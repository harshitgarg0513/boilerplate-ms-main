import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthGrpcClientService } from '../../grpc-client/auth/auth-grpc-client.service';
import { AuthenticateResponseDto } from 'proto/beatroute/auth/auth';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  constructor(private readonly authGrpcClientService: AuthGrpcClientService){

  }
  async use(req: any, res: any, next: () => void) {
    const authHeader =
      req.headers['authorization'] || req.headers['Authorization'];
    const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : authHeader?.trim();

    // Capture x-request-context header if provided by client (Postman),
    // otherwise generate a simple context so requests are traceable end-to-end.
    const xRequestContextHeader = req.headers['x-request-context'] || req.headers['X-Request-Context'] || req.headers['X-REQUEST-CONTEXT'];
    if (xRequestContextHeader) {
      // preserve header as string (could be JSON string)
      req['xRequestContext'] = typeof xRequestContextHeader === 'string' ? xRequestContextHeader : JSON.stringify(xRequestContextHeader);
    } else {
      // generate a minimal context object and store as JSON string
      req['xRequestContext'] = JSON.stringify({ requestId: `req_${Date.now()}` });
    }

    if(token) {
      const authenticateResponse: AuthenticateResponseDto = await (this.authGrpcClientService.authenticate(token).toPromise());
  
      req['jwtToken'] = authenticateResponse.jwtToken;
    }
    next();
  }
}
