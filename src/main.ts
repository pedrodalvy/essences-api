import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  appConfig(app);

  await app.listen(3000);
}
bootstrap();
