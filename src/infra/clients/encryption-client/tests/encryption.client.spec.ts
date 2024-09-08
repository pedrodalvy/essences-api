import { Test } from '@nestjs/testing';
import { EncryptionClientInterface } from '../encryption.client.interface';
import { EncryptionClient } from '../encryption.client';

describe('EncryptionClient', () => {
  let encryptionClient: EncryptionClientInterface;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [EncryptionClient],
    }).compile();

    encryptionClient = app.get<EncryptionClientInterface>(EncryptionClient);
  });

  describe('encrypt', () => {
    it('should encrypt with success', async () => {
      // ARRANGE
      const value = 'any-value';

      // ACT
      const result = await encryptionClient.encrypt(value);

      // ASSERT
      expect(typeof result).toBe('string');
      expect(result).not.toBe('any-value');
    });
  });

  describe('compare', () => {
    it('should return true when compare a valid value', async () => {
      // ARRANGE
      const originalValue = 'any-value';
      const encryptedValue = await encryptionClient.encrypt(originalValue);

      // ACT
      const result = await encryptionClient.compare({
        value: originalValue,
        hash: encryptedValue,
      });

      // ASSERT
      expect(result).toBe(true);
    });

    it('should return false when compare an invalid value', async () => {
      // ARRANGE
      const encryptedValue = await encryptionClient.encrypt('any-value');

      // ACT
      const result = await encryptionClient.compare({
        value: 'invalid-value',
        hash: encryptedValue,
      });

      // ASSERT
      expect(result).toBe(false);
    });
  });
});
