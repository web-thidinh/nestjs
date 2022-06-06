import axios from 'axios';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from "@nestjs/mongoose";
import { OAuth2Client } from "google-auth-library";
import { LoginSocial } from './dto/create-auth.dto';
import { Users, UsersDocument } from './auth.modal';
import { AuthData, AuthGoogle } from './interface/auth.interface';
import { Injectable, UnprocessableEntityException } from "@nestjs/common";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Injectable({})

export class AuthService {
    
    constructor(
        @InjectModel(Users.name) 
        private authModel: Model<UsersDocument>,
        private jwtService: JwtService,
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

    async submitLogin(body:any){
        const { username, password } = body
        const user = await this.authModel.findOne({email:username});
        if (user && (await bcrypt.compare(password,user.password))) {
            const payload = { username: user.email, sub: user._id };
            return{
                message:'Login successful',
                data:{
                    user:{
                        email: user.email,
                        access_token: this.jwtService.sign(payload)
                    },
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

    async googleLoginRedirect(req: any){
        const user = req.user;
        if(user){
            const checkUser = await this.authModel.findOne({email:user.email});
            if(checkUser) { console.log('User exist') }
            else {
                const newUser = new this.authModel(user)
                newUser.save();
            }
            return {
                message: "User information from google",
                data: user
            }
        }
        return {
            message: "No user from google",
            data:{}
        }
    }

    async googleReactLogin(body: any){
        const { token } = body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { email_verified, name, email, picture } = ticket.getPayload();
        if(email_verified){
            const generateToken = this.jwtService.sign({email});
            const checkUser = await this.authModel.findOne({email: email})
            if(checkUser) {
                const { email, from } = checkUser
                console.log(name, picture)
                if(from == undefined){
                    await this.authModel.updateOne({email: email},{
                        name: name,
                        picture: picture,
                        from: LoginSocial.google
                    })
                }
                return {
                    message: 'Get user exist from database',
                    data: {
                        user:{email, name, picture, access_token: generateToken}
                    }
                };
            }
            const newUser = new this.authModel({
                email: email,
                name: name,
                picture: picture,
                from: LoginSocial.google
            });
            newUser.save();
    
            return {
                message:'Login google successful',
                data:{ user:{email, name, picture, access_token: generateToken} }
            };
        }
        return {
            message: 'Login google faild',
            data: null
        }
    }

    async facebookReactLogin(body: any){
        const { userID, token } = body;
        const data: any = await axios.get(`https://graph.facebook.com/${userID}?fields=name,picture,email&access_token=${token}`);
        if(data?.data){
            const { id, email, name, picture } = data?.data;
            const generateToken = this.jwtService.sign({id,email,name});
            const checkUser = await this.authModel.findOne({email: email});
            if(checkUser && checkUser?.from) {
                return {
                    message: 'User information from DB',
                    data: {
                        user:{
                            email: checkUser.email,
                            name: checkUser.name,
                            picture: checkUser.picture,
                            access_token: generateToken
                        }
                    }
                }    
            }
            if(checkUser && checkUser?.from === undefined){
                await this.authModel.updateOne({email: email},{
                    name: name,
                    picture: picture?.data?.url,
                    from: LoginSocial.facebook
                })
                return {
                    message: 'Login successful',
                    data: {
                        user:{
                            email,
                            name,
                            picture: picture?.data?.url,
                            access_token: generateToken
                        }
                    }
                } 
            }
            else {
                const newUser = new this.authModel({
                    email,
                    name,
                    picture: picture?.data?.url,
                    from : LoginSocial.facebook
                })
                newUser.save();
                return {
                    message: "User information from facebook",
                    data: {
                        user:{
                            email,
                            name,
                            picture: picture?.data?.url,
                            access_token: generateToken
                        }
                    }
                }
            }
        }
        return {
            message: "No user from facebook",
            data:{}
        }
    }
}