'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

interface BuyNowSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderDetails: {
        orderId: string;
        productName: string;
        deliveryOption: string;
        deliveryAddress: string;
        amountPaid: number;
    };
}

const BuyNowSuccessModal = ({ isOpen, onClose, orderDetails }: BuyNowSuccessModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#808080]/20">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-[022B23]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-center mb-2">Purchase Successful!</h2>
                <p className="text-center mb-6">Your order has been confirmed.</p>

                <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-medium">{orderDetails.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Product:</span>
                        <span className="font-medium">{orderDetails.productName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Delivery:</span>
                        <span className="font-medium">{orderDetails.deliveryOption}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Address:</span>
                        <span className="font-medium">{orderDetails.deliveryAddress}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Amount Paid:</span>
                        <span className="font-medium">₦{orderDetails.amountPaid.toLocaleString()}</span>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full bg-[#022B23] text-white py-2 rounded-md hover:bg-[#033a30] transition-colors"
                >
                    View Order Details
                </button>
            </div>
        </div>
    );
};

const SuccessPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const transRef = searchParams.get('transRef');

    const [isProcessing, setIsProcessing] = useState(true);
    const [orderDetails, setOrderDetails] = useState<{
        orderId: string;
        productName: string;
        deliveryOption: string;
        deliveryAddress: string;
        amountPaid: number;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const verifyPaymentAndCreateOrder = async () => {
            if (!transRef) {
                setError('No transaction reference found');
                router.push('/');
                return;
            }

            try {
                setIsProcessing(true);
                toast.loading('Processing your purchase...', { id: 'buy-now' });

                const verificationResponse = await axios.get(
                    `https://digitalmarket.benuestate.gov.ng/api/payments/verify/${transRef}`,
                    { timeout: 20000 }
                );
                console.log("Verification response: ",verificationResponse)

                if (!verificationResponse.data.data) {
                    throw new Error('Payment verification failed');
                }

                const paymentData = verificationResponse.data.data;
                const expectedAmount = getStoredTotalAmount();

                if (expectedAmount && Math.abs(paymentData.transAmount - expectedAmount) > 0.01) {
                    throw new Error('Payment amount does not match order total');
                }

                const productId = localStorage.getItem("productId")
                const productName = verificationResponse.data.metadata?.productName;
                const orderResponse = await axios.post(
                    `https://digitalmarket.benuestate.gov.ng/api/orders/buy-product?productId=${productId}`,
                    {
                        buyerEmail: session?.user.email,
                        deliveryMethod: 'pickup',
                        address: 'Shop',
                        transRef: transRef
                    }
                );

                console.log("Order response: ",orderResponse)
                setOrderDetails({
                    orderId: orderResponse.data.orderNumber || `#${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
                    productName: productName,
                    deliveryOption: 'Pickup at market',
                    deliveryAddress: 'Shop 2C, Modern market, Makurdi',
                    amountPaid: paymentData.transAmount
                });

                clearStoredTotalAmount();
                toast.dismiss('buy-now');
                localStorage.removeItem("productId")

            } catch (error) {
                console.error('Purchase processing error:', error);
                toast.dismiss('buy-now');

                const errorMessage = axios.isAxiosError(error)
                    ? error.response?.data?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Purchase processing failed';

                setError(errorMessage);
                toast.error(errorMessage);

                setTimeout(() => {
                    router.push('/');
                }, 3000);
            } finally {
                setIsProcessing(false);
            }
        };

        if (transRef) {
            verifyPaymentAndCreateOrder();
        } else {
            router.push('/');
        }
    }, [transRef, router, session]);

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-gray-800 mb-2">Purchase Failed</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-2 bg-[#022B23] text-white rounded-md hover:bg-[#033a30] transition-colors"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            {isProcessing && !orderDetails ? (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#022B23] mx-auto mb-4"></div>
                    <h1 className="text-xl font-bold text-gray-800 mb-2">Processing Your Purchase</h1>
                    <p className="text-gray-600">Please wait while we confirm your order...</p>
                </div>
            ) : null}

            {orderDetails && (
                <BuyNowSuccessModal
                    isOpen={true}
                    onClose={() => router.push('/buyer/orders')}
                    orderDetails={orderDetails}
                />
            )}
        </div>
    );
};
const getStoredTotalAmount = (): number | null => {
    const paymentData = localStorage.getItem('expectedPayment');
    if (!paymentData) return null;
    const { amount } = JSON.parse(paymentData);
    return amount;
};

const clearStoredTotalAmount = () => {
    localStorage.removeItem('expectedPayment');
};

export default SuccessPage;