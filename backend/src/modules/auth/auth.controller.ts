import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async handleLogin(@Body() data: LoginDto) {
    return await this.authService.login(data);
  }

  @Post('register')
  async handleRegister(@Body() data: RegisterDto) {
    return await this.authService.register(data);
  }
}
