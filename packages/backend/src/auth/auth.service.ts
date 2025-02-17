/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  verifyEmail(token: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: 'USER',
        isVerified: false,
      },
    });

    const verificationToken = this.jwtService.sign(
      { id: user.id, email: user.email },
      { expiresIn: '1h' }
    );

    await this.emailService.sendVerificationEmail(user.email, verificationToken);

    return { message: 'User registered successfully. Please verify your email.' };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Invalid email or password');
    if (!user.isVerified) throw new UnauthorizedException('Please verify your email first');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid email or password');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.user.updateMany({
      where: { id: userId, refreshToken: { not: null } },
      data: { refreshToken: null },
    });
  }

  async refreshToken(userId: string, rt: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
  
    if (!user || !user.refreshToken) throw new UnauthorizedException('Access Denied');
  
    const isValid = await bcrypt.compare(rt, user.refreshToken);
    if (!isValid) throw new UnauthorizedException('Invalid refresh token');
  
    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
  
    return tokens;
  }
  

  private async getTokens(userId: string, email: string, role: string) {
    const payload: JwtPayload = { id: userId, email, role };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);

    return { access_token, refresh_token };
  }

  private async updateRefreshToken(userId: string, rt: string) {
    const hashedRt = await bcrypt.hash(rt, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRt },
    });
  }  
}
