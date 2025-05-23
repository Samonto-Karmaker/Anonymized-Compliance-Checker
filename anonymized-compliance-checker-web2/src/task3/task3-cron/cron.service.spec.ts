import { Test, TestingModule } from "@nestjs/testing"
import { Task3CronService } from "./cron.service"

describe("Task3CronService", () => {
    let service: Task3CronService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [Task3CronService],
        }).compile()

        service = module.get<Task3CronService>(Task3CronService)
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })
})
