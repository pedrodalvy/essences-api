import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppConstants } from './app.constants';

export const appConfig = (app: INestApplication): void => {
  app.setGlobalPrefix(AppConstants.API_PREFIX);
  app.enableVersioning();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
};
