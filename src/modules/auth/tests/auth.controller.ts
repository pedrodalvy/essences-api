import { mock } from 'jest-mock-extended';
import { Test } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  const authService = mock<AuthService>();

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    authController = app.get(AuthController);
  });

  describe('signUp', () => {
    it('should sign up with success', async () => {
      // ARRANGE
      const input = { user: 'user', password: 'password' };

      // ACT
      await authController.signUp(input);

      // ASSERT
      expect(authService.signUp).toHaveBeenCalledWith(input);
    });
  });
});
