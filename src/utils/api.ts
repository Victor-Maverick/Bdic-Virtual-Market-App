//utils/api.ts
import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'https://digitalmarket.benuestate.gov.ng/api';

const api = axios.create({
    baseURL: API_BASE_URL,
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

export const fetchStates = async () => {
    try {
        const response = await api.get('/states/all');
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error('Error fetching states:', error.message);
        } else {
            console.error('Unexpected error fetching states:', error);
        }
        throw new Error('Failed to fetch states');
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
        console.log("lgas: ",response.data)
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

// add Shop
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
        // Create FormData object to match the API expectations
        const formData = new FormData();

        // Add shop details
        formData.append('name', shopData.shopInfo.shopName);
        formData.append('address', shopData.shopInfo.shopAddress);
        formData.append('shopNumber', shopData.shopInfo.shopNumber);
        formData.append('cacNumber', shopData.shopInfo.cacNumber);
        formData.append('taxIdNumber', shopData.shopInfo.taxIdNumber);

        // Add personal details
        formData.append('homeAddress', shopData.personalInfo.homeAddress);
        formData.append('streetName', shopData.personalInfo.street);
        formData.append('nin', shopData.personalInfo.NIN);
        formData.append('phone', shopData.personalInfo.phone);

        // Add bank details
        formData.append('bankName', shopData.bankInfo.bankName);
        formData.append('accountNumber', shopData.bankInfo.accountNumber);

        // Add IDs
        formData.append('marketId', shopData.shopInfo.marketId.toString());
        formData.append('marketSectionId', shopData.shopInfo.marketSectionId.toString());
        formData.append('email', shopData.email);

        // Add logo image if available
        if (shopData.shopInfo.logoImage) {
            // Handle logo image conversion from base64 to file
            try {
                // If it's a base64 string (from previous localStorage)
                if (shopData.shopInfo.logoImage.startsWith('data:image')) {
                    const response = await fetch(shopData.shopInfo.logoImage);
                    const blob = await response.blob();
                    formData.append('logoImage', blob, 'shop_logo.jpg');
                } else {
                    formData.append('logoImage', shopData.shopInfo.logoImage);
                }
            } catch (err) {
                console.error('Error processing logo image:', err);
            }
        }

        // Use native axios for FormData to avoid custom headers
        const response = await axios.post(`${API_BASE_URL}/shops/add`, formData);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error('Error adding shop:', error.message, error.response?.data);
            throw new Error(error.response?.data?.message || 'Failed to add shop');
        } else {
            console.error('Unexpected error adding shop:', error);
            throw new Error('Failed to add shop due to an unexpected error');
        }
    }
};

