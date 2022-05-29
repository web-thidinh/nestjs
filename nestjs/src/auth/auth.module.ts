import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Users, UsersSchema } from './auth.modal';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtConstants } from './constants/constants';
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