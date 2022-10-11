import { inject, injectable } from 'inversify'
import * as repository from '../domain/repository'
import { TYPES } from '../types'

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
}
