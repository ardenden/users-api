import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { PrismaService } from './prisma.service'
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger'
import { UsersModule } from './users/users.module'
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { HttpExceptionsFilter } from './filters/http-exceptions.filter'
import { AuthModule } from './auth/auth.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const httpAdapter = app.get(HttpAdapterHost)
  app.useGlobalFilters(new HttpExceptionsFilter(httpAdapter))

  app.setGlobalPrefix('v1')
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Users API')
    .setVersion('1.0.0')
    .build()
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
    include: [UsersModule, AuthModule]
  }
  const document = SwaggerModule.createDocument(app, config, options)
  SwaggerModule.setup('api/users', app, document)

  await app.listen(3000)
}

bootstrap()

