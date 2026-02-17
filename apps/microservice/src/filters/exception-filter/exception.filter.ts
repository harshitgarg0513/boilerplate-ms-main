import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { Status } from '@grpc/grpc-js/build/src/constants';

@Catch()
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    // If already a RpcException, preserve it and add `details`
    if (exception instanceof RpcException) {
      const error: any = exception.getError();
      console.log('[ExceptionFilter] caught RpcException.getError() =', error);
      error['details'] = JSON.stringify({ message: error['message'], error_data: error['error_data'] });
      return throwError(() => exception);
    }

    // If a third-party error object contains an embedded `error.code`, respect that
    // (this handles AccessDeniedError / UnauthorizedError instances from shared packages
    // which may not be `instanceof RpcException` due to module resolution differences).
    if (exception && exception.error && typeof exception.error.code === 'number') {
      const embedded = exception.error;
      const rpcEx = new RpcException({ code: embedded.code, message: embedded.message || exception.message || 'Error', error_data: embedded.error_data ?? null });
      const e: any = rpcEx.getError();
      e['details'] = JSON.stringify({ message: e['message'], error_data: e['error_data'] });
      console.log('[ExceptionFilter] converted embedded error.code -> RpcException', e);
      return throwError(() => rpcEx);
    }

    // Convert common errors (e.g. Auth guard throwing plain Error('Unauthorized'))
    const msg = exception && exception.message ? exception.message : 'Internal server error';

    if (msg === 'Unauthorized') {
      const rpcEx = new RpcException({ code: Status.UNAUTHENTICATED, message: 'Unauthorized', error_data: null });
      const e: any = rpcEx.getError();
      e['details'] = JSON.stringify({ message: e['message'], error_data: e['error_data'] });
      console.log('[ExceptionFilter] converted plain Unauthorized -> RpcException', e);
      return throwError(() => rpcEx);
    }

    // Fallback: return UNKNOWN with sanitized message
    const rpcEx = new RpcException({ code: Status.UNKNOWN, message: 'Internal server error', error_data: null });
    const e: any = rpcEx.getError();
    e['details'] = JSON.stringify({ message: e['message'], error_data: e['error_data'] });
    console.error('[ExceptionFilter] unexpected error -> converted to UNKNOWN', exception);
    return throwError(() => rpcEx);
  }
}
