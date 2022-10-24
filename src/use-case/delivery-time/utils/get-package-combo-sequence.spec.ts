import { getPackageComboSequence } from './get-package-combo-sequence'
import { mockedDeliveryTimeStandardRequirement } from './mocks/mock-delivery-time-standard-requirement.mock'
import { mockedFourPackageShouldDeliveryFirst } from './mocks/mock-four-packages-should-send-first.mock'
import { mockedThreePackagesShouldSendFirst } from './mocks/mock-three-packages-should-send-first..mock'
import { mockedTwoComboSameLengthAndWeightDifferenceDistance } from './mocks/mock-two-combo-same-length-and-weight-different-distance.mock'
import { mockedTwoComboSameLengthDifferentWeight } from './mocks/mock-two-combo-same-length-different-weight.mock'
describe('getPackageComboSequence', () => {
  const maxCarriableWeight = 200

  it('Standard case: should return the correct sequence of package combo', () => {
    const input = mockedDeliveryTimeStandardRequirement

    const result = getPackageComboSequence(input, maxCarriableWeight)

    expect(result).toEqual([
      [
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
      ],
      [
        {
          packageId: 'pkg3',
          weightInKg: 175,
          distanceInKm: 100,
          offerCode: 'off003',
          baseDeliveryCost: 100,
          sequence: 2,
        },
      ],
      [
        {
          packageId: 'pkg5',
          weightInKg: 155,
          distanceInKm: 95,
          offerCode: 'off001',
          baseDeliveryCost: 100,
          sequence: 4,
        },
      ],
      [
        {
          packageId: 'pkg1',
          weightInKg: 50,
          distanceInKm: 30,
          offerCode: 'off001',
          baseDeliveryCost: 100,
          sequence: 0,
        },
      ],
    ])
  })

  it('Edge case 1: three package sum up less than maxCarriableWeight', () => {
    const input = mockedThreePackagesShouldSendFirst

    const result = getPackageComboSequence(input, maxCarriableWeight)

    expect(result).toEqual([
      [
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
      ],
      [
        {
          packageId: 'pkg3',
          weightInKg: 150,
          distanceInKm: 100,
          offerCode: 'off003',
          baseDeliveryCost: 100,
          sequence: 2,
        },
      ],
      [
        {
          packageId: 'pkg4',
          weightInKg: 99,
          distanceInKm: 100,
          offerCode: 'off002',
          baseDeliveryCost: 100,
          sequence: 3,
        },
      ],
    ])
  })

  it('Edge case 2: four package sum up less than maxCarriableWeight', () => {
    const input = mockedFourPackageShouldDeliveryFirst

    const result = getPackageComboSequence(input, maxCarriableWeight)

    expect(result).toEqual([
      [
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
      ],
      [
        {
          packageId: 'pkg5',
          weightInKg: 100,
          distanceInKm: 100,
          offerCode: 'off001',
          baseDeliveryCost: 100,
          sequence: 4,
        },
      ],
    ])
  })

  it('Edge case 3: two combo have same length different weight', () => {
    const input = mockedTwoComboSameLengthDifferentWeight

    const result = getPackageComboSequence(input, maxCarriableWeight)

    expect(result).toEqual([
      [
        {
          packageId: 'pkg1',
          weightInKg: 140,
          distanceInKm: 100,
          offerCode: 'off001',
          baseDeliveryCost: 100,
          sequence: 0,
        },
        {
          packageId: 'pkg2',
          weightInKg: 60,
          distanceInKm: 200,
          offerCode: 'off008',
          baseDeliveryCost: 100,
          sequence: 1,
        },
      ],
      [
        {
          packageId: 'pkg3',
          weightInKg: 130,
          distanceInKm: 100,
          offerCode: 'off003',
          baseDeliveryCost: 100,
          sequence: 2,
        },
        {
          packageId: 'pkg4',
          weightInKg: 50,
          distanceInKm: 100,
          offerCode: 'off002',
          baseDeliveryCost: 100,
          sequence: 3,
        },
      ],
      [
        {
          packageId: 'pkg5',
          weightInKg: 100,
          distanceInKm: 100,
          offerCode: 'off001',
          baseDeliveryCost: 100,
          sequence: 4,
        },
      ],
    ])
  })

  it('Edge case 4: 2 combo having same package amount and weight sum, but different distance sum', () => {
    const input = mockedTwoComboSameLengthAndWeightDifferenceDistance

    const result = getPackageComboSequence(input, maxCarriableWeight)

    expect(result).toEqual([
      [
        {
          packageId: 'pkg1',
          weightInKg: 140,
          distanceInKm: 100,
          offerCode: 'off001',
          baseDeliveryCost: 100,
          sequence: 0,
        },
        {
          packageId: 'pkg2',
          weightInKg: 60,
          distanceInKm: 200,
          offerCode: 'off008',
          baseDeliveryCost: 100,
          sequence: 1,
        },
      ],
      [
        {
          packageId: 'pkg3',
          weightInKg: 130,
          distanceInKm: 100,
          offerCode: 'off003',
          baseDeliveryCost: 100,
          sequence: 2,
        },
        {
          packageId: 'pkg4',
          weightInKg: 70,
          distanceInKm: 100,
          offerCode: 'off002',
          baseDeliveryCost: 100,
          sequence: 3,
        },
      ],
      [
        {
          packageId: 'pkg5',
          weightInKg: 100,
          distanceInKm: 100,
          offerCode: 'off001',
          baseDeliveryCost: 100,
          sequence: 4,
        },
      ],
    ])
  })
})
