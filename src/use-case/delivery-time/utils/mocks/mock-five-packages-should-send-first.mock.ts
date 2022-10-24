import { PackageDtoForTime } from '../../delivery-time.dto'

/**
 * @description
 * Input stimulate 5 packages should send first
 * - PKG1, PKG2, PKG3,PKG4, PKG5
 * 1 trips
 */
export const mockFivePackagesShouldSendFirst: PackageDtoForTime[] = [
  {
    packageId: 'pkg1',
    weightInKg: 30,
    distanceInKm: 100,
    offerCode: 'off002',
    baseDeliveryCost: 100,
    sequence: 0,
  },
  {
    packageId: 'pkg2',
    weightInKg: 50,
    distanceInKm: 100,
    offerCode: 'off001',
    baseDeliveryCost: 100,
    sequence: 1,
  },
  {
    packageId: 'pkg3',
    weightInKg: 40,
    distanceInKm: 100,
    offerCode: 'off003',
    baseDeliveryCost: 100,
    sequence: 2,
  },
  {
    packageId: 'pkg4',
    weightInKg: 70,
    distanceInKm: 100,
    offerCode: 'off001',
    baseDeliveryCost: 100,
    sequence: 3,
  },
  {
    packageId: 'pkg5',
    weightInKg: 5,
    distanceInKm: 100,
    offerCode: 'off001',
    baseDeliveryCost: 100,
    sequence: 4,
  },
]
