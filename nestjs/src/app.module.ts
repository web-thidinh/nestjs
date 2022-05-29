import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AtmModule } from './atm/atm.module';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest'),
    ConfigModule.forRoot(),
    AuthModule,
    AtmModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
