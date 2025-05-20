import { Controller, Get, Query } from '@nestjs/common';
import { Task2Service } from './task2.service';

@Controller("task2")
export class Task2Controller {
    constructor(
        private readonly task2Service:Task2Service
    ){}
    @Get("/batches")
    async getAllBatches(){
        const total=await this.task2Service.getRowCount();
        const batchSize=5;
        const totalBatch=Math.ceil(total/batchSize);
        // const 
    }
}
