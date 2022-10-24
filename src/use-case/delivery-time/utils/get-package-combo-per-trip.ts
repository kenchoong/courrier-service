import { PackageDtoForTime } from '../delivery-time.dto'
import { decideSendFirstCombo } from './decide-send-first-combo'

export function powerSet(array: PackageDtoForTime[]): PackageDtoForTime[][] {
  if (array.length === 0) {
    return [[]]
  }

  var lastElement = array.pop() as PackageDtoForTime

  var restPowerset = powerSet(array)

  var powerset = []
  for (var i = 0; i < restPowerset.length; i++) {
    var set = restPowerset[i]

    // without last element
    powerset.push(set)

    // with last element
    set = set.slice() // create a new array that's a copy of set
    set.push(lastElement)
    powerset.push(set)
  }

  return powerset
}

export function getPackageComboPerTrip(
  packageList: PackageDtoForTime[],
  maxCarriableWeight: number,
) {
  // all subsets of arr
  var powerset = powerSet(packageList)

  // subsets summing less than or equal to number
  var subsets: PackageDtoForTime[][] = []

  for (var i = 0; i < powerset.length; i++) {
    var subset = powerset[i]

    var sum = 0
    for (var j = 0; j < subset.length; j++) {
      sum += subset[j].weightInKg
    }

    if (sum <= maxCarriableWeight) {
      subsets.push(subset)
    }
  }

  return decideSendFirstCombo(subsets)
}
