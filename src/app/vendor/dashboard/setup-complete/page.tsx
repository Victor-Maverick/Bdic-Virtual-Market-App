'use client';
import DashboardHeader from "@/components/dashboardHeader";
import DashboardSubHeader from "@/components/dashboardSubHeader";
import Image from "next/image";
import arrow from "../../../../../public/assets/images/arrow-right.svg";
import limeArrow from "../../../../../public/assets/images/green arrow.png";
import doneImg from "../../../../../public/assets/images/doneImg.png";
import dashSlideImg from "../../../../../public/assets/images/dashSlideImg.png";
import { addShop } from "@/utils/api";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface ShopInfo {
    shopName: string;
    shopAddress: string;
    shopNumber: string;
    marketId: number;
    marketSectionId: number;
    cacNumber: string;
    taxIdNumber: string;
    logoImage?: string | null;
}

interface PersonalInfo {
    homeAddress: string;
    street: string;
    NIN: string;
    lgaId: number;
}

interface BankInfo {
    bankName: string;
    accountNumber: string;
}

interface CredoPaymentResponse {
    status: 'success' | 'failed' | 'pending';
    message: string;
    transactionRef: string;
    paymentRef: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    callbackUrl: string;
}

interface CredoWidgetHandler {
    openIframe: () => void;
}

declare global {
    interface Window {
        CredoWidget: {
            setup: (config: CredoConfig) => CredoWidgetHandler;
        };
    }
}

interface CredoConfig {
    key: string;
    customerFirstName: string;
    customerLastName: string;
    email: string;
    amount: number;
    currency: string;
    renderSize: number;
    channels: string[];
    reference: string;
    customerPhoneNumber: string;
    callbackUrl: string;
    onClose: () => void;
    callBack: (response: CredoPaymentResponse) => void;
}

