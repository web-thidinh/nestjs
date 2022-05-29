import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class CookieExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    if (status === 401) {
        response.redirect('/');
        return;
    }
    const resData = {
        statusCode: status,
        message: exception.message,
        name: exception.name
    }
    response.json(resData);
  }
}