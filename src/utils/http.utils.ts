import { HttpStatus } from '@nestjs/common'

interface HttpError {
  statusCode: number
  error: string
}

export const httpError = (statusCode: number): HttpError => {
  const error = HttpStatus[statusCode]
    .toLowerCase()
    .split('_')
    .map((word) => word.replace(word[0], word[0].toUpperCase()))
    .join(' ')

  return { statusCode, error }
}

export function getPrismaHttpError(code: string): HttpError {
  let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR

  if (code === 'P2025') statusCode = HttpStatus.NOT_FOUND
  else if (code === 'P2002') statusCode = HttpStatus.CONFLICT
  else statusCode = HttpStatus.INTERNAL_SERVER_ERROR

  return httpError(statusCode)
}

