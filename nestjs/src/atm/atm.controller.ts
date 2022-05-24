import { AtmService } from "./atm.service";
import { Request, Response } from "express";
import { Controller, Get, UseGuards, Res} from "@nestjs/common";
import { LocalAuthGuard } from "../auth/config/local-auth.guard";

@Controller()
export class AtmController {

    constructor(private atmService: AtmService){}

    @UseGuards(LocalAuthGuard)
    @Get('atm/getAtms')
    async getAtms(@Res() res: Response){
        try{
            const result = await this.atmService.getAtms();
            return res.json(result);
        }
        catch(error){
            return res.json(error)
        }
    }

    @UseGuards(LocalAuthGuard)
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

    @UseGuards(LocalAuthGuard)
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