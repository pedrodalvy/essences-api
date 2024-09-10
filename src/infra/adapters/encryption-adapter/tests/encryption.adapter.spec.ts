import { Test } from '@nestjs/testing';
import { EncryptionAdapterInterface } from '../encryption.adapter.interface';
import { EncryptionAdapter } from '../encryption.adapter';

describe('EncryptionAdapter', () => {
  let encryptionAdapter: EncryptionAdapterInterface;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [EncryptionAdapter],
    }).compile();

    encryptionAdapter = app.get<EncryptionAdapterInterface>(EncryptionAdapter);
  });

  describe('encrypt', () => {
    it('should encrypt with success', async () => {
      // ARRANGE
      const value = 'any-value';

      // ACT
      const result = await encryptionAdapter.encrypt(value);

      // ASSERT
      expect(typeof result).toBe('string');
      expect(result).not.toBe('any-value');
    });
  });

  describe('compare', () => {
    it('should return true when compare a valid value', async () => {
      // ARRANGE
      const originalValue = 'any-value';
      const encryptedValue = await encryptionAdapter.encrypt(originalValue);

      // ACT
      const result = await encryptionAdapter.compare({
        value: originalValue,
        hash: encryptedValue,
      });

      // ASSERT
      expect(result).toBe(true);
    });

    it('should return false when compare an invalid value', async () => {
      // ARRANGE
      const encryptedValue = await encryptionAdapter.encrypt('any-value');

      // ACT
      const result = await encryptionAdapter.compare({
        value: 'invalid-value',
        hash: encryptedValue,
      });

      // ASSERT
      expect(result).toBe(false);
    });
  });
});
