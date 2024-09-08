import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppConstants } from './app.constants';
import { HttpExceptionFilter } from './errors/http.exception-filter';

export const appConfig = (app: INestApplication): void => {
  app.setGlobalPrefix(AppConstants.API_PREFIX);
  app.enableVersioning();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
};
