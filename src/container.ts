import Enquirer from 'enquirer'
import { Container } from 'inversify'
import { Cli, ICli } from './api/cli/cli'
import { OfferRepository } from './domain/repository'
import { OfferDbRepository } from './infra/repository/offer'
import { CliTable } from './libs/cli-table'
import { DataTransformer } from './libs/data-transformer'
import { EnquireProvider } from './libs/enquirer'
import { TYPES } from './types'
import { DeliveryCostService } from './use-case/delivery-cost.service'
import { InquireService } from './use-case/inquire.service'
import { OfferService } from './use-case/offer.service'

const container = new Container()

container.bind<ICli>(TYPES.Cli).to(Cli).inSingletonScope()

container.bind(TYPES.Enquirer).to(EnquireProvider).inSingletonScope()
container.bind(TYPES.InquiryService).to(InquireService)
container.bind(TYPES.DeliveryCostService).to(DeliveryCostService)



export { container }
