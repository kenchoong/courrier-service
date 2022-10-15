import { injectable, inject } from 'inversify'
import { TYPES } from '../../types'
import { DeliveryCostService } from '../delivery-cost/delivery-cost.service'
import { roundOff } from '../utils/utils'
import {
  CalculateDeliveryTimeInputDto,
  PackageDeliveredTimeDto,
  PackageDtoForTime,
  PackageTimeNeededDto,
} from './delivery-time.dto'
import {
  assignVechileForThisTrip,
  VechileStateDto,
} from './utils/assign-vehicle'
import { getPackageComboPerTrip } from './utils/get-package-combo-per-trip'
import { getShipmentArrivalTime } from './utils/get-shipment-arrival-time'

export class DeliveryTimeResultDto {
  packageId: string
  totalDiscountedAmount: number
  totalDeliveryCostAfterDiscount: number
  estimatedDeliveryTime: number
}

@injectable()
export class DeliveryTimeService {
  constructor(
    @inject(TYPES.DeliveryCostService)
    private deliveryCostService: DeliveryCostService,
  ) {}

  async calculateEstimatedDeliveryTime(
    input: CalculateDeliveryTimeInputDto,
  ): Promise<DeliveryTimeResultDto[]> {
    const { vechileDetails, packageList } = input
    const { noOfVechiles, maxSpeed, maxCarriableWeight } = vechileDetails

    // Initialize remaining package list,
    // at begining is the package list itself
    let remainingPackageList = [...packageList]

    // Get the delivery combo for each trip
    // package closest to maxCarriableWeight go first
    // delivery sequence store in an array
    const deliveryComboSequence: PackageDtoForTime[][] = []
    while (remainingPackageList.length > 0) {
      const combo = getPackageComboPerTrip(
        remainingPackageList,
        maxCarriableWeight,
      )

      deliveryComboSequence.push(combo)

      remainingPackageList = remainingPackageList.filter(
        (eachPackage) => !combo.find((eachCombo) => eachCombo === eachPackage),
      )
    }

    // Initialize an array to represent avaialble vechiles available time
    let currentVechilesAvailabiltyState: VechileStateDto[] = Array(noOfVechiles)
      .fill({})
      .map((_, index) => {
        return {
          returningTimeForThisVechile: 0,
          vechileNo: '0' + (index + 1).toString(),
        }
      })

    const packagesEstimatedDeliverTime: PackageDeliveredTimeDto[] = []

    for (const packageComboForThisTrip of deliveryComboSequence) {
      // Get each package need how many time to deliver
      const packageNeedTimeList: PackageTimeNeededDto[] =
        packageComboForThisTrip.map((packageDto) => {
          const timeNeeded = getShipmentArrivalTime(
            packageDto.distanceInKm,
            maxSpeed,
          )

          return {
            ...packageDto,
            timeNeeded,
          }
        })

      // assign vechile for this package combo
      // return the vechile number
      // the time needed for this vechile to return
      const {
        assignedVechileNo,
        nextAvailableTimeForVechile,
        currentWaitingTime,
      } = assignVechileForThisTrip(
        currentVechilesAvailabiltyState,
        packageNeedTimeList,
      )

      // get estimated delivery time of each package
      // based on the vechile assigned
      // store in an array
      packageNeedTimeList.map((packageTimeNeed) => {
        const estimatedDeliveryTime =
          currentWaitingTime + packageTimeNeed.timeNeeded

        packagesEstimatedDeliverTime.push({
          ...packageTimeNeed,
          estimatedDeliveryTime,
        })
      })

      // update the vechile state
      // cause 1 vechile is assigned to this trip
      // store return time for this vechile in the state
      let objIndex = currentVechilesAvailabiltyState.findIndex(
        (obj) => obj.vechileNo == assignedVechileNo,
      )
      currentVechilesAvailabiltyState[objIndex].returningTimeForThisVechile =
        nextAvailableTimeForVechile
    }

    // sort the package list by sequence
    const result = packagesEstimatedDeliverTime.sort(
      (previos, current) => previos.sequence - current.sequence,
    )

    const deliveryTimeResult: DeliveryTimeResultDto[] = []

    for (const packageDeliveredTime of result) {
      // calculate the total delivery cost
      // for each package
      const { totalDiscountedAmount, totalDeliveryCostAfterDiscount } =
        await this.deliveryCostService.getPackagePriceDiscount({
          baseDeliveryCost: packageDeliveredTime.baseDeliveryCost,
          packageId: packageDeliveredTime.packageId,
          weightInKg: packageDeliveredTime.weightInKg,
          distanceInKm: packageDeliveredTime.distanceInKm,
          offerCode: packageDeliveredTime.offerCode,
        })

      // store calculation result in an array for return
      deliveryTimeResult.push({
        packageId: packageDeliveredTime.packageId,
        totalDeliveryCostAfterDiscount,
        totalDiscountedAmount,
        estimatedDeliveryTime: roundOff(
          packageDeliveredTime.estimatedDeliveryTime,
        ),
      })
    }

    return deliveryTimeResult
  }
}
