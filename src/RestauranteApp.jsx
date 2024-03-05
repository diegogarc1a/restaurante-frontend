import { BrowserRouter } from "react-router-dom"
import { AppRouter } from "./router/AppRouter"

export const RestauranteApp = () => {
  return (
    <BrowserRouter>
      <AppRouter/>
    </BrowserRouter>
  )
}
