import { EncryptionCompareInput } from './dto/encryption-compare.input';

export interface EncryptionClientInterface {
  encrypt(value: string): Promise<string>;
  compare(input: EncryptionCompareInput): Promise<boolean>;
}
