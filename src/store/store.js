import { configureStore } from "@reduxjs/toolkit";
import { authSlice, categorySlice, productSlice } from "./";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        category: categorySlice.reducer,
        product: productSlice.reducer,
    },
    middleware: (getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck : false
    }))
})