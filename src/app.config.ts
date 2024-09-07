import { INestApplication } from '@nestjs/common';
import { AppConstants } from './app.constants';

export const appConfig = (app: INestApplication): void => {
  app.setGlobalPrefix(AppConstants.API_PREFIX);
  app.enableVersioning();
};
