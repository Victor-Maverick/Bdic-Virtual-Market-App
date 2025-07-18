import axios, { AxiosError } from 'axios';

// Initialize axios with proper base URL
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Utility function for handling errors
const handleApiError = (error: unknown, context: string) => {
    if (error instanceof AxiosError) {
        console.error(`Error ${context}:`, error.message, error.response?.data);
        throw new Error(error.response?.data?.message || `Failed to ${context}`);
    } else {
        console.error(`Unexpected error ${context}:`, error);
        throw new Error(`Failed to ${context} due to an unexpected error`);
    }
};

// API functions
export const fetchMarkets = async () => {
    try {
        const response = await api.get('markets/all');
        return response.data;
    } catch (error) {
        handleApiError(error, 'fetching markets');
    }
};

export const fetchStates = async () => {
    try {
        const response = await api.get('states/all');
        return response.data;
    } catch (error) {
        handleApiError(error, 'fetching states');
    }
};

export const fetchMarketSections = async () => {
    try {
        const response = await api.get('market-sections/all');
        return response.data;
    } catch (error) {
        handleApiError(error, 'fetching market sections');
    }
};

export const fetchLocalGovernments = async () => {
    try {
        const response = await api.get('local-governments/all');
        return response.data;
    } catch (error) {
        handleApiError(error, 'fetching local governments');
    }
};

export const addShop = async (shopData: {
    shopInfo: {
        shopName: string;
        shopAddress: string;
        shopNumber: string;
        marketId: number;
        marketSectionId: number;
        cacNumber: string;
        taxIdNumber: string;
        logoImage?: string | null;
    };
    personalInfo: {
        homeAddress: string;
        street: string;
        NIN: string;
        phone: string;
        lgaId: number;
    };
    bankInfo: {
        bankName: string;
        accountNumber: string;
    };
    email: string;
}) => {
    try {
        const formData = new FormData();

        // Shop details
        formData.append('name', shopData.shopInfo.shopName);
        formData.append('address', shopData.shopInfo.shopAddress);
        formData.append('shopNumber', shopData.shopInfo.shopNumber);
        formData.append('cacNumber', shopData.shopInfo.cacNumber);
        formData.append('taxIdNumber', shopData.shopInfo.taxIdNumber);

        // Personal details
        formData.append('homeAddress', shopData.personalInfo.homeAddress);
        formData.append('streetName', shopData.personalInfo.street);
        formData.append('nin', shopData.personalInfo.NIN);
        formData.append('phone', shopData.personalInfo.phone);

        // Bank details
        formData.append('bankName', shopData.bankInfo.bankName);
        formData.append('accountNumber', shopData.bankInfo.accountNumber);

        // IDs
        formData.append('marketId', shopData.shopInfo.marketId.toString());
        formData.append('marketSectionId', shopData.shopInfo.marketSectionId.toString());
        formData.append('email', shopData.email);

        // Handle logo image
        if (shopData.shopInfo.logoImage) {
            if (shopData.shopInfo.logoImage.startsWith('data:image')) {
                const response = await fetch(shopData.shopInfo.logoImage);
                const blob = await response.blob();
                formData.append('logoImage', blob, 'shop_logo.jpg');
            } else {
                formData.append('logoImage', shopData.shopInfo.logoImage);
            }
        }

        const response = await api.post('shops/add', formData);
        return response.data;
    } catch (error) {
        handleApiError(error, 'add shop');
    }
};

// Add more API functions as needed