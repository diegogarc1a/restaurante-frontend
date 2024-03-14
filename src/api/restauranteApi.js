import axios from "axios";
import { getEnvVariables } from '../helpers'
import Swal from "sweetalert2";

const { VITE_API_URL } = getEnvVariables();

const restauranteApi = axios.create({
    baseURL : VITE_API_URL
});

restauranteApi.interceptors.response.use(
    response => response,
    error => {
        const errorMessage = Object.values(error.response.data).map(value => value).join('<br>');
        Swal.fire('Error al eliminar', errorMessage, 'error');
        return Promise.reject(error);
    }
)

export default restauranteApi;