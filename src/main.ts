import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { PrismaService } from './prisma.service'
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger'
import { UsersModule } from './users/users.module'
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.setGlobalPrefix('v1')
  const config = new DocumentBuilder()
    .setTitle('Users API')
    .setVersion('1.0.0')
    .build()
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
    include: [UsersModule]
  }
  const document = SwaggerModule.createDocument(app, config, options)
  SwaggerModule.setup('api/users', app, document)

  await app.listen(3000)
}

bootstrap()

