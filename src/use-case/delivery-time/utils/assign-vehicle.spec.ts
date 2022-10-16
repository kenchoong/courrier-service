import { PackageTimeNeededDto } from '../delivery-time.dto'
import { assignVechileForThisTrip, VechileStateDto } from './assign-vehicle'

describe('assignVechileForThisTrip', () => {
  const mockedPackageNeedTimeList: PackageTimeNeededDto[] = [
    {
      packageId: '1',
      weightInKg: 100,
      distanceInKm: 200,
      offerCode: '1234',
      baseDeliveryCost: 100,
      sequence: 0,

      // only this needed
      timeNeeded: 0,
    },
    {
      packageId: '1',
      weightInKg: 100,
      distanceInKm: 200,
      offerCode: '1234',
      baseDeliveryCost: 100,
      sequence: 1,

      // only this needed
      timeNeeded: 0,
    },
  ]
  it('current time case: STEP 1', () => {
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

    const mockedPackageNeedTimeList1 = [
      {
        ...mockedPackageNeedTimeList[0],
        timeNeeded: 1.78,
      },
      {
        ...mockedPackageNeedTimeList[1],
        timeNeeded: 0.85,
      },
    ]

    const result = assignVechileForThisTrip(
      mockedCurrentVechileStates,
      mockedPackageNeedTimeList1,
    )

    expect(result).toEqual({
      assignedVechileNo: '01',
      nextAvailableTimeForVechile: 3.56,
      currentWaitingTime: 0,
    })
  })

  it('current time case: STEP 1', () => {
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

    const mockedPackageNeedTimeList1 = [
      {
        ...mockedPackageNeedTimeList[0],
        timeNeeded: 0.85,
      },
      {
        ...mockedPackageNeedTimeList[1],
        timeNeeded: 1.78,
      },
    ]

    const result = assignVechileForThisTrip(
      mockedCurrentVechileStates,
      mockedPackageNeedTimeList1,
    )

    expect(result).toEqual({
      assignedVechileNo: '01',
      nextAvailableTimeForVechile: 3.56,
      currentWaitingTime: 0,
    })
  })

  it('current time case: STEP 2', () => {
    const mockedCurrentVechileStates: VechileStateDto[] = [
      {
        returningTimeForThisVechile: 3.56,
        vechileNo: '01',
      },
      {
        returningTimeForThisVechile: 0,
        vechileNo: '02',
      },
    ]

    const mockedPackageNeedTimeList2 = [
      {
        ...mockedPackageNeedTimeList[0],
        timeNeeded: 1.42,
      },
    ]

    const result = assignVechileForThisTrip(
      mockedCurrentVechileStates,
      mockedPackageNeedTimeList2,
    )

    // currentWaitingTime(CurrentTime) = 0 (Lowest return time in vechile state)
    // nextAvailableTimeForVechile = 0 + (2 * 1.42) = 2.84
    expect(result).toEqual({
      assignedVechileNo: '02',
      nextAvailableTimeForVechile: 2.84,
      currentWaitingTime: 0,
    })
  })

  it('current time case: STEP 03 and 04', () => {
    const mockedCurrentVechileStates: VechileStateDto[] = [
      {
        returningTimeForThisVechile: 3.56,
        vechileNo: '01',
      },
      {
        returningTimeForThisVechile: 2.84,
        vechileNo: '02',
      },
    ]

    const mockedPackageNeedTimeList3 = [
      {
        ...mockedPackageNeedTimeList[0],
        timeNeeded: 1.35,
      },
    ]

    const result = assignVechileForThisTrip(
      mockedCurrentVechileStates,
      mockedPackageNeedTimeList3,
    )

    // currentWaitingTime(CurrentTime) = 2.84 (Lowest return time in vechile state)
    // nextAvailableTimeForVechile = 2.84 + (2 * 1.35) = 5.54
    expect(result).toEqual({
      assignedVechileNo: '02',
      nextAvailableTimeForVechile: 5.54,
      currentWaitingTime: 2.84,
    })
  })

  it('current time case: STEP 05 and 06', () => {
    const mockedCurrentVechileStates: VechileStateDto[] = [
      {
        returningTimeForThisVechile: 3.56,
        vechileNo: '01',
      },
      {
        returningTimeForThisVechile: 5.54,
        vechileNo: '02',
      },
    ]

    const mockedPackageNeedTimeList4 = [
      {
        ...mockedPackageNeedTimeList[0],
        timeNeeded: 0.42,
      },
    ]

    const result = assignVechileForThisTrip(
      mockedCurrentVechileStates,
      mockedPackageNeedTimeList4,
    )

    // currentWaitingTime(CurrentTime) = 3.56 (Lowest return time in vechile state)
    // nextAvailableTimeForVechile = 3.56 + (2 * 0.42) = 4.4
    expect(result).toEqual({
      assignedVechileNo: '01',
      nextAvailableTimeForVechile: 4.4,
      currentWaitingTime: 3.56,
    })
  })
})
