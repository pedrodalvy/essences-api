import { mock } from 'jest-mock-extended';
import { JwtClientInterface } from '../../../infra/clients/jwt-client/jwt.client.interface';
import { Test } from '@nestjs/testing';
import { JwtClient } from '../../../infra/clients/jwt-client/jwt.client';
import { AuthGuard } from '../auth.guard';
import { executionContextMock } from './mocks/execution-context.mock';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  const jwtClient = mock<JwtClientInterface>();

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [AuthGuard, { provide: JwtClient, useValue: jwtClient }],
    }).compile();

    authGuard = app.get(AuthGuard);
  });

  describe('canActivate', () => {
    it('should return true when token is valid', async () => {
      // ARRANGE
      const context = executionContextMock('valid-token');
      jwtClient.verifyToken.mockResolvedValueOnce(true);

      // ACT
      const result = await authGuard.canActivate(context);

      // ASSERT
      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      // ARRANGE
      const context = executionContextMock('invalid-token');
      jwtClient.verifyToken.mockResolvedValueOnce(false);

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
      jwtClient.verifyToken.mockResolvedValueOnce(true);

      // ACT
      const promise = authGuard.canActivate(context);

      // ASSERT
      await expect(promise).rejects.toThrow(expectedError);
    });
  });
});
