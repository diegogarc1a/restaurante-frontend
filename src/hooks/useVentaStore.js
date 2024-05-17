import { useDispatch, useSelector } from "react-redux";
import { restauranteApi } from "../api";
import { onAddNewDetalleVenta, onAddNewVenta, onCleanDetalleVenta, onCloseDetalleVentaModal, onCloseVentaModal, onDeleteDetalleVenta, onDeleteVenta, onLoadVentas, onOpenVentaModal, onSetActiveVenta, onUpdateDetalleVenta, onUpdateVenta } from "../store/venta/ventaSlice";
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
          
          console.log(venta);

          const { data } = await restauranteApi.post("ventas/", venta);
          dispatch( onAddNewVenta({...venta, id: data.id}) );
          Swal.fire('Exito',"Venta Guardada", "success");
          
        } catch (error) {
          console.log(error);
        }
    }

    const pedidoFinalizado = async( venta ) => {
      if( venta.id ){
        //Actualizando
        const { data } = await restauranteApi.patch("ventas/finalizarVenta", venta);
        console.log(data);
        dispatch( onUpdateVenta({...data }) );
        Swal.fire('Exito',"Pedido Terminado", "success");
        return;
      }
    }

    const pagarPedido = async( id, cantidad ) => {
      try {
        // Create a new FormData object
        const formData = new FormData();
    
        // Add the id and cantidad to the form-data
        formData.append('id', id);
        formData.append('cantidad', cantidad);
    
        // Send the form-data request
        const { data } = await restauranteApi.patch("ventas/pagarVenta", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log(data);
        dispatch( onUpdateVenta({...data }) );
        Swal.fire('Exito',"Pedido Pagado", "success");
        return;
    
      } catch (error) {
        console.log(error);
        return;
      }
    }

    const cambiarEstadoDv = async( detalleventa ) => {
      if( detalleventa.id ){
        //Actualizando
        const { data } = await restauranteApi.patch("ventas/cambiarEstadoDv", {...detalleventa});
        dispatch( onUpdateVenta({...data}) );
        return;
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

      const addVentaWS = (venta) => {
        dispatch( onAddNewVenta(venta) );
      }

      const updateVentaWS = (venta) => {
        dispatch( onUpdateVenta(venta) );
      }

    const addDetalleVenta = ( detalleVenta ) => {
        if(detalleVenta.index >= 0){
          dispatch( onUpdateDetalleVenta( detalleVenta ) );
          return;
        }
        dispatch( onAddNewDetalleVenta( detalleVenta ) );
    }

    const deleteDetalleVenta = ( detalleVenta, rowIndex ) => {
      detalleVenta = {...detalleVenta, index: rowIndex};
      dispatch( onDeleteDetalleVenta( detalleVenta ) );
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
    const closeDetalleVentaModal = () => {
      dispatch( onCloseDetalleVentaModal() )
    }

    const cleanDetalleVenta = () => {
      dispatch( onCleanDetalleVenta() );
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
    closeDetalleVentaModal,
    addDetalleVenta,
    deleteDetalleVenta,
    addVentaWS,
    updateVentaWS,
    pedidoFinalizado,
    pagarPedido,
    cambiarEstadoDv,
    cleanDetalleVenta
  }
}
