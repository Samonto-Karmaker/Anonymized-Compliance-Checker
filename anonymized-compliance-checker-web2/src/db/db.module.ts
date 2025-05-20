import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { inventory } from 'src/task1/task1.entity';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'inventory_db',
      entities: [inventory],
      synchronize: false, 
    }),
    TypeOrmModule.forFeature([inventory]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
