import { inject, injectable } from 'inversify'
import { DiscountType } from '../../domain/offer'
import { CliTable } from '../../libs/cli-table'
import { TYPES } from '../../types'
import { DeliveryCostService } from '../../use-case/delivery-cost/delivery-cost.service'
import {
  FunctionalityType,
  InquireService,
} from '../../use-case/inquire/inquire.service'
import { OfferService } from '../../use-case/offer/offer.service'

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
    @inject(TYPES.DeliveryTimeController)
    private deliveryTimeController: DeliveryTimeController,
    @inject(TYPES.OfferService)
    private offerService: OfferService,
    @inject(TYPES.CliTable)
    private cliTable: CliTable,
  ) {}

  async start(): Promise<void> {
    try {
      const { typeOfFunctionality } =
        await this.inquiryService.askTypeFunction()

      switch (typeOfFunctionality) {
        case FunctionalityType.CalculateDeliveryCost:
          await this.deliveryCostService.getDeliveryCost()
          break

        case FunctionalityType.AddNewOffer:
          const {
            id,
            offerCode,
            discountAmount,
            minWeight,
            maxWeight,
            minDistance,
            maxDistance,
          } = await this.inquiryService.askCreateOfferQuestions()

          const creatOfferResult = await this.offerService.addOffers({
            id,
            offerCode,
            offerName: `${discountAmount}% off for courrier fees`,
            discountAmount,
            discountType: DiscountType.PERCENTAGE,
            criteria: {
              weight: {
                min: minWeight,
                max: maxWeight,
                unitCode: 'kg',
              },
              distance: {
                min: minDistance,
                max: maxDistance,
                unitCode: 'km',
              },
            },
          })

          console.log(
            'Offer created successfully ===> ',
            JSON.stringify(creatOfferResult, null, 2),
          )

          break

        case FunctionalityType.ListOffers:
          const offers = await this.offerService.listOffers()

          console.log('Found offer ==> ', JSON.stringify(offers, null, 2))
          break
        default:
          break
      }
    } catch (error) {
      console.log(error)
    }
  }
}
