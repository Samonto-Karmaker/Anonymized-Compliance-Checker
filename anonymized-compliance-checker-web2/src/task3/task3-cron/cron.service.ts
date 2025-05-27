import { Injectable, OnModuleInit } from "@nestjs/common"
import { CronJob } from "cron"
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule"
import { BatchService } from "../task3-batch/batch.service"

@Injectable()
export class CronService implements OnModuleInit {
    constructor(
        private schedulerRegistry: SchedulerRegistry,
        private readonly batchService: BatchService
    ) {}

    // This method is called when the module is initialized
    async onModuleInit() {
        const isProd = process.env.NODE_ENV === "production"
        const cronTime = isProd
            ? CronExpression.EVERY_30_MINUTES
            : CronExpression.EVERY_10_MINUTES
        this.addCronJob("sync-db-with-contact", cronTime)

        if (!isProd) {
            console.log(`Cron job is running in development mode`)
            await this.handleCron()
        }
    }

    // This method is used to register a cron job
    private addCronJob(name: string, cronTime: string) {
        const job = new CronJob(cronTime, async () => {
            await this.handleCron()
        })
        this.schedulerRegistry.addCronJob(name, job)
        job.start()
        console.log(`Cron job ${name} started with time: ${cronTime}`)
    }

    // This method is called when the cron job is triggered
    private async handleCron() {
        console.log("Cron job triggered!")
        await this.batchService.sendCreationBatch()
        console.log("Batch creation processing completed!")
        await this.batchService.sendUpdateBatch()
        console.log("Batch update processing completed!")
    }
}
