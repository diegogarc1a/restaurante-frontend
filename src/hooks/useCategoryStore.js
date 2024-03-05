import { useDispatch, useSelector } from "react-redux"
import { restauranteApi } from "../api";
import { onLoadCategories } from "../store/categoria/categorySlice";

export const useCategoryStore = () => {

    const dispatch = useDispatch();
    const { categories, activeCategory } = useSelector( state => state.category );

    const startLoadingCategories = async() => {
        try {
            
            const { data } = await restauranteApi.get('categorias/');
            console.log(data);
            dispatch( onLoadCategories(data) );

        } catch (error) {
            console.log("Error cargando categorias");
            console.log(error);
        }
    }

  return {
    //*Properties
    categories,
    activeCategory,


    //*Methods
    startLoadingCategories,
  }
}
