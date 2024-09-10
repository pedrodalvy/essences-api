import { mock } from 'jest-mock-extended';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { JwtAdapterInterface } from '../jwt.adapter.interface';
import { JwtAdapter } from '../jwt.adapter';
import { JwtAdapterConstants } from '../jwt.adapter.constants';
import { JwtService } from '@nestjs/jwt';

describe('JwtAdapter', () => {
  let jwtAdapter: JwtAdapterInterface;
  const jwtService = mock<JwtService>();

  const mockedSecret = 'mocked-secret';
  const mockedTTL = 60;

  const configService = mock<ConfigService>({
    get: jest.fn((key: string) => {
      return key === JwtAdapterConstants.TTL ? mockedTTL : mockedSecret;
    }),
  });

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        JwtAdapter,
        { provide: ConfigService, useValue: configService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    jwtAdapter = app.get<JwtAdapterInterface>(JwtAdapter);
  });

  describe('createToken', () => {
    it('should create token with success', async () => {
      // ARRANGE
      const input = { sub: 'any-sub' };
      const expectedToken = 'any-token';
      jwtService.signAsync.mockResolvedValueOnce(expectedToken);

      // ACT
      const output = await jwtAdapter.createToken(input);

      // ASSERT
      expect(output).toEqual({ token: expectedToken, ttl: mockedTTL });
    });
  });

  describe('verifyToken', () => {
    it('should return true when verify token with success', async () => {
      // ACT
      const output = await jwtAdapter.verifyToken('any-token');

      // ASSERT
      expect(output).toEqual(true);
    });

    it('should return false when verify token with fail', async () => {
      // ARRANGE
      jwtService.verifyAsync.mockRejectedValueOnce(new Error('any-error'));

      // ACT
      const output = await jwtAdapter.verifyToken('any-token');

      // ASSERT
      expect(output).toEqual(false);
    });
  });
});
