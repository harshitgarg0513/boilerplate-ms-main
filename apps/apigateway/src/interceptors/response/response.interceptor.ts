import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'proto/beatroute/common/response';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rpcContext = context.switchToRpc().getContext();
    const statusCode = rpcContext.statusCode || HttpStatus.OK;
    let pagination = null;

    return next.handle().pipe(
      map((data) => {
        if(data.pagination) {
          pagination = data.pagination;
          delete data.pagination;
        }

        const response: Response = {
          success: true,
          status: statusCode,
          message: 'Success',
          data,
          dataError: null,
          pagination,
        };
        return response;
      }),
    );
  }
}
