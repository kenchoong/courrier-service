import { injectable } from 'inversify'
import Table from 'cli-table3'

@injectable()
export class CliTable {
  initializeTable(
    head: string[],
    colWidths: number[],
    wordWrap: boolean,
  ): Table.Table {
    return new Table({
      head,
      colWidths,
      wordWrap,
    })
  }
}
