// src/auth/auth.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) { }
  

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  async signup(@Body() body: any) {
    console.log('Signup attempt:', body);
    const res = await this.userService.login(body.login,body.password)
    if(res) return res
    console.log("42")
    throw new HttpException(
            { message: 'Login failed: password is incorrect' },
            HttpStatus.INTERNAL_SERVER_ERROR
          );
  }
}