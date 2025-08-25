'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, Suspense } from "react";
import axios from "axios";
import DashboardHeader from "@/components/dashboardHeader";
import DashboardOptions from "@/components/dashboardOptions";
import DashboardSubHeader from "@/components/dashboardSubHeader";
import dashSlideImg from "../../public/assets/images/dashSlideImg.png";
import Toast from "@/components/Toast";
import { useSearchParams } from "next/navigation";

interface ShopData {
    id: number;
    name: string;
    address: string;
    logoUrl: string;
    phone: string;
    shopNumber: string;
    homeAddress: string;
    streetName: string;
    cacNumber: string;
    taxIdNumber: string;
    nin: number;
    bankName: string;
    accountNumber: string;
    market: string;
    marketSectionId: number;
    firstName: string;
    status: string;
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
}

interface VerifyPaymentResponse {
    status: string;
    message: string;
    data?: {
        amount: number;
        currency: string;
        transactionDate: string;
        reference: string;
        status: string;
        paymentMethod: string;
        transAmount: number;
    };
}

interface VendorShopGuardProps {
    children: React.ReactNode;
    showHeader?: boolean;
    showDashboardOptions?: boolean;
    showSubHeader?: boolean;
}

const VendorShopGuardContent: React.FC<VendorShopGuardProps> = ({ 
    children, 
    showHeader = false, 
    showDashboardOptions = false, 
    showSubHeader = false 
}) => {
    const [shopData, setShopData] = useState<ShopData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activating, setActivating] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    
    // Toast state
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<"success" | "error">("success");
    const [toastMessage, setToastMessage] = useState("");
    const [toastSubMessage, setToastSubMessage] = useState("");

    const showSuccessToast = (message: string, subMessage: string) => {
        setToastType("success");
        setToastMessage(message);
        setToastSubMessage(subMessage);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
    };

    const showErrorToast = (message: string, subMessage: string) => {
        setToastType("error");
        setToastMessage(message);
        setToastSubMessage(subMessage);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
    };

    const handleCloseToast = () => setShowToast(false);

    const fetchShopData = useCallback(async () => {
        if (session?.user?.email) {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/shops/getbyEmail?email=${session.user.email}`);
                const data = response.data;
                setShopData(data);
            } catch (error) {
                console.error('Error fetching shop data:', error);
                setShopData(null);
            } finally {
                setLoading(false);
            }
        }
    }, [session]);

    useEffect(() => {
        fetchShopData();
    }, [fetchShopData]);

    const verifyShopStatus = useCallback(async (email: string) => {
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/shops/update-status`,
                null,
                {
                    params: {email},
                    headers: {'Content-Type': 'application/json'},
                    timeout: 30000,
                }
            );
            return response.status === 200;
        } catch (error) {
            console.error('Error verifying shop status:', error);
            return false;
        }
        finally {
            router.replace("/vendor/dashboard", undefined)
        }
    }, [router]);

    const verifyPayment = useCallback(async (transRef: string) => {
        try {
            const response = await axios.get<VerifyPaymentResponse>(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/verify/${transRef}`,
                {timeout: 30000}
            );

            if (response.data.data) {
                if (session?.user.email) {
                    const shopVerified = await verifyShopStatus(session.user.email);
                    if (shopVerified) {
                        showSuccessToast('Payment Successful', 'Your shop has been activated successfully');
                        await fetchShopData();
                    } else {
                        throw new Error('Shop verification failed');
                    }
                } else {
                    throw new Error('User email not found');
                }
            } else {
                throw new Error('Payment verification failed');
            }
        } catch (error) {
            console.error('Payment verification error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Payment verification failed';
            setPaymentError(errorMessage);
            showErrorToast('Payment Error', errorMessage);
        }
    }, [session, fetchShopData, verifyShopStatus]);

    useEffect(() => {
        const transRef = searchParams.get('transRef');
        if (transRef) {
            verifyPayment(transRef);
        }
    }, [searchParams, verifyPayment]);

    const initializePayment = async () => {
        if (!session?.user?.email) {
            showErrorToast('Error', 'User email not found');
            return;
        }

        setActivating(true);
        setPaymentError(null);

        try {
            const requestData = {
                email: session.user.email,
                amount: 500000,
                currency: 'NGN',
                callbackUrl: `${window.location.origin}/vendor/dashboard`,
                paymentType: 'SHOP_ACTIVATION'
            };

            const response = await axios.post<InitializePaymentResponse>(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/initialize`,
                requestData,
                {
                    headers: {'Content-Type': 'application/json'},
                    timeout: 30000,
                }
            );

            const paymentResponse = response.data;

            if (paymentResponse.status === '200' || paymentResponse.message === 'Successfully processed') {
                const authorizationUrl = paymentResponse.data?.authorizationUrl;

                if (!authorizationUrl) {
                    throw new Error('Authorization URL not found');
                }

                showSuccessToast('Payment Initialized', 'Redirecting to payment page...');
                setTimeout(() => {
                    window.location.href = authorizationUrl;
                }, 2000);
            } else {
                throw new Error(paymentResponse.message || 'Payment initialization failed');
            }
        } catch (error) {
            console.error('Payment initialization error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Payment initialization failed';
            setPaymentError(errorMessage);
            showErrorToast('Payment Error', errorMessage);
        } finally {
            setActivating(false);
        }
    };

    const handleActivateShop = async () => {
        await initializePayment();
    };

    if (loading) {
        return (
            <>
                {showHeader && <DashboardHeader/>}
                <div className="flex justify-center items-center h-screen">
                    <p>Loading...</p>
                </div>
            </>
        );
    }

    // Shop not set up yet
    if (!shopData) {
        return (
            <>
                {showHeader && <DashboardHeader/>}
                {showDashboardOptions && <DashboardOptions/>}
                {showSubHeader && (
                    <DashboardSubHeader 
                        welcomeText={"Hey, welcome"} 
                        description={"Explore your shop, products, sales and orders"}
                        background={'#ECFDF6'} 
                        image={dashSlideImg} 
                        textColor={'#05966F'}
                    />
                )}
                <div className="flex flex-col items-center justify-center h-screen">
                    <p className="mb-4">You need to set up your shop first</p>
                    <button
                        onClick={() => router.push('/vendor/setup-shop')}
                        className="h-[48px] w-[200px] flex items-center justify-center cursor-pointer bg-[#022B23] text-white rounded-[10px]"
                    >
                        Setup Shop
                    </button>
                </div>
            </>
        );
    }

    // Shop not activated yet
    if (shopData.status === 'NOT_VERIFIED') {
        return (
            <>
                {showHeader && <DashboardHeader/>}
                {showDashboardOptions && <DashboardOptions/>}
                {showSubHeader && (
                    <DashboardSubHeader 
                        welcomeText={"Hey, welcome"} 
                        description={"Explore your shop, products, sales and orders"}
                        background={'#ECFDF6'} 
                        image={dashSlideImg} 
                        textColor={'#05966F'}
                    />
                )}
                <div className="flex flex-col items-center justify-center h-screen">
                    <p className="mb-4">Your shop is not yet activated</p>
                    <button
                        onClick={handleActivateShop}
                        disabled={activating}
                        className={`h-[48px] w-[200px] flex items-center justify-center cursor-pointer bg-[#022B23] text-white rounded-[10px] ${
                            activating ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {activating ? 'Processing...' : 'Activate Shop'}
                    </button>
                    {paymentError && (
                        <p className="mt-2 text-red-500">{paymentError}</p>
                    )}
                </div>
                {showToast && (
                    <Toast
                        type={toastType}
                        message={toastMessage}
                        subMessage={toastSubMessage}
                        onClose={handleCloseToast}
                    />
                )}
            </>
        );
    }

    // Shop is set up and activated - render children with default headers
    return (
        <>
            {showHeader && <DashboardHeader/>}
            {showDashboardOptions && <DashboardOptions/>}
            {showSubHeader && (
                <DashboardSubHeader 
                    welcomeText={"Hey, welcome"} 
                    description={"Explore your shop, products, sales and orders"}
                    background={'#ECFDF6'} 
                    image={dashSlideImg} 
                    textColor={'#05966F'}
                />
            )}
            {children}
        </>
    );
};

const VendorShopGuard: React.FC<VendorShopGuardProps> = (props) => {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        }>
            <VendorShopGuardContent {...props} />
        </Suspense>
    );
};

export default VendorShopGuard;