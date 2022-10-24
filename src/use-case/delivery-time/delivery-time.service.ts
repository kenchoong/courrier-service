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
import { getPackageComboSequence } from './utils/get-package-combo-sequence'
import { getShipmentArrivalTime } from './utils/get-shipment-arrival-time'
import { updateVechileStates } from './utils/update-vehicle-states'

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

    const deliveryComboSequence: PackageDtoForTime[][] =
      getPackageComboSequence(packageList, maxCarriableWeight)

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
        packageComboForThisTrip.map((packageDto: PackageDtoForTime) => {
          const timeNeeded = getShipmentArrivalTime(
            packageDto.distanceInKm,
            maxSpeed,
          )

          return {
            ...packageDto,
            timeNeeded,
          }
        })

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

      currentVechilesAvailabiltyState = updateVechileStates(
        currentVechilesAvailabiltyState,
        assignedVechileNo,
        nextAvailableTimeForVechile,
      )
    }

    const result = packagesEstimatedDeliverTime.sort(
      (previos, current) => previos.sequence - current.sequence,
    )

    const deliveryTimeResult: DeliveryTimeResultDto[] = []

    for (const packageDeliveredTime of result) {
      // calculate the total delivery cost
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
