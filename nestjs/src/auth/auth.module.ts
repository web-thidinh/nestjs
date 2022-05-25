import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Users, UsersSchema } from './auth.modal';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { jwtConstants } from './constants/constants';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret
        }),],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService],
})

export class AuthModule {}