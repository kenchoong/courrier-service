import { PackageDtoForTime } from '../delivery-time.dto'

/**
 * Maximize the number of package first
 * - If the number of package is the same,
 *   maximize the total weight of the package in combo
 * - If the total weight is the same,
 *   maximize the total distance of the package in combo
 * @param packageComboList
 * @returns array of package combo(which should send first)
 */
export function decideSendFirstCombo(
  packageComboList: PackageDtoForTime[][],
): PackageDtoForTime[] {
  return packageComboList.reduce((prev, current) => {
    if (current.length > prev.length) {
      return current
    } else if (current.length === prev.length) {
      // check for sum of weight
      const currentComboSum = current.reduce((accumulate, currentCombo) => {
        return accumulate + currentCombo.weightInKg
      }, 0)

      const previousComboSum = prev.reduce((accumulate, previousCombo) => {
        return accumulate + previousCombo.weightInKg
      }, 0)

      if (currentComboSum > previousComboSum) {
        return current
      } else if (currentComboSum === previousComboSum) {
        // check for sum of distance
        const currentComboDistance = current.reduce(
          (accumulate, currentCombo) => {
            return accumulate + currentCombo.distanceInKm
          },
          0,
        )

        const previousComboDistance = prev.reduce(
          (accumulate, previousCombo) => {
            return accumulate + previousCombo.distanceInKm
          },
          0,
        )

        if (currentComboDistance > previousComboDistance) {
          return current
        } else {
          return prev
        }
      } else {
        return prev
      }
    } else {
      return prev
    }
  })
}
