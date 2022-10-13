import 'reflect-metadata'
import { mock } from 'jest-mock-extended'
import { container } from '../../container'
import { OfferRepository } from '../../domain/repository'
import { TYPES } from '../../types'
import { DeliveryCostService } from '../delivery-cost/delivery-cost.service'
import { InquireService } from '../inquire/inquire.service'
import { DeliveryTimeController } from './delivery-time.controller'
import { DeliveryTimeService } from './delivery-time.service'

const mockDeliveryTimeService = mock<DeliveryTimeService>()
const mockInquireService = mock<InquireService>()

describe('DeliveryTimeController', () => {
  let deliveryTimeController: DeliveryTimeController
  let mockedDeliveryTimeService: DeliveryTimeService
  let mockedInquireService: InquireService

  beforeEach(() => {
    container
      .rebind(TYPES.DeliveryTimeService)
      .toConstantValue(mockDeliveryTimeService)

    container.rebind(TYPES.InquiryService).toConstantValue(mockInquireService)

    mockedInquireService = container.get(TYPES.InquiryService)
    mockedDeliveryTimeService = container.get(TYPES.DeliveryTimeService)

    deliveryTimeController = new DeliveryTimeController(
      mockedInquireService,
      mockedDeliveryTimeService,
    )
  })

  it('Delivery time controller is defined', () => {
    expect(deliveryTimeController).toBeDefined()
    expect(mockedDeliveryTimeService).toBeDefined()
    expect(mockedInquireService).toBeDefined()
  })

  it('should get package vechiles details', async () => {
    mockInquireService.askBaseCostNoOfPackages.mockResolvedValue({
      baseDeliveryCose: 100,
      noOfPackages: 2,
    })

    mockInquireService.askQuestionsForDeliveryCost
      .mockResolvedValueOnce({
        packageId: 'pkg1',
        weightInKg: 50,
        distanceInKm: 30,
        offerCode: 'off001',
      })
      .mockResolvedValueOnce({
        packageId: 'pkg2',
        weightInKg: 75,
        distanceInKm: 125,
        offerCode: 'off008',
      })

    const mockVechileDetails = {
      noOfVechiles: 2,
      maxSpeed: 70,
      maxCarriableWeight: 200,
    }
    mockInquireService.askVechileQuestions.mockResolvedValue(mockVechileDetails)

    const result = await deliveryTimeController.getPackageVechileDetails()

    expect(mockDeliveryTimeService.calculateEstimatedDeliveryTime).toBeCalled()
    expect(
      mockDeliveryTimeService.calculateEstimatedDeliveryTime,
    ).toBeCalledWith({
      vechileDetails: mockVechileDetails,
      packageList: [
        {
          packageId: 'pkg1',
          weightInKg: 50,
          distanceInKm: 30,
          offerCode: 'off001',
          sequence: 0, // added in in for loop
        },
        {
          packageId: 'pkg2',
          weightInKg: 75,
          distanceInKm: 125,
          offerCode: 'off008',
          sequence: 1, // added in in for loop
        },
      ],
    })

    // TODO:
    // expect(result).toEqual({})
  })
})
