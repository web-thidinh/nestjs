import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from "@nestjs/mongoose";
import { Users, UsersDocument } from './auth.modal'
import { Injectable, PreconditionFailedException, 
        NotFoundException, UnprocessableEntityException } from "@nestjs/common";

export interface AuthData {
    email: string
    password: string
}

@Injectable({})

export class AuthService {
    
    constructor(
        @InjectModel(Users.name) 
        private authModel: Model<UsersDocument>,
        private jwtService: JwtService
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.authModel.findOne({email:username});
        if (user && (await bcrypt.compare(password,user.password))) {
          const { password, ...result } = user;
          return result;
        }
        return null;
    }
    
    async submitRegister(data: AuthData){
        const saltOrRounds = 10;
        const { email, password } = data;
        const checkExist = await this.authModel.findOne({email:email});
        const hashPassword = await bcrypt.hash(password,saltOrRounds);
        if(checkExist !== null){
            throw new UnprocessableEntityException('Email already exist !');
        }
        const newUser = new this.authModel({
            email: email,
            password: hashPassword
        });
        newUser.save();
        return {
            message: 'Register successful',
            user: newUser.toJSON().email
        }
    }

    async submitLogin(data: AuthData){
        const { email, password } = data
        console.log(email,password)
        const user = await this.authModel.findOne({email:email});
        console.log(user)
        if(user && (await bcrypt.compare(password,user.password))){
            const private_token = this.jwtService.sign({username: user.email, sub: user._id});
            console.log(private_token);
            return {
                message: 'Login successful',
                token: private_token
            }
        }
        else if(!user){
            throw new NotFoundException('User email not found !');
        }
        else if(bcrypt.compare(password,user.password)){
            throw new PreconditionFailedException('Wrong password !');
        }
    }
}