import { Module } from "@nestjs/common";
import { Task2ContractService } from "./task2.contract.service";

@Module({
  providers: [Task2ContractService],
  exports: [Task2ContractService],
})
export class Task2ContractModule{}