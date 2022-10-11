import Enquirer from 'enquirer'
import { injectable } from 'inversify'

@injectable()
export class EnquireProvider {
  constructor() {
    Enquirer
  }

  prompt(object: any) {
    return Enquirer.prompt(object)
  }
}
