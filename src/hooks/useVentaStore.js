import { useDispatch, useSelector } from "react-redux";
import { restauranteApi } from "../api";
import { onAddNewDetalleVenta, onAddNewVenta, onCloseVentaModal, onDeleteVenta, onLoadVentas, onOpenVentaModal, onSetActiveVenta, onUpdateDetalleVenta, onUpdateVenta } from "../store/venta/ventaSlice";
import Swal from "sweetalert2";

export const useVentaStore = () => {
    const dispatch = useDispatch();
    const { ventas, detalleVentas, activeVenta, isLoadingVentas, isVentaModalOpen } = useSelector( state => state.venta );

    const startSavingVenta = async( venta ) => {
        try {

          if( venta.id ){
            //Actualizando
            await restauranteApi.put("ventas/", venta);
            dispatch( onUpdateVenta({...venta}) );
            Swal.fire('Exito',"Venta Modificada", "success");
            return;
          }

          const { data } = await restauranteApi.post("ventas/", venta);
          dispatch( onAddNewVenta({...venta, id: data.id}) );
          Swal.fire('Exito',"Venta Guardada", "success");
          
        } catch (error) {
          console.log(error);
        }
    }


    const startLoadingVentas = async() => {
        try {
            
            const { data } = await restauranteApi.get('ventas/');
            dispatch( onLoadVentas(data) );

        } catch (error) {
            console.log("Error cargando ventas");
            console.log(error);
        }
    }

    const startDeletingVenta = async( venta ) => {
        try {
          
          await restauranteApi.delete(`ventas/${venta.id}`);
          dispatch( onDeleteVenta( venta ) );
          Swal.fire('Exito',"Venta Eliminada", "success");
        } catch (error) {
            console.log(error);
        } 
  }

    const addDetalleVenta = ( detalleVenta ) => {
        
        if(detalleVenta.id >= 0){
          console.log(detalleVenta);
          dispatch( onUpdateDetalleVenta( detalleVenta ) );
          return;
        }
        dispatch( onAddNewDetalleVenta( detalleVenta ) );
    }

    const setActiveVenta = ( venta ) => {
        dispatch( onSetActiveVenta( venta ) );
    }

    const openVentaModal = () => {
      dispatch( onOpenVentaModal() )
    }

    const closeVentaModal = () => {
      dispatch( onCloseVentaModal() )
    }

  return {
    //*Properties
    ventas,
    activeVenta,
    isLoadingVentas,
    isVentaModalOpen,
    detalleVentas,


    //*Methods
    startLoadingVentas,
    setActiveVenta,
    startSavingVenta,
    startDeletingVenta,
    openVentaModal,
    closeVentaModal,
    addDetalleVenta
  }
}
