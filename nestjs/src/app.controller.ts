import { Get, Controller, Render, Res } from '@nestjs/common';
import { Response } from 'express';
@Controller()
export class AppController {
  @Get('/')
  @Render('login')
  Login() {
    return { layout:'index', title: 'Server NestJs' };
  }
}
