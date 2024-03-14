import { useDispatch, useSelector } from "react-redux"
import { restauranteApi } from "../api";
import { onAddNewProduct, onCloseProductModal, onDeleteProduct, onLoadProducts, onOpenProductModal, onSetActiveProduct, onUpdateProduct } from "../store/producto/productSlice";
import Swal from "sweetalert2";


export const useProductStore = () => {
  
    const dispatch = useDispatch();
    const { products, isLoadingProduct, activeProduct, isProductModalOpen } = useSelector( state => state.product);
  
    const configHeader = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
          }
    }
    const startSavingProduct = async( product ) => {
        try {
            if( activeProduct !== null ){
                // Actualizando
                const { data } = await restauranteApi.put("productos/", product, configHeader);
                dispatch( onUpdateProduct({...data }) )
                Swal.fire('Exito',"Producto Modificado", "success");
                return;
            }
                //Guardando
                const { data } = await restauranteApi.post("productos/", product, configHeader);
                
                dispatch( onAddNewProduct({  ...data , id: data.id }) );
                Swal.fire('Exito',"Producto Guardado", "success");
        
        } catch (error) {
            console.log(error);
        }
    }

    const startDeletingProduct = async(product) => {
        try {   
            await restauranteApi.delete(`productos/${product.id}`);
            dispatch( onDeleteProduct( product ) );
            Swal.fire('Exito',"Procto Eliminado", "success");
        } catch (error) {
            console.log(error);
        }
    }

    const startLoadingProducts = async() => {
        try {
            const { data } = await restauranteApi.get("productos/");
            dispatch( onLoadProducts( data ) )
        } catch (error) {
            console.log(error);
        }
    }

    const setActiveProduct = ( product ) => {
        dispatch( onSetActiveProduct( product ) );
    }

    const openProductModal = () => {
        dispatch( onOpenProductModal() )
      }
  
      const closeProductModal = () => {
        dispatch( onCloseProductModal() )
      }

    return {
        //Properties
        products,
        isLoadingProduct,
        isProductModalOpen,
        activeProduct,

        //Methods
        startLoadingProducts,
        startSavingProduct,
        startDeletingProduct,
        setActiveProduct,
        openProductModal,
        closeProductModal,
  }
}
