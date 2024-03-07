import { createSlice } from '@reduxjs/toolkit';
export const productSlice = createSlice({
    name: 'product',
    initialState: {
        isLoadingProduct: true,
        products : [],
        activeProduct : null,
        isProductModalOpen : false,
    },
    reducers: {
        onSetActiveProduct: (state, { payload }) =>{
            state.activeProduct = payload;
        },
        onAddNewProduct: (state, { payload }) => {
            state.products.push(payload);
            state.activeProduct = null;
        },
        onUpdateProduct: (state, { payload }) => {
            state.products = state.products.map( cat => {
                if( cat.id === payload.id ){
                    return payload;
                }
                return cat;
            } )
            state.activeProduct = null;
        },
        onDeleteProduct: (state, { payload }) => {
            // state.products = state.products.filter( cat => cat.id !== state.activeProduct.id);
            state.products = state.products.filter( cat => cat.id !== payload.id);
            state.activeProduct = null;
        },
        onLoadProducts: (state, { payload = [] }) => {
            state.isLoadingProducts = false;
            payload.forEach( cat => {
                const exists = state.products.some( dbCat => dbCat.id === cat.id );
                if ( !exists ){
                    state.products.push( cat );
                }
            } )
        },onLogoutProduct: ( state ) => {
            state.isLoadingProducts= true,
            state.products= [],
            state.activeProduct= null
        }
        ,onOpenProductModal: ( state ) => {
            state.isProductModalOpen = true;
        },
        onCloseProductModal: ( state ) => {
            state.isProductModalOpen = false;
            state.activeProduct = null;
        }
    }
});

// Action creators are generated for each case reducer function
export const { 
    onSetActiveProduct, 
    onAddNewProduct, 
    onUpdateProduct, 
    onDeleteProduct, 
    onLoadProducts,
    onLogoutProduct,
    onOpenProductModal,
    onCloseProductModal
} = productSlice.actions;