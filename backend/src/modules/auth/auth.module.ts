import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schemas/user.schema';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Token, TokenSchema } from '../../schemas/token.schema';
import { MailModule } from '../../mail/mail.module';
import { MailService } from '../../mail/mail.service';
import { RegisterMiddleware } from '../../middlewares/register.middleware';
import { Otp, OtpSchema } from '../../schemas/otp.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
      { name: Otp.name, schema: OtpSchema },
    ]),
    MailModule,
  ],
  providers: [AuthService, MailService],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RegisterMiddleware)
      .forRoutes({ path: 'auth/register', method: RequestMethod.POST });
  }
}
