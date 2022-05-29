import { Controller, Post, Res, Body, UseGuards, Req, Get, Render, UseFilters} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response, Request } from "express";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { GoogleAuthGuard } from "./config/google-auth.guard";
import { CookieStrategy } from "./strategies/cookie.strategy";
import { CookieExceptionFilter } from "./strategies/cookie.exeptionfilter";

@Controller()
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('user/register')
    async register(@Body() createAuthDto: CreateAuthDto,@Res() res: Response){
        try{
            const result = await this.authService.submitRegister(createAuthDto);
            return res.json(result);
        }
        catch(error){
            return res.json(error);
        }
    }

    @Post('user/login')
    async login(@Body() body: Body, @Res() res: Response){
        try{
            const result = await this.authService.submitLogin(body);
            return res.json(result);
        }
        catch(error){
            return res.json(error);
        }
    }

    @Post('')
    async loginRichClient(@Res() res: Response,@Req() req: Request){
        try{
            const result = await this.authService.submitLoginRichClient(req.body);
            if(result?.data?.access_token){
                res.cookie('access_token',result.data.access_token,{
                    maxAge: 60000
                });
                return res.redirect('/dashboard');
            }
            return res.render('login',{layout:'index',message: result.message, email: req.body.username, password: req.body.password});
        }
        catch(error){
            return res.json(error);
        }
    }

    @UseGuards(CookieStrategy)
    @Get('/dashboard')
    @UseFilters(new CookieExceptionFilter())
    @Render('dashboard')
    getDashboard(){
        return {layout:'index',title:'Dashboard page'};
    }

    @UseGuards(GoogleAuthGuard)
    @Get('google/login')
    async googleAuth(@Req() req: Request) {}

    @UseGuards(GoogleAuthGuard)
    @Get('google/redirect')
    async getGoogleAuth(@Req() req: Request,@Res() res: Response){
        try{
            const result = await this.authService.googleLogin(req);
            return res.json(result);
        }
        catch(error){
            return res.json(error);
        }
    }
}