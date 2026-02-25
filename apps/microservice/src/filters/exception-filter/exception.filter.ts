import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';



@Catch(RpcException)
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException): Observable<any> {
    const error: any = exception.getError();

    const formatted = {
      code: error?.code ?? 2,
      message: error?.message ?? 'Internal server error',
      error_data: error?.error_data ?? null,
    };

    formatted['details'] = JSON.stringify({
      message: formatted.message,
      error_data: formatted.error_data,
    });

    return throwError(() => formatted);
  }
}