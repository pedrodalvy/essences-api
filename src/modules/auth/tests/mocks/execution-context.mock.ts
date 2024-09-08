import { ExecutionContext } from '@nestjs/common';

export const executionContextMock = (token: string): ExecutionContext => ({
  switchToHttp: () => ({
    // @ts-expect-error just for testing purposes
    getRequest: () => {
      const headers = {};

      if (token) {
        headers['authorization'] = `Bearer ${token}`;
      }

      return { headers };
    },
  }),
});
