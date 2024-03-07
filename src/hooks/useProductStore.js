import { useDispatch, useSelector } from "react-redux"
import { restauranteApi } from "../api";
import { onLoadProducts } from "../store/producto/productSlice";


export const useProductStore = () => {
  
    const dispatch = useDispatch();
    const { products, isLoadingProduct } = useSelector( state => state.product);
  

    const startLoadingProducts = async() => {
        try {
            const { data } = await restauranteApi.get("productos/");
            dispatch( onLoadProducts( data ) )
        } catch (error) {
            console.log(error);
        }
    }

    return {
        //Properties
        products,
        isLoadingProduct,

        //Methods
        startLoadingProducts
  }
}
