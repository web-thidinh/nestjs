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
            const { _id,email, ...result } = user;
            return {
                    userId:_id,
                    userEmail:email
                }
        }
        else if(!user){
            return{
                message:'User not found !'
            }
        }
        else if(bcrypt.compare(password,user.password)){
            return{
                message:'Wrong password !'
            }
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

    async submitLogin(user:any){
        if(user.userId){
            const payload = { username: user.userEmail, sub: user.userId.toJSON() }; 
            return{
                message:'Login successful',
                access_token: this.jwtService.sign(payload),
            }
        }
        return{
            message: user.message
        }
    }
}