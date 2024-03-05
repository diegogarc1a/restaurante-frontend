import { Navigate, Route, Routes } from "react-router-dom"
import { DashboardPage } from "../dashboard"
import { CategoriaPage } from "../categoria/pages/CategoriaPage"
import { ProductoPage } from "../producto/pages/ProductoPage"
import { VentaPage } from "../venta/pages/VentaPage"


export const RestauranteRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<DashboardPage/>} />
        <Route path="/categoria" element={<CategoriaPage/>} />
        <Route path="/producto" element={<ProductoPage/>} />
        <Route path="/venta" element={<VentaPage/>} />
        <Route path="/*" element={ <Navigate to="/"/> }/>
    </Routes>
  )
}
