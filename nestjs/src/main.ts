import * as hbs from 'hbs';
import { join } from 'path';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin:"*"
  });
  app.use(cookieParser(process.env.ACCESS_COOKIE_SECRET));
  //config view handlebar
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  hbs.registerPartials(join(__dirname, '..', '/views/partials'),()=>{});
  app.setViewEngine('hbs');

  await app.listen(process.env.ENV_PORT);
}
bootstrap();
