import { PackageDtoForTime } from '../../delivery-time.dto'

/**
 * @description
 * 2 packages should send first
 * 3 trips
 * - PKG1, PKG2,
 * - PKG3, PKG4
 * - PKG5
 */
export const mockedTwoComboSameLengthAndWeightDifferenceDistance: PackageDtoForTime[] =
  [
    {
      packageId: 'pkg1',
      weightInKg: 140,
      distanceInKm: 100,
      offerCode: 'off001',
      baseDeliveryCost: 100,
      sequence: 0,
    },
    {
      packageId: 'pkg2',
      weightInKg: 60,
      distanceInKm: 200,
      offerCode: 'off008',
      baseDeliveryCost: 100,
      sequence: 1,
    },
    {
      packageId: 'pkg3',
      weightInKg: 130,
      distanceInKm: 100,
      offerCode: 'off003',
      baseDeliveryCost: 100,
      sequence: 2,
    },
    {
      packageId: 'pkg4',
      weightInKg: 70,
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
