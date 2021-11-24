import { Body, Controller, Get, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { AuthDocument } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('local/signin')
  signinLocal(@Body() dto: AuthDto) {
    return this.authService.signinLocal(dto);
  }
  @Post('local/signup')
  signupLocal(@Body() dto: AuthDto) {
    dto.email = dto.email.toLocaleLowerCase();
    return this.authService.signupLocal(dto);
  }

  @Get('local/users')
  getUsers() {
    return this.authService.getUsers();
  }
}
