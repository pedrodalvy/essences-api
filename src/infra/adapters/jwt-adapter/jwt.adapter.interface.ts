import { CreateTokenInput } from './dto/create-token.input';
import { CreateTokenOutput } from './dto/create-token.output';

export interface JwtAdapterInterface {
  createToken(payload: CreateTokenInput): Promise<CreateTokenOutput>;
  verifyToken(token: string): Promise<boolean>;
}
