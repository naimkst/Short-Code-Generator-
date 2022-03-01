import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { Context, GqlExecutionContext, GraphQLExecutionContext } from '@nestjs/graphql';
import { REQUEST_CONTEXT_ID } from '@nestjs/core/router/request/request-constants';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
    @Context() cotx: GraphQLExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const ctx = GqlExecutionContext.create(context);
    const cookie = ctx.getContext().req.cookies['jwt']
    try {
      const decoded = jwt.verify(cookie, process.env.JWT_TOKEN);
      return true;
    } catch (error) {
      return false;
    }
  }
}
