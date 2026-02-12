import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, headers, ip } = request;

    return next.handle().pipe(
      catchError((error) => {
        // Log error details
        console.error('Error occurred:', {
          timestamp: new Date().toISOString(),
          method,
          url,
          body,
          headers,
          ip,
          error: {
            message: error.message,
            stack: error.stack,
            status: error.status || 500,
          },
        });

        // If it's already an HttpException, rethrow it
        if (error instanceof HttpException) {
          return throwError(() => error);
        }

        // For other errors, wrap them in HttpException
        return throwError(
          () =>
            new HttpException(
              {
                message: error.message || 'Internal server error',
                error: 'Internal Server Error',
              },
              error.status || 500,
            ),
        );
      }),
    );
  }
}
