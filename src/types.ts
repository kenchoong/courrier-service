const TYPES = {
  Cli: Symbol.for('Cli'),
  Enquirer: Symbol.for('Enquirer'),
  InquiryService: Symbol.for('InquiryService'),

  DeliveryCostService: Symbol.for('DeliveryService'),
  DeliveryCostController: Symbol.for('DeliveryCostController'),

  DeliveryTimeService: Symbol.for('DeliveryTimeService'),
  DeliveryTimeController: Symbol.for('DeliveryTimeController'),

  OfferService: Symbol.for('OfferService'),
  OfferRepository: Symbol.for('OfferRepository'),

  DataTransformer: Symbol.for('DataTransformer'),
  CliTable: Symbol.for('CliTable'),
  Database: Symbol.for('Database'),
}

export { TYPES }
