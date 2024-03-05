import { Navigate, Route, Routes } from "react-router-dom";
import { RestauranteRoutes } from "../restaurante/routes/RestauranteRoutes";
import { AuthRoutes } from "../auth/routes/AuthRoutes";

export const AppRouter = () => {

    const status = 'checking';

  return (
        <Routes>
            {
                status === 'checking'
                ? <Route path="/*" element={<RestauranteRoutes/>} />
                : <Route path="/auth/*" element={<AuthRoutes/>} />

            }

                <Route path="/*" element={ <Navigate to="/auth/login" /> }/>
        </Routes>
  )
}
