import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { Prisma } from '@prisma/client'
import { httpError, getPrismaHttpError } from 'src/utils/http.utils'

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

  catch(
    exception: unknown,
    host: ArgumentsHost
  ) {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    let status: number = HttpStatus.INTERNAL_SERVER_ERROR
    let response: string | { [key: string]: any } = ''

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      response = exception.getResponse()
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      response = getPrismaHttpError(exception.code)
      status = response.statusCode
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR
    }

    response = typeof response === 'string'
      ? { ...httpError(status), ...response && { message: response } }
      : response
    const responseBody = {
      ...response,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest())
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, status)
  }
}

