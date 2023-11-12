import axios from 'axios';
import Cookies from "universal-cookie";

const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";

axios.defaults.headers.common['Accept'] = 'application/json';

const addInterceptor = (instant) => {
    const cookies = new Cookies();

    instant.interceptors.request.use(
        (config) => {
            if (!config?.headers?.Authorization) {
                const token = cookies.get("TOKEN");
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                } else {
                    config.headers.Authorization = '';
                }
            }
            return config;
        },
        (err) => Promise.reject(err),
    );

    instant.interceptors.response.use(
        async (response) => {
            const { code } = response
            if (code === 401 || (code === 500 && !response.config.headers.Authorization)) {
                cookies.remove("TOKEN");
            }
            return response;
        },
        (err) => {
            if (err.response?.status === 401) {
                cookies.remove("TOKEN");
                window.location.href = '/login'
            }
            return Promise.reject(err)
        }
    )
    return instant;
}

const createInstance = (api) => {
    const instant = axios.create({
        baseURL: api,
    });

    addInterceptor(instant);

    return instant;
}

export const instanceCoreApi = createInstance(API);

export default function setupAxiosDefault() {
    axios.defaults.baseURL = API;
    addInterceptor(axios);
}