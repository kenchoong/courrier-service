import 'reflect-metadata'
import { ICli } from './api/cli/cli'
import { container } from './container'
import { TYPES } from './types'

const bootstrap = async () => {
  const cli = container.get<ICli>(TYPES.Cli)
  return cli.start()
}

bootstrap()
