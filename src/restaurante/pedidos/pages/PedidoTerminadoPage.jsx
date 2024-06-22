import { useEffect,  } from "react";
import { useVentaStore } from "../../../hooks";
import { DataViewPedidos } from "../components/DataViewPedidos";
import { NavigationDropdown } from "../components/NavigationDropdown";

export const PedidoTerminadoPage = () => {

  const { startLoadingVentas } = useVentaStore();


  useEffect(() => {
    startLoadingVentas('','','Terminado');
}, []);

  return (
    <>
    <NavigationDropdown/>
    <DataViewPedidos estado='Terminado'/>
    </>
  )
}
