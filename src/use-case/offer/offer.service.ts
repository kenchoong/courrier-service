import { inject, injectable } from 'inversify'
import { Offer, OfferProps } from '../../domain/offer'
import * as repository from '../../domain/repository'
import { TYPES } from '../../types'

@injectable()
export class OfferService {
  constructor(
    @inject(TYPES.OfferRepository)
    private offerRepository: repository.OfferRepository,
  ) {}

  async listOffers(): Promise<any> {
    const offerData = await this.offerRepository.findAll()
    return Promise.resolve(offerData)
  }

  async addOffers(offer: OfferProps): Promise<any> {
    const offerData = await this.offerRepository.create(offer)
    return Promise.resolve(offerData)
  }
}
