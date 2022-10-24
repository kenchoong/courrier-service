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
import { mockedThreePackagesShouldSendFirst } from './utils/mocks/mock-three-packages-should-send-first..mock'
import { mockedFourPackageShouldDeliveryFirst } from './utils/mocks/mock-four-packages-should-send-first.mock'
import { mockFivePackagesShouldSendFirst } from './utils/mocks/mock-five-packages-should-send-first.mock'

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

  it('Delivery time standard requirement', async () => {
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

  it('Delivery time, 3 packages send together', async () => {
    // P1 0 1100 1.42
    // P2 0 1100 1.42
    // P3 105 1995 4.26
    // P4 0 1590 7.10
    // P5 0 1600 1.42

    const input = {
      vechileDetails: {
        noOfVechiles: 1,
        maxSpeed: 70,
        maxCarriableWeight: 200,
      },
      packageList: mockedThreePackagesShouldSendFirst,
    }

    const mockCostResult: DeliveryCostCalculatedDetails[] = [
      {
        packageId: 'pkg1',
        totalDiscountedAmount: 0,
        totalDeliveryCostBeforeDiscount: 0,
        totalDeliveryCostAfterDiscount: 1100,
      },
      {
        packageId: 'pkg2',
        totalDiscountedAmount: 0,
        totalDeliveryCostBeforeDiscount: 0,
        totalDeliveryCostAfterDiscount: 1100,
      },
      {
        packageId: 'pkg3',
        totalDiscountedAmount: 105,
        totalDeliveryCostBeforeDiscount: 2100,
        totalDeliveryCostAfterDiscount: 1995,
      },
      {
        packageId: 'pkg4',
        totalDiscountedAmount: 0,
        totalDeliveryCostBeforeDiscount: 0,
        totalDeliveryCostAfterDiscount: 1590,
      },
      {
        packageId: 'pkg5',
        totalDiscountedAmount: 0,
        totalDeliveryCostBeforeDiscount: 0,
        totalDeliveryCostAfterDiscount: 1600,
      },
    ]

    mockedDeliveryCostService.getPackagePriceDiscount
      .mockResolvedValueOnce(mockCostResult[0])
      .mockResolvedValueOnce(mockCostResult[1])
      .mockResolvedValueOnce(mockCostResult[2])
      .mockResolvedValueOnce(mockCostResult[3])
      .mockResolvedValueOnce(mockCostResult[4])

    const outcome: DeliveryTimeResultDto[] = [
      {
        packageId: 'pkg1',
        totalDiscountedAmount: 0,
        estimatedDeliveryTime: 1.42,
        totalDeliveryCostAfterDiscount: 1100,
      },

      {
        packageId: 'pkg2',
        totalDiscountedAmount: 0,
        estimatedDeliveryTime: 1.42,
        totalDeliveryCostAfterDiscount: 1100,
      },

      {
        packageId: 'pkg3',
        totalDiscountedAmount: 105,
        estimatedDeliveryTime: 4.26,
        totalDeliveryCostAfterDiscount: 1995,
      },

      {
        packageId: 'pkg4',
        totalDiscountedAmount: 0,
        estimatedDeliveryTime: 7.1,
        totalDeliveryCostAfterDiscount: 1590,
      },

      {
        packageId: 'pkg5',
        totalDiscountedAmount: 0,
        estimatedDeliveryTime: 1.42,
        totalDeliveryCostAfterDiscount: 1600,
      },
    ]

    const result = await deliveryTimeService.calculateEstimatedDeliveryTime(
      input,
    )

    expect(result).toEqual(outcome)
  })

  it('Delivery time, 4 packages send together', async () => {
    const input = {
      vechileDetails: {
        noOfVechiles: 1,
        maxSpeed: 70,
        maxCarriableWeight: 200,
      },
      packageList: mockedFourPackageShouldDeliveryFirst,
    }

    //Base Delivery Cost + (Package Total Weight * 10) +
    //(Distance to Destination * 5) =

    const mockCostResult: DeliveryCostCalculatedDetails[] = [
      {
        packageId: 'pkg1',
        totalDiscountedAmount: 0,
        totalDeliveryCostBeforeDiscount: 900,
        totalDeliveryCostAfterDiscount: 900,
      },
      {
        packageId: 'pkg2',
        totalDiscountedAmount: 0,
        totalDeliveryCostBeforeDiscount: 1100,
        totalDeliveryCostAfterDiscount: 1100,
      },
      {
        packageId: 'pkg3',
        totalDiscountedAmount: 0,
        totalDeliveryCostBeforeDiscount: 1000,
        totalDeliveryCostAfterDiscount: 1000,
      },
      {
        packageId: 'pkg4',
        totalDiscountedAmount: 0,
        totalDeliveryCostBeforeDiscount: 1300,
        totalDeliveryCostAfterDiscount: 1300,
      },
      {
        packageId: 'pkg5',
        totalDiscountedAmount: 0,
        totalDeliveryCostBeforeDiscount: 0,
        totalDeliveryCostAfterDiscount: 1600,
      },
    ]

    mockedDeliveryCostService.getPackagePriceDiscount
      .mockResolvedValueOnce(mockCostResult[0])
      .mockResolvedValueOnce(mockCostResult[1])
      .mockResolvedValueOnce(mockCostResult[2])
      .mockResolvedValueOnce(mockCostResult[3])
      .mockResolvedValueOnce(mockCostResult[4])

    const outcome: DeliveryTimeResultDto[] = [
      {
        packageId: 'pkg1',
        totalDiscountedAmount: 0,
        estimatedDeliveryTime: 1.42,
        totalDeliveryCostAfterDiscount: 900,
      },

      {
        packageId: 'pkg2',
        totalDiscountedAmount: 0,
        estimatedDeliveryTime: 1.42,
        totalDeliveryCostAfterDiscount: 1100,
      },

      {
        packageId: 'pkg3',
        totalDiscountedAmount: 0,
        estimatedDeliveryTime: 1.42,
        totalDeliveryCostAfterDiscount: 1000,
      },

      {
        packageId: 'pkg4',
        totalDiscountedAmount: 0,
        estimatedDeliveryTime: 1.42,
        totalDeliveryCostAfterDiscount: 1300,
      },

      {
        packageId: 'pkg5',
        totalDiscountedAmount: 0,
        estimatedDeliveryTime: 4.26,
        totalDeliveryCostAfterDiscount: 1600,
      },
    ]

    const result = await deliveryTimeService.calculateEstimatedDeliveryTime(
      input,
    )

    expect(result).toEqual(outcome)
  })

  it('Delivery time, 5 packages send together', async () => {
    const input = {
      vechileDetails: {
        noOfVechiles: 1,
        maxSpeed: 70,
        maxCarriableWeight: 200,
      },
      packageList: mockFivePackagesShouldSendFirst,
    }

    //Base Delivery Cost + (Package Total Weight * 10) +
    //(Distance to Destination * 5) =

    const mockCostResult: DeliveryCostCalculatedDetails[] = [
      {
        packageId: 'pkg1',
        totalDiscountedAmount: 0,
        totalDeliveryCostBeforeDiscount: 900,
        totalDeliveryCostAfterDiscount: 900,
      },
      {
        packageId: 'pkg2',
        totalDiscountedAmount: 0,
        totalDeliveryCostBeforeDiscount: 1100,
        totalDeliveryCostAfterDiscount: 1100,
      },
      {
        packageId: 'pkg3',
        totalDiscountedAmount: 0,
        totalDeliveryCostBeforeDiscount: 1000,
        totalDeliveryCostAfterDiscount: 1000,
      },
      {
        packageId: 'pkg4',
        totalDiscountedAmount: 0,
        totalDeliveryCostBeforeDiscount: 1300,
        totalDeliveryCostAfterDiscount: 1300,
      },
      {
        packageId: 'pkg5',
        totalDiscountedAmount: 0,
        totalDeliveryCostBeforeDiscount: 0,
        totalDeliveryCostAfterDiscount: 650,
      },
    ]

    mockedDeliveryCostService.getPackagePriceDiscount
      .mockResolvedValueOnce(mockCostResult[0])
      .mockResolvedValueOnce(mockCostResult[1])
      .mockResolvedValueOnce(mockCostResult[2])
      .mockResolvedValueOnce(mockCostResult[3])
      .mockResolvedValueOnce(mockCostResult[4])

    const outcome: DeliveryTimeResultDto[] = [
      {
        packageId: 'pkg1',
        totalDiscountedAmount: 0,
        estimatedDeliveryTime: 1.42,
        totalDeliveryCostAfterDiscount: 900,
      },

      {
        packageId: 'pkg2',
        totalDiscountedAmount: 0,
        estimatedDeliveryTime: 1.42,
        totalDeliveryCostAfterDiscount: 1100,
      },

      {
        packageId: 'pkg3',
        totalDiscountedAmount: 0,
        estimatedDeliveryTime: 1.42,
        totalDeliveryCostAfterDiscount: 1000,
      },

      {
        packageId: 'pkg4',
        totalDiscountedAmount: 0,
        estimatedDeliveryTime: 1.42,
        totalDeliveryCostAfterDiscount: 1300,
      },

      {
        packageId: 'pkg5',
        totalDiscountedAmount: 0,
        estimatedDeliveryTime: 1.42,
        totalDeliveryCostAfterDiscount: 650,
      },
    ]

    const result = await deliveryTimeService.calculateEstimatedDeliveryTime(
      input,
    )

    expect(result).toEqual(outcome)
  })
})
