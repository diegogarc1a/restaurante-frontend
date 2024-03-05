import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./auth/authSlice";
import { categorySlice } from "./categoria/categorySlice";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        category: categorySlice.reducer,
    },
    middleware: (getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck : false
    }))
})