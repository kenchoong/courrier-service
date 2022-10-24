import { PackageDtoForTime } from '../../delivery-time.dto'

/**
 * @description
 * 3 packages should send first
 * - PKG1, PKG2, PKG5
 * - PKG3,
 * - PKG4
 */
export const mockedThreePackagesShouldSendFirst: PackageDtoForTime[] = [
  {
    packageId: 'pkg1',
    weightInKg: 50,
    distanceInKm: 100,
    offerCode: 'off001',
    baseDeliveryCost: 100,
    sequence: 0,
  },
  {
    packageId: 'pkg2',
    weightInKg: 50,
    distanceInKm: 100,
    offerCode: 'off008',
    baseDeliveryCost: 100,
    sequence: 1,
  },
  {
    packageId: 'pkg3',
    weightInKg: 150,
    distanceInKm: 100,
    offerCode: 'off003',
    baseDeliveryCost: 100,
    sequence: 2,
  },
  {
    packageId: 'pkg4',
    weightInKg: 99,
    distanceInKm: 100,
    offerCode: 'off002',
    baseDeliveryCost: 100,
    sequence: 3,
  },
  {
    packageId: 'pkg5',
    weightInKg: 100,
    distanceInKm: 100,
    offerCode: 'off001',
    baseDeliveryCost: 100,
    sequence: 4,
  },
]
