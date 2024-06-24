import { useEffect } from "react";
import { useVentaStore } from "../../../hooks"
import { DataViewPedidos } from "../components/DataViewPedidos";
import { NavigationDropdown } from "../components/NavigationDropdown";

export const PedidoProcesoPage = () => {
  
   const { startLoadingVentas } = useVentaStore();

   useEffect(() => {
    startLoadingVentas('',100,'Proceso');
  }, []);

return (  
  <>
    <NavigationDropdown/>
    <DataViewPedidos estado='Proceso'/>
  </>
  )
}