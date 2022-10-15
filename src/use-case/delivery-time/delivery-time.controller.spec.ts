import 'reflect-metadata'
import { mock } from 'jest-mock-extended'
import { container } from '../../container'
import { TYPES } from '../../types'
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
      baseDeliveryCost: '100',
      noOfPackages: '2',
    })

    mockInquireService.askQuestionsForDeliveryCost
      .mockResolvedValueOnce({
        packageId: 'pkg1',
        weightInKg: '50',
        distanceInKm: '30',
        offerCode: 'off001',
      })
      .mockResolvedValueOnce({
        packageId: 'pkg2',
        weightInKg: '75',
        distanceInKm: '125',
        offerCode: 'off008',
      })

    const mockVechileDetails = {
      noOfVechiles: 2,
      maxSpeed: 70,
      maxCarriableWeight: 200,
    }

    const mockCalculatedResult = [
      {
        packageId: 'pkg1',
        totalDiscountedAmount: 0,
        estimatedDeliveryTime: 3.98,
        totalDeliveryCostAfterDiscount: 750,
      },

      {
        packageId: 'pkg2',
        totalDiscountedAmount: 0,
        estimatedDeliveryTime: 1.78,
        totalDeliveryCostAfterDiscount: 1475,
      },

      {
        packageId: 'pkg3',
        totalDiscountedAmount: 0,
        estimatedDeliveryTime: 1.42,
        totalDeliveryCostAfterDiscount: 2350,
      },

      {
        packageId: 'pkg4',
        totalDiscountedAmount: 105,
        estimatedDeliveryTime: 0.85,
        totalDeliveryCostAfterDiscount: 1395,
      },

      {
        packageId: 'pkg5',
        totalDiscountedAmount: 0,
        estimatedDeliveryTime: 4.18,
        totalDeliveryCostAfterDiscount: 2125,
      },
    ]

    mockInquireService.askVechileQuestions.mockResolvedValue(mockVechileDetails)

    mockDeliveryTimeService.calculateEstimatedDeliveryTime.mockResolvedValue(
      mockCalculatedResult,
    )

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
          baseDeliveryCost: 100,
        },
        {
          packageId: 'pkg2',
          weightInKg: 75,
          distanceInKm: 125,
          offerCode: 'off008',
          sequence: 1, // added in in for loop
          baseDeliveryCost: 100,
        },
      ],
    })

    expect(result).toEqual(mockCalculatedResult)
  })
})
