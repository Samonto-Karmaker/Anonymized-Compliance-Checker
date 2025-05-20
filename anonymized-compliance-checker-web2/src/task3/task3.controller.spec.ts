import { Test, TestingModule } from "@nestjs/testing"
import { Task3Controller } from "./task3.controller"

describe("Task3Controller", () => {
    let controller: Task3Controller

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [Task3Controller],
        }).compile()

        controller = module.get<Task3Controller>(Task3Controller)
    })

    it("should be defined", () => {
        expect(controller).toBeDefined()
    })
})
