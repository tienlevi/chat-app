import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedRequest, JwtPayload } from '../interfaces/request';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeaders = request.headers.authorization;

    if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
      throw new HttpException(
        'Token: Invalid access',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    const token = authHeaders.split(' ')[1];

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
    } catch {
      throw new HttpException(
        'UNAUTHORIZED or token not found',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return true;
  }
}
