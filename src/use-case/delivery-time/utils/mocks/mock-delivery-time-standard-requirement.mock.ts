import { PackageDtoForTime } from '../../delivery-time.dto'

/**
 * @description
 * Input stimulate standard requirement
 * - PKG2,  PKG4
 * - PKG3
 * - PKG5
 * - PKG1
 */
export const mockedDeliveryTimeStandardRequirement: PackageDtoForTime[] = [
  {
    packageId: 'pkg1',
    weightInKg: 50,
    distanceInKm: 30,
    offerCode: 'off001',
    baseDeliveryCost: 100,
    sequence: 0,
  },
  {
    packageId: 'pkg2',
    weightInKg: 75,
    distanceInKm: 125,
    offerCode: 'off008',
    baseDeliveryCost: 100,
    sequence: 1,
  },
  {
    packageId: 'pkg3',
    weightInKg: 175,
    distanceInKm: 100,
    offerCode: 'off003',
    baseDeliveryCost: 100,
    sequence: 2,
  },
  {
    packageId: 'pkg4',
    weightInKg: 110,
    distanceInKm: 60,
    offerCode: 'off002',
    baseDeliveryCost: 100,
    sequence: 3,
  },
  {
    packageId: 'pkg5',
    weightInKg: 155,
    distanceInKm: 95,
    offerCode: 'off001',
    baseDeliveryCost: 100,
    sequence: 4,
  },
]
