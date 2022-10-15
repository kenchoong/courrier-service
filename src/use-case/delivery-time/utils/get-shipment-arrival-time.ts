import { roundOff } from '../../utils/utils'

/**
 *
 * @param distanceInKm
 * @param maxSpeed
 * @returns number (Time needed to deliver a shipment, in hours, rounded off to 2 digits)
 */
export function getShipmentArrivalTime(distanceInKm: number, maxSpeed: number) {
  return roundOff(distanceInKm / maxSpeed)
}
