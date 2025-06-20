'use client';
import DashboardHeader from "@/components/dashboardHeader";
import DashboardSubHeader from "@/components/dashboardSubHeader";
import Image from "next/image";
import arrow from "../../../../../public/assets/images/arrow-right.svg";
import limeArrow from "../../../../../public/assets/images/green arrow.png";
import doneImg from "../../../../../public/assets/images/doneImg.png";
import dashSlideImg from "../../../../../public/assets/images/dashSlideImg.png";
import { addShop } from "@/utils/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/toast";
import axios from 'axios';

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

interface PaymentData {
    authorizationUrl: string;
    reference: string;
    credoReference: string;
}

interface InitializePaymentResponse {
    status: string;
    message: string;
    data?: PaymentData;
    execTime?: number;
    error?: unknown[];
    errorMessage?: string;
}

interface InitializePaymentRequest {
    email: string;
    amount: number;
    currency: string;
    callbackUrl: string;
}

const SetupComplete = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [summaryData, setSummaryData] = useState({
        shopInfo: null as ShopInfo | null,
        personalInfo: null as PersonalInfo | null,
        bankInfo: null as BankInfo | null
    });

    // Toast state
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<"success" | "error">("success");
    const [toastMessage, setToastMessage] = useState("");
    const [toastSubMessage, setToastSubMessage] = useState("");

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
            showErrorToast('Setup Error', 'Error loading your information. Please go back and try again.');
        }
    }, []);

    const showSuccessToast = (message: string, subMessage: string) => {
        setToastType("success");
        setToastMessage(message);
        setToastSubMessage(subMessage);
        setShowToast(true);

        setTimeout(() => {
            setShowToast(false);
        }, 5000);
    };

    const showErrorToast = (message: string, subMessage: string) => {
        setToastType("error");
        setToastMessage(message);
        setToastSubMessage(subMessage);
        setShowToast(true);

        setTimeout(() => {
            setShowToast(false);
        }, 5000);
    };

    const handleCloseToast = () => {
        setShowToast(false);
    };

    // Initialize payment with backend API using axios
    const initializePayment = async (): Promise<string> => {
        try {
            const shopEmail = `ameliageorge215@gmail.com`;

            const requestData: InitializePaymentRequest = {
                email: shopEmail,
                amount: 500000, // Amount in kobo (NGN 5,000.00)
                currency: 'NGN',
                callbackUrl: `${window.location.origin}/vendor/dashboard2`
            };

            console.log('Initializing payment with data:', requestData);

            const response = await axios.post<InitializePaymentResponse>(
                'https://api.digitalmarke.bdic.ng/api/payments/initialize',
                requestData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 30000, // 30 seconds timeout
                }
            );

            console.log('Payment initialization response:', response.data);

            const paymentResponse = response.data;

            // Check if the response indicates success
            if (paymentResponse.status === '200' || paymentResponse.message === 'Successfully processed') {
                // Extract authorization URL from data structure
                const authorizationUrl = paymentResponse.data?.authorizationUrl;

                if (!authorizationUrl) {
                    console.error('Authorization URL not found in response:', paymentResponse);
                    throw new Error('Payment initialization successful but authorization URL not found');
                }

                console.log('Authorization URL found:', authorizationUrl);
                return authorizationUrl;
            } else {
                throw new Error(paymentResponse.errorMessage || paymentResponse.message || 'Payment initialization failed');
            }

        } catch (error) {
            console.error('Payment initialization error:', error);

            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // Server responded with error status
                    const errorMessage = error.response.data?.message || error.response.data?.errorMessage || 'Server error occurred';
                    showErrorToast('Payment Error', `${errorMessage} (Status: ${error.response.status})`);
                } else if (error.request) {
                    // Request was made but no response received
                    showErrorToast('Payment Error', 'No response from payment server. Please check your connection.');
                } else {
                    // Something else happened
                    showErrorToast('Payment Error', error.message);
                }
            } else {
                const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
                showErrorToast('Payment Error', errorMessage);
            }

            throw error;
        }
    };

    const handleSkip = async () => {
        setIsLoading(true);

        try {
            if (!summaryData.shopInfo || !summaryData.personalInfo || !summaryData.bankInfo) {
                throw new Error('Missing required information. Please complete all setup-shop steps.');
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

            showSuccessToast('Setup Complete', 'You have successfully skipped payment. Redirecting to dashboard...');

            setTimeout(() => {
                router.push("/vendor/dashboard2");
            }, 2000);

        } catch (error) {
            console.error('Error:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
            showErrorToast('Setup Error', errorMessage);
            setIsLoading(false);
        }
    }

    const handleContinue = async () => {
        setIsLoading(true);

        try {
            if (!summaryData.shopInfo || !summaryData.personalInfo || !summaryData.bankInfo) {
                throw new Error('Missing required information. Please complete all setup-shop steps.');
            }

            // First, add the shop
            const userId = 1; // Replace with actual userId from your auth system
            await addShop({
                shopInfo: summaryData.shopInfo,
                personalInfo: summaryData.personalInfo,
                bankInfo: summaryData.bankInfo,
                userId
            });

            console.log('Shop added successfully');
            showSuccessToast('Shop Added', 'Initializing payment...');

            // Clear localStorage after successful shop creation
            localStorage.removeItem('shopInfo');
            localStorage.removeItem('personalInfo');
            localStorage.removeItem('bankInfo');

            // Initialize payment and get authorization URL
            const authorizationUrl = await initializePayment();

            console.log('Redirecting to payment URL:', authorizationUrl);

            // Show success message and redirect to payment
            showSuccessToast('Payment Initialized', 'Redirecting to payment page...');

            setTimeout(() => {
                // Redirect to the authorization URL
                window.location.href = authorizationUrl;
            }, 2000);

        } catch (error) {
            console.error('Error in handleContinue:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
            showErrorToast('Setup Error', errorMessage);
            setIsLoading(false);
        }
    };

    const handleBack = () => router.push("/vendor/dashboard/bank-info");
    const returnToShopInfo = () => router.push("/vendor/dashboard/shop-info");
    const returnToPersonalInfo = () => router.push("/vendor/dashboard/personal-info");

    return (
        <>
            {showToast && (
                <Toast
                    type={toastType}
                    message={toastMessage}
                    subMessage={toastSubMessage}
                    onClose={handleCloseToast}
                />
            )}

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

                </div>
                <div className="flex flex-col w-[400px] h-auto gap-[38px]">
                    <div className="flex flex-col items-center h-[218px] w-full justify-center">
                        <Image src={doneImg} alt="setup complete image" />
                    </div>
                    <div>
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
                        <p onClick={handleSkip} className="text-[14px] mb-[30px] cursor-pointer text-center font-medium text-[#707070]">Skip for now</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SetupComplete;