import { inject, injectable } from 'inversify'
import Enquirer from 'enquirer'
import { TYPES } from '../../types'
import { EnquireProvider } from '../../libs/enquirer'
import { PackageDto } from '../delivery-cost/delivery-cost.dto'
//import { Select } from 'enquirer'

export enum FunctionalityType {
  CalculateDeliveryCost = 'CalculateDeliveryCost',
  CalculateDeliveryTime = 'CalculateDeliveryTime',
  AddNewOffer = 'AddNewOffer',
  ListOffers = 'ListOffers',
  Exit = 'Exit',
}

@injectable()
export class InquireService {
  constructor(
    @inject(TYPES.Enquirer)
    private enquirer: EnquireProvider,
  ) {}

  async askQuestionsForDeliveryCost(): Promise<any> {
    const deliveryCostQuestions = [
      {
        name: 'packageId',
        type: 'input',
        message: 'Enter your package id (Example: PKG1)',
      },
      {
        name: 'weightInKg',
        type: 'input',
        message: 'Enter your package Weight in kg (Number only)',
        validate: (value: string) =>
          this.isNumeric(value, 'Please enter the package Weight'),
      },
      {
        name: 'distanceInKm',
        type: 'input',
        message: 'Enter package Distance in Km (Number only)',
        validate: (value: string) =>
          this.isNumeric(value, 'Please enter the valid package Distance'),
      },
      {
        name: 'offerCode',
        type: 'input',
        message: 'enter offercode Example: OFR001',
      },
    ]

    return this.enquirer.prompt(deliveryCostQuestions)
  }

  async askTypeFunction(): Promise<any> {
    const questions = [
      {
        type: 'select',
        name: 'typeOfFunctionality',
        message: 'calculate delivery cost or delivery time for the packages',
        choices: [
          {
            name: FunctionalityType.CalculateDeliveryCost,
            message: 'Calculate delivery cost',
            value: FunctionalityType.CalculateDeliveryCost,
          },
          {
            name: FunctionalityType.CalculateDeliveryTime,
            message: 'Calculate delivery time',
            value: FunctionalityType.CalculateDeliveryTime,
          },
          {
            name: FunctionalityType.AddNewOffer,
            message: 'Add new offercodes',
            value: FunctionalityType.AddNewOffer,
          },
          {
            name: FunctionalityType.ListOffers,
            message: 'Get all existing offercodes',
            value: FunctionalityType.ListOffers,
          },
          {
            name: FunctionalityType.Exit,
            message: 'Exit',
            value: FunctionalityType.Exit,
          },
        ],
        default: FunctionalityType.CalculateDeliveryCost,
      },
    ]

    return this.enquirer.prompt(questions)
  }

  async askBaseCostNoOfPackages(): Promise<any> {
    const questions = [
      {
        type: 'input',
        name: 'baseDeliveryCost',
        message: 'Please Enter the base delivery cost',
        validate: (value: string) =>
          this.isNumeric(
            value,
            'Please Enter the base delivery cost (In number only)',
          ),
      },
      {
        type: 'input',
        name: 'noOfPackages',
        message: 'Please Enter the no of packages',
        validate: (value: string) =>
          this.isNumeric(
            value,
            ' Please Enter the no of packages (In number only)',
          ),
      },
    ]

    return this.enquirer.prompt(questions)
  }

  async askVechileQuestions(): Promise<any> {
    const questions = [
      {
        name: 'noOfVechiles',
        type: 'input',
        message: 'Enter No of vechiles you have (Number only)',
        validate: (value: string) =>
          this.isNumeric(value, 'Please enter the package Weight'),
      },
      {
        name: 'maxSpeed',
        type: 'input',
        message: ' Enter Maxium speed of each vechile (km/hr, number only)',
        validate: (value: string) =>
          this.isNumeric(value, 'Please enter the package Weight'),
      },
      {
        name: 'maxCarriableWeight',
        type: 'input',
        message:
          'Enter maximum weight each vechile can carry (kg, Number only)',
        validate: (value: string) =>
          this.isNumeric(value, 'Please max load of each vechile'),
      },
    ]

    return this.enquirer.prompt(questions)
  }

  async askCreateOfferQuestions(): Promise<any> {
    const questions = [
      {
        name: 'id',
        type: 'input',
        message: 'Put a unique id for the offer',
      },
      {
        name: 'offerCode',
        type: 'input',
        message: 'Enter offer code (Example: OFR001)',
      },
      {
        name: 'discountAmount',
        type: 'input',
        message:
          'How much discount you want to give, Number only (Example: 10 for 10% discount)',
        validate: (value: string) =>
          this.isNumeric(value, 'Please enter the discount amount'),
      },
      {
        name: 'minWeight',
        type: 'input',
        message: 'Enter minumum weight to get this offer (kg, Number only)',
        validate: (value: string) =>
          this.isNumeric(value, 'Please enter the minumum weight'),
      },
      {
        name: 'maxWeight',
        type: 'input',
        message: 'Enter maximum weight to get this offer (kg, Number only)',
        validate: (value: string) =>
          this.isNumeric(value, 'Please enter the maximum weight'),
      },
      {
        name: 'minDistance',
        type: 'input',
        message: 'Enter minumum distance for this offer (km, Number only)',
        validate: (value: string) =>
          this.isNumeric(value, 'Please enter the minumum distance'),
      },
      {
        name: 'maxDistance',
        type: 'input',
        message: 'Enter maximum distance for this offer (km, Number only)',
        validate: (value: string) =>
          this.isNumeric(value, 'Please enter the maximum distance'),
      },
    ]

    return this.enquirer.prompt(questions)
  }

  isNumeric(value: string, message: string) {
    if (
      value &&
      value.length &&
      !isNaN(parseFloat(value)) &&
      isFinite(parseInt(value))
    ) {
      return true
    } else {
      return message
    }
  }
}
