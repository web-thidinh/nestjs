import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Users, UsersSchema } from './auth.modal'

@Module({
    imports: [MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }])],
    controllers: [AuthController],
    providers: [AuthService]
})

export class AuthModule {}