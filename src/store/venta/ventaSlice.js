import { createSlice } from '@reduxjs/toolkit';
export const ventaSlice = createSlice({
    name: 'venta',
    initialState: {
        isLoadingVentas: true,
        ventas : [],
        detalleVentas: [],
        activeVenta : null,
        isVentaModalOpen : false,
    },
    reducers: {
        onSetActiveVenta: (state, { payload }) =>{
            state.activeVenta = payload;
        },
        onAddNewVenta: (state, { payload }) => {
            
            //Para que el websocket no tenga problemas de duplicacion de muestra en pedidos
            const exists = state.ventas.some( dbVen => dbVen.id === payload.id );
            if ( !exists ){
            state.ventas.push( payload );
            }
                
            // state.ventas.push(payload);
            state.detalleVentas = [];
            state.activeVenta = null;
        },
        onUpdateVenta: (state, { payload }) => {
            state.ventas = state.ventas.map( venta => {
                if( venta.id === payload.id ){
                    return payload;
                }
                return venta;
            } )
            state.activeVenta = null;
        },
        onDeleteVenta: (state, { payload }) => {
            state.ventas = state.ventas.filter( ven => ven.id !== payload.id);
            state.activeVenta = null;
        },
        onLoadVentas: (state, { payload = [] }) => {
            state.isLoadingVentas = false;
            payload.forEach( ven => {
                const exists = state.ventas.some( dbVen => dbVen.id === ven.id );
                if ( !exists ){
                    state.ventas.push( ven );
                }
            } )
        },
        onAddNewDetalleVenta: (state, { payload }) => {
            // state.detalleVentas.push(payload);
            const index = state.detalleVentas.findIndex(detalle => detalle.producto.id === payload.producto.id &&
                detalle.descripcion === payload.descripcion );

            if (index !== -1) {
                // Si el detalle de venta ya existe, actualiza su cantidad
                state.detalleVentas[index].cantidad += payload.cantidad;
            } else {
                // Si el detalle de venta no existe, agrega el nuevo detalle
                state.detalleVentas.push(payload);
            }
        },
        onUpdateDetalleVenta: (state, { payload }) => {
            state.detalleVentas[payload.id] = payload;
        },
        onLogoutVenta: ( state ) => {
            state.isLoadingVentas= true,
            state.ventas= [],
            state.activeVenta= null
        }
        ,onOpenVentaModal: ( state ) => {
            state.isVentaModalOpen = true;
        },
        onCloseVentaModal: ( state ) => {
            state.isVentaModalOpen = false;
            state.activeVenta = null;
        }
    }
});

// Action creators are generated for each case reducer function
export const { 
    onSetActiveVenta, 
    onAddNewVenta, 
    onUpdateVenta, 
    onDeleteVenta, 
    onLoadVentas,
    onAddNewDetalleVenta,
    onUpdateDetalleVenta,
    onLogoutVenta,
    onOpenVentaModal,
    onCloseVentaModal
} = ventaSlice.actions;