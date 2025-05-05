import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

class SignUpDto {
  email: string;
  password: string;
}

class SignInDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto.email, signUpDto.password);
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('signout')
  async signOut() {
    return this.authService.signOut();
  }

  @Get('me')
  async getCurrentUser() {
    return this.authService.getCurrentUser();
  }
} 