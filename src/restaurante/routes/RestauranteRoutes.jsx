import { Navigate, Route, Routes } from "react-router-dom"
import { DashboardPage } from "../dashboard"
import { ProductoPage } from "../producto/pages/ProductoPage"
import { VentaPage } from "../venta/pages/VentaPage"
import { CategoriaPage } from "../categoria"
import { Navbar } from "../ui/components/Navbar"
import { PedidoPagadoPage, PedidoProcesoPage, PedidoTerminadoPage } from "../pedidos"


export const RestauranteRoutes = () => {
  return (
    <>

    <Navbar/>
    
    <Routes>
        <Route path="/" element={<DashboardPage/>} />
        <Route path="/categoria" element={<CategoriaPage/>} />
        <Route path="/producto" element={<ProductoPage/>} />
        <Route path="/venta" element={<VentaPage/>} />
        <Route path="/pedidop" element={<PedidoProcesoPage/>} />
        <Route path="/pedidot" element={<PedidoTerminadoPage/>} />
        <Route path="/pedidopa" element={<PedidoPagadoPage/>} />
        <Route path="/*" element={ <Navigate to="/"/> }/>
    </Routes>
    </>
    
  )
}
