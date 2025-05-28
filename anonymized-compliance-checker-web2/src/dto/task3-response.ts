export class Task3Response {
    constructor(
        public untrackedInventories: number,
        public inventoriesReadyForUpdate: number,
        public creationBatchesVerified: boolean,
        public updateBatchesVerified: boolean
    ) {}
}
