import 'reflect-metadata'
import { mock } from 'jest-mock-extended'
import { container } from '../../container'
import { TYPES } from '../../types'
import { OfferRepository } from '../../domain/repository'
import { DiscountType } from '../../domain/offer'
import { DeliveryTimeService } from './delivery-time.service'
import { PackageDtoForTime } from './delivery-time.dto'
import { CliTable } from '../../libs/cli-table'
import { InquireService } from '../inquire/inquire.service'
import { DeliveryCostService } from '../delivery-cost/delivery-cost.service'

const mockedDeliveryTimeService = mock<DeliveryTimeService>()
const mockedOfferRepository = mock<OfferRepository>()
const mockedInquireService = mock<InquireService>()
const mockedCliTable = mock<CliTable>()

const maxCarriableWeight = 200

describe('DeliveryTimeService', () => {
  let service: DeliveryTimeService
  let repo: OfferRepository
  let deliveryTimeService: DeliveryTimeService

  let mockedDeliveryCostService: DeliveryCostService
  let mockedInquireService: InquireService
  let mockCliTable: CliTable

  beforeEach(() => {
    container
      .rebind(TYPES.DeliveryTimeService)
      .toConstantValue(mockedDeliveryTimeService)
    container
      .rebind(TYPES.OfferRepository)
      .toConstantValue(mockedOfferRepository)

    service = container.get(TYPES.DeliveryTimeService)
    repo = container.get(TYPES.OfferRepository)

    mockedInquireService = container.get(TYPES.InquiryService)
    mockedDeliveryCostService = container.get(TYPES.DeliveryCostService)
    mockCliTable = container.get(TYPES.CliTable)

    deliveryTimeService = new DeliveryTimeService(
      mockedInquireService,
      mockedDeliveryCostService,
      mockCliTable,
    )
  })

  it('Delivery time service is defined', () => {
    expect(service).toBeDefined()
  })
})
