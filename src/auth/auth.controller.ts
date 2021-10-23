import { Body, Controller, Post, Put, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { VerifyDto } from './dto/verify.dto';

@Controller('/api/v1/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    signup(@Body() body: SignupDto) {
        return this.authService.signup(body);
    }

    @Post('login')
    login(@Body() body: LoginDto) {
        return this.authService.login(body);
    }

    @Post('/verify')
    verify(@Body() body: VerifyDto) {
        return this.authService.verify(body);
    }

    @Put('/refresh')
    refresh(@Req() req: Request) {
        return this.authService.refresh(req);
    }
}
