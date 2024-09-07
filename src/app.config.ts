import { INestApplication } from '@nestjs/common';

export const appConfig = (app: INestApplication): void => {
  app.setGlobalPrefix('api');
  app.enableVersioning();
};
