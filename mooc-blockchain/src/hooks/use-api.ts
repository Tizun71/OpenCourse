import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const api = axios.create({
    baseURL: process.env.BACKEND_API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

export const useApi = () => {
    // GET request
    const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
      const response: AxiosResponse<T> = await api.get(url, config);
      return response.data;
    };
  
    // POST request
    const post = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
      const response: AxiosResponse<T> = await api.post(url, data, config);
      return response.data;
    };
  
    // PUT request
    const put = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
      const response: AxiosResponse<T> = await api.put(url, data, config);
      return response.data;
    };
  
    // DELETE request
    const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
      const response: AxiosResponse<T> = await api.delete(url, config);
      return response.data;
    };
  
    return {
      get,
      post,
      put,
      delete: del,
    };
  };