import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { PrismaService } from './prisma/prisma.service';
import { EmailModule } from './email/email.module';
import { AtStrategy } from './auth/strategies/at.strategy';
import { AtGuard } from './auth/guards/at.guard';

@Module({
  imports: [
    AuthModule,
    EmailModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AtStrategy, AtGuard, PrismaService],
  exports: [AuthService, JwtModule],
})
export class AppModule {}
