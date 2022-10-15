import { injectable, inject } from 'inversify'
import { TYPES } from '../../types'
import { InquireService } from '../inquire/inquire.service'
import { PackageDtoForTime } from './delivery-time.dto'
import { DeliveryTimeService } from './delivery-time.service'

@injectable()
export class DeliveryTimeController {
  constructor(
    @inject(TYPES.InquiryService)
    private inquiryService: InquireService,

    @inject(TYPES.DeliveryTimeService)
    private deliveryTimeService: DeliveryTimeService,
  ) {}

  async getPackageVechileDetails() {
    const { baseDeliveryCost, noOfPackages } =
      await this.inquiryService.askBaseCostNoOfPackages()

    const packageList: PackageDtoForTime[] = []

    for (let index = 0; index < noOfPackages; index++) {
      console.log('Enter details of package', index + 1)
      const packageDetails =
        await this.inquiryService.askQuestionsForDeliveryCost()

      packageList.push({
        packageId: packageDetails.packageId,
        weightInKg: parseFloat(packageDetails.weightInKg),
        distanceInKm: parseFloat(packageDetails.distanceInKm),
        offerCode: packageDetails.offerCode,
        baseDeliveryCost: parseFloat(baseDeliveryCost),
        sequence: index,
      })
    }

    const vechileDetail = await this.inquiryService.askVechileQuestions()

    return this.deliveryTimeService.calculateEstimatedDeliveryTime({
      vechileDetails: {
        noOfVechiles: parseFloat(vechileDetail.noOfVechiles),
        maxSpeed: parseFloat(vechileDetail.maxSpeed),
        maxCarriableWeight: parseFloat(vechileDetail.maxCarriableWeight),
      },
      packageList,
    })
  }
}
