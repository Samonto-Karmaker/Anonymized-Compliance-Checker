import { Injectable, OnModuleInit } from "@nestjs/common"
import { CronJob } from "cron"
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule"

@Injectable()
export class CronService implements OnModuleInit {
    constructor(private schedulerRegistry: SchedulerRegistry) {}

    // This method is called when the module is initialized
    onModuleInit() {
        const isProd = process.env.NODE_ENV === "production"
        const cronTime = isProd
            ? CronExpression.EVERY_30_SECONDS
            : CronExpression.EVERY_10_SECONDS
        this.addCronJob("sync-db-with-contact", cronTime)

        if (!isProd) {
            console.log(`Cron job is running in development mode`)
            this.handleCron()
        }
    }

    // This method is used to register a cron job
    private addCronJob(name: string, cronTime: string) {
        const job = new CronJob(cronTime, () => {
            this.handleCron()
        })
        this.schedulerRegistry.addCronJob(name, job)
        job.start()
        console.log(`Cron job ${name} started with time: ${cronTime}`)
    }

    // This method is called when the cron job is triggered
    private handleCron() {
        console.log(`Cron job running at ${new Date().toISOString()}`)
    }
}
