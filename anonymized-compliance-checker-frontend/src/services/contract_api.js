import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseUrl = process.env.REACT_APP_API_BASE_URL;
console.log("Base URL:", baseUrl);

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
        }),
        createTask3: builder.mutation({
            query: (data) => ({
                url: `/task3/create`,
                method: "POST",
                body:data
            }),
            providesTags: ["Contract"]
        }),
        updateTask3: builder.mutation({
        query: ({ id, data }) => ({
            url: `/task3/update-disbursement-date/${id}`,
            method: "PATCH",
            body: data
        }),
        invalidatesTags: ["Contract"]
      }),

      getHashByCreationId: builder.query({
         query: (id) => ({
            url: `/task3/batch/verify/creation/${id}`,
            method: "GET",
        }),
        invalidatesTags: ["Contract"]
      }),

      getHashByUpdateId:builder.query({
         query: (id) => ({
            url: `/task3/batch/verify/update/${id}`,
            method: "GET",
        }),
        invalidatesTags: ["Contract"]
      }),

      verifyAllBatches: builder.query({
         query: () => ({
            url: `/task3/batch/verify/all`,
            method: "GET",
        }),
        invalidatesTags: ["Contract"]
      }),
    })
})

export const {
    useCheckTask1Mutation,
    useCheckTask2Mutation,
    useCreateTask3Mutation,
    useUpdateTask3Mutation,
    useGetHashByCreationIdQuery,
    useGetHashByUpdateIdQuery,
    useVerifyAllBatchesQuery
} = contract_api;