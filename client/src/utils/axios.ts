import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";


// const ENDPOINT = "https://e-magazine.onrender.com/api/v1";
const ENDPOINT = "http://localhost:8080/api/v1";


const axiosInstance: AxiosInstance = axios.create({
  baseURL: ENDPOINT,
});

axiosInstance.interceptors.request.use(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const token: string | null = localStorage.getItem("token");

    if (!token) localStorage.removeItem("token");

    config.headers = {
      ...config.headers,
      Authorization: token ? `Bearer ${token}` : "",
    };

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => Promise.reject(error),
);

export default axiosInstance;
