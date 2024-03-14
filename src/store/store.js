import { configureStore } from "@reduxjs/toolkit";
import { authSlice, categorySlice, productSlice, ventaSlice } from "./";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        category: categorySlice.reducer,
        product: productSlice.reducer,
        venta: ventaSlice.reducer,
    },
    middleware: (getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck : false
    }))
})