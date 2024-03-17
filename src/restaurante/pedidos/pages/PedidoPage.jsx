import { useEffect } from "react";
import { useVentaStore } from "../../../hooks"
import { DataViewPedidos } from "../components/DataViewPedidos";
import { DataViewPedidosTable } from "../components/DataViewPedidosTable";

export const PedidoPage = () => {
  
   const { startLoadingVentas } = useVentaStore();

   useEffect(() => {
    startLoadingVentas();
  }, []);

return (
    <DataViewPedidos/>
    // <DataViewPedidosTable/>
  )
}