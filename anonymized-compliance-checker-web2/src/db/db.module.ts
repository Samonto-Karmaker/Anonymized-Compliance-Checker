import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import * as dotenv from "dotenv"
import { Inventory } from "src/db/inventory.entity"
dotenv.config()

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "postgres",
            host: process.env.DB_HOST || "localhost",
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
            username: process.env.DB_USERNAME || "postgres",
            password: process.env.DB_PASSWORD || "",
            database: process.env.DB_NAME || "inventory_db",
            entities: [Inventory],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([Inventory]),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}
