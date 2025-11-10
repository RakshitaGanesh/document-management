/*
 * <copyright company="Argenbright Innovations Lab">
 *        copyright (c) Argenbright Innovations Lab, an Argenbright Holdings Company.  All rights reserved.
 * </copyright>
 */
import { ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().setTitle('Peazy Document Manager').setDescription('Peazy Document Manager APIs').setVersion('0.1').build();

  const document = SwaggerModule.createDocument(app, config);
  app.enableCors();
  
  app.setGlobalPrefix('documentuploader');
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.listen(3010);
}
// eslint-disable-next-line promise/catch-or-return, @typescript-eslint/no-floating-promises, unicorn/prefer-top-level-await
bootstrap().then(() => console.log('bootstrapped'));

