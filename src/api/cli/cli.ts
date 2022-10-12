import { inject, injectable } from 'inversify'
import { TYPES } from '../../types'
import { DeliveryCostService } from '../../use-case/delivery-cost/delivery-cost.service'
import {
  FunctionalityType,
  InquireService,
} from '../../use-case/inquire/inquire.service'

export interface ICli {
  start(): void
}

@injectable()
export class Cli implements ICli {
  constructor(
    @inject(TYPES.InquiryService)
    private inquiryService: InquireService,
    @inject(TYPES.DeliveryCostService)
    private deliveryCostService: DeliveryCostService,
  ) {}

  async start(): Promise<void> {
    try {
      const { typeOfFunctionality } =
        await this.inquiryService.askTypeFunction()

      switch (typeOfFunctionality) {
        case FunctionalityType.CalculateDeliveryCost:
          await this.deliveryCostService.getDeliveryCost()
          break

        default:
          break
      }
    } catch (error) {
      console.log(error)
    }
  }
}
