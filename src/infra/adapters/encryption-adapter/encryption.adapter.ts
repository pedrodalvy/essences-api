import { EncryptionAdapterInterface } from './encryption.adapter.interface';
import { EncryptionCompareInput } from './dto/encryption-compare.input';
import * as bcrypt from 'bcrypt';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EncryptionAdapter implements EncryptionAdapterInterface {
  private readonly logger = new Logger(EncryptionAdapter.name);

  async encrypt(value: string): Promise<string> {
    this.logger.log({ message: 'encrypt - Start' });

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(value, salt);

    this.logger.log({ message: 'encrypt - End' });
    return hash;
  }

  async compare(input: EncryptionCompareInput): Promise<boolean> {
    this.logger.log({ message: 'compare - Start' });

    const isValid = await bcrypt.compare(input.value, input.hash);

    this.logger.log({ message: 'compare - End' });
    return isValid;
  }
}
