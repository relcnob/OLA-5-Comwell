import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({origin: ["localhost:3000", "https://ola-5-comwell.vercel.app"], credentials: true, allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, authorization',});
  app.use(cookieParser());
  await app.listen(5000);
  console.log('Server is now live.');
  console.log(
    'If you want to seed the database please check backend/README.md for appropriate commands.',
  );
}
bootstrap();
 