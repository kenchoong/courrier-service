import { Entity } from './entity'

export enum DiscountType {
  FLAT = 'FLAT',
  PERCENTAGE = 'PERCENTAGE',
}

export interface Weight {
  unitCode: string
  min: number
  max: number
}

export interface Distance {
  unitCode: string
  min: number
  max: number
}

export interface OfferCriteria {
  weight: Weight
  distance: Distance
}

export interface OfferProps {
  id?: string
  offerCode: string
  offerName: string
  discountType: DiscountType
  discountAmount: number
  criteria: OfferCriteria
}

export class Offer extends Entity<OfferProps> {
  offerCode: string
  offerName: string
  discountType: DiscountType
  discountAmount: number
  criteria: OfferCriteria
  private constructor(offer: OfferProps) {
    super(offer)
    Object.assign(this, offer)
  }

  public unmarsal(): OfferProps {
    return {
      id: this.id,
      offerCode: this.offerCode,
      offerName: this.offerName,
      discountType: this.discountType,
      discountAmount: this.discountAmount,
      criteria: this.criteria,
    }
  }
}
