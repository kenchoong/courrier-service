import { PackageDtoForTime } from '../../delivery-time.dto'

/**
 * @description
 * Input stimulate 7 packages with below situation
 * - PKG1, PKG2, PKG3, total weight 200kg, highest weight
 * - All 100km/70 = 1.42 hours/km
 * - pkg6, pkg7 total 195kg, highest weight, distance 190km
 * - pkg5, pkg8,total 175kg, highest weight, distance 160km

 * Total 3 trips
 * This will cover all the situation together
 * - Maximize no of packages
 * - If same no of package, Maximize weight
 */
export const mockUltimateSituation: PackageDtoForTime[] = [
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
    weightInKg: 120,
    distanceInKm: 100,
    offerCode: 'off003',
    baseDeliveryCost: 100,
    sequence: 2,
  },
  {
    packageId: 'pkg5',
    weightInKg: 100,
    distanceInKm: 90,
    offerCode: 'off001',
    baseDeliveryCost: 100,
    sequence: 3,
  },
  {
    packageId: 'pkg6',
    weightInKg: 85,
    distanceInKm: 90,
    offerCode: 'off002',
    baseDeliveryCost: 100,
    sequence: 4,
  },
  {
    packageId: 'pkg7',
    weightInKg: 110,
    distanceInKm: 100,
    offerCode: 'off001',
    baseDeliveryCost: 100,
    sequence: 5,
  },
  {
    packageId: 'pkg8',
    weightInKg: 75,
    distanceInKm: 70,
    offerCode: 'off003',
    baseDeliveryCost: 100,
    sequence: 6,
  },
]
