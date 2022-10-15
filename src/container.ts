import Enquirer from 'enquirer'
import { Container } from 'inversify'
import { Cli, ICli } from './api/cli/cli'
import { OfferRepository } from './domain/repository'
import { OfferDbRepository } from './infra/repository/offer'
import { CliTable } from './libs/cli-table'
import { DataTransformer } from './libs/data-transformer'
import { EnquireProvider } from './libs/enquirer'
import { TYPES } from './types'
import { DeliveryCostService } from './use-case/delivery-cost/delivery-cost.service'
import { DeliveryTimeController } from './use-case/delivery-time/delivery-time.controller'
import { DeliveryTimeService } from './use-case/delivery-time/delivery-time.service'
import { InquireService } from './use-case/inquire/inquire.service'
import { OfferService } from './use-case/offer/offer.service'

const container = new Container()

container.bind<ICli>(TYPES.Cli).to(Cli).inSingletonScope()

container.bind(TYPES.Enquirer).to(EnquireProvider).inSingletonScope()
container.bind(TYPES.InquiryService).to(InquireService)
container.bind(TYPES.DeliveryCostService).to(DeliveryCostService)

container.bind(TYPES.DataTransformer).to(DataTransformer)
container.bind(TYPES.CliTable).to(CliTable)

container.bind<OfferRepository>(TYPES.OfferRepository).to(OfferDbRepository)
container.bind(TYPES.OfferService).to(OfferService)

container.bind(TYPES.DeliveryTimeService).to(DeliveryTimeService)
container.bind(TYPES.DeliveryTimeController).to(DeliveryTimeController)

export { container }
