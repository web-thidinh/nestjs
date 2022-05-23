import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Injectable} from "@nestjs/common";
import { Request, Response } from "express";
import { InjectModel } from "@nestjs/mongoose";
import { Users, UsersDocument } from './auth.modal'

export interface AuthData {
    email: string
    password: string
}

@Injectable({})

export class AuthService {
    
    constructor(@InjectModel(Users.name) private authModel: Model<UsersDocument>) {}
    
    async submitRegister(data: AuthData){
        const saltOrRounds = 10;
        const { email, password } = data;
        const checkExist = await this.authModel.findOne({email:email});
        const hashPassword = await bcrypt.hash(password,saltOrRounds);
        if(checkExist !== null){
            return {
                error:true,
                message: 'Email already exist !'
            }
        }
        const newUser = new this.authModel({
            email: email,
            password: hashPassword
        });
        newUser.save();
        return {
            message: 'Register successful'
        }
    }

    async submitLogin(data: AuthData){
        const { email, password } = data
        const user = await this.authModel.findOne({email:email});
        if(user && (await bcrypt.compare(password,user.password))){
            const private_token = jwt.sign(
                {userId: user._id as string},
                process.env.ACCESS_TOKEN_SECRET,
            );
            return {
                message: 'Login successful',
                token: private_token
            }
        }
        else if(!user){
            return {
                error:true,
                message: 'Email does not exist!'
            }
        }
        else if(bcrypt.compare(password,user.password)){
            return {
                error:true,
                message: 'Wrong password!'
            }
        }
        return {
            error: true,
            message: 'Login faild'
        }
    }
}