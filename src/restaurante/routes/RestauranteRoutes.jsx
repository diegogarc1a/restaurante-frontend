import { Navigate, Route, Routes } from "react-router-dom"
import { DashboardPage } from "../dashboard"
import { ProductoPage } from "../producto/pages/ProductoPage"
import { VentaPage } from "../venta/pages/VentaPage"
import { CategoriaPage } from "../categoria"
import { Navbar } from "../ui/components/Navbar"
import { PedidoPage } from "../pedidos"


export const RestauranteRoutes = () => {
  return (
    <>

    <Navbar/>
    
    <Routes>
        <Route path="/" element={<DashboardPage/>} />
        <Route path="/categoria" element={<CategoriaPage/>} />
        <Route path="/producto" element={<ProductoPage/>} />
        <Route path="/venta" element={<VentaPage/>} />
        <Route path="/pedido" element={<PedidoPage/>} />
        <Route path="/*" element={ <Navigate to="/"/> }/>
    </Routes>
    </>
    
  )
}
