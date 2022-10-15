import { roundOff } from './utils'

describe('getPackageComboPerTrip', () => {
  it('should round off to 2 decimal places', () => {
    const result = roundOff(1.23456)
    expect(result).toBe(1.23)
  })
})
