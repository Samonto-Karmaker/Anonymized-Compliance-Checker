import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const baseUrl = process.env.REACT_APP_API_BASE_URL;

export const contract_api = createApi({
    reducerPath: "contract_api",
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers) => {
            headers.set("Content-type", "application/json");
            return headers;
        }
    }),
    tagTypes: ["Contract"],
    endpoints: (builder) => ({
        checkTask1: builder.mutation({
            query: () => ({
                url: "/task1/check-compliance",
                method: "GET"
            }),
            providesTags: ["Contract"]
        }),
        checkTask2: builder.mutation({
            query: (batchSize) => ({
                url: `/task2/batches/${batchSize}`,
                method: "GET"
            }),
            providesTags: ["Contract"]
        })
    })
})


export const {
    useCheckTask1Mutation,
    useCheckTask2Mutation
} = contract_api;