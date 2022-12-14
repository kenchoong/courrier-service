import 'reflect-metadata'
import { mock } from 'jest-mock-extended'
import { OfferService } from './offer.service'
import { container } from '../../container'
import { DiscountType } from '../../domain/offer'
import { OfferRepository } from '../../domain/repository'
import { TYPES } from '../../types'

const mockedOfferService = mock<OfferService>()
const mockedOfferRepository = mock<OfferRepository>()

describe('OfferService', () => {
  let service: OfferService
  let repo: OfferRepository

  beforeEach(() => {
    container.rebind(TYPES.OfferService).toConstantValue(mockedOfferService)
    container
      .rebind(TYPES.OfferRepository)
      .toConstantValue(mockedOfferRepository)

    service = container.get(TYPES.OfferService)
    repo = container.get(TYPES.OfferRepository)
  })

  it('offer service is defined', () => {
    expect(service).toBeDefined()
  })

  const expected = [
    {
      id: '1234',
      offerCode: 'offercode1',
      offerName: 'offercode1',
      discountType: DiscountType.PERCENTAGE,
      discountAmount: 5,
      criteria: {
        weight: {
          unitCode: 'kg',
          min: 0,
          max: 10,
        },
        distance: {
          unitCode: 'km',
          min: 0,
          max: 10,
        },
      },
    },
    {
      id: '1234',
      offerCode: 'offercode1',
      offerName: 'offercode1',
      discountType: DiscountType.PERCENTAGE,
      discountAmount: 5,
      criteria: {
        weight: {
          unitCode: 'kg',
          min: 0,
          max: 10,
        },
        distance: {
          unitCode: 'km',
          min: 0,
          max: 10,
        },
      },
    },
  ]
  it('should return a list of offers', async () => {
    // arrange

    const offerService = new OfferService(repo)
    mockedOfferRepository.findAll.mockResolvedValue(expected)

    // // act
    const offer = await offerService.listOffers()

    // // assert
    expect(mockedOfferRepository.findAll).toHaveBeenCalledTimes(1)
    expect(offer).toEqual(expected)
  })

  it('should create offers', async () => {
    const offerService = new OfferService(repo)
    mockedOfferRepository.create.mockResolvedValue(expected[0])

    // // act
    const offer = await offerService.addOffers(expected[0])

    // // assert
    expect(mockedOfferRepository.create).toHaveBeenCalledTimes(1)
    expect(offer).toEqual(expected[0])
  })
})
