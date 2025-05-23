import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

// services
import { contract_api } from "./services/contract_api";

const store = configureStore({
    reducer: {
        [contract_api.reducerPath]: contract_api.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(contract_api.middleware)
})

setupListeners(store.dispatch);

export default store;