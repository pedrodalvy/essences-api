import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppConstants } from './app.constants';
import { HttpExceptionFilter } from './errors/http.exception-filter';
import { Logger } from 'nestjs-pino';

export const appConfig = (app: INestApplication): void => {
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix(AppConstants.API_PREFIX);
  app.enableVersioning();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
};
