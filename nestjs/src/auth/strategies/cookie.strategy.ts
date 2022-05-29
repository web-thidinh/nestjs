import { Request } from 'express';
import { Injectable, UnauthorizedException, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CookieStrategy implements CanActivate {
  canActivate(context: ExecutionContext): any | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    if(!req.cookies?.access_token){
      throw new UnauthorizedException();
    }
    return req.cookies.access_token;
  }
}