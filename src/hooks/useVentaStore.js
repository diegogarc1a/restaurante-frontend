import { useDispatch, useSelector } from "react-redux";
import { restauranteApi } from "../api";
import { onAddNewDetalleVenta, onAddNewVenta, onCharge, onCleanDetalleVenta, onCloseDetalleVentaModal, onCloseVentaModal, onDeleteDetalleVenta, onDeleteVenta, onLoadVentas, onOpenVentaModal, onSetActiveVenta, onSetPageSelected, onTotalRecords, onUpdateDetalleVenta, onUpdateVenta } from "../store/venta/ventaSlice";
import Swal from "sweetalert2";

export const useVentaStore = () => {
    const dispatch = useDispatch();
    const { ventas, detalleVentas, activeVenta, isLoadingVentas, isVentaModalOpen, totalRecords, pageSelected } = useSelector( state => state.venta );

    const startSavingVenta = async( venta ) => {
        try {

          if( venta.id ){
            //Actualizando
            Swal.showLoading()
            const {data} = await restauranteApi.put("ventas/", venta);
            dispatch( onUpdateVenta({...data}) );
            Swal.fire('Exito',"Venta modificada", "success");
            return;
          }

          Swal.showLoading()
          const { data } = await restauranteApi.post("ventas/", venta);
          dispatch( onAddNewVenta({...venta, id: data.id}) );
          Swal.fire('Exito',"Venta guardada", "success");
          
        } catch (error) {
          console.log(error);
        }
    }

    const pedidoFinalizado = async( venta ) => {
      if( venta.id ){
        //Actualizando
         Swal.showLoading()
       
        const { data } = await restauranteApi.patch("ventas/finalizarVenta", venta);
        console.log(data);
        dispatch( onUpdateVenta({...data }) );
        Swal.fire('Exito',"Pedido terminado", "success");
        return;
      }
    }

    const pagarPedido = async( id, cantidad ) => {
      try {
        const formData = new FormData();
    
        formData.append('id', id);
        formData.append('cantidad', cantidad);

         Swal.showLoading()
        const { data } = await restauranteApi.patch("ventas/pagarVenta", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        await dispatch( onUpdateVenta({...data }) );
        
        Swal.fire('Exito',"Pedido pagado", "success");
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

    const startLoadingVentas = async(page=0, size=100,estado) => {
      try {
         dispatch( onCharge(true) );
          const { data } = await restauranteApi.get(`ventas/lista?page=${page}&size=${size}&estado=${estado}&sortDirection=${estado === 'Proceso' ? 'asc' : 'desc' }`);
          dispatch( onLoadVentas(data.content));
          if (estado === 'Pagado') dispatch( onTotalRecords(data.totalElements));

      } catch (error) {
          console.log("Error cargando ventas");
          console.log(error);
      }
  }

    const startDeletingVenta = async( venta ) => {
        try {
          Swal.showLoading()
          await restauranteApi.delete(`ventas/${venta.id}`);
          dispatch( onDeleteVenta( venta ) );
          Swal.fire('Exito',"Venta eliminada", "success");
        } catch (error) {
            console.log(error);
        } 
  }

      const addVentaWS = (venta) => {
          dispatch(onAddNewVenta(venta));
      }

      const updateVentaWS = (venta) => {
        dispatch( onUpdateVenta(venta) );
      }
      const eliminarVentaWS = (venta) => {
        dispatch( onDeleteVenta(venta) );
      }

    const addDetalleVenta = ( detalleVenta, toastRef ) => {
        if(detalleVenta.index >= 0){
          dispatch( onUpdateDetalleVenta( detalleVenta ) );
          console.log("Entro")
          toastRef &&  toastRef.current.show({ severity: 'success', detail: 'Producto modificado con exito' });
          return;
        }
        dispatch( onAddNewDetalleVenta( detalleVenta ) ); 
        toastRef &&  toastRef.current.show({ severity: 'success', detail: 'Producto agregado con exito' });
    }

    const deleteDetalleVenta = ( detalleVenta, rowIndex ) => {
      detalleVenta = {...detalleVenta, index: rowIndex};
      dispatch( onDeleteDetalleVenta( detalleVenta ) );
    }

    const setActiveVenta = ( venta ) => {
        dispatch( onSetActiveVenta( venta ) );
    }

    const setPageSelected = ( page ) => {
      dispatch( onSetPageSelected( page ) )
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

    const getEstadisticas = async( ) => {
        const { data } = await restauranteApi.get("ventas/estadisticas-hoy",);
        return data;
    }

    const getVentasPorProducto = async( ) => {
        const { data } = await restauranteApi.get("ventas/ventas-por-producto",);
        return data;
    }

    const getVentasPorSemana = async( ) => {
        const { data } = await restauranteApi.get("ventas/ventas-por-semana",);
        return data;
    }

  return {
    //*Properties
    ventas,
    activeVenta,
    isLoadingVentas,
    isVentaModalOpen,
    detalleVentas,
    totalRecords,
    pageSelected,


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
    eliminarVentaWS,
    pedidoFinalizado,
    pagarPedido,
    cambiarEstadoDv,
    cleanDetalleVenta,
    getEstadisticas,
    getVentasPorProducto,
    getVentasPorSemana,
    setPageSelected
  }
}
