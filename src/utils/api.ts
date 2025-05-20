// utils/api.ts
import axios, { AxiosError } from 'axios';

// Base URL for all API requests
export const API_BASE_URL = 'https://api.digitalmarke.bdic.ng/api';

// Get the auth token from localStorage or wherever you store it
const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('authToken');
    }
    return null;
};

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds
});

// Add request interceptor to include auth token on every request
apiClient.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with a status code outside of 2xx range
            console.error('API Error:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
                url: error.config?.url,
            });

            // Handle authentication errors (401)
            if (error.response.status === 401) {
                // Clear local storage and redirect to login
                localStorage.removeItem('authToken');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Fetch markets
export const fetchMarkets = async () => {
    try {
        const response = await apiClient.get('/markets');
        return response.data;
    } catch (error) {
        console.error('Error fetching markets:', error);
        throw new Error('Failed to fetch markets');
    }
};

// Fetch market sections
export const fetchMarketSections = async () => {
    try {
        const response = await apiClient.get('/market-sections');
        return response.data;
    } catch (error) {
        console.error('Error fetching market sections:', error);
        throw new Error('Failed to fetch market sections');
    }
};

// Fetch local governments
export const fetchLocalGovernments = async () => {
    try {
        const response = await apiClient.get('/local-governments');
        return response.data;
    } catch (error) {
        console.error('Error fetching local governments:', error);
        throw new Error('Failed to fetch local governments');
    }
};

// Add shop with proper error handling (for public endpoint)
export const addShop = async (formData: FormData) => {
    try {
        // For debugging - log the FormData keys (can't directly log all content as it may contain binary data)
        const formDataKeys: string[] = [];
        formData.forEach((value, key) => {
            formDataKeys.push(key);

            // Safely log JSON dto content if present
            if (key === 'dto') {
                try {
                    if (typeof value === 'string') {
                        console.log('DTO Content:', JSON.parse(value));
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (e) {
                    console.log('Could not parse DTO content');
                }
            }
        });
        console.log('FormData keys:', formDataKeys);

        // Direct API call without using the interceptor, since this is a public endpoint
        const response = await axios.post(
            `${API_BASE_URL}/shops/add`,
            formData,
            {
                headers: {
                    // Important: Let the browser set the correct Content-Type with boundary
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        console.log('Shop added successfully:', response.data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Error adding shop:', {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
            });

            // Provide more specific error messages based on status codes
            if (error.response?.status === 403) {
                throw new Error('Request forbidden. There might be an issue with the server configuration or CORS policy.');
            } else if (error.response?.status === 400) {
                const errorMsg = error.response.data?.message || JSON.stringify(error.response.data);
                throw new Error(`Invalid request: ${errorMsg}`);
            } else if (error.response?.status === 500) {
                throw new Error('Server error. Please try again later or contact support.');
            }
        }
        throw new Error('Failed to add shop. Please try again later.');
    }
};