const SetupComplete = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [summaryData, setSummaryData] = useState({
        shopInfo: null as ShopInfo | null,
        personalInfo: null as PersonalInfo | null,
        bankInfo: null as BankInfo | null
    });
    const credoHandler = useRef<CredoWidgetHandler | null>(null);

    useEffect(() => {
        if (document.querySelector('script[src="https://pay.credocentral.com/inline.js"]')) {
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://pay.credocentral.com/inline.js';
        script.async = true;
        script.onload = () => console.log('Credo script loaded successfully');
        script.onerror = () => setError('Failed to load payment processor');
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        try {
            const shopInfoStr = localStorage.getItem('shopInfo');
            const personalInfoStr = localStorage.getItem('personalInfo');
            const bankInfoStr = localStorage.getItem('bankInfo');

            setSummaryData({
                shopInfo: shopInfoStr ? JSON.parse(shopInfoStr) : null,
                personalInfo: personalInfoStr ? JSON.parse(personalInfoStr) : null,
                bankInfo: bankInfoStr ? JSON.parse(bankInfoStr) : null
            });
        } catch (err) {
            console.error('Error loading data from localStorage', err);
            setError('Error loading your information. Please go back and try again.');
        }
    }, []);

    const initializeCredo = (): boolean => {
        if (typeof window !== 'undefined' && window.CredoWidget) {
            const generateRandomNumber = (min: number, max: number) =>
                Math.floor(Math.random() * (max - min) + min);

            const transRef = `iy67f${generateRandomNumber(10, 60)}hvc${generateRandomNumber(10, 90)}`;

            credoHandler.current = window.CredoWidget.setup({
                key: process.env.NEXT_PUBLIC_CREDO_KEY || '0PUB0024x8k5w4TU1dq570Jb8zJn0dLH',
                customerFirstName: summaryData.personalInfo?.NIN?.split(' ')[0] || 'Customer',
                customerLastName: summaryData.personalInfo?.NIN?.split(' ')[1] || summaryData.shopInfo?.shopName || 'Shop',
                email: `${summaryData.shopInfo?.shopName.replace(/\s+/g, '')}@example.com` || 'customer@example.com',
                amount: 500000,
                currency: 'NGN',
                renderSize: 0,
                channels: ['card', 'bank'],
                reference: transRef,
                customerPhoneNumber: summaryData.shopInfo?.shopNumber || '08000000000',
                callbackUrl: `${window.location.origin}/vendor/dashboard2`,
                onClose: () => {
                    console.log('Widget Closed');
                    setIsLoading(false);
                },
                callBack: (response: CredoPaymentResponse) => {
                    console.log('Payment response:', response);
                    if (response.status === 'success') {
                        router.push(response.callbackUrl);
                    } else {
                        setError(`Payment failed: ${response.message}`);
                        setIsLoading(false);
                    }
                },
            });
            return true;
        }
        return false;
    };

    const handleContinue = async () => {
        setIsLoading(true);
        setError(null);

        try {
            if (!summaryData.shopInfo || !summaryData.personalInfo || !summaryData.bankInfo) {
                throw new Error('Missing required information. Please complete all setup steps.');
            }

            const userId = 1; // Replace with actual userId from your auth system
            await addShop({
                shopInfo: summaryData.shopInfo,
                personalInfo: summaryData.personalInfo,
                bankInfo: summaryData.bankInfo,
                userId
            });

            localStorage.removeItem('shopInfo');
            localStorage.removeItem('personalInfo');
            localStorage.removeItem('bankInfo');

            const initialized = initializeCredo();
            if (initialized && credoHandler.current) {
                credoHandler.current.openIframe();
            } else {
                throw new Error('Payment service could not be initialized. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError(error instanceof Error ? error.message : 'An unexpected error occurred.');
            setIsLoading(false);
        }
    };

    const handleBack = () => router.push("/vendor/dashboard/bank-info");
    const returnToShopInfo = () => router.push("/vendor/dashboard/shop-info");
    const returnToPersonalInfo = () => router.push("/vendor/dashboard/personal-info");

    return (
        <>
            <DashboardHeader />
            <DashboardSubHeader
                welcomeText="Hey, welcome"
                description="Get started by setting up your shop"
                background="#ECFDF6"
                image={dashSlideImg}
                textColor="#05966F"
            />
            <div className="h-[44px] gap-[8px] border-b-[0.5px] px-25 border-[#ededed] flex items-center">
                <Image src={arrow} alt="arrow image" className="cursor-pointer" onClick={handleBack} />
                <p className="text-[14px] font-normal">
                    <span className="cursor-pointer" onClick={returnToShopInfo}>Shop information //</span>
                    <span className="cursor-pointer" onClick={returnToPersonalInfo}> Vendor information //</span>
                    <span className="cursor-pointer" onClick={handleBack}> Bank Details //</span>
                    <span className="cursor-pointer font-medium"> Complete</span>
                </p>
            </div>
            <div className="flex ml-[366px] w-auto mt-16 gap-25">
                <div className="flex flex-col gap-15 h-auto">
                    <div className="flex flex-col w-[268px] h-[67px] gap-[10px]">
                        <p className="text-[#022B23] text-[16px] font-medium">Setup complete</p>
                        <p className="text-[#707070] font-medium text-[14px]">
                            Your setup is complete and pending approval, you&#39;ll be notified when approved.
                        </p>
                    </div>
                    <div className="flex flex-col w-[244px] py-[10px] px-[12px] border border-[#ededed] h-[87px] bg-[#FCFCFC] rounded-[12px] gap-[7px]">
                        <p className="text-[#707070] text-[14px] font-medium leading-tight">
                            Pay a store activation fee<br />
                            to continue
                        </p>
                        <p className="text-[#000000] font-semibold text-[20px]">
                            NGN 5,000.00
                        </p>
                    </div>
                    {error && (
                        <div className="w-[268px] mt-4 p-3 bg-red-50 border border-red-200 rounded-[12px] text-red-700 text-[14px]">
                            {error}
                        </div>
                    )}
                </div>
                <div className="flex flex-col w-[400px] h-auto gap-[38px]">
                    <div className="flex flex-col items-center h-[218px] w-full justify-center">
                        <Image src={doneImg} alt="setup complete image" />
                    </div>
                    <button
                        className={`flex mb-[20px] gap-[9px] justify-center items-center bg-[#022B23] rounded-[12px] h-[52px] cursor-pointer hover:bg-[#033a30] transition-colors w-full ${
                            isLoading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                        onClick={handleContinue}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <p className="text-[#C6EB5F] font-semibold text-[14px]">Processing...</p>
                            </div>
                        ) : (
                            <>
                                <p className="text-[#C6EB5F] font-semibold text-[14px]">Continue to payment</p>
                                <Image src={limeArrow} alt="Continue arrow" width={18} height={18} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
};

export default SetupComplete;