import 'reflect-metadata'
import { mock } from 'jest-mock-extended'
import { DeliveryCostService } from '../../use-case/delivery-cost.service'
import {
  FunctionalityType,
  InquireService,
} from '../../use-case/inquire.service'
import { Cli } from './cli'
import { container } from '../../container'
import { TYPES } from '../../types'

const mockedInquirerService = mock<InquireService>()
const mockedDeliveryCostService = mock<DeliveryCostService>()
describe('Cli', () => {
  let cli: Cli
  let deliveryCostService: DeliveryCostService
  let inquireService: InquireService
  beforeEach(() => {
    //
    container
      .rebind(TYPES.InquiryService)
      .toConstantValue(mockedInquirerService)
    container
      .rebind(TYPES.DeliveryCostService)
      .toConstantValue(mockedDeliveryCostService)

    cli = container.get<Cli>(TYPES.Cli)
    deliveryCostService = container.get<DeliveryCostService>(
      TYPES.DeliveryCostService,
    )
    inquireService = container.get<InquireService>(TYPES.InquiryService)
  })

  it('should be defined', () => {
    expect(cli).toBeDefined()
    expect(deliveryCostService).toBeDefined()
    expect(inquireService).toBeDefined()
  })

  it('should call getDeliveryCost', async () => {
    mockedInquirerService.askTypeFunction.mockResolvedValue({
      typeOfFunctionality: FunctionalityType.CalculateDeliveryCost,
    })

    await cli.start()

    expect(deliveryCostService.getDeliveryCost).toBeCalled()
  })
})
