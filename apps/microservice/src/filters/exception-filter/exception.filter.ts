import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException): Observable<any> {
    const error: any = exception.getError();

    error['details'] = JSON.stringify({
      message: error?.message,
      error_data: error?.error_data ?? null,
    });

    return throwError(() => exception);
  }
}