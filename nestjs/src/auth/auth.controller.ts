import { Controller, Get, Post, Res, Req, Render, Body, Catch, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { AuthData } from "./auth.service";

@Controller('user')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('register')
    async register(@Body() body: AuthData){
        const result = await this.authService.submitRegister(body);
        return {result:result};
    }

    @Post('login')
    async login(@Body() body: AuthData){
        const result = await this.authService.submitLogin(body);
        return {result: result}
    }
}