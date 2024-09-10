import { mock } from 'jest-mock-extended';
import { JwtAdapterInterface } from '../../../infra/adapters/jwt-adapter/jwt.adapter.interface';
import { Test } from '@nestjs/testing';
import { JwtAdapter } from '../../../infra/adapters/jwt-adapter/jwt.adapter';
import { AuthGuard } from '../auth.guard';
import { executionContextMock } from './mocks/execution-context.mock';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  const jwtAdapter = mock<JwtAdapterInterface>();

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [AuthGuard, { provide: JwtAdapter, useValue: jwtAdapter }],
    }).compile();

    authGuard = app.get(AuthGuard);
  });

  describe('canActivate', () => {
    it('should return true when token is valid', async () => {
      // ARRANGE
      const context = executionContextMock('valid-token');
      jwtAdapter.verifyToken.mockResolvedValueOnce(true);

      // ACT
      const result = await authGuard.canActivate(context);

      // ASSERT
      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      // ARRANGE
      const context = executionContextMock('invalid-token');
      jwtAdapter.verifyToken.mockResolvedValueOnce(false);

      const expectedError = new UnauthorizedException('Invalid token');

      // ACT
      const promise = authGuard.canActivate(context);

      // ASSERT
      await expect(promise).rejects.toThrow(expectedError);
    });

    it('should throw an error when token is missing', async () => {
      // ARRANGE
      const context = executionContextMock('');
      const expectedError = new UnauthorizedException('Invalid token');
      jwtAdapter.verifyToken.mockResolvedValueOnce(true);

      // ACT
      const promise = authGuard.canActivate(context);

      // ASSERT
      await expect(promise).rejects.toThrow(expectedError);
    });
  });
});
