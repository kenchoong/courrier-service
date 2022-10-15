import { getShipmentArrivalTime } from './get-shipment-arrival-time'

describe('getShipmentArrivalTime', () => {
  it('should return 2 digit number', () => {
    const result = getShipmentArrivalTime(120, 70)
    expect(result).toBe(1.71)
  })
})
