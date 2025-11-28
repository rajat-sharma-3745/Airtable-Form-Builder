import axios from 'axios';
import { server } from '../utils/apiPaths';

const axiosInstance = axios.create({
    baseURL:server,
    withCredentials:true
})


export default axiosInstance;