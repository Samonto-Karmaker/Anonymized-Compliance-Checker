import { Test, TestingModule } from "@nestjs/testing"
import { Task3Service } from "./task3.service"

describe("Task3Service", () => {
    let service: Task3Service

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [Task3Service],
        }).compile()

        service = module.get<Task3Service>(Task3Service)
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })
})
