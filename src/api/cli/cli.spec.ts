import 'reflect-metadata'
import { mock } from 'jest-mock-extended'
import { DeliveryCostService } from '../../use-case/delivery-cost/delivery-cost.service'
import {
  FunctionalityType,
  InquireService,
} from '../../use-case/inquire/inquire.service'
import { Cli } from './cli'
import { container } from '../../container'
import { TYPES } from '../../types'
import { DeliveryTimeController } from '../../use-case/delivery-time/delivery-time.controller'
import { DeliveryTimeService } from '../../use-case/delivery-time/delivery-time.service'

const mockedInquirerService = mock<InquireService>()
const mockedDeliveryCostService = mock<DeliveryCostService>()
const mockedDeliveryTimeController = mock<DeliveryTimeController>()

describe('Cli', () => {
  let cli: Cli
  let deliveryCostService: DeliveryCostService
  let deliveryTimeController: DeliveryTimeController
  let inquireService: InquireService
  beforeEach(() => {
    //
    container
      .rebind(TYPES.InquiryService)
      .toConstantValue(mockedInquirerService)
    container
      .rebind(TYPES.DeliveryCostService)
      .toConstantValue(mockedDeliveryCostService)
    container
      .rebind(TYPES.DeliveryTimeController)
      .toConstantValue(mockedDeliveryTimeController)

    cli = container.get<Cli>(TYPES.Cli)
    deliveryCostService = container.get<DeliveryCostService>(
      TYPES.DeliveryCostService,
    )
    deliveryTimeController = container.get<DeliveryTimeController>(
      TYPES.DeliveryTimeController,
    )
    inquireService = container.get<InquireService>(TYPES.InquiryService)
  })

  it('should be defined', () => {
    expect(cli).toBeDefined()
    expect(deliveryCostService).toBeDefined()
    expect(inquireService).toBeDefined()
    expect(deliveryTimeController).toBeDefined()
  })

  it('should call getDeliveryCost', async () => {
    mockedInquirerService.askTypeFunction.mockResolvedValue({
      typeOfFunctionality: FunctionalityType.CalculateDeliveryCost,
    })

    await cli.start()

    expect(deliveryCostService.getDeliveryCost).toBeCalled()
  })

  it('should call getDeliveryTime', async () => {
    mockedInquirerService.askTypeFunction.mockResolvedValue({
      typeOfFunctionality: FunctionalityType.CalculateDeliveryTime,
    })

    await cli.start()

    expect(deliveryTimeController.getPackageVechileDetails).toBeCalled()
  })
})
