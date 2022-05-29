import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from "@nestjs/mongoose";
import { Users, UsersDocument } from './auth.modal'
import { AuthData } from './interface/auth.interface';
import { Injectable, UnprocessableEntityException } from "@nestjs/common";

@Injectable({})

export class AuthService {
    
    constructor(
        @InjectModel(Users.name) 
        private authModel: Model<UsersDocument>,
        private jwtService: JwtService
    ) {}

    findUserById(id){
        const user = this.authModel.findOne({_id:id});
        return user;
    }

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
                message:'User not found !',
                data:{}
            }
        }
        else if(bcrypt.compare(password,user.password)){
            return{
                message:'Wrong password !',
                data: {}
            }
        }
        return null;
    }
    
    async submitRegister(data: AuthData){
        const saltOrRounds = 10;
        const { username, password } = data;
        const checkExist = await this.authModel.findOne({email:username});
        const hashPassword = await bcrypt.hash(password,saltOrRounds);
        if(checkExist !== null){
            throw new UnprocessableEntityException('Email already exist !');
        }
        const newUser = new this.authModel({
            email: username,
            password: hashPassword
        });
        newUser.save();
        return {
            message: 'Register successful',
            data: {
                user: newUser.toJSON().email
            }
        }
    }

    async submitLogin(data:any){
        const { username, password } = data
        const user = await this.authModel.findOne({email:username});
        if (user && (await bcrypt.compare(password,user.password))) {
            const payload = { username: user.email, sub: user.password };
            return{
                message:'Login successful',
                data:{
                    access_token: this.jwtService.sign(payload)
                },
            }
        }
        else if(!user){
            return{
                message:'User not found !',
                data:{}
            }
        }
        else if(bcrypt.compare(password,user.password)){
            return{
                message:'Wrong password !',
                data: {}
            }
        }
    }

    async submitLoginRichClient(data: AuthData){
        const { username, password } = data;
        const user = await this.authModel.findOne({email:username});
        if (user && (await bcrypt.compare(password,user.password))) {
            const payload = { username: user.email, sub: user.password };
            return{
                message:'Login successful',
                data:{
                    access_token: this.jwtService.sign(payload)
                },
            }
        }
        else if(!user){
            return{
                message:'User not found !',
                data:{}
            }
        }
        else if(bcrypt.compare(password,user.password)){
            return{
                message:'Wrong password !',
                data: {}
            }
        }
    }

    async googleLogin(req){
        if (!req.user) {
            return {
                message:'No user from google',
                data:{
                    user:null
                }
            }
        }
        return {
            message: 'User information from google',
            data:{
                user: req.user
            }
        }
    }
}