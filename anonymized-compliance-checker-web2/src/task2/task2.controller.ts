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

        for(let i=1;i<=totalBatch;i++){
            const res= await this.task2Service.getDatesInBatch(i,batchSize);
            if(res.resCode==500){
                return {"msg":`Validation failed for batch no ${i}!`};
            }
        }
        return {"msg":"Validation Passed."};
    }

    @Get("/test")
    async test(){
        return "Running.";
    }

}
