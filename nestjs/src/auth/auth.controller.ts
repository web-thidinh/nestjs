import { Response, Request } from "express";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { GoogleAuthGuard } from "./config/google-auth.guard";
import { CookieStrategy } from "./strategies/cookie.strategy";
import { CookieExceptionFilter } from "./strategies/cookie.exeptionfilter";
import { Controller, Post, Res, Body, UseGuards, Req, Get, Render, UseFilters} from "@nestjs/common";
const REACT_REDIRECT_URL = 'http://localhost:3000/'

@Controller()
export class AuthController {
    constructor(private authService: AuthService){}
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
            if(result?.data?.access_token){
                res.cookie('access_token',result.data.access_token,{
                    signed:true,
                    maxAge: 60000
                });
            }
            return res.json(result);
        }
        catch(error){
            return res.json(error);
        }
    }

    @Get('/dashboard')
    @UseGuards(CookieStrategy)
    @UseFilters(new CookieExceptionFilter())
    @Render('dashboard')
    getDashboard(){
        return {layout:'index',title:'Dashboard page'};
    }

    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    async googleAuth(@Req() req: Request) {}

    @Get('google/login/redirect')
    @UseGuards(GoogleAuthGuard)
    async getGoogleRedirect(@Req() req: Request,@Res() res: Response){
        try{
            const result = await this.authService.googleLoginRedirect(req);
            if(result?.data?.access_token){
                res.cookie('access_token',result.data.access_token,{
                    signed:true,
                    maxAge: 60000
                })
                return res.redirect('/dashboard');
            }
        }
        catch(error){
            return res.json(error);
        }
    }

    @Post('react-google-login')
    async getGoogleLogin (@Req() req: Request,@Res() res: Response){
        try{
            const result = await this.authService.googleReactLogin(req.body);
            return res.json(result);
        }
        catch(error){
            return res.json(error);
        }
    }

}