import 'reflect-metadata'
import { mock } from 'jest-mock-extended'
import { InquireService } from './inquire.service'
import { container } from '../../container'
import { TYPES } from '../../types'

const mockedInquireService = mock<InquireService>()

describe('Inquire Service', () => {
  let service: InquireService

  beforeEach(() => {
    container.rebind(TYPES.InquiryService).toConstantValue(mockedInquireService)

    service = container.get(TYPES.InquiryService)
  })

  it('Inquire service is defined', () => {
    expect(service).toBeDefined()
  })

  it('isNumeric - should return error message, when input value is not number', () => {
    // arrage
    mockedInquireService.isNumeric.mockReturnValue('my error message')

    // act
    const result = service.isNumeric('a', 'my error message')

    // assert
    expect(service.isNumeric).toBeCalledWith('a', 'my error message')
    expect(result).toBe('my error message')
  })

  it('isNumeric - should return true, when input value is number', () => {
    // arrage
    mockedInquireService.isNumeric.mockReturnValue(true)

    // act
    const result = service.isNumeric('1', 'my error message')

    // assert
    expect(service.isNumeric).toBeCalledWith('1', 'my error message')
    expect(result).toBe(true)
  })
})
