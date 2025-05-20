import { Test, TestingModule } from "@nestjs/testing"
import { Task1Service } from "./task1.service"

describe("Task1Service", () => {
    let service: Task1Service

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [Task1Service],
        }).compile()

        service = module.get<Task1Service>(Task1Service)
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })
})
