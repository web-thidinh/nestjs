import { Module } from "@nestjs/common";
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from "./auth.service";
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './auth.modal';
import { AuthController } from "./auth.controller";
import { JwtConstants } from './constants/constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { GoogleStrategy } from "./strategies/google.strategy";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
        JwtModule.register({
            secret: JwtConstants.secret,
            signOptions: { expiresIn: '1d' }
        }),
        PassportModule],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy],
    exports: [AuthService],
})

export class AuthModule {}