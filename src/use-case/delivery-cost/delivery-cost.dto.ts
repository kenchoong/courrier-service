export class PackageDto {
  packageId: string
  weightInKg: number
  distanceInKm: number
  offerCode: string
  baseDeliveryCost: number
}

export interface AfterDiscount {
  totalDiscountedAmount: number
  totalDeliveryCostAfterDiscount: number
}

export interface DeliveryCostCalculatedDetails {
  packageId: string
  totalDeliveryCostBeforeDiscount: number
  totalDiscountedAmount: number
  totalDeliveryCostAfterDiscount: number
}
