import 'reflect-metadata'
import { mock } from 'jest-mock-extended'
import { container } from '../../container'
import { TYPES } from '../../types'
import { InquireService } from '../inquire/inquire.service'
import { DeliveryCostService } from './delivery-cost.service'
import { DeliveryCostController } from './delivery-cost.controller'

const mockDeliveryCostController = mock<DeliveryCostController>()
const mockDeliveryCostService = mock<DeliveryCostService>()
const mockInquireService = mock<InquireService>()

describe('DeliveryCostController', () => {
  let mockedDeliveryCostController: DeliveryCostController
  let mockedDeliveryCostService: DeliveryCostService
  let mockedInquireService: InquireService
  beforeEach(() => {
    container
      .rebind(TYPES.DeliveryCostService)
      .toConstantValue(mockDeliveryCostService)

    container.rebind(TYPES.InquiryService).toConstantValue(mockInquireService)
    container
      .rebind(TYPES.DeliveryCostController)
      .toConstantValue(mockDeliveryCostController)

    mockedInquireService = container.get(TYPES.InquiryService)
    mockedDeliveryCostService = container.get(TYPES.DeliveryCostService)
    //mockedDeliveryCostController = container.get(TYPES.DeliveryCostController)

    mockedDeliveryCostController = new DeliveryCostController(
      mockedInquireService,
      mockedDeliveryCostService,
    )
  })

  it('Delivery cost controller is defined', () => {
    expect(mockedDeliveryCostController).toBeDefined()
    expect(mockedDeliveryCostService).toBeDefined()
    expect(mockedInquireService).toBeDefined()
  })

  it('should get package vechiles details', async () => {
    mockInquireService.askBaseCostNoOfPackages.mockResolvedValue({
      baseDeliveryCost: 100,
      noOfPackages: 3,
    })

    mockInquireService.askQuestionsForDeliveryCost
      .mockResolvedValueOnce({
        weightInKg: 5,
        distanceInKm: 5,
        offerCode: 'OFR001',
        packageId: 'pkg1',
      })
      .mockResolvedValueOnce({
        weightInKg: 15,
        distanceInKm: 5,
        offerCode: 'OFR002',
        packageId: 'pkg2',
      })
      .mockResolvedValueOnce({
        weightInKg: 10,
        distanceInKm: 100,
        offerCode: 'OFR003',
        packageId: 'pkg3',
      })

    mockDeliveryCostService.getPackagePriceDiscount
      .mockResolvedValueOnce({
        packageId: 'pkg1',
        totalDiscountedAmount: 0,
        totalDeliveryCostBeforeDiscount: 175,
        totalDeliveryCostAfterDiscount: 175,
      })
      .mockResolvedValueOnce({
        packageId: 'pkg2',
        totalDiscountedAmount: 0,
        totalDeliveryCostBeforeDiscount: 0,
        totalDeliveryCostAfterDiscount: 275,
      })
      .mockResolvedValueOnce({
        packageId: 'pkg3',
        totalDiscountedAmount: 35,
        totalDeliveryCostBeforeDiscount: 700,
        totalDeliveryCostAfterDiscount: 665,
      })

    const result = await mockedDeliveryCostController.getDeliveryCost()

    expect(
      mockDeliveryCostService.getPackagePriceDiscount,
    ).toHaveBeenCalledTimes(3)

    expect(
      mockDeliveryCostService.getPackagePriceDiscount,
    ).toHaveBeenCalledWith({
      baseDeliveryCost: 100,
      weightInKg: 5,
      distanceInKm: 5,
      offerCode: 'OFR001',
      packageId: 'pkg1',
    })

    expect(
      mockDeliveryCostService.getPackagePriceDiscount,
    ).toHaveBeenCalledWith({
      baseDeliveryCost: 100,
      weightInKg: 15,
      distanceInKm: 5,
      offerCode: 'OFR002',
      packageId: 'pkg2',
    })

    expect(
      mockDeliveryCostService.getPackagePriceDiscount,
    ).toHaveBeenCalledWith({
      baseDeliveryCost: 100,
      weightInKg: 10,
      distanceInKm: 100,
      offerCode: 'OFR003',
      packageId: 'pkg3',
    })

    expect(
      mockedInquireService.askQuestionsForDeliveryCost,
    ).toHaveBeenCalledTimes(3)

    expect(
      mockDeliveryCostService.getPackagePriceDiscount,
    ).toHaveBeenCalledTimes(3)
    expect(
      mockDeliveryCostService.getPackagePriceDiscount,
    ).toHaveBeenCalledWith({
      baseDeliveryCost: 100,
      weightInKg: 5,
      distanceInKm: 5,
      offerCode: 'OFR001',
      packageId: 'pkg1',
    })
    expect(
      mockDeliveryCostService.getPackagePriceDiscount,
    ).toHaveBeenCalledWith({
      baseDeliveryCost: 100,
      weightInKg: 15,
      distanceInKm: 5,
      offerCode: 'OFR002',
      packageId: 'pkg2',
    })
    expect(
      mockDeliveryCostService.getPackagePriceDiscount,
    ).toHaveBeenCalledWith({
      baseDeliveryCost: 100,
      weightInKg: 10,
      distanceInKm: 100,
      offerCode: 'OFR003',
      packageId: 'pkg3',
    })

    expect(result).toEqual([
      {
        packageId: 'pkg1',
        totalDeliveryCostAfterDiscount: 175,
        totalDeliveryCostBeforeDiscount: 175,
        totalDiscountedAmount: 0,
      },
      {
        packageId: 'pkg2',
        totalDeliveryCostAfterDiscount: 275,
        totalDeliveryCostBeforeDiscount: 0,
        totalDiscountedAmount: 0,
      },
      {
        packageId: 'pkg3',
        totalDeliveryCostAfterDiscount: 665,
        totalDeliveryCostBeforeDiscount: 700,
        totalDiscountedAmount: 35,
      },
    ])
  })
})
