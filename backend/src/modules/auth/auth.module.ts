import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schemas/user.schema';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Token, TokenSchema } from '../../schemas/token.schema';
import { MailModule } from '../../mail/mail.module';
import { MailService } from '../../mail/mail.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
    MailModule,
  ],
  providers: [AuthService, MailService],
  controllers: [AuthController],
})
export class AuthModule {}
