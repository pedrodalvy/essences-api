import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();
    let errorMessage = exception.message;

    if (status < HttpStatus.INTERNAL_SERVER_ERROR && exceptionResponse['message']) {
      errorMessage = exceptionResponse['message'];
    }

    response.status(status).json({
      statusCode: status,
      message: errorMessage,
    });
  }
}
