import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { appConfig } from './app/app.config';
import { swaggerConfig } from './infra/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  appConfig(app);
  swaggerConfig(app);

  await app.listen(3000);
}
bootstrap();
