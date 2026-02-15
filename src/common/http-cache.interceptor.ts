import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const { httpAdapter } = this.httpAdapterHost;
    const isGetRequest = httpAdapter.getRequestMethod(request) === 'GET';
    const cacheControl = request.headers['cache-control'] as string | undefined;
    const hasAuth = Boolean(request.headers.authorization);
    const excludePaths = [
      // Routes to be excluded
    ];
    if (
      !isGetRequest ||
      (isGetRequest &&
        excludePaths.includes(httpAdapter.getRequestUrl(request))) ||
      (cacheControl && /no-cache|no-store/i.test(cacheControl)) ||
      hasAuth
    ) {
      return undefined;
    }
    return httpAdapter.getRequestUrl(request);
  }
}
