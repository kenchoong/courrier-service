import { inject, injectable } from 'inversify'
import { Offer, OfferProps } from '../../domain/offer'
import { OfferRepository } from '../../domain/repository'
import data from './offers.json' assert { type: 'json' }
import { DataTransformer } from '../../libs/data-transformer'
import { TYPES } from '../../types'

@injectable()
export class OfferDbRepository implements OfferRepository {
  constructor(
    @inject(TYPES.DataTransformer) private dataTransformer: DataTransformer,
  ) {}

  async findByCode(code: string): Promise<OfferProps | null> {
    const offerData: OfferProps[] = await this.dataTransformer.transformData<
      Offer[]
    >(data, Offer)

    const offer = offerData.find((item) => {
      return item.offerCode === code
    })
    const dataToReturn = offer ? offer : null
    return Promise.resolve(dataToReturn)
  }

  findAll(): Promise<OfferProps[]> {
    const offerData = this.dataTransformer.transformData(data, Offer)

    return Promise.resolve(offerData)
  }

  async create(offer: OfferProps): Promise<OfferProps> {
    const existingOffer = await this.findAll()

    existingOffer.push(offer)

    const dataToReturn = this.dataTransformer.convertDataToJson(existingOffer)

    await this.dataTransformer.writeToFile(
      'src/infra/repository/offers.json',
      dataToReturn,
    )

    return Promise.resolve(offer)
  }

  getById(id: string): Promise<OfferProps> {
    // demo purpose only
    throw new Error('Method not implemented.')
  }

  update(offer: Offer): Promise<OfferProps> {
    // demo purpose only
    throw new Error('Method not implemented.')
  }
}
