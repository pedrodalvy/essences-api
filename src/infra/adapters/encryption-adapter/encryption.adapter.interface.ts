import { EncryptionCompareInput } from './dto/encryption-compare.input';

export interface EncryptionAdapterInterface {
  encrypt(value: string): Promise<string>;
  compare(input: EncryptionCompareInput): Promise<boolean>;
}
