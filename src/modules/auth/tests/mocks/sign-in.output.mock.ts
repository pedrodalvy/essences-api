import { SignInOutput } from '../../dto/sign-in.output';

export const signInOutputMock = (): SignInOutput => ({
  token: 'jwt-token',
  ttl: 3600,
});
