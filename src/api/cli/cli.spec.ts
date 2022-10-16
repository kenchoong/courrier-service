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

const mockedInquirerService = mock<InquireService>()
const mockedDeliveryCostController = mock<DeliveryCostController>()
const mockedDeliveryTimeController = mock<DeliveryTimeController>()

describe('Cli', () => {
  let cli: Cli
  let deliveryCostController: DeliveryCostController
  let deliveryTimeController: DeliveryTimeController
  let inquireService: InquireService
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

    cli = container.get<Cli>(TYPES.Cli)
    deliveryCostController = container.get<DeliveryCostController>(
      TYPES.DeliveryCostController,
    )
    deliveryTimeController = container.get<DeliveryTimeController>(
      TYPES.DeliveryTimeController,
    )
    inquireService = container.get<InquireService>(TYPES.InquiryService)
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
})
