import { AtmService } from "./atm.service";
import { Request, Response } from "express";
import { Controller, Get, UseGuards, Res, Req} from "@nestjs/common";
import { JwtAuthGuard  } from "../auth/config/jwt-auth.guard";

@Controller()
export class AtmController {

    constructor(private atmService: AtmService){}

    @UseGuards(JwtAuthGuard)
    @Get('atm/getAtms')
    async getAtms(@Res() res: Response, @Req() req: Request){
        try{
            const result = await this.atmService.getAtms();
            return res.json(result);
        }
        catch(error){
            return res.json(error)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('atm/getQueues')
    async getQueues(@Res() res: Response){
        try{
            const result = await this.atmService.getQueues();
            return res.json(result);
        }
        catch(error){
            return res.json(error)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('atm/getProcesses')
    async getProcesses(@Res() res: Response){
        try{
            const result = await this.atmService.getProcesses();
            return res.json(result);
        }
        catch(error){
            return res.json(error)
        }
    }
}