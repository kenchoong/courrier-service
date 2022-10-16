import { injectable, inject } from 'inversify'
import { TYPES } from '../../types'
import { InquireService } from '../inquire/inquire.service'
import { DeliveryCostCalculatedDetails } from './delivery-cost.dto'
import { DeliveryCostService } from './delivery-cost.service'

@injectable()
export class DeliveryCostController {
  constructor(
    @inject(TYPES.InquiryService)
    private inquiryService: InquireService,

    @inject(TYPES.DeliveryCostService)
    private deliveryCostService: DeliveryCostService,
  ) {}

  async getDeliveryCost() {
    const { baseDeliveryCost, noOfPackages } =
      await this.inquiryService.askBaseCostNoOfPackages()

    const checkTable: DeliveryCostCalculatedDetails[] = []

    for (let index = 0; index < noOfPackages; index++) {
      console.log('Enter details of package', index + 1)
      const packageDetails =
        await this.inquiryService.askQuestionsForDeliveryCost()

      const data = await this.deliveryCostService.getPackagePriceDiscount({
        baseDeliveryCost,
        ...packageDetails,
      })

      checkTable.push(data)
    }

    return checkTable
  }
}
