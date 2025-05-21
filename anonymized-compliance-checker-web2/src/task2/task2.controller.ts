import { Controller, Get, Param, Query } from '@nestjs/common';
import { Task2Service } from './task2.service';

@Controller("task2")
export class Task2Controller {
    constructor(
        private readonly task2Service:Task2Service
    ){}

    @Get("batches/:batchSize")
    async getAllBatches(@Param('batchSize') batchSize:string){
        const BatchSize=parseInt(batchSize,10);
        return await this.task2Service.getDatesInBatch(BatchSize);
    }

    @Get("test")
    async test(){
        return "Running.";
    }

}
