export const abi = [
    {
        inputs: [],
        name: "TaskTwo_RulesViolated",
        type: "error",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "expiryDate",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "disbursedDate",
                        type: "uint256",
                    },
                ],
                internalType: "struct Task2.DateObj[]",
                name: "dates",
                type: "tuple[]",
            },
        ],
        name: "validate",
        outputs: [],
        stateMutability: "view",
        type: "function",
    },
]
