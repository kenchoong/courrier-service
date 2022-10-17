import { VechileStateDto } from './assign-vehicle'
import { updateVechileStates } from './update-vehicle-states'

describe('updateVechileStates', () => {
  it('it should update the vechile state according to vechile no', () => {
    const mockedCurrentVechileStates: VechileStateDto[] = [
      {
        returningTimeForThisVechile: 0,
        vechileNo: '01',
      },
      {
        returningTimeForThisVechile: 0,
        vechileNo: '02',
      },
    ]

    const mockedAssignedVechileNo = '01'
    const mockedVechileNextAvailableTime = 3.56

    const result = updateVechileStates(
      mockedCurrentVechileStates,
      mockedAssignedVechileNo,
      mockedVechileNextAvailableTime,
    )

    expect(result).toEqual([
      {
        returningTimeForThisVechile: 3.56,
        vechileNo: '01',
      },
      {
        returningTimeForThisVechile: 0,
        vechileNo: '02',
      },
    ])
  })
})
