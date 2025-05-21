import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import crypto from 'crypto';
import {getMetadataArgsStorage} from 'typeorm'
import { Inventory } from 'src/db/inventory.entity';
import { Task1ContractService } from 'src/contracts/task1/task1.contract.service';

@Injectable()
export class Task1Service {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
    private readonly contractSvc: Task1ContractService,
  ) { }

  async checkCompliance(): Promise<{ msg: string ,code: number}> {
      const columns = getMetadataArgsStorage()
      .columns
      .filter(col => col.target === Inventory)
      .map(col => col.propertyName);

      // console.log('Columns to check:', columns);

       const hashed = columns.map(name =>
      '0x' + crypto.createHash('sha256').update(name).digest('hex')
       );

    const contract = this.contractSvc.getContract();
    try {
      const compliant = await contract.isCompliant(hashed);
      console.log('Compliance check result:', compliant);
      return { msg: compliant ? 'All fields are compliant.' : 'Some fields are not compliant.', code: 200 };
    } catch (error) {
      return { msg: 'Error checking compliance.', code: 400 };
    }
  }
}
