import { injectable, inject } from 'inversify'
import { CliTable } from '../../libs/cli-table'
import { TYPES } from '../../types'
import { PackageDto } from '../delivery-cost/delivery-cost.dto'
import { DeliveryCostService } from '../delivery-cost/delivery-cost.service'
import { InquireService } from '../inquire/inquire.service'
import {
  CalculateDeliveryTimeInputDto,
  PackageDtoForTime,
  VechileDetailDto,
} from './delivery-time.dto'

@injectable()
export class DeliveryTimeService {
  constructor(
    @inject(TYPES.InquiryService)
    private inquiryService: InquireService,

    @inject(TYPES.DeliveryCostService)
    private deliveryCostService: DeliveryCostService,

    @inject(TYPES.CliTable)
    private cliTable: CliTable,
  ) {}

  async calculateEstimatedDeliveryTime(input: CalculateDeliveryTimeInputDto) {
    const { vechileDetails, packageList } = input
    const { noOfVechiles, maxSpeed, maxCarriableWeight } = vechileDetails

    //this.prototype()

    // Initialize remaining package list,
    // at begining is the package list itself
    const remainingPackageList = [...packageList]

    // Initialize current waiting time
    let currentWaitingTime = 0

    // Initialize current available vechile
    let currentAvailableVechile = noOfVechiles

    while (remainingPackageList.length > 0) {
      // Get the package list to be delivered in 1 trip
      const packageListPerTrip = this.getPackageComboPerTrip(
        remainingPackageList,
        maxCarriableWeight,
      )
    }
  }

  /**
   *
   * Given list of package, with their distance and weight
   * Given the max load of all our vechiles
   *
   * Calculate and select the combination of package weight
   * that is closest to the max load of our vechiles
   * for 1 trip
   *
   * Given:
   * maxLoad = 200
   * packageList(only weight)= [ 50, 75 , 175, 110, 155 ]
   *
   * get the highest combination of package weight that is closest to maxLoad
   * Output: [ 75, 110 ]
   * Then return the list 2nd and 4th package from the packageList
   *
   * if no combination of package weight is found,
   * return highest weight package into the list
   *
   * @param packageList (List of packages to be delivered)
   * @param maxCarriableWeight
   * @returns packageList[] (List of packages to be delivered in 1 trip)
   */
  getPackageComboPerTrip(
    packageList: PackageDtoForTime[],
    maxCarriableWeight: number,
  ) {
    let possiblePackagesCombo: PackageDtoForTime[][] = []

    const originalState = { weightInKg: 0 } as PackageDtoForTime

    // Given package weight = [ 50, 75 , 175, 110, 155 ]
    // Generate all possible combination of package
    // Will produce result like this:
    // [
    //   [ 50 ],      [ 75 ],
    //   [ 50, 75 ],  [ 175 ],
    //   [ 110 ],     [ 50, 110 ],
    //   [ 75, 110 ], [ 155 ]
    // ]
    // For M << 1, left shift in js, reference below:
    // https://stackoverflow.com/questions/38922606/what-is-x-1-and-x-1
    // https://stackoverflow.com/a/49143693/4332049
    let M = 1 << packageList.length
    for (var i = 1; i < M; ++i) {
      var sublist = packageList.filter(function (c, k) {
        return (i >> k) & 1
      })
      if (
        sublist.reduce((previous, current) => {
          return {
            ...current,
            weightInKg: previous.weightInKg + current.weightInKg,
          }
        }, originalState).weightInKg <= maxCarriableWeight
      ) {
        possiblePackagesCombo.push(sublist)
      }
    }

    // sum up each element inside each element(array) inside possiblePackagesCombo array
    // sum only the weightInKg property
    // from possible package above
    // produce this stimulation below.
    // sumUpAlpossiblePackagesComboInList = [
    //     50,  75, 125, 175,
    //    110, 160, 185, 155
    //  ]
    // (stimution value above only for weightInKg property)
    const sumUpAlpossiblePackagesComboInList: PackageDtoForTime[] =
      possiblePackagesCombo.map((x) =>
        x.reduce(
          (previous, current) => ({
            ...current,
            weightInKg: previous.weightInKg + current.weightInKg,
          }),
          originalState,
        ),
      )

    // Find the highest combination of package weight that is closest to maxLoad
    // from sumUpAlpossiblePackagesComboInList
    // produce 185 (closest to maxCarriableWeight = 200)
    // therefore get the whole object
    const calculateClosetCombination: PackageDtoForTime =
      sumUpAlpossiblePackagesComboInList.reduce((prev, current) => {
        const prevWeight = Math.abs(prev.weightInKg - maxCarriableWeight)

        const currentWeight = Math.abs(current.weightInKg - maxCarriableWeight)
        if (currentWeight < prevWeight) {
          return current
        } else {
          return prev
        }
      }, originalState)

    // From sumUpAlpossiblePackagesComboInList
    // get index of calculated closest combination
    const indexOfItem = sumUpAlpossiblePackagesComboInList.indexOf(
      calculateClosetCombination,
    )

    // possiblePackagesCombo[indexOfItem]  = sumUpAlpossiblePackagesComboInList[indexOfItem]
    // This is the combination of package weight that is closest to maxLoad
    // Which is [ 75, 110 ]
    const closestCombination = possiblePackagesCombo[indexOfItem]

    return closestCombination
  }

  async getPackageWithClosestDistance() {}

  /**
   *
   * @param distanceInKm
   * @param maxSpeed
   * @returns number (Time needed to deliver a shipment, in hours, rounded off to 2 digits)
   */
  getShipmentArrivalTime(distanceInKm: number, maxSpeed: number) {
    return this.roundOff(distanceInKm / maxSpeed)
  }

  /**
   *
   * @param currentWaitingTime (in hours, CurrentTime in requirement)
   * @param distanceInKm
   * @param maxSpeed
   * @returns number (Next available time for a vechile, in hours, rounded off to 2 digits)
   */
  getNextVechileAvailableTime(
    currentWaitingTime: number,
    distanceInKm: number,
    maxSpeed: number,
  ) {
    // TODO: environment variable
    const waitingTimeMultiplier = 2
    const timeTaken = this.getShipmentArrivalTime(distanceInKm, maxSpeed)

    return currentWaitingTime + waitingTimeMultiplier * timeTaken
  }

  /**
   * Roundoff estimated delivery time upto 2 digits
   * @example 3.456 becomes 3.45
   * @param input number
   * @returns rounded off value
   */
  roundOff(input: number) {
    return Math.trunc(input * 100) / 100
  }
}
