import { Controller, Post, Res, Body, UseGuards, Request, Req} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { AuthData } from "./auth.service";
import { LocalAuthGuard } from "./config/local-auth.guard";

@Controller()
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('user/register')
    async register(@Body() body: AuthData,@Res() res: Response){
        try{
            const result = await this.authService.submitRegister(body);
            return res.json(result);
        }
        catch(error){
            return res.json(error);
        }
    }

    @UseGuards(LocalAuthGuard)
    @Post('user/login')
    async login(@Request() req : any){
        return this.authService.submitLogin(req.user);
    }
}