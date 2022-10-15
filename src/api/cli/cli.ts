import { inject, injectable } from 'inversify'
import { CliTable } from '../../libs/cli-table'
import { TYPES } from '../../types'
import { DeliveryCostService } from '../../use-case/delivery-cost/delivery-cost.service'
import { DeliveryTimeController } from '../../use-case/delivery-time/delivery-time.controller'
import { DeliveryTimeService } from '../../use-case/delivery-time/delivery-time.service'
import {
  FunctionalityType,
  InquireService,
} from '../../use-case/inquire/inquire.service'

export interface ICli {
  start(): void
}

@injectable()
export class Cli implements ICli {
  constructor(
    @inject(TYPES.InquiryService)
    private inquiryService: InquireService,
    @inject(TYPES.DeliveryCostService)
    private deliveryCostService: DeliveryCostService,
    @inject(TYPES.DeliveryTimeController)
    private deliveryTimeController: DeliveryTimeController,
    @inject(TYPES.CliTable)
    private cliTable: CliTable,
  ) {}

  async start(): Promise<void> {
    try {
      const { typeOfFunctionality } =
        await this.inquiryService.askTypeFunction()

      switch (typeOfFunctionality) {
        case FunctionalityType.CalculateDeliveryCost:
          await this.deliveryCostService.getDeliveryCost()
          break
        case FunctionalityType.CalculateDeliveryTime:
          const cliTable = this.cliTable.initializeTable(
            [
              'Package Id',
              'Discounted Amount',
              'Total after discount',
              'Estimated Delivery time',
            ],
            [20, 20, 20],
            true,
          )
          const result =
            await this.deliveryTimeController.getPackageVechileDetails()

          /**
             * [
                {
                  packageId: 'pkg1',
                  totalDeliveryCostAfterDiscount: 750,
                  totalDiscountedAmount: 0,
                  estimatedDeliveryTime: 3.98
                },
                {
                  packageId: 'pkg2',
                  totalDeliveryCostAfterDiscount: 1475,
                  totalDiscountedAmount: 0,
                  estimatedDeliveryTime: 1.78
                },
                {
                  packageId: 'pkg3',
                  totalDeliveryCostAfterDiscount: 2350,
                  totalDiscountedAmount: 0,
                  estimatedDeliveryTime: 1.42
                },
                {
                  packageId: 'pkg4',
                  totalDeliveryCostAfterDiscount: 1395,
                  totalDiscountedAmount: 105,
                  estimatedDeliveryTime: 0.85
                },
                {
                  packageId: 'pkg5',
                  totalDeliveryCostAfterDiscount: 2125,
                  totalDiscountedAmount: 0,
                  estimatedDeliveryTime: 4.18
                }
              ]
             */

          result.map((item) => {
            cliTable.push([
              item.packageId,
              item.totalDiscountedAmount,
              item.totalDeliveryCostAfterDiscount,
              item.estimatedDeliveryTime,
            ])
          })

          console.log('Calculated delivery time for packages are as follows: ')
          console.log(cliTable.toString())
          break

        default:
          break
      }
    } catch (error) {
      console.log(error)
    }
  }
}
