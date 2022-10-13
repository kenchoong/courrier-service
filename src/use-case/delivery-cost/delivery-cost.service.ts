import { inject, injectable } from 'inversify'
import { DiscountType } from '../../domain/offer'
import * as repository from '../../domain/repository'
import { CliTable } from '../../libs/cli-table'
import { TYPES } from '../../types'
import {
  AfterDiscount,
  DeliveryCostCalculatedDetails,
  PackageDto,
} from './delivery-cost.dto'
import { InquireService } from '../inquire/inquire.service'

@injectable()
export class DeliveryCostService {
  constructor(
    @inject(TYPES.InquiryService)
    private inquiryService: InquireService,

    @inject(TYPES.OfferRepository)
    private repository: repository.OfferRepository,

    @inject(TYPES.CliTable)
    private cliTable: CliTable,
  ) {}

  public async getDeliveryCost() {
    const { baseDeliveryCost, noOfPackages } =
      await this.inquiryService.askBaseCostNoOfPackages()

    const cliTable = this.cliTable.initializeTable(
      ['Package Id', 'Discounted Amount', 'Total after discount'],
      [20, 20, 20],
      true,
    )

    const checkTable = []

    for (let index = 0; index < noOfPackages; index++) {
      console.log('Enter details of package', index + 1)
      const packageDetails =
        await this.inquiryService.askQuestionsForDeliveryCost()

      const {
        packageId,
        totalDiscountedAmount,
        totalDeliveryCostAfterDiscount,
      } = await this.getPackagePriceDiscount({
        baseDeliveryCost,
        ...packageDetails,
      })

      cliTable.push([
        packageId,
        totalDiscountedAmount,
        totalDeliveryCostAfterDiscount,
      ])

      // for unit test checking
      checkTable.push([
        packageId,
        totalDiscountedAmount,
        totalDeliveryCostAfterDiscount,
      ])
    }

    console.log('Calculated delivery cost for packages are as follows: ')
    console.log(cliTable.toString())

    return checkTable
  }

  public async getPackagePriceDiscount(
    packageDetails: PackageDto,
  ): Promise<DeliveryCostCalculatedDetails> {
    const { packageId, weightInKg, distanceInKm, offerCode, baseDeliveryCost } =
      packageDetails

    const weightMultiplier = 10
    const distanceMultiplier = 5

    // todo: environment variable
    const weightCost = weightInKg * weightMultiplier
    const distanceCost = distanceInKm * distanceMultiplier

    console.log(baseDeliveryCost, weightCost, distanceCost)
    const totalDeliveryCostBeforeDiscount =
      +baseDeliveryCost + weightCost + distanceCost

    let totalDiscountedAmount = 0
    let totalDeliveryCostAfterDiscount = totalDeliveryCostBeforeDiscount

    const foundOffer = await this.repository.findByCode(offerCode.toUpperCase())

    if (foundOffer) {
      const { criteria, discountType, discountAmount } = foundOffer

      const { weight, distance } = criteria
      const { min: minWeight, max: maxWeight } = weight
      const { min: minDistance, max: maxDistance } = distance
      if (
        this.isBetweenRange(weightInKg, minWeight, maxWeight) &&
        this.isBetweenRange(distanceInKm, minDistance, maxDistance)
      ) {
        const calculatedAmount = this.calculateDiscount(
          discountType,
          totalDeliveryCostBeforeDiscount,
          discountAmount,
        )
        totalDiscountedAmount = calculatedAmount.totalDiscountedAmount
        totalDeliveryCostAfterDiscount =
          calculatedAmount.totalDeliveryCostAfterDiscount
      } else {
        console.log('Offer criteria not matched')
      }
    }

    return {
      packageId,
      totalDeliveryCostBeforeDiscount,
      totalDiscountedAmount,
      totalDeliveryCostAfterDiscount,
    }
  }

  public isBetweenRange(value: number, min: number, max: number | null) {
    if (min && max) {
      return value >= min && value <= max
    }

    return value >= min
  }

  public calculateDiscount(
    discountType: DiscountType,
    amountBeforeDiscount: number,
    discountAmount: number,
  ): AfterDiscount {
    let totalDiscountedAmount = 0
    let totalDeliveryCostAfterDiscount = 0

    if (discountType === DiscountType.PERCENTAGE) {
      totalDiscountedAmount = amountBeforeDiscount * (discountAmount / 100)
      totalDeliveryCostAfterDiscount =
        amountBeforeDiscount - totalDiscountedAmount
    } else {
      totalDiscountedAmount = discountAmount
      totalDeliveryCostAfterDiscount = amountBeforeDiscount - discountAmount
    }

    return {
      totalDiscountedAmount,
      totalDeliveryCostAfterDiscount,
    }
  }
}
