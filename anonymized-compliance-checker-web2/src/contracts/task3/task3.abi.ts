export const abi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "id",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "string",
                name: "hash",
                type: "string",
            },
        ],
        name: "CreationHashUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "id",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "string",
                name: "hash",
                type: "string",
            },
        ],
        name: "UpdateHashUpdated",
        type: "event",
    },
    {
        inputs: [
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "string", name: "hash", type: "string" },
        ],
        name: "create",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "latestCreationHash",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "latestUpdateHash",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "string", name: "hash", type: "string" },
        ],
        name: "update",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
]
