import { Test, TestingModule } from "@nestjs/testing"
import { Task1Controller } from "./task1.controller"

describe("Task1Controller", () => {
    let controller: Task1Controller

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [Task1Controller],
        }).compile()

        controller = module.get<Task1Controller>(Task1Controller)
    })

    it("should be defined", () => {
        expect(controller).toBeDefined()
    })
})
