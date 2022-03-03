import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {
  Context,
  GqlExecutionContext,
  GraphQLExecutionContext,
} from '@nestjs/graphql';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class SuperGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
    @Context() cotx: GraphQLExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const cookie = ctx.getContext().req.cookies['jwt'];
    const decoded = jwt.verify(cookie, process.env.JWT_TOKEN);
    const loginUser = decoded['user']['id'];
    if (loginUser == 1) {
      try {
        return true;
      } catch (error) {
        return false;
      }
    }
    return false;
  }
}
