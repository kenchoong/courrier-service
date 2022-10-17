import { PackageTimeNeededDto } from '../delivery-time.dto'
import { VechileStateDto } from './assign-vehicle'

/**
 *
 * Update the state of specific vechile
 * with its returning time
 *
 * @param currentVechileStates
 * @param vechileNo
 * @param vechileNextAvailableTime
 * @returns updatedVechileStates: VechileStateDto[]
 */
export function updateVechileStates(
  currentVechileStates: VechileStateDto[],
  vechileNo: string,
  vechileNextAvailableTime: number,
): VechileStateDto[] {
  // update the vechile state
  // cause 1 vechile is assigned to this trip
  // store return time for this vechile in the state
  let objIndex = currentVechileStates.findIndex(
    (obj) => obj.vechileNo === vechileNo,
  )
  currentVechileStates[objIndex].returningTimeForThisVechile =
    vechileNextAvailableTime

  return currentVechileStates
}
