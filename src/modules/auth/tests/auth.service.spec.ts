import { Test } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    authService = app.get(AuthService);
  });

  describe('signUp', () => {
    it('should sign up with success', async () => {
      // ARRANGE
      const input = { user: 'user', password: 'password' };

      // ACT
      await authService.signUp(input);

      // ASSERT
      expect(1).toBe(1); // Will change when cache client is implemented
    });

    it('should throw a bad request error when user already exists', async () => {
      // ARRANGE
      const input = { user: 'user', password: 'password' };
      await authService.signUp(input);

      const expectedError = new BadRequestException('User already exists');

      // ACT
      const promise = authService.signUp(input);

      // ASSERT
      await expect(promise).rejects.toThrow(expectedError);
    });
  });
});
