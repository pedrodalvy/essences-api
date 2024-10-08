import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientsModule } from '../../infra/adapters/clients.module';

@Module({
  imports: [ClientsModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
