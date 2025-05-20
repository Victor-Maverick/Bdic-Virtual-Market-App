// utils/api.ts
import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'https://api.digitalmarke.bdic.ng/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchMarkets = async () => {
    try {
        const response = await api.get('/markets/all');
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error('Error fetching markets:', error.message);
        } else {
            console.error('Unexpected error fetching markets:', error);
        }
        throw new Error('Failed to fetch markets');
    }
};

export const fetchMarketSections = async () => {
    try {
        const response = await api.get('/market-sections/all');
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error('Error fetching market sections:', error.message);
        } else {
            console.error('Unexpected error fetching market sections:', error);
        }
        throw new Error('Failed to fetch market sections');
    }
};

export const fetchLocalGovernments = async () => {
    try {
        const response = await api.get('/local-governments/all');
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error('Error fetching local governments:', error.message);
        } else {
            console.error('Unexpected error fetching local governments:', error);
        }
        throw new Error('Failed to fetch local governments');
    }
};

export const addShop = async (formData: FormData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/shops/add`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error('Error adding shop:', error.message);
        } else {
            console.error('Unexpected error adding shop:', error);
        }
        throw new Error('Failed to add shop');
    }
};