import { PackageDto } from '../delivery-cost/delivery-cost.dto'

export interface VechileDetailDto {
  noOfVechiles: number
  maxSpeed: number
  maxCarriableWeight: number
}

export interface PackageDtoForTime extends PackageDto {
  sequence: number
}

export interface PackageTimeNeededDto extends PackageDtoForTime {
  timeNeeded: number
}

export interface PackageDeliveredTimeDto extends PackageDtoForTime {
  estimatedDeliveryTime: number
}

export class CalculateDeliveryTimeInputDto {
  vechileDetails: VechileDetailDto
  packageList: PackageDtoForTime[]
}
