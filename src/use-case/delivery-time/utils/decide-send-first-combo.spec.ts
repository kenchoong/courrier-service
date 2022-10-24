import { PackageDtoForTime } from '../delivery-time.dto'
import { decideSendFirstCombo } from './decide-send-first-combo'

describe('decideSendFirstCombo', () => {
  it('should return combo that have biggest amount of packages', () => {
    const packageComboList: PackageDtoForTime[][] = [
      [
        {
          packageId: '1',
          weightInKg: 1,
          distanceInKm: 1,
          baseDeliveryCost: 100,
          sequence: 5,
          offerCode: 'OFFER1',
        },
        {
          packageId: '2',
          weightInKg: 1,
          distanceInKm: 1,
          baseDeliveryCost: 100,
          sequence: 5,
          offerCode: 'OFFER1',
        },
      ],
      [
        {
          packageId: '3',
          weightInKg: 1,
          distanceInKm: 1,
          baseDeliveryCost: 100,
          sequence: 5,
          offerCode: 'OFFER1',
        },
      ],
    ]

    const result = decideSendFirstCombo(packageComboList)

    expect(result).toEqual([
      {
        packageId: '1',
        weightInKg: 1,
        distanceInKm: 1,
        baseDeliveryCost: 100,
        sequence: 5,
        offerCode: 'OFFER1',
      },
      {
        packageId: '2',
        weightInKg: 1,
        distanceInKm: 1,
        baseDeliveryCost: 100,
        sequence: 5,
        offerCode: 'OFFER1',
      },
    ])
  })

  it('should return combo that have biggest total weight if more than one combo having same amount of packages', () => {
    const packageComboList: PackageDtoForTime[][] = [
      [
        {
          packageId: '1',
          weightInKg: 1,
          distanceInKm: 1,
          baseDeliveryCost: 100,
          sequence: 5,
          offerCode: 'OFFER1',
        },
        {
          packageId: '2',
          weightInKg: 1,
          distanceInKm: 1,
          baseDeliveryCost: 100,
          sequence: 5,
          offerCode: 'OFFER1',
        },
      ],
      [
        {
          packageId: '3',
          weightInKg: 20,
          distanceInKm: 1,
          baseDeliveryCost: 100,
          sequence: 5,
          offerCode: 'OFFER1',
        },
        {
          packageId: '4',
          weightInKg: 20,
          distanceInKm: 1,
          baseDeliveryCost: 100,
          sequence: 5,
          offerCode: 'OFFER1',
        },
      ],
    ]

    const result = decideSendFirstCombo(packageComboList)

    expect(result).toEqual([
      {
        packageId: '3',
        weightInKg: 20,
        distanceInKm: 1,
        baseDeliveryCost: 100,
        sequence: 5,
        offerCode: 'OFFER1',
      },
      {
        packageId: '4',
        weightInKg: 20,
        distanceInKm: 1,
        baseDeliveryCost: 100,
        sequence: 5,
        offerCode: 'OFFER1',
      },
    ])
  })

  it('should return combo that have biggest total distance if more than one combo having same amount of packages and same total weight', () => {
    const packageComboList: PackageDtoForTime[][] = [
      [
        {
          packageId: '1',
          weightInKg: 20,
          distanceInKm: 1,
          baseDeliveryCost: 100,
          sequence: 5,
          offerCode: 'OFFER1',
        },
        {
          packageId: '2',
          weightInKg: 20,
          distanceInKm: 1,
          baseDeliveryCost: 100,
          sequence: 5,
          offerCode: 'OFFER1',
        },
      ],
      [
        {
          packageId: '3',
          weightInKg: 20,
          distanceInKm: 3,
          baseDeliveryCost: 100,
          sequence: 5,
          offerCode: 'OFFER1',
        },
        {
          packageId: '4',
          weightInKg: 20,
          distanceInKm: 5,
          baseDeliveryCost: 100,
          sequence: 5,
          offerCode: 'OFFER1',
        },
      ],
    ]

    const result = decideSendFirstCombo(packageComboList)

    expect(result).toEqual([
      {
        packageId: '3',
        weightInKg: 20,
        distanceInKm: 3,
        baseDeliveryCost: 100,
        sequence: 5,
        offerCode: 'OFFER1',
      },
      {
        packageId: '4',
        weightInKg: 20,
        distanceInKm: 5,
        baseDeliveryCost: 100,
        sequence: 5,
        offerCode: 'OFFER1',
      },
    ])
  })
})
