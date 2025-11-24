import axios from "axios";
import { getBaseApiUrl } from "./GetBaseApiUrl";
import {
    error_message_for_execution_file_is_not_running,
    error_message_for_exe_file_not_running,
    network_error_message_for_batch_file_is_not_running,
    public_address_api_url,
    public_address_api_url_for_desktop_application,
} from "../shared/constants/AppConstants";

const api = (isDesktop?: boolean, isMobile?: boolean) => {
    let baseURL = '';

    if (isDesktop) {
        baseURL = public_address_api_url_for_desktop_application;
    } else if (isMobile) {
        baseURL = public_address_api_url;
    } else {
        console.log("web application else block in authheader");
        baseURL = getBaseApiUrl();
    }

    const unAuthoraizedUrl = '/sessiontimeout';

    const instance = axios.create({ baseURL });

    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            if (config.data instanceof FormData) {
                delete config.headers['Content-Type'];
            } else {
                config.headers['Content-Type'] = 'application/json';
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (
                error?.config?.baseURL === public_address_api_url &&
                error?.message === network_error_message_for_batch_file_is_not_running
            ) {
                throw error_message_for_execution_file_is_not_running;
            }

            if (
                error?.config?.baseURL === public_address_api_url_for_desktop_application &&
                error?.message === network_error_message_for_batch_file_is_not_running
            ) {
                throw error_message_for_exe_file_not_running;
            }

            if (error.response?.status === 401 && window.location.pathname !== unAuthoraizedUrl) {
                window.location.href = unAuthoraizedUrl;
            }

            function delay(ms: any) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
            async function handledelay() {
                if (error.response.status === 401) {
                    await delay(1000000);
                } else {
                    await delay(100);
                }
                return Promise.reject(error);
            }
            await handledelay();
        }
    );

    return instance;
};

export default api;
