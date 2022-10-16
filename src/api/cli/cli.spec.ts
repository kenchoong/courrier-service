import 'reflect-metadata'
import { mock } from 'jest-mock-extended'
import {
  FunctionalityType,
  InquireService,
} from '../../use-case/inquire/inquire.service'
import { Cli } from './cli'
import { container } from '../../container'
import { TYPES } from '../../types'
import { DeliveryTimeController } from '../../use-case/delivery-time/delivery-time.controller'
import { DeliveryCostController } from '../../use-case/delivery-cost/delivery-cost.controller'
import { DeliveryTimeService } from '../../use-case/delivery-time/delivery-time.service'
import { OfferService } from '../../use-case/offer/offer.service'

const mockedInquirerService = mock<InquireService>()
const mockedDeliveryCostController = mock<DeliveryCostController>()
const mockedDeliveryTimeController = mock<DeliveryTimeController>()
const mockedOfferService = mock<OfferService>()

describe('Cli', () => {
  let cli: Cli
  let deliveryCostController: DeliveryCostController
  let deliveryTimeController: DeliveryTimeController
  let inquireService: InquireService
  let offerService: OfferService
  beforeEach(() => {
    //
    container
      .rebind(TYPES.InquiryService)
      .toConstantValue(mockedInquirerService)
    container
      .rebind(TYPES.DeliveryCostController)
      .toConstantValue(mockedDeliveryCostController)
    container
      .rebind(TYPES.DeliveryTimeController)
      .toConstantValue(mockedDeliveryTimeController)

    container.rebind(TYPES.OfferService).toConstantValue(mockedOfferService)

    cli = container.get<Cli>(TYPES.Cli)
    deliveryCostController = container.get<DeliveryCostController>(
      TYPES.DeliveryCostController,
    )
    deliveryTimeController = container.get<DeliveryTimeController>(
      TYPES.DeliveryTimeController,
    )
    inquireService = container.get<InquireService>(TYPES.InquiryService)
    offerService = container.get<OfferService>(TYPES.OfferService)
  })

  it('should be defined', () => {
    expect(cli).toBeDefined()
    expect(deliveryCostController).toBeDefined()
    expect(inquireService).toBeDefined()
    expect(deliveryTimeController).toBeDefined()
  })

  it('should call getDeliveryCost', async () => {
    mockedInquirerService.askTypeFunction.mockResolvedValue({
      typeOfFunctionality: FunctionalityType.CalculateDeliveryCost,
    })

    await cli.start()

    expect(deliveryCostController.getDeliveryCost).toBeCalled()
  })

  it('should call getDeliveryTime', async () => {
    mockedInquirerService.askTypeFunction.mockResolvedValue({
      typeOfFunctionality: FunctionalityType.CalculateDeliveryTime,
    })

    await cli.start()

    expect(deliveryTimeController.getPackageVechileDetails).toBeCalled()
  })

  it('should call create offer ', async () => {
    mockedInquirerService.askTypeFunction.mockResolvedValue({
      typeOfFunctionality: FunctionalityType.AddNewOffer,
    })

    mockedInquirerService.askCreateOfferQuestions.mockResolvedValue({
      maxDistance: 10,
      minDistance: 0,
      maxWeight: 10,
      minWeight: 0,
      discountAmount: 5,
      discountType: 'PERCENTAGE',
      id: '1234',
      offerCode: 'offercode1',
    })

    await cli.start()

    expect(offerService.addOffers).toBeCalled()
    expect(offerService.addOffers).toBeCalledWith({
      criteria: {
        distance: {
          max: 10,
          min: 0,
          unitCode: 'km',
        },
        weight: {
          max: 10,
          min: 0,
          unitCode: 'kg',
        },
      },
      discountAmount: 5,
      discountType: 'PERCENTAGE',
      id: '1234',
      offerCode: 'offercode1',
      offerName: '5% off for courrier fees',
    })
  })

  it('should call list offer ', async () => {
    mockedInquirerService.askTypeFunction.mockResolvedValue({
      typeOfFunctionality: FunctionalityType.ListOffers,
    })

    await cli.start()

    expect(offerService.listOffers).toBeCalled()
  })
})
