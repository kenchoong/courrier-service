import { plainToInstance } from 'class-transformer'
import { injectable } from 'inversify'

@injectable()
export class DataTransformer {
  async transformData<E>(data: any, objectClass: any): Promise<any> {
    return plainToInstance(objectClass, data) as E
  }

  convertDataToJson(data: any) {
    return JSON.stringify(data, null, 2)
  }
}
