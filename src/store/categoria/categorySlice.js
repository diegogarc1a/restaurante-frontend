import { createSlice } from '@reduxjs/toolkit';
export const categorySlice = createSlice({
    name: 'category',
    initialState: {
        isLoadingCategories: true,
        categories : [],
        activeCategory : null,
        isCategoryModalOpen : false,
    },
    reducers: {
        onSetActiveCategory: (state, { payload }) =>{
            state.activeCategory = payload;
        },
        onAddNewCategory: (state, { payload }) => {
            state.categories.push(payload);
            state.activeCategory = null;
        },
        onUpdateCategory: (state, { payload }) => {
            state.categories = state.categories.map( cat => {
                if( cat.id === payload.id ){
                    return payload;
                }
                return cat;
            } )
            state.activeCategory = null;
        },
        onDeleteCategory: (state, { payload }) => {
            // state.categories = state.categories.filter( cat => cat.id !== state.activeCategory.id);
            state.categories = state.categories.filter( cat => cat.id !== payload.id);
            state.activeCategory = null;
        },
        onLoadCategories: (state, { payload = [] }) => {
            state.isLoadingCategories = false;
            payload.forEach( cat => {
                const exists = state.categories.some( dbCat => dbCat.id === cat.id );
                if ( !exists ){
                    state.categories.push( cat );
                }
            } )
        },onLogoutCategory: ( state ) => {
            state.isLoadingCategories= true,
            state.categories= [],
            state.activeCategory= null
        }
        ,onOpenCategoryModal: ( state ) => {
            state.isCategoryModalOpen = true;
        },
        onCloseCategoryModal: ( state ) => {
            state.isCategoryModalOpen = false;
            state.activeCategory = null;
        }
    }
});

// Action creators are generated for each case reducer function
export const { 
    onSetActiveCategory, 
    onAddNewCategory, 
    onUpdateCategory, 
    onDeleteCategory, 
    onLoadCategories,
    onLogoutCategory,
    onOpenCategoryModal,
    onCloseCategoryModal
} = categorySlice.actions;