import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = ctx.getResponse();
          const delay = Date.now() - start;
          this.logger.log(
            `${method} ${url} ${response.statusCode} ${delay}ms — ${ip} ${userAgent}`,
          );
        },
        error: (err: Error) => {
          const delay = Date.now() - start;
          this.logger.error(
            `${method} ${url} ${(err as any).status || 500} ${delay}ms — ${ip}`,
          );
        },
      }),
    );
  }
}
