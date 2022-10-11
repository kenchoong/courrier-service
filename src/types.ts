const TYPES = {
  Cli: Symbol.for('Cli'),
  Enquirer: Symbol.for('Enquirer'),
  InquiryService: Symbol.for('InquiryService'),
  DeliveryCostService: Symbol.for('DeliveryService'),

  DeliveryTimeService: Symbol.for('DeliveryTimeService'),

  OfferService: Symbol.for('OfferService'),
  OfferRepository: Symbol.for('OfferRepository'),

  DataTransformer: Symbol.for('DataTransformer'),
  CliTable: Symbol.for('CliTable'),
  Database: Symbol.for('Database'),
}

export { TYPES }
