import { Request } from 'express';
import { Observable } from 'rxjs';
import { Injectable, UnauthorizedException, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class CookieStrategy implements CanActivate {
  canActivate(context: ExecutionContext): any | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    if(!req.signedCookies?.access_token){
      throw new UnauthorizedException();
    }
    return req.signedCookies.access_token;
  }
}