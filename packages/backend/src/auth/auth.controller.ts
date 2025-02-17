import { Controller, Post, Body, Get, UseGuards, Request, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './decorators/roles.decorator';
import { RoleGuard } from '@guards/role.guard';
import { Role } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Get('protected')
  @UseGuards(AuthGuard('jwt'))
  getProtected(@Request() req: any) {
    return { message: 'This is a protected route', user: req.user };
  }

  @Get('admin')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(Role.ADMIN) 
  getAdminRoute() {
    return { message: 'This is an admin-only route' };
  }

  
}
