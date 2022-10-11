import { Offer, OfferProps } from './offer'

export interface OfferRepository {
  getById(id: string): Promise<OfferProps>
  create(offer: Offer): Promise<OfferProps>
  update(offer: Offer): Promise<OfferProps>
  findAll(): Promise<Partial<OfferProps[]>>
  findByCode(code: string): Promise<OfferProps | null>
}
