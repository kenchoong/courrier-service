import { PackageDtoForTime } from '../delivery-time.dto'
import { getPackageComboPerTrip } from './get-package-combo-per-trip'
import { mockFivePackagesShouldSendFirst } from './mocks/mock-five-packages-should-send-first.mock'
import { mockedFourPackageShouldDeliveryFirst } from './mocks/mock-four-packages-should-send-first.mock'
import { mockedThreePackagesShouldSendFirst } from './mocks/mock-three-packages-should-send-first..mock'

describe('getPackageComboPerTrip', () => {
  let maxCarriableWeight = 200
  it('getPackageComboPerTrip, step 1 of requirement', () => {
    const mockedOrignalPackageListStepO1: PackageDtoForTime[] = [
      {
        packageId: 'pkg1',
        weightInKg: 50,
        distanceInKm: 30,
        offerCode: 'off001',
        baseDeliveryCost: 100,
        sequence: 0,
      },
      {
        packageId: 'pkg2',
        weightInKg: 75,
        distanceInKm: 125,
        offerCode: 'off008',
        baseDeliveryCost: 100,
        sequence: 1,
      },
      {
        packageId: 'pkg3',
        weightInKg: 175,
        distanceInKm: 100,
        offerCode: 'off003',
        baseDeliveryCost: 100,
        sequence: 2,
      },
      {
        packageId: 'pkg4',
        weightInKg: 110,
        distanceInKm: 60,
        offerCode: 'off002',
        baseDeliveryCost: 100,
        sequence: 3,
      },
      {
        packageId: 'pkg5',
        weightInKg: 155,
        distanceInKm: 95,
        offerCode: 'off001',
        baseDeliveryCost: 100,
        sequence: 4,
      },
    ]

    const mockedOutcome = [
      {
        packageId: 'pkg2',
        weightInKg: 75,
        distanceInKm: 125,
        offerCode: 'off008',
        baseDeliveryCost: 100,
        sequence: 1,
      },
      {
        packageId: 'pkg4',
        weightInKg: 110,
        distanceInKm: 60,
        offerCode: 'off002',
        baseDeliveryCost: 100,
        sequence: 3,
      },
    ]

    const result = getPackageComboPerTrip(
      mockedOrignalPackageListStepO1,
      maxCarriableWeight,
    )

    expect(result).toEqual(mockedOutcome)
  })

  it('getPackageComboPerTrip, step 2 of requirement', () => {
    const mockedPackageListForStep02: PackageDtoForTime[] = [
      {
        packageId: 'pkg1',
        weightInKg: 50,
        distanceInKm: 30,
        offerCode: 'off001',
        baseDeliveryCost: 100,
        sequence: 0,
      },
      {
        packageId: 'pkg3',
        weightInKg: 175,
        distanceInKm: 100,
        offerCode: 'off003',
        baseDeliveryCost: 100,
        sequence: 2,
      },
      {
        packageId: 'pkg5',
        weightInKg: 155,
        distanceInKm: 95,
        offerCode: 'off001',
        baseDeliveryCost: 100,
        sequence: 4,
      },
    ]

    const outcome = [
      {
        packageId: 'pkg3',
        weightInKg: 175,
        distanceInKm: 100,
        offerCode: 'off003',
        baseDeliveryCost: 100,
        sequence: 2,
      },
    ]

    const result = getPackageComboPerTrip(
      mockedPackageListForStep02,
      maxCarriableWeight,
    )

    expect(result).toEqual(outcome)
  })

  it('getPackageComboPerTrip, step 4 of requirement', () => {
    const mockedPackageListForStep04: PackageDtoForTime[] = [
      {
        packageId: 'pkg1',
        weightInKg: 50,
        distanceInKm: 30,
        offerCode: 'off001',
        baseDeliveryCost: 100,
        sequence: 0,
      },
      {
        packageId: 'pkg5',
        weightInKg: 155,
        distanceInKm: 95,
        offerCode: 'off001',
        baseDeliveryCost: 100,
        sequence: 4,
      },
    ]

    const outcome = [
      {
        packageId: 'pkg5',
        weightInKg: 155,
        distanceInKm: 95,
        offerCode: 'off001',
        baseDeliveryCost: 100,
        sequence: 4,
      },
    ]

    const result = getPackageComboPerTrip(
      mockedPackageListForStep04,
      maxCarriableWeight,
    )

    expect(result).toEqual(outcome)
  })

  it('getPackageComboPerTrip, step 6 of requirement', () => {
    const mockedPackageListForStep06: PackageDtoForTime[] = [
      {
        packageId: 'pkg1',
        weightInKg: 50,
        distanceInKm: 30,
        offerCode: 'off001',
        baseDeliveryCost: 100,
        sequence: 0,
      },
    ]

    const outcome = [
      {
        packageId: 'pkg1',
        weightInKg: 50,
        distanceInKm: 30,
        offerCode: 'off001',
        baseDeliveryCost: 100,
        sequence: 0,
      },
    ]

    const result = getPackageComboPerTrip(
      mockedPackageListForStep06,
      maxCarriableWeight,
    )

    expect(result).toEqual(outcome)
  })

  it('getPackageComboPerTrip, Edge case, if sum of 3 packages still less than vechile max weight', () => {
    const input = mockedThreePackagesShouldSendFirst

    const mockedOutcome = [
      {
        packageId: 'pkg1',
        weightInKg: 50,
        distanceInKm: 100,
        offerCode: 'off001',
        baseDeliveryCost: 100,
        sequence: 0,
      },
      {
        packageId: 'pkg2',
        weightInKg: 50,
        distanceInKm: 100,
        offerCode: 'off008',
        baseDeliveryCost: 100,
        sequence: 1,
      },
      {
        packageId: 'pkg5',
        weightInKg: 100,
        distanceInKm: 100,
        offerCode: 'off001',
        baseDeliveryCost: 100,
        sequence: 4,
      },
    ]

    const result = getPackageComboPerTrip(input, maxCarriableWeight)

    expect(result).toEqual(mockedOutcome)
  })

  it('getPackageComboPerTrip, Edge case, if sum of 4 packages still less than vechile max weight', () => {
    const input = mockedFourPackageShouldDeliveryFirst

    const mockedOutcome = [
      {
        packageId: 'pkg1',
        weightInKg: 30,
        distanceInKm: 100,
        offerCode: 'off002',
        baseDeliveryCost: 100,
        sequence: 0,
      },
      {
        packageId: 'pkg2',
        weightInKg: 50,
        distanceInKm: 100,
        offerCode: 'off001',
        baseDeliveryCost: 100,
        sequence: 1,
      },
      {
        packageId: 'pkg3',
        weightInKg: 40,
        distanceInKm: 100,
        offerCode: 'off003',
        baseDeliveryCost: 100,
        sequence: 2,
      },
      {
        packageId: 'pkg4',
        weightInKg: 70,
        distanceInKm: 100,
        offerCode: 'off001',
        baseDeliveryCost: 100,
        sequence: 3,
      },
    ]

    const result = getPackageComboPerTrip(input, maxCarriableWeight)

    expect(result).toEqual(mockedOutcome)
  })

  it('getPackageComboPerTrip, Edge case, if sum of 5 packages still less than vechile max weight', () => {
    const input = mockFivePackagesShouldSendFirst

    const mockedOutcome = [
      {
        packageId: 'pkg1',
        weightInKg: 30,
        distanceInKm: 100,
        offerCode: 'off002',
        baseDeliveryCost: 100,
        sequence: 0,
      },
      {
        packageId: 'pkg2',
        weightInKg: 50,
        distanceInKm: 100,
        offerCode: 'off001',
        baseDeliveryCost: 100,
        sequence: 1,
      },
      {
        packageId: 'pkg3',
        weightInKg: 40,
        distanceInKm: 100,
        offerCode: 'off003',
        baseDeliveryCost: 100,
        sequence: 2,
      },
      {
        packageId: 'pkg4',
        weightInKg: 70,
        distanceInKm: 100,
        offerCode: 'off001',
        baseDeliveryCost: 100,
        sequence: 3,
      },
      {
        packageId: 'pkg5',
        weightInKg: 5,
        distanceInKm: 100,
        offerCode: 'off001',
        baseDeliveryCost: 100,
        sequence: 4,
      },
    ]

    const result = getPackageComboPerTrip(input, maxCarriableWeight)

    expect(result).toEqual(mockedOutcome)
  })
})
