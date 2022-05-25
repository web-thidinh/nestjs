import { AtmService } from "./atm.service";
import { Request, Response } from "express";
import { CreateAtmDto, CreateQueueDto } from './dto/create-atm.dto';
import { Controller, Get, UseGuards, Res, Req, Post, Body, Delete} from "@nestjs/common";
import { JwtAuthGuard  } from "../auth/config/jwt-auth.guard";

@Controller()
export class AtmController {

    constructor(private atmService: AtmService){}

    @UseGuards(JwtAuthGuard)
    @Post('atm/create')
    async createAtm(@Body() createAtmDto: CreateAtmDto, @Res() res: Response  ){
        try{
            const result = await this.atmService.createAtm(createAtmDto);
            return res.json(result);
        }
        catch(error){
            return res.json(error);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('queue/create')
    async createQueue(@Body() createQueueDto: CreateQueueDto, @Res() res: Response){
        try{
            const result = await this.atmService.createQueue(createQueueDto);
            return res.json(result);
        }
        catch(error){
            return res.json(error);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('atm/delete')
    async deleteAtm(@Body() id: any, @Res() res: Response){
        try{
            const result = await this.atmService.deleleAtm(id);
            return res.json(result);
        }
        catch(error){
            return res.json(error);
        }
    }

    @UseGuards(JwtAuthGuard)
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