import { plainToInstance } from 'class-transformer'
import { injectable } from 'inversify'
import fs from 'fs'

@injectable()
export class DataTransformer {
  async transformData<E>(data: any, objectClass: any): Promise<any> {
    return plainToInstance(objectClass, data) as E
  }

  convertDataToJson(data: any) {
    return JSON.stringify(data, null, 2)
  }

  async writeToFile(fileName: string, data: string) {
    fs.writeFile(fileName, data, (err) => {
      if (err) throw err
      console.log(`File ${fileName} saved!`)
    })
  }
}
