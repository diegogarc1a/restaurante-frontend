import { BrowserRouter } from "react-router-dom"
import { AppRouter } from "./router/AppRouter"
import { Provider } from "react-redux"
import { store } from "./store/store"
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-blue/theme.css";
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';


export const RestauranteApp = () => {
  return (
    
    <Provider store={ store }>
      <BrowserRouter>
        <PrimeReactProvider>
          <AppRouter/>
        </PrimeReactProvider>
      </BrowserRouter>
    </Provider>
  )
}
