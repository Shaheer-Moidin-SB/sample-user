import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientKafka } from '@nestjs/microservices';
import { GetUserId } from 'src/dto/get-user-request.dto';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('AUTH_SERVICE') private authClient: ClientKafka,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const userId = request.headers.authorization;

      const handler = context.getHandler();

      const flag = this.reflector.get<string>('authFlag', handler);

      if (!userId) {
        throw new UnauthorizedException('User Authentication Failed'); // No userId means unauthorized
      }

      if (flag && flag === 'privateRoute') {
        console.log('sending user for authorization');
        // Send the authorization request to the auth service
        const isAuthorized = await this.authClient
          .send('authorize_user', new GetUserId(userId))
          .toPromise();
        console.log('User Authorized Successfully! Welcome');
        return isAuthorized; // Allow or deny access based on the response
      } else {
        return true;
      }
    } catch (oError) {
      throw new UnauthorizedException(oError);
    }
  }
}
