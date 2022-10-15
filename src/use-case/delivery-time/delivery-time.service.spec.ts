import 'reflect-metadata'
import { mock } from 'jest-mock-extended'
import { container } from '../../container'
import { TYPES } from '../../types'
import {
  DeliveryTimeResultDto,
  DeliveryTimeService,
} from './delivery-time.service'
import {
  CalculateDeliveryTimeInputDto,
  PackageDtoForTime,
  VechileDetailDto,
} from './delivery-time.dto'
import { DeliveryCostService } from '../delivery-cost/delivery-cost.service'
import { DeliveryCostCalculatedDetails } from '../delivery-cost/delivery-cost.dto'

const mockedDeliveryCostService = mock<DeliveryCostService>()

describe('DeliveryTimeService', () => {
  let service: DeliveryTimeService
  let deliveryTimeService: DeliveryTimeService

  let deliveryCostService: DeliveryCostService

  beforeEach(() => {
    container
      .rebind(TYPES.DeliveryCostService)
      .toConstantValue(mockedDeliveryCostService)

    service = container.get(TYPES.DeliveryTimeService)
    deliveryCostService = container.get(TYPES.DeliveryCostService)

    deliveryTimeService = new DeliveryTimeService(mockedDeliveryCostService)
  })

  it('Delivery time service is defined', () => {
    expect(service).toBeDefined()
    expect(deliveryTimeService).toBeDefined()
    expect(deliveryCostService).toBeDefined()
  })

  it('Delivery time', async () => {
    const mockedOrignalPackageListStepO1: PackageDtoForTime[] = [
      {
        packageId: 'pkg1',
        weightInKg: 50,
        distanceInKm: 30,
        offerCode: 'ofr001',
        baseDeliveryCost: 100,
        sequence: 0,
      },
      {
        packageId: 'pkg2',
        weightInKg: 75,
        distanceInKm: 125,
        offerCode: 'ofr008',
        baseDeliveryCost: 100,
        sequence: 1,
      },
      {
        packageId: 'pkg3',
        weightInKg: 175,
        distanceInKm: 100,
        offerCode: 'ofr003',
        baseDeliveryCost: 100,
        sequence: 2,
      },
      {
        packageId: 'pkg4',
        weightInKg: 110,
        distanceInKm: 60,
        offerCode: 'ofr002',
        baseDeliveryCost: 100,
        sequence: 3,
      },
      {
        packageId: 'pkg5',
        weightInKg: 155,
        distanceInKm: 95,
        offerCode: 'ofr001',
        baseDeliveryCost: 100,
        sequence: 4,
      },
    ]

    const mockedVechile: VechileDetailDto = {
      noOfVechiles: 2,
      maxSpeed: 70,
      maxCarriableWeight: 200,
    }

    const mockDeliveryTimeInput: CalculateDeliveryTimeInputDto = {
      vechileDetails: mockedVechile,
      packageList: mockedOrignalPackageListStepO1,
    }
    const mockCostResult: DeliveryCostCalculatedDetails[] = [
      {
        packageId: 'pkg1',
        totalDiscountedAmount: 0,
        totalDeliveryCostBeforeDiscount: 0,
        totalDeliveryCostAfterDiscount: 750,
      },
      {
        packageId: 'pkg2',
        totalDiscountedAmount: 0,
        totalDeliveryCostBeforeDiscount: 0,
        totalDeliveryCostAfterDiscount: 1475,
      },
      {
        packageId: 'pkg3',
        totalDiscountedAmount: 0,
        totalDeliveryCostBeforeDiscount: 0,
        totalDeliveryCostAfterDiscount: 2350,
      },
      {
        packageId: 'pkg4',
        totalDiscountedAmount: 105,
        totalDeliveryCostBeforeDiscount: 0,
        totalDeliveryCostAfterDiscount: 1395,
      },
      {
        packageId: 'pkg5',
        totalDiscountedAmount: 0,
        totalDeliveryCostBeforeDiscount: 0,
        totalDeliveryCostAfterDiscount: 2125,
      },
    ]

    mockedDeliveryCostService.getPackagePriceDiscount
      .mockResolvedValueOnce(mockCostResult[0])
      .mockResolvedValueOnce(mockCostResult[1])
      .mockResolvedValueOnce(mockCostResult[2])
      .mockResolvedValueOnce(mockCostResult[3])
      .mockResolvedValueOnce(mockCostResult[4])

    const result = await deliveryTimeService.calculateEstimatedDeliveryTime(
      mockDeliveryTimeInput,
    )

    const outcome: DeliveryTimeResultDto[] = [
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

    expect(mockedDeliveryCostService.getPackagePriceDiscount).toBeCalledTimes(5)
    expect(result).toEqual(outcome)
  })
})
