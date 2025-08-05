'use client'
import {useCallback, useEffect, useState} from "react";
import Image from "next/image";
import VendorShopGuard from "@/components/VendorShopGuard";
import arrowBack from '@/../public/assets/images/arrow-right.svg'
import crownImg from '@/../public/assets/images/crown.svg'
import gradient1 from '@/../public/assets/images/promote gradient 1.svg'
import gradient2 from '@/../public/assets/images/promote gradient 2.svg'
import gradient3 from '@/../public/assets/images/promote gradient 3.png'
import greenTick from '@/../public/assets/images/promote checkmark.svg'
import limeArrow from '@/../public/assets/images/green arrow.png'
import {useSession} from "next-auth/react";
import {useRouter, useSearchParams} from "next/navigation";
import axios from "axios";
import Toast from "@/components/Toast";

interface ApiTier {
    id: number;
    tier: string;
    price: number;
    shopsPromoted: number;
    featuredNumber: number;
    promotedNumber: number;
    floatedNumber: number;
    updateTime: string;
}

interface ShopData {
    id: number;
    promotedStatus: string;
    promotedTierId?: number;
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
    error?: unknown[];
    errorMessage?: string;
}

interface InitializePaymentRequest {
    email: string;
    amount: number;
    currency: string;
    callbackUrl: string;
    paymentType: string;
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

interface PromoteShopRequest {
    shopId: number;
    tierId: number;
}

const PromoteShop = () => {
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [selectedTierInModal, setSelectedTierInModal] = useState<ApiTier>();
    const [tiers, setTiers] = useState<ApiTier[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { data: session } = useSession();
    const [shopData, setShopData] = useState<ShopData | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isVerifying, setIsVerifying] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<"success" | "error">("success");
    const [toastMessage, setToastMessage] = useState("");
    const [toastSubMessage, setToastSubMessage] = useState("");
    const [isProcessingPayment, setIsProcessingPayment] = useState(false); // You're using this, so keep it


    const storeTotalAmount = (amount: number) => {
        const paymentData = {
            amount,
            timestamp: new Date().getTime()
        };
        localStorage.setItem('expectedPromotionPayment', JSON.stringify(paymentData));
    };

    const getStoredTotalAmount = (): number | null => {
        const paymentData = localStorage.getItem('expectedPromotionPayment');
        if (!paymentData) return null;

        const { amount, timestamp } = JSON.parse(paymentData);

        if (new Date().getTime() - timestamp > 24 * 60 * 60 * 1000) {
            localStorage.removeItem('expectedPromotionPayment');
            return null;
        }

        return amount;
    };

    const clearStoredTotalAmount = () => {
        localStorage.removeItem('expectedPromotionPayment');
    };

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

    const fetchShopData = useCallback(async () => {
        if (session?.user?.email) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/shops/getbyEmail?email=${session.user.email}`);
                const data = await response.json();
                setShopData(data);
            } catch (error) {
                console.error('Error fetching shop data:', error);
            }
        }
    }, [session]);

    const fetchTiers = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/shops/all-tiers`);
            if (!response.ok) {
                throw new Error('Failed to fetch tiers');
            }
            const data: ApiTier[] = await response.json();
            setTiers(data);
            setSelectedTierInModal(data[0]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch tiers');
        } finally {
            setLoading(false);
        }
    };

    const promoteShop = useCallback(async () => {
        if (!shopData?.id || !selectedTierInModal?.id) {
            throw new Error('Shop ID or tier information missing');
        }

        try {
            const request: PromoteShopRequest = {
                shopId: shopData.id,
                tierId: selectedTierInModal.id
            };

            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/shops/promote`,
                request,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 30000,
                }
            );

            if (response.status !== 200) {
                throw new Error('Failed to promote shop');
            }

            return true;
        } catch (error) {
            console.error('Error promoting shop:', error);
            throw error;
        }
    }, [shopData?.id, selectedTierInModal?.id]);

    const initializePayment = async (): Promise<string> => {
        if (!session?.user?.email || !selectedTierInModal) {
            throw new Error('User not authenticated or tier not selected');
        }

        try {
            const requestData: InitializePaymentRequest = {
                email: session.user.email,
                amount: selectedTierInModal.price * 100,
                currency: 'NGN',
                callbackUrl: `${window.location.origin}/vendor/dashboard/reviews/promote-shop`,
                paymentType: "SHOP_PROMOTION"
            };

            storeTotalAmount(selectedTierInModal.price);

            const response = await axios.post<InitializePaymentResponse>(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/initialize`,
                requestData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 30000,
                }
            );

            const paymentResponse = response.data;

            if (paymentResponse.status === '200' || paymentResponse.message === 'Successfully processed') {
                const authorizationUrl = paymentResponse.data?.authorizationUrl;

                if (!authorizationUrl) {
                    throw new Error('Payment initialization successful but authorization URL not found');
                }

                return authorizationUrl;
            } else {
                throw new Error(paymentResponse.errorMessage || paymentResponse.message || 'Payment initialization failed');
            }
        } catch (error) {
            console.error('Payment initialization error:', error);

            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const errorMessage = error.response.data?.message || error.response.data?.errorMessage || 'Server error occurred';
                    showErrorToast('Payment Error', `${errorMessage} (Status: ${error.response.status})`);
                } else if (error.request) {
                    showErrorToast('Payment Error', 'No response from payment server. Please check your connection.');
                } else {
                    showErrorToast('Payment Error', error.message);
                }
            } else {
                const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
                showErrorToast('Payment Error', errorMessage);
            }

