import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthenticatedRequest } from '../interfaces/request';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() === 'ws') {
      return this.canActivateWs(context);
    }

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

  private async canActivateWs(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const authToken = client.handshake.auth?.token as string | undefined;
    const authHeaders = client.handshake.headers.authorization;
    const token =
      authToken ??
      (authHeaders?.startsWith('Bearer ') ? authHeaders.split(' ')[1] : null);

    if (!token) {
      console.log('Token: Invalid access');
      throw new BadRequestException('Token: Invalid access');
    }

    const decode = await this.jwtService.decode(token);
    const now = new Date().getTime();
    const isExpired = now > decode.exp * 1000;

    if (isExpired) {
      console.log('Token is expired');
      throw new BadRequestException('Token is expired');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      client.data.user = payload;
    } catch {
      console.log('UNAUTHORIZED or token not found');
      throw new WsException('UNAUTHORIZED or token not found');
    }
    return true;
  }
}
