import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserRole } from '../database/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('register-buyer')
  registerBuyer(@Body() dto: RegisterDto) {
    return this.authService.register({ ...dto, role: UserRole.BUYER });
  }

  @Post('register-organizer')
  registerOrganizer(@Body() dto: RegisterDto) {
    return this.authService.register({ ...dto, role: UserRole.ORGANIZER });
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
