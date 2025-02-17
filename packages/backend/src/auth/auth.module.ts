import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RoleGuard } from './guards/role.guard';
import { EmailModule } from '../email/email.module'; 

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '1h' },
    }),
    EmailModule, 
  ],
  providers: [AuthService, PrismaService, JwtStrategy, RoleGuard], 
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
