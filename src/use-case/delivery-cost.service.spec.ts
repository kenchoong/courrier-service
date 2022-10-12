import 'reflect-metadata'
import { jest } from '@jest/globals'
import { mock, mockClear } from 'jest-mock-extended'
import { DeliveryCostService } from './delivery-cost.service'
import { container } from '../container'
import { TYPES } from '../types'
import { OfferRepository } from '../domain/repository'
import { InquireService } from './inquire.service'
import { CliTable } from '../libs/cli-table'
import { DiscountType } from '../domain/offer'
import Table from 'cli-table3'

const mockedDeliveryCostService = mock<DeliveryCostService>()
const mockedOfferRepository = mock<OfferRepository>()
const mockedInquireService = mock<InquireService>()
const mockedCliTable = mock<CliTable>()

const mockedOffer003 = {
  id: 'OFFER3',
  offerCode: 'OFR003',
  offerName: '5% off for courrier fees',
  discountType: DiscountType.PERCENTAGE,
  discountAmount: 5,
  criteria: {
    weight: {
      unitCode: 'kg',
      min: 10,
      max: 150,
    },
    distance: {
      unitCode: 'km',
      min: 50,
      max: 250,
    },
  },
}

describe('DeliveryCostService', () => {
  let mockService: DeliveryCostService
  let inquiryService: InquireService
  let offerRepository: OfferRepository
  let cliTable: CliTable

  let deliveryCostService: DeliveryCostService

  beforeEach(() => {
    container
      .rebind(TYPES.DeliveryCostService)
      .toConstantValue(mockedDeliveryCostService)

    container.rebind(TYPES.InquiryService).toConstantValue(mockedInquireService)

    container
      .rebind(TYPES.OfferRepository)
      .toConstantValue(mockedOfferRepository)

    container.rebind(TYPES.CliTable).toConstantValue(mockedCliTable)

    mockService = container.get(TYPES.DeliveryCostService)
    inquiryService = container.get(TYPES.InquiryService)
    offerRepository = container.get(TYPES.OfferRepository)
    cliTable = container.get(TYPES.CliTable)

    deliveryCostService = new DeliveryCostService(
      inquiryService,
      offerRepository,
      cliTable,
    )
  })

  it('DeliveryCostservice is defined', () => {
    expect(mockService).toBeDefined()
    expect(inquiryService).toBeDefined()
    expect(offerRepository).toBeDefined()
  })

  it('should calculate percentage discount', () => {
    const result = deliveryCostService.calculateDiscount(
      DiscountType.PERCENTAGE,
      100,
      10,
    )

    expect(result).toEqual({
      totalDiscountedAmount: 10,
      totalDeliveryCostAfterDiscount: 90,
    })
  })

  it('should calculate fixed discount', () => {
    const result = deliveryCostService.calculateDiscount(
      DiscountType.FLAT,
      100,
      5,
    )

    expect(result).toEqual({
      totalDiscountedAmount: 5,
      totalDeliveryCostAfterDiscount: 95,
    })
  })

  it('should check is between range', () => {
    const result = deliveryCostService.isBetweenRange(5, 0, 10)

    expect(result).toEqual(true)
  })

  it('should check is not between range', () => {
    const result = deliveryCostService.isBetweenRange(15, 5, 10)

    expect(result).toEqual(false)
  })

  it('bigger than min - should check is between range even max value is null', () => {
    const result = deliveryCostService.isBetweenRange(15, 5, null)

    expect(result).toEqual(true)
  })

  it('smaller than min - should check is between range even max value is null', () => {
    const result = deliveryCostService.isBetweenRange(4, 5, null)

    expect(result).toEqual(false)
  })

  it('PKG 1: Testcase - getPackagePriceDiscount - should get package price discount', async () => {
    mockedOfferRepository.findByCode.mockResolvedValue(null)

    const result = await deliveryCostService.getPackagePriceDiscount({
      baseDeliveryCost: 100,
      weightInKg: 5,
      distanceInKm: 5,
      offerCode: 'OFR001',
      packageId: 'pkg1',
    })
    // Base Delivery Cost + (Package Total Weight * 10) +
    // (Distance to Destination * 5) =
    // 100 + (5 * 10) + (5 * 5) = 175
    // Offer code not found, no discount
    // Discount amount = 0
    // Total delivery cost = 175 (no discount)

    expect(result).toEqual({
      packageId: 'pkg1',
      totalDeliveryCostBeforeDiscount: 175,
      totalDiscountedAmount: 0,
      totalDeliveryCostAfterDiscount: 175,
    })
  })

  it('PKG 3: Testcase - getPackagePriceDiscount - should get package price discount', async () => {
    mockedOfferRepository.findByCode.mockResolvedValue(mockedOffer003)

    const result = await deliveryCostService.getPackagePriceDiscount({
      baseDeliveryCost: 100,
      weightInKg: 10,
      distanceInKm: 100,
      offerCode: 'OFR003',
      packageId: 'pkg3',
    })

    // Base Delivery Cost + (Package Total Weight * 10) +
    // (Distance to Destination * 5) =
    // 100 + (10 * 10) + (100 * 5) = 700
    // applied offerCode: OFR003
    // 5% off for courrier fees
    // Discount amount = 35 (5% of 700)
    // Total delivery cost = 665 (700 - 35)

    expect(result).toEqual({
      packageId: 'pkg3',
      totalDeliveryCostBeforeDiscount: 700,
      totalDiscountedAmount: 35,
      totalDeliveryCostAfterDiscount: 665,
    })
  })

  it('PKG 4: Testcase - getPackagePriceDiscount - found offer, but weight not within range', async () => {
    mockedOfferRepository.findByCode.mockResolvedValue(mockedOffer003)

    const result = await deliveryCostService.getPackagePriceDiscount({
      baseDeliveryCost: 100,
      weightInKg: 4,
      distanceInKm: 100,
      offerCode: 'OFR003',
      packageId: 'pkg4',
    })

    // Base Delivery Cost + (Package Total Weight * 10) +
    // (Distance to Destination * 5) =
    // 100 + (4 * 10) + (100 * 5) = 640
    // applied offerCode: OFR003
    // No discount, weight not within range

    expect(result).toEqual({
      packageId: 'pkg4',
      totalDeliveryCostBeforeDiscount: 640,
      totalDiscountedAmount: 0,
      totalDeliveryCostAfterDiscount: 640,
    })
  })

  it('PKG 5: Testcase - getPackagePriceDiscount - found offer, but distance not within range', async () => {
    mockedOfferRepository.findByCode.mockResolvedValue(mockedOffer003)

    const result = await deliveryCostService.getPackagePriceDiscount({
      baseDeliveryCost: 100,
      weightInKg: 10,
      distanceInKm: 4,
      offerCode: 'OFR003',
      packageId: 'pkg5',
    })

    // Base Delivery Cost + (Package Total Weight * 10) +
    // (Distance to Destination * 5) =
    // 100 + (10 * 10) + (4 * 5) = 220
    // applied offerCode: OFR003
    // No discount, distance not within range

    expect(result).toEqual({
      packageId: 'pkg5',
      totalDeliveryCostBeforeDiscount: 220,
      totalDiscountedAmount: 0,
      totalDeliveryCostAfterDiscount: 220,
    })
  })

  it('getTotalDeliveryCost - should get total delivery cost', async () => {
    mockedInquireService.askBaseCostNoOfPackages.mockResolvedValue({
      baseDeliveryCost: 100,
      noOfPackages: 2,
    })

    mockedCliTable.initializeTable.mockReturnValue(
      new Table({
        head: ['Package Id', 'Discounted Amount', 'Total after discount'],
        colWidths: [20, 20, 20],
        wordWrap: true,
      }),
    )

    mockedInquireService.askQuestionsForDeliveryCost
      .mockResolvedValueOnce({
        weightInKg: 5,
        distanceInKm: 5,
        offerCode: 'OFR001',
        packageId: 'pkg1',
      })
      .mockResolvedValueOnce({
        weightInKg: 10,
        distanceInKm: 100,
        offerCode: 'OFR003',
        packageId: 'pkg3',
      })

    const result = deliveryCostService.getDeliveryCost()

    expect(mockedInquireService.askBaseCostNoOfPackages).toHaveBeenCalledTimes(
      1,
    )

    // TODO: Need to figure out the for loop
    // expect(
    //   mockedInquireService.askQuestionsForDeliveryCost,
    // ).toHaveBeenCalledTimes(2)

    //expect(mockService.getPackagePriceDiscount).toHaveBeenCalledTimes(2)
    // expect(mockService.getPackagePriceDiscount).toHaveBeenCalledWith({
    //   baseDeliveryCost: 100,
    //   weightInKg: 5,
    //   distanceInKm: 5,
    //   offerCode: 'OFR001',
    //   packageId: 'pkg1',
    // })
    // expect(mockService.getPackagePriceDiscount).toHaveBeenCalledWith({
    //   baseDeliveryCost: 100,
    //   weightInKg: 10,
    //   distanceInKm: 100,
    //   offerCode: 'OFR003',
    //   packageId: 'pkg3',
    // })

    // expect(result).toEqual([
    //   ['pkg1', '0', '175'],
    //   ['pkg3', '35', '665'],
    // ])
  })
})
