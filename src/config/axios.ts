import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

class ApiClient {
    private static instance: AxiosInstance;
    private static isRefreshing = false;
    private static refreshSubscribers: ((token: string) => void)[] = [];

    private static subscribeTokenRefresh(cb: (token: string) => void) {
        this.refreshSubscribers.push(cb);
    }

    private static onTokenRefreshed(token: string) {
        this.refreshSubscribers.forEach(cb => cb(token));
        this.refreshSubscribers = [];
    }

    public static getInstance(): AxiosInstance {
        if (!this.instance) {
            this.instance = axios.create({
                baseURL: 'http://localhost:8080/api/v1',
                withCredentials: true
            });

            this.setupInterceptors();
        }
        return this.instance;
    }

    public static getMultipartInstance(): AxiosInstance {
        const instance = this.getInstance();
        const multipartInstance = axios.create({
            ...instance.defaults,
            headers: {
                ...instance.defaults.headers,
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        });

        // 인터셉터 재사용
        multipartInstance.interceptors.request = instance.interceptors.request;
        multipartInstance.interceptors.response = instance.interceptors.response;

        return multipartInstance;
    }

    private static async refreshToken() {
        try {
            const response = await axios.post<{ accessToken: string }>(
                'http://localhost:8080/api/v1/auth/refresh',
                {},
                { withCredentials: true }
            );
            const newToken = response.data.accessToken;
            localStorage.setItem('accessToken', newToken);
            return newToken;
        } catch (error) {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
            throw error;
        }
    }

    private static setupInterceptors() {
        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    config.headers.set('Authorization', `Bearer ${token}`);
                }
                return config;
            },
            error => Promise.reject(error)
        );

        this.instance.interceptors.response.use(
            response => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as CustomInternalAxiosRequestConfig;
                if (!originalRequest) {
                    return Promise.reject(error);
                }

                if (error.response?.status === 403 && !originalRequest._retry) {
                    if (this.isRefreshing) {
                        return new Promise(resolve => {
                            this.subscribeTokenRefresh(token => {
                                originalRequest.headers.set('Authorization', `Bearer ${token}`);
                                resolve(this.instance(originalRequest));
                            });
                        });
                    }

                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    try {
                        const newToken = await this.refreshToken();
                        this.onTokenRefreshed(newToken);
                        originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
                        this.isRefreshing = false;
                        return this.instance(originalRequest);
                    } catch (refreshError) {
                        this.isRefreshing = false;
                        localStorage.removeItem('accessToken');
                        window.location.href = '/login';
                        return Promise.reject(refreshError);
                    }
                }

                if (error.response?.status === 401) {
                    localStorage.removeItem('accessToken');
                    window.location.href = '/login';
                }

                return Promise.reject(error);
            }
        );
    }
}

export const api = ApiClient.getInstance();
export const multipartApi = ApiClient.getMultipartInstance();