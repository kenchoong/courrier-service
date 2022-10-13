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
import { getPackageComboPerTrip } from './utils/get-package-combo-per-trip'

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
      const packageComboPerTrip = getPackageComboPerTrip(
        remainingPackageList,
        maxCarriableWeight,
      )
    }
  }

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
