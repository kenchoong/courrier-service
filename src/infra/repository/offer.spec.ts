import 'reflect-metadata'
import { mock } from 'jest-mock-extended'
import { container } from '../../container'
import { DataTransformer } from '../../libs/data-transformer'
import { TYPES } from '../../types'
import { OfferDbRepository } from './offer'
import data from './offers.json' assert { type: 'json' }
import { DiscountType, Offer } from '../../domain/offer'

const mockedOfferDbRepository = mock<OfferDbRepository>()
const mockedDataTransformer = mock<DataTransformer>()

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
    id: '12345',
    offerCode: 'offercode2',
    offerName: 'offercode2',
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

describe('OfferDbRepository', () => {
  let repo: OfferDbRepository
  let dataTransformer: DataTransformer

  beforeEach(() => {
    container
      .rebind(TYPES.OfferRepository)
      .toConstantValue(mockedOfferDbRepository)
    container
      .rebind(TYPES.DataTransformer)
      .toConstantValue(mockedDataTransformer)

    repo = container.get(TYPES.OfferRepository)
    dataTransformer = container.get(TYPES.DataTransformer)
  })

  it('is defined', () => {
    expect(repo).toBeDefined()
  })

  it('should return a list of offers', async () => {
    // arrange
    const offerRepo = new OfferDbRepository(dataTransformer)
    mockedDataTransformer.transformData.mockResolvedValue(expected)

    // act
    const actual = await offerRepo.findAll()

    // assert
    expect(actual).toEqual(expected)
  })

  it('should return a single offer', async () => {
    // arrange
    const offerRepo = new OfferDbRepository(dataTransformer)
    mockedDataTransformer.transformData.mockResolvedValue(expected)

    // act
    const actual = await offerRepo.findByCode('offercode2')

    // assert
    expect(actual).toEqual(expected[1])
    expect(mockedDataTransformer.transformData).toBeCalled()
  })

  it('should create offers', async () => {
    // arrange
    const offerRepo = new OfferDbRepository(dataTransformer)

    // act
    const actual = await offerRepo.create(expected[0])

    // assert
    expect(actual).toEqual(expected[0])
    expect(mockedDataTransformer.convertDataToJson).toBeCalled()
    expect(mockedDataTransformer.writeToFile).toBeCalled()
  })
})
