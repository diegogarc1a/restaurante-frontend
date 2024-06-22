import { DataViewPedidosPagado } from "../components/DataViewPedidosPagado"
import { NavigationDropdown } from "../components/NavigationDropdown"

export const PedidoPagadoPage = () => {

  return (
    <>
    <NavigationDropdown/>
    <DataViewPedidosPagado estado='Pagado' />
    </>
  )
}
