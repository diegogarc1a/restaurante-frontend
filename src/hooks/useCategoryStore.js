import { useDispatch, useSelector } from "react-redux"
import { restauranteApi } from "../api";
import { onAddNewCategory, onCloseCategoryModal, onDeleteCategory, onLoadCategories, onOpenCategoryModal, onSetActiveCategory, onUpdateCategory } from "../store/categoria/categorySlice";
import Swal from "sweetalert2";

export const useCategoryStore = () => {

    const dispatch = useDispatch();
    const { categories, activeCategory, isLoadingCategories, isCategoryModalOpen } = useSelector( state => state.category );

    const startSavingCategory = async( category ) => {
        try {

          if( category.id ){
            //Actualizando
            await restauranteApi.put("categorias/", category);
            dispatch( onUpdateCategory({...category}) );
            Swal.fire('Exito',"Categoria Modificada", "success");
            return;
          }

          const { data } = await restauranteApi.post("categorias/", category);
          dispatch( onAddNewCategory({...category, id: data.id}) );
          Swal.fire('Exito',"Categoria Guardada", "success");
          
        } catch (error) {
          console.log(error);
          Swal.fire('Error al guardar', "Ha ocurrido un error", 'error');
        }
    }


    const startLoadingCategories = async() => {
        try {
            
            const { data } = await restauranteApi.get('categorias/');
            dispatch( onLoadCategories(data) );

        } catch (error) {
            console.log("Error cargando categorias");
            console.log(error);
        }
    }

    const startDeletingCategory = async( category ) => {
        try {
          
          await restauranteApi.delete(`categorias/${category.id}`);
          dispatch( onDeleteCategory( category ) );
          Swal.fire('Exito',"Categoria Eliminada", "success");
        } catch (error) {
            console.log(error);
            Swal.fire('Error al eliminar', "Ha ocurrido un error", 'error');
        }
      
  }

    const setActiveCategory = ( category ) => {
        dispatch( onSetActiveCategory( category ) );
    }

    const openCategoryModal = () => {
      dispatch( onOpenCategoryModal() )
    }

    const closeCategoryModal = () => {
      dispatch( onCloseCategoryModal() )
    }

  return {
    //*Properties
    categories,
    activeCategory,
    isLoadingCategories,
    isCategoryModalOpen,


    //*Methods
    startLoadingCategories,
    setActiveCategory,
    startSavingCategory,
    startDeletingCategory,
    openCategoryModal,
    closeCategoryModal
  }
}
