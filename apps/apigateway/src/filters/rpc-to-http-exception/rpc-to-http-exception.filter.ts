import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'proto/beatroute/common/response';

@Catch(Error || RpcException)
export class RpcToHttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    console.log('RPC Exception', exception);

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    let messageObject: any = {
      message: null,
      error_data: null,
    };

    // Prefer structured `details` when available (set by the microservice ExceptionFilter).
    const detailsRaw = exception?.details;
    const msgRaw = exception?.message;

    if (detailsRaw) {
      try {
        // details should be a JSON string like `{ message: "...", error_data: ... }`
        messageObject = JSON.parse(detailsRaw) || { message: String(detailsRaw), error_data: null };
      } catch (err) {
        messageObject = { message: String(detailsRaw), error_data: null };
      }
    } else if (msgRaw) {
      // Some gRPC errors arrive as: "2 UNKNOWN: Access denied!" or
      // "7 PERMISSION_DENIED: {\"message\":\"Access denied!\",...}".
      // Strip leading "<code> <STATUS>: " if present and try to parse JSON payload.
      let cleaned = String(msgRaw);
      const match = cleaned.match(/^\d+\s+[A-Z_]+:\s*(.*)$/);
      if (match) cleaned = match[1];

      try {
        const parsed = JSON.parse(cleaned);
        messageObject = {
          message: parsed.message ?? cleaned,
          error_data: parsed.error_data ?? null,
        };
      } catch (err) {
        messageObject = { message: cleaned, error_data: exception?.error ?? null };
      }
    } else {
      messageObject = { message: null, error_data: null };
    }

    switch (exception.code) {
      case Status.NOT_FOUND:
        httpStatus = HttpStatus.NOT_FOUND; // 404
        break;
      case Status.INVALID_ARGUMENT:
        httpStatus = HttpStatus.BAD_REQUEST; // 400
        break;
      case Status.UNAUTHENTICATED:
        httpStatus = HttpStatus.UNAUTHORIZED; // 401
        break;
      case Status.PERMISSION_DENIED:
        httpStatus = HttpStatus.FORBIDDEN; // 403
        break;
      case Status.ALREADY_EXISTS:
        httpStatus = HttpStatus.CONFLICT; // 409
        break;
      case Status.RESOURCE_EXHAUSTED:
        httpStatus = HttpStatus.TOO_MANY_REQUESTS; // 429
        break;
      case Status.FAILED_PRECONDITION:
        httpStatus = HttpStatus.PRECONDITION_FAILED; // 412
        break;
      case Status.INTERNAL:
        httpStatus = HttpStatus.INTERNAL_SERVER_ERROR; // 500
        break;
      case Status.UNAVAILABLE:
        httpStatus = HttpStatus.SERVICE_UNAVAILABLE; // 503
        break;
      default:
        // Some RpcExceptions arrive over the wire with UNKNOWN status but include a
        // stringified details/message that indicates the real reason (e.g. Unauthorized,
        // Access denied!, Validation failed). Use that as a best-effort fallback.
        const lowerMsg = (messageObject && messageObject.message) ? String(messageObject.message).toLowerCase() : (exception.message || '').toLowerCase();
        if (lowerMsg.includes('unauthorized')) {
          httpStatus = HttpStatus.UNAUTHORIZED;
        } else if (lowerMsg.includes('access denied')) {
          httpStatus = HttpStatus.FORBIDDEN;
        } else if (lowerMsg.includes('validation failed') || lowerMsg.includes('invalid argument')) {
          httpStatus = HttpStatus.BAD_REQUEST;
        } else {
          httpStatus = HttpStatus.INTERNAL_SERVER_ERROR; // Default to 500
        }
        break;
    }

    const responseData: Response = {
      success: false,
      status: httpStatus,
      message: messageObject.message,
      dataError: messageObject.error_data || null,
    };

    response.status(httpStatus).json(responseData);
  }
}
