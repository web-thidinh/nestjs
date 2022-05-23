import { Get, Controller, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('home_layout.hbs')
  root() {
    return { title: 'Server NestJs', message: 'Server NestJs Running' };
  }
}
