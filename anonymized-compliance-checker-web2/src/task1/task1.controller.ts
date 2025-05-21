import { Controller, Get } from '@nestjs/common';
import { Task1Service } from './task1.service';
@Controller('task1')
export class Task1Controller {
  constructor(private readonly svc: Task1Service) {}

  @Get('check-compliance')
  async checkCompliance() {
    return this.svc.checkCompliance();
  }
}
