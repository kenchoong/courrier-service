import { PackageDtoForTime } from '../delivery-time.dto'
import { getPackageComboPerTrip } from './get-package-combo-per-trip'

export function getPackageComboSequence(
  packageList: PackageDtoForTime[],
  maxCarriableWeight: number,
): PackageDtoForTime[][] {
  let remainingPackages = [...packageList]
  let deliveryComboSequence = [] as PackageDtoForTime[][]

  while (remainingPackages.length > 0) {
    const toBeTrained = [...remainingPackages]

    const combo = getPackageComboPerTrip(toBeTrained, maxCarriableWeight)
    deliveryComboSequence.push(combo)

    remainingPackages = remainingPackages.filter(
      (eachPackage) => !combo.includes(eachPackage),
    )
  }

  return deliveryComboSequence
}