            throw error;
        }
    };


    const verifyPayment = useCallback(async (transRef: string) => {
        setIsVerifying(true);
        setPaymentError(null);

        try {
            // Wait for session to be available
            let attempts = 0;
            const maxAttempts = 10; // ~5 seconds with 500ms interval
            while (!session?.user?.email && attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 500));
                attempts++;
            }

            if (!session?.user?.email) {
                throw new Error('User authentication timed out');
            }

            const response = await axios.get<VerifyPaymentResponse>(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/verify/${transRef}`,
                { timeout: 30000 }
            );

            if (response.data.data) {
                const paymentData = response.data.data;
                const expectedAmount = getStoredTotalAmount();

                if (expectedAmount && Math.abs(paymentData.transAmount - expectedAmount) > 0.01) {
                    throw new Error('Payment amount does not match expected amount');
                }

                await promoteShop();
                clearStoredTotalAmount();
                showSuccessToast('Payment Successful', 'Your shop has been promoted successfully');
                await fetchShopData();

                // Redirect to reviews page after successful promotion
                setTimeout(() => {
                    router.replace('/vendor/dashboard/reviews');
                }, 2000); // Wait 2 seconds to show the success toast
            } else {
                throw new Error('Payment verification failed');
            }
        } catch (error) {
            console.error('Payment verification error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Payment verification failed';
            setPaymentError(errorMessage);
            showErrorToast('Payment Error', errorMessage);
        } finally {
            setIsVerifying(false);
        }
    }, [session, fetchShopData, promoteShop, router]);


    const handleMakePayment = async () => {
        setIsProcessingPayment(true);
        try {
            const authorizationUrl = await initializePayment();
            window.location.href = authorizationUrl;
        } catch (error) {
            console.error('Payment initialization failed:', error);
        } finally {
            setIsProcessingPayment(false);
        }
    };

    useEffect(() => {
        fetchTiers();
        fetchShopData();
    }, [fetchShopData]);

    useEffect(() => {
        const transRef = searchParams.get('transRef');
        const tier = searchParams.get('tier');

        if (transRef) {
            if (session) {
                verifyPayment(transRef);
            }

        }

        if (tier && !transRef) {
            router.replace('/vendor/promote-shop', undefined);
        }
    }, [searchParams, verifyPayment, router, session]);

    const handleUpgradeClick = () => {
        setShowUpgradeModal(true);
        setSelectedTierInModal(tiers[0]);
    };

    const closeModal = () => {
        setShowUpgradeModal(false);
    };

    const handleTierSelectInModal = (tier: ApiTier) => {
        setSelectedTierInModal(tier);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Loading tiers...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    const CURRENTLY_RUNNING_TIER = shopData?.promotedStatus === 'PROMOTED'
        ? tiers.find(tier => tier.id === shopData.promotedTierId)
        : null;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
        }).format(price);
    };

    const getGradientImage = (index: number) => {
        switch (index) {
            case 0: return gradient1;
            case 1: return gradient2;
            case 2: return gradient3;
            default: return gradient1;
        }
    };

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

            {isVerifying && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#808080]/20">
                    <div className="bg-white p-6 shadow-lg max-w-md w-full mx-4 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {session ? 'Verifying Payment' : 'Loading Session'}
                        </h3>
                        <p className="text-gray-600">
                            {session
                                ? 'Please wait while we verify your payment...'
                                : 'Completing authentication, please wait...'}
                        </p>
                    </div>
                </div>
            )}

            {paymentError && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">
                                    {paymentError}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <VendorShopGuard showSubHeader={false}>
            <div className="flex flex-col py-[10px] px-25 relative">
                <div className="w-[359px] h-[52px] gap-[24px] flex items-end">
                    <p className="py-2 text-[#11151F] cursor-pointer text-[14px] font-medium border-b-2 border-[#C6EB5F]">
                        Reviews & campaigns
                    </p>
                    <p className="py-2 cursor-pointer text-[14px] text-gray-500">
                        Coupons
                    </p>
                </div>

                <div className="flex gap-[8px] mt-[15px] text-[#1E1E1E] text-[14px] font-medium items-center">
                    <Image src={arrowBack} alt="Back arrow" width={18} height={18} className="cursor-pointer"/>
                    <p className="cursor-pointer">Back to reviews and campaigns</p>
                </div>

                <div className="flex flex-col h-[92px] w-full mt-[20px] pb-[20px]">
                    <p className="text-[#101828] text-[18px] font-medium">Promote shop</p>
                    <p className="text-[#667085] text-[14px]">
                        Boost your shop to the top and get more <br/>customers to visit and purchase from your shop
                    </p>
                </div>

                {CURRENTLY_RUNNING_TIER ? (
                    <div className="flex flex-col h-[290px] w-full rounded-[24px] border border-[#EDEDED] p-[20px]">
                        <div className="flex justify-between items-center h-[92px] border-b-[0.5px] border-[#EDEDED]">
                            <div className="flex flex-col text-[14px] gap-[4px]">
                                <p className="text-[#101828] font-medium">{CURRENTLY_RUNNING_TIER.tier}</p>
                                <p className="text-[#667085] leading-tight">
                                    Your shop is currently promoted with this tier
                                </p>
                            </div>
                            <span className="w-[145px] text-[#07A341] text-[14px] font-medium flex items-center justify-center h-[44px] rounded-[100px] bg-[#ECFDF6] border border-[#22C55E]">
                                Currently running
                            </span>
                        </div>
                        <button
                            onClick={handleUpgradeClick}
                            className="flex items-center justify-center gap-[9px] text-[14px] text-[#C6EB5F] font-semibold w-[174px] rounded-[12px] mt-[28px] bg-[#022B23] h-[52px]"
                        >
                            <p>Upgrade</p>
                            <Image src={crownImg} alt="Crown icon"/>
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col h-[290px] w-full rounded-[24px] border border-[#EDEDED] p-[20px]">
                        <div className="flex justify-between items-center h-[92px] border-b-[0.5px] border-[#EDEDED]">
                            <div className="flex flex-col text-[14px] gap-[4px]">
                                <p className="text-[#101828] font-medium">No active promotion</p>
                                <p className="text-[#667085] leading-tight">
                                    Your shop is not currently promoted. Choose a tier to boost your visibility.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleUpgradeClick}
                            className="flex items-center justify-center gap-[9px] text-[14px] text-[#C6EB5F] font-semibold w-[174px] rounded-[12px] mt-[28px] bg-[#022B23] h-[52px]"
                        >
                            <p>Promote Now</p>
                            <Image src={crownImg} alt="Crown icon"/>
                        </button>
                    </div>
                )}

                <div className="flex flex-col h-[388px] mt-[30px] gap-[24px]">
                    <p className="text-[#022B23] text-[16px] font-medium">Campaign Tiers ({tiers.length})</p>
                    <div className="flex h-[345px] w-full justify-between">
                        {tiers.map((tier, index) => (
                            <div key={tier.id} className="h-full w-[380px] flex flex-col items-center border-[0.5px] rounded-[24px] border-[#EDEDED]">
                                <Image
                                    src={getGradientImage(index)}
                                    alt={`${tier.tier} gradient`}
                                    className="h-[112px] rounded-tr-[24px] rounded-tl-[24px] w-full"
                                />
                                <div className="w-[334px] h-[198px] mt-[10px] flex flex-col gap-[20px]">
                                    <div className="flex flex-col gap-[8px]">
                                        <div className="flex text-[16px] font-semibold text-[#101828] justify-between">
                                            <p>{tier.tier}</p>
                                            <p>{formatPrice(tier.price)}</p>
                                        </div>
                                        <p className="text-[12px] font-medium text-[#667085]">
                                            Boost your shop to the top and get more customers to visit and purchase from your shop
                                        </p>
                                    </div>

                                    {/* Tier-specific details */}
                                    <div className="flex flex-col gap-[14px]">
                                        <div className="flex items-center gap-[4px] text-[12px] text-[#1E1E1E] font-medium">
                                            <Image src={greenTick} alt="Green tick icon"/>
                                            <p>Featured: {tier.featuredNumber} products</p>
                                        </div>
                                        <div className="flex items-center gap-[4px] text-[12px] text-[#1E1E1E] font-medium">
                                            <Image src={greenTick} alt="Green tick icon"/>
                                            <p>Promoted: {tier.promotedNumber} products</p>
                                        </div>
                                        {tier.tier !=='BASIC'&&(
                                            <div className="flex items-center gap-[4px] text-[12px] text-[#1E1E1E] font-medium">
                                                <Image src={greenTick} alt="Green tick icon"/>
                                                <p>Floated: {tier.floatedNumber} products</p>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {showUpgradeModal && selectedTierInModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#808080]/20">
                        <div className="relative z-10 bg-white w-[1100px] mx-4 px-[60px] py-[30px] shadow-lg">
                            <div className="flex flex-col pb-2 border-b-[0.5px] border-[#EDEDED]">
                                <p className="text-[#022B23] text-[16px] font-medium">Promote shop payment</p>
                                <p className="text-[#707070] text-[14px] font-medium">Pay for your preferred tier to help your business rank better</p>
                            </div>

                            <div className="flex">
                                <div className="w-[40%]">
                                    <h3 className="text-[#101828] text-[16px] mt-[4px] font-medium mb-2">Campaign Tiers ({tiers.length})</h3>
                                    <div className="w-[325px] max-h-[80vh] flex flex-col gap-[10px]">
                                        {tiers.map((tier) => (
                                            <div
                                                key={tier.id}
                                                className={`p-3 rounded-[24px] w-full h-[140px] cursor-pointer border ${
                                                    selectedTierInModal.id === tier.id
                                                        ? 'border-[#C6EB5F] h-[170px] shadow-md relative'
                                                        : 'border-[#EDEDED] h-[140px]'
                                                }`}
                                                onClick={() => handleTierSelectInModal(tier)}
                                            >
                                                <div className="flex justify-between text-[12px] items-center mb-2">
                                                    <h4 className="text-[#101828] font-medium">{tier.tier}</h4>
                                                    <p className="text-[#101828] font-semibold">{formatPrice(tier.price)}</p>
                                                </div>
                                                <p className="text-[#667085] text-[12px] leading-tight mb-2">
                                                    Boost your shop to the top and get more customers to visit and purchase from your shop
                                                </p>
                                                <div className="flex flex-col gap-[8px]">
                                                    <div className="flex items-center gap-[4px] text-[12px] text-[#1E1E1E] font-medium">
                                                        <Image src={greenTick} alt="Green tick icon"/>
                                                        <p>Featured: {tier.featuredNumber} products</p>
                                                    </div>
                                                    <div className="flex items-center gap-[4px] text-[12px] text-[#1E1E1E] font-medium">
                                                        <Image src={greenTick} alt="Green tick icon"/>
                                                        <p>Promoted: {tier.promotedNumber} products</p>
                                                    </div>
                                                    <div className="flex items-center gap-[4px] text-[12px] text-[#1E1E1E] font-medium">
                                                        <Image src={greenTick} alt="Green tick icon"/>
                                                        <p>Floated: {tier.floatedNumber} products</p>
                                                    </div>
                                                </div>
                                                {selectedTierInModal.id === tier.id && (
                                                    <div className="absolute bottom-0 left-0 right-0 text-center text-[#1E1E1E] font-medium text-[12px] bg-[#C6EB5F] rounded-b-[12px] h-[24px] flex items-center justify-center">
                                                        Selected tier
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="w-[60%] flex flex-col gap-[20px] pl-[50px] pt-[24px] pb-[2px] border-l border-[#EDEDED]">
                                    <p className="text-[#022B23] text-[16px] font-medium">Tier details</p>

                                    <div className="flex flex-col gap-[8px] pb-[24px] border-b-[0.5px] border-[#ededed]">
                                        <div className="flex justify-between items-center">
                                            <p className="text-[14px] text-[#707070] font-medium">Order amount</p>
                                            <p className="text-[14px] text-[#000000] font-medium">{formatPrice(selectedTierInModal.price)}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-[14px] text-[#707070] font-medium">Tier</p>
                                            <p className="text-[14px] text-[#000000] font-medium">{selectedTierInModal.tier}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-[14px] text-[#707070] font-medium">Featured Products</p>
                                            <p className="text-[14px] text-[#000000] font-medium">{selectedTierInModal.featuredNumber}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-[14px] text-[#707070] font-medium">Promoted Products</p>
                                            <p className="text-[14px] text-[#000000] font-medium">{selectedTierInModal.promotedNumber}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-[14px] text-[#707070] font-medium">Floated Products</p>
                                            <p className="text-[14px] text-[#000000] font-medium">{selectedTierInModal.floatedNumber}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-[10px] justify-end mt-8">
                                        <button
                                            onClick={closeModal}
                                            className="justify-center w-[116px] h-[52px] text-[#707070] flex items-center text-[16px] font-medium border border-[#707070] rounded-[12px] cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={!isProcessingPayment ? handleMakePayment : undefined}
                                            disabled={isProcessingPayment}
                                            className={`flex items-center justify-center gap-[8px] w-[179px] h-[52px] bg-[#022B23] text-[#C6EB5F] rounded-[12px] text-[14px] font-semibold ${
                                                isProcessingPayment ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                                            }`}
                                        >
                                            {isProcessingPayment ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                    <p>Processing...</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <p>Make payment</p>
                                                    <Image src={limeArrow} alt="Arrow icon"/>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            </VendorShopGuard>
        </>
    );
};

export default PromoteShop;