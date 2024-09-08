import { EncryptionClientInterface } from './encryption.client.interface';
import { EncryptionCompareInput } from './dto/encryption-compare.input';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EncryptionClient implements EncryptionClientInterface {
  async encrypt(value: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(value, salt);
  }

  async compare(input: EncryptionCompareInput): Promise<boolean> {
    return bcrypt.compare(input.value, input.hash);
  }
}
