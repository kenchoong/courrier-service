import { PackageTimeNeededDto } from '../delivery-time.dto'

export class VechileStateDto {
  returningTimeForThisVechile: number
  vechileNo: string
}

export class AssignVechileResult {
  /**
   * @Description
   * We need to find out which vechile to be assigned
   */
  assignedVechileNo: string

  /**
   * @Description
   * the time needed for this vechile to return
   */
  nextAvailableTimeForVechile: number
  /**
   * @Description
   * - in case no vechile is available,
   * - we need to wait how long for any of our vechile to return
   * - so we can dispatch this package combo
   */
  currentWaitingTime: number
}

/**
 * Purpose: Assign vechile to delivery a package combo
 * We know the current state of all vechiles right now
 * and the time needed for each package in this combo
 *
 * assignedVechileNo: We need to find out which vechile to be assigned
 * nextAvailableTimeForVechile: the time needed for this vechile to return
 *
 * currentWaitingTime:
 * - in case no vechile is available,
 * - we need to wait how long for any of our vechile to return
 * - so we can dispatch this package combo
 *
 *
 * @param currentVechileStates: VechileStateDto[]
 * @param packageNeedTimeList: PackageTimeNeededDto[]
 * @returns AssignVechileResult
 */
export function assignVechileForThisTrip(
  currentVechileStates: VechileStateDto[],
  packageNeedTimeList: PackageTimeNeededDto[],
): AssignVechileResult {
  // get the vechile which is available first
  // returning time is lowest
  const lowestCurrentWaitingTimeVechile = currentVechileStates.reduce(
    (previos, current) => {
      if (
        current.returningTimeForThisVechile <
        previos.returningTimeForThisVechile
      ) {
        return current
      }
      return previos
    },
  )

  // among the package, which one need the longest time to deliver
  const highTimeNeededPackage = packageNeedTimeList.reduce(
    (previos, current) => {
      if (current.timeNeeded > previos.timeNeeded) {
        return current
      }
      return previos
    },
  )

  // CurrentTime in requirement
  // in case no vechile is available now,
  // how much time we need to wait, in order any vechile is available again
  // This means a shortest time any vechile is available
  const currentWaitingTime =
    lowestCurrentWaitingTimeVechile.returningTimeForThisVechile

  // In order to send this trip for this package combo
  // how much time will cause a vechile until it available again
  const nextAvailableTimeForVechile =
    currentWaitingTime + highTimeNeededPackage.timeNeeded * 2

  // After this action,
  // we need to tell the caller
  // vechileNo: which vechile is assigned
  // nextAvailableTimeForVechile = when this vechile will be available again
  // currentWaitingTime = in case no  vechile is available,
  // how much time need to wait, in order any vechile is available again
  return {
    assignedVechileNo: lowestCurrentWaitingTimeVechile.vechileNo,
    nextAvailableTimeForVechile,
    currentWaitingTime,
  }
}
