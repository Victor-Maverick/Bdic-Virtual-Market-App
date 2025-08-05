//Cart/page.tsxx
'use client';
import { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductDetailHeader from "@/components/productDetailHeader";
import NavigationBar from "@/components/navigationBar";
import Toast from "../../components/Toast";
import cartIcon from '../../../public/assets/images/black cart.png';
import Image from "next/image";
import arrow from '../../../public/assets/images/blackArrow.png';
import card_tick from '../../../public/assets/images/card-tick.png';
import trash from '../../../public/assets/images/trash.png';
import grayAddressIcon from '../../../public/assets/images/greyAddressIcon.svg';
import whiteAddressIcon from "../../../public/assets/images/addressIcon.svg";
import addIcon from '../../../public/assets/images/add-circle.svg';
import limeArrow from '../../../public/assets/images/green arrow.png';
import { useCart } from "@/context/CartContext";
import emptyCartImg from '@/../public/assets/images/archive.svg';
import { Toaster, toast } from "react-hot-toast";
import arrowRight from '@/../public/assets/images/green arrow.png'
import checkIcon from '@/../public/assets/images/green tick.png'


import axios from 'axios';
import {useSession} from 'next-auth/react';


const DELIVERY_FEE = 1000;
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

interface OrderDetails {
    orderId: string;
    deliveryOption: 'pickup' | 'delivery';
    deliveryAddress: string;
    paymentAmount: number;
}

// Store the expected payment amount
const storeTotalAmount = (amount: number) => {
    const paymentData = {
        amount,
        timestamp: new Date().getTime()
    };
    localStorage.setItem('expectedPayment', JSON.stringify(paymentData));
};

// Get the stored payment amount
const getStoredTotalAmount = (): number | null => {
    const paymentData = localStorage.getItem('expectedPayment');
    if (!paymentData) return null;

    const { amount, timestamp } = JSON.parse(paymentData);

    // Optional: Clear if older than 24 hours
    if (new Date().getTime() - timestamp > 24 * 60 * 60 * 1000) {
        localStorage.removeItem('expectedPayment');
        return null;
    }

    return amount;
};

interface Address {
    id: string;
    address: string;
    isDefault: boolean;
}

// Clear the stored amount
const clearStoredTotalAmount = () => {
    localStorage.removeItem('expectedPayment');
};

type HoverOption = "pickup" | "delivery" | "add" | null;

const Cart = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<'pickup' | 'delivery'>('pickup');
    const [hoveredOption, setHoveredOption] = useState<'pickup' | 'delivery' | 'add' | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [userAddresses, setUserAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<string>('Shop 2C, Modern market, Makurdi');
    const [showAddAddressModal, setShowAddAddressModal] = useState(false);
    const [newAddress, setNewAddress] = useState('');
    const { data: session } = useSession();
    const isAuthenticated = session?.user;

    const {
        cartItems,
        updateQuantity,
        removeFromCart,
        getTotalItems,
        getTotalPrice,
        clearCart,
        fetchCart
    } = useCart();

    const { checkout: apiCheckout } = useCart();

    // Toast state
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<"success" | "error">("success");
    const [toastMessage, setToastMessage] = useState("");
    const [toastSubMessage, setToastSubMessage] = useState("");
    const [isSessionLoading, setIsSessionLoading] = useState(true);


    useEffect(() => {
        if (session !== undefined) { // Session state is resolved (either authenticated or not)
            setIsSessionLoading(false);
        }
    }, [session]);

    const verifyPayment = useCallback(async (transRef: string) => {
        setIsVerifying(true);
        setPaymentError(null);

        try {
            const response = await axios.get<VerifyPaymentResponse>(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/verify/${transRef}`,
                { timeout: 20000 }
            );

            if (response.data.data) {
                const paymentData = response.data.data;
                const expectedAmount = getStoredTotalAmount();

                if (expectedAmount && Math.abs(paymentData.transAmount - expectedAmount) > 0.01) {
                    throw new Error('Payment amount does not match order total');
                }

                // Wait for session to be ready if not already
                if (session === undefined) {
                    await new Promise(resolve => {
                        const checkSession = () => {
                            if (session !== undefined) resolve(true);
                            else setTimeout(checkSession, 100);
                        };
                        checkSession();
                    });
                }

                if (!session?.user?.email) {
                    throw new Error('User email not found in session. Please log in again.');
                }

                const checkoutResponse = await apiCheckout({
                    buyerEmail: session.user.email,
                    deliveryMethod: selectedDeliveryOption,
                    address: selectedAddress,
                    transRef
                });

                const orderDetails: OrderDetails = {
                    orderId: checkoutResponse.orderNumber || generateOrderId(),
                    deliveryOption: selectedDeliveryOption,
                    deliveryAddress: selectedDeliveryOption === 'pickup'
                        ? 'Shop'
                        : selectedAddress,
                    paymentAmount: paymentData.transAmount,
                };

                setOrderDetails(orderDetails);
                clearStoredTotalAmount();
                clearCart();
                setShowSuccessModal(true);
                showSuccessToast('Payment Successful', 'Your order has been placed successfully');
                router.replace('/cart', undefined);
            } else {
                throw new Error('Payment verification failed');
            }
        } catch (error) {
            console.error('Payment verification error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Payment verification failed';
            setPaymentError(errorMessage);
            showErrorToast('Payment Error', errorMessage);

            if (errorMessage.includes('log in')) {
                localStorage.setItem('preAuthUrl', window.location.pathname);
                router.push('/login');
            }
        } finally {
            setIsVerifying(false);
        }
    }, [selectedDeliveryOption, selectedAddress, apiCheckout, clearCart, router, session]);


    useEffect(() => {
        if (isAuthenticated) {
            // Mock function to fetch user addresses - replace with actual API call
            const fetchUserAddresses = async () => {
                try {
                    // This would be your actual API call to get user addresses
                    const mockAddresses: Address[] = [
                        { id: '1', address: 'Shop 2C, Modern market, Makurdi', isDefault: true },
                        { id: '2', address: 'No. 4 Vandeikya Street, Makurdi', isDefault: false },
                    ];
                    setUserAddresses(mockAddresses);
                    setSelectedAddress(mockAddresses.find(addr => addr.isDefault)?.address || mockAddresses[0].address);
                } catch (error) {
                    console.error('Error fetching addresses:', error);
                }
            };

            fetchUserAddresses();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const storedCartId = localStorage.getItem('cartId');
        if (storedCartId) {
            fetchCart();
        }
    }, [fetchCart]);

    useEffect(() => {
        const transRef = searchParams.get('transRef');
        const paymentStatus = searchParams.get('status');

        // Only verify if we have a transaction reference and status is not already shown
        if (transRef && !showSuccessModal) {
            verifyPayment(transRef);
        }

        // Clean up URL after verification
        if (paymentStatus && !transRef) {
            router.replace('/cart', undefined);
        }
    }, [searchParams, showSuccessModal, verifyPayment, router]);
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

    const handleApplyCoupon = () => {
        if (!couponCode.trim()) {
            toast.error("Please enter a coupon code");
            return;
        }

        // Mock coupon validation
        if (couponCode.toUpperCase() === "SAVE10") {
            setDiscount(getTotalPrice() * 0.1); // 10% discount
            toast.success("Coupon applied! 10% discount");
        } else if (couponCode.toUpperCase() === "SAVE20") {
            setDiscount(getTotalPrice() * 0.2); // 20% discount
            toast.success("Coupon applied! 20% discount");
        } else {
            toast.error("Invalid coupon code");
            setDiscount(0);
        }
    };

    const generateOrderId = () => {
        return `#${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;
    };

    const initializePayment = async (): Promise<PaymentData> => {
        // Wait for session to be ready if not already
        if (session === undefined) {
            await new Promise(resolve => {
                const checkSession = () => {
                    if (session !== undefined) resolve(true);
                    else setTimeout(checkSession, 100);
                };
                checkSession();
            });
        }

        if (!session?.user?.email) {
            throw new Error('User email not available');
        }

        try {
            const totalAmount = getTotalPrice() + DELIVERY_FEE - discount;

            const requestData = {
                email: session.user.email,
                amount: totalAmount * 100,
                currency: 'NGN',
                callbackUrl: `${window.location.origin}/cart`,
                paymentType: 'ORDER',
                metadata: {
                    cartItems: cartItems.map(item => ({
                        id: item.productId,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    deliveryOption: selectedDeliveryOption
                }
            };

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
                if (!paymentResponse.data?.authorizationUrl) {
                    throw new Error('Payment initialization successful but authorization URL not found');
                }
                return paymentResponse.data;
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

    const handleCheckout = async () => {
        if (isSessionLoading) {
            toast.loading('Checking your session...');
            return;
        }

        if (!session) {
            toast.error('Please login to proceed with payment');
            localStorage.setItem('preAuthUrl', window.location.pathname);
            router.push('/login');
            return;
        }

        setIsLoading(true);
        try {
            if (cartItems.length === 0) {
                throw new Error('Your cart is empty');
            }

            // Store the expected amount before payment
            const totalAmount = getTotalPrice() + DELIVERY_FEE - discount;
            storeTotalAmount(totalAmount);

            // Initialize payment
            const paymentData = await initializePayment();

            // Redirect to payment page
            window.location.href = paymentData.authorizationUrl;

        } catch (error) {
            console.error('Checkout error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Payment failed';
            showErrorToast('Payment Error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddNewAddress = () => {
        if (!newAddress.trim()) {
            toast.error('Please enter a valid address');
            return;
        }

        const newAddressObj: Address = {
            id: Date.now().toString(),
            address: newAddress,
            isDefault: false
        };

        setUserAddresses([...userAddresses, newAddressObj]);
        setSelectedAddress(newAddress);
        setSelectedDeliveryOption('delivery');
        setShowAddAddressModal(false);
        setNewAddress('');
    };

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        router.push('/buyer/orders');
    };

    const getDeliveryOptionText = () => {
        return selectedDeliveryOption === 'pickup' ? 'Pick-up at the market' : 'Delivery to your address';
    };

    return (
        <>
            <Toaster position="bottom-right" />
            {showToast && (
                <Toast
                    type={toastType}
                    message={toastMessage}
                    subMessage={toastSubMessage}
                    onClose={handleCloseToast}
                />
            )}

            {/* Loading overlay for payment verification */}
            {isVerifying && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#808080]/20">
                    <div className="bg-white p-6  shadow-lg max-w-md w-full mx-4 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Verifying Payment</h3>
                        <p className="text-gray-600">Please wait while we verify your payment...</p>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && orderDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#808080]/20">
                    <div className="bg-white items-center p-25 justify-center shadow-lg max-w-[800px] w-full ">
                        {/* Success Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-8 h-8 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Success Message */}
                        <div className="text-center mb-6">
                            <h2 className="text-[20px] font-medium text-[#000B38] mb-2">
                                Your order has been placed successfully
                            </h2>
                            <p className="text-[#6B718C] text-sm mb-4">
                                You can pick up at the shop address selected
                            </p>

                            {/* Delivery Option Display */}
                            <div className="flex items-center justify-center">
                                <div className="bg-[#ECFDF6] w-[378px] border-[0.5px] border-[#C6EB5F] rounded-[18px] p-3 mb-3">
                                    <div className="flex items-start justify-center gap-2">
                                        <Image src={checkIcon} alt={'image'}/>
                                        <div className="flex flex-col text-start w-[174px]">
                                            <p className="text-[14px] font-medium text-[#022B23]">
                                                {getDeliveryOptionText()}
                                            </p>
                                            <p className="text-[12px] text-[#022B23]">
                                                {orderDetails.deliveryAddress}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order ID */}
                            <p className="font-semibold text-[20px] text-[#022B23]">
                                Order ID: <span className="font-semibold text-[20px] text-[#022B23]">{orderDetails.orderId}</span>
                            </p>
                        </div>

                        {/* Continue Button */}
                        <div className="flex justify-center">
                            <button
                                onClick={handleSuccessModalClose}
                                className="w-[250px] h-[52px] bg-[#022B23] text-[#C6EB5F] rounded-[12px] font-semibold  transition-colors flex items-center justify-center gap-[9px]"
                            >
                                <span>Go home to order history</span>
                                <Image src={arrowRight} alt={"image"} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {paymentError && (
                <div className="px-[100px] py-4">
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
            <ProductDetailHeader />
            {/*<ProductDetailHeroBar />*/}
            <NavigationBar page="//cart" name="Cart" />

            <div className="px-4 sm:px-6 lg:px-[100px] py-[10px] border-b border-[#ededed]">
                <div className="w-full max-w-[182px] h-[46px] flex border-[0.5px] border-[#ededed] rounded-[4px] p-[2px]">
                    <div className="flex justify-center gap-[2px] items-center bg-[#F9F9F9] w-full h-[40px]">
                        <Image src={cartIcon} alt="cart icon" width={20} height={20} />
                        <p className="text-[14px] text-[#1E1E1E]">My cart</p>
                        <p className="font-medium text-[14px] text-[#1E1E1E]">({getTotalItems()})</p>
                    </div>
                </div>
            </div>

            <div className="flex px-4 sm:px-6 lg:px-[100px] items-center mt-[20px] gap-[12px] sm:gap-[24px] overflow-x-auto">
                <div className="flex gap-[6px] items-center">
                    <Image src={cartIcon} alt="cart" width={20} height={20} />
                    <p className="text-[14px] font-medium">Cart / checkout</p>
                </div>
                <Image src={arrow} alt="arrow" className="w-[14px] h-[14px]" />
                <div className="flex gap-[6px] items-center">
                    <Image src={card_tick} alt="card" />
                    <p className="text-[14px] text-[#707070]">Payment</p>
                </div>
            </div>

            {getTotalItems() === 0 ? (
                <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-[100px] py-[60px] sm:py-[80px]">
                    <Image
                        src={emptyCartImg}
                        alt="Empty cart"
                        width={150}
                        height={150}
                        className="mb-6 sm:w-[200px] sm:h-[200px]"
                    />
                    <h3 className="text-[20px] sm:text-[24px] font-medium mb-2 text-center">Your cart is empty</h3>
                    <p className="text-[#707070] mb-6 text-center max-w-md text-[14px] sm:text-[16px]">
                        Looks like you haven&#39;t added anything to your cart yet
                    </p>
                    <button
                        className="bg-[#022B23] text-white px-6 py-3 rounded-[12px] hover:bg-[#033a30] transition-colors text-[14px] sm:text-[16px]"
                        onClick={() => router.push('/marketPlace')}
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-[12px] mt-4 sm:mt-6 lg:mt-[20px] px-4 sm:px-6 lg:px-[100px] py-4">
                    <div className="border-[0.5px] border-[#ededed] w-full lg:w-[60%] h-full rounded-xl sm:rounded-[14px] mb-4 lg:mb-0">
                        {cartItems.map((product, index) => (
                            <div
                                key={`${product.productId}-${index}`}
                                className={`flex items-center ${index !== cartItems.length - 1 ? 'border-b border-[#ededed]' : ''}`}
                            >
                                <div className="flex border-r border-[#ededed] w-20 sm:w-24 lg:w-[133px] h-16 sm:h-20 lg:h-[110px] overflow-hidden flex-shrink-0">
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.name}
                                        width={133}
                                        height={110}
                                        className="w-full h-full object-contain bg-[#F9F9F9]"
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center w-full px-3 sm:px-4 lg:px-[20px] justify-between gap-3 sm:gap-4 lg:gap-0 py-2 sm:py-0">
                                    <div className="flex flex-col w-full sm:w-[40%] lg:w-[30%] min-w-0">
                                        <div className="mb-2 sm:mb-[8px] lg:mb-[13px]">
                                            <p className="text-xs sm:text-sm lg:text-[14px] text-[#1E1E1E] font-medium mb-1 sm:mb-[4px] truncate">
                                                {product.name}
                                            </p>
                                            <p className="text-xs font-normal text-[#3D3D3D] line-clamp-2 hidden sm:block">
                                                {product.description}
                                            </p>
                                        </div>
                                        <p className="font-medium text-sm sm:text-[14px] lg:text-[16px]">
                                            ₦{product.price.toLocaleString()}.00
                                        </p>
                                    </div>
                                    <button
                                        className="w-[38px] h-[38px] flex justify-center items-center rounded-[8px] bg-[#F9F9F9] border-[0.5px] border-[#ededed] hover:bg-[#e5e5e5] transition-colors"
                                        onClick={() => updateQuantity(product.itemId, -1)}
                                        disabled={product.quantity <= 1}
                                    >
                                        <p className="text-[14px] font-medium">-</p>
                                    </button>
                                    <div className="w-[38px] h-[38px] flex justify-center items-center">
                                        <p className="text-[14px] font-medium">{product.quantity}</p>
                                    </div>
                                    <button
                                        className="w-[38px] h-[38px] flex rounded-[8px] justify-center items-center bg-[#F9F9F9] border-[0.5px] border-[#ededed] hover:bg-[#e5e5e5] transition-colors"
                                        onClick={() => updateQuantity(product.itemId, 1)}
                                    >
                                        <p className="text-[14px] font-medium">+</p>
                                    </button>
                                    <div className="flex gap-[4px] items-center w-[20%] justify-end">
                                        <Image
                                            src={trash}
                                            alt="Remove"
                                            width={19}
                                            height={19}
                                            className="w-[19px] h-[19px] cursor-pointer hover:opacity-80 transition-opacity"
                                            onClick={() => {
                                                removeFromCart(product.itemId);
                                                toast.success(`${product.name} removed from cart`);
                                            }}
                                        />
                                        <p
                                            className="text-[14px] text-[#707070] font-normal cursor-pointer hover:text-[#505050] transition-colors"
                                            onClick={async () => {
                                                try {
                                                    await removeFromCart(product.itemId);
                                                    toast.success(`${product.name} removed from cart`);
                                                    // // Fetch the latest cart state after removal
                                                    // await fetchCart();
                                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                } catch (error) {
                                                    toast.error('Failed to remove item from cart');
                                                }
                                            }}
                                        >
                                            Remove
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex-col w-[40%] space-y-[10px]">
                        <p className="text-[#022B23] font-medium text-[14px] mb-[10px]">Order summary</p>

                        <div className="bg-[#F9F9F9] p-[24px] space-y-[10px] rounded-[14px]">
                            <div className="flex justify-between items-center">
                                <p className="text-[#022B23] text-[14px] font-normal">Subtotal</p>
                                <p className="text-[14px] font-semibold text-[#1E1E1E]">
                                    ₦{getTotalPrice().toLocaleString()}.00
                                </p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-[#022B23] text-[14px] font-normal">Discount</p>
                                <p className="text-[14px] font-semibold text-[#1E1E1E]">
                                    -₦{discount.toLocaleString()}.00
                                </p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-[#022B23] text-[14px] font-normal">VAT</p>
                                <p className="text-[14px] font-semibold text-[#1E1E1E]">0%</p>
                            </div>

                            <div className="flex justify-between items-center">
                                <p className="text-[#022B23] text-[14px] font-normal">Delivery</p>
                                <p className="text-[14px] font-semibold text-[#1E1E1E]">
                                    ₦{DELIVERY_FEE.toLocaleString()}.00
                                </p>
                            </div>
                            <div className="border-t border-[#ededed] pt-3 mt-3">
                                <div className="flex justify-between items-center">
                                    <p className="text-[#022B23] text-[18px] font-medium">Total</p>
                                    <p className="text-[18px] font-bold text-[#1E1E1E]">
                                        ₦{(getTotalPrice() + DELIVERY_FEE - discount).toLocaleString()}.00
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-[20px]">
                            <div className="flex rounded-[12px] border-[1.5px] border-[#D1D1D1] h-[48px] flex-1">
                                <div className="flex justify-center items-center w-[98px] border-r border-[#D1D1D1] rounded-tl-[12px] rounded-bl-[12px] h-full bg-[#F6F6F6]">
                                    <p className="text-[14px] font-medium text-[#121212]">COUPON</p>
                                </div>
                                <input
                                    className="p-[10px] w-full outline-none bg-transparent text-[14px] font-medium text-[#121212]"
                                    placeholder="Enter coupon code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                />
                            </div>
                            <button
                                className="w-[116px] bg-[#022B23] h-[48px] flex justify-center items-center rounded-[12px] hover:bg-[#033a30] transition-colors"
                                onClick={handleApplyCoupon}
                            >
                                <p className="text-[#C6EB5F] font-semibold text-[16px]">Apply</p>
                            </button>
                        </div>

                        <div className="flex-col mt-[30px] space-y-[5px]">
                            <p className="font-medium text-[14px] text-[#022B23]">Delivery option</p>

                            <div className="bg-[#f9f9f9] rounded-[14px] p-[10px] flex-col">
                                {/* Pickup Option */}
                                <div
                                    className={`flex gap-[10px] py-[10px] px-[8px] cursor-pointer rounded-[10px] transition-colors ${
                                        selectedDeliveryOption === 'pickup'
                                            ? 'bg-[#022B23] text-white'
                                            : hoveredOption === 'pickup'
                                                ? 'bg-[#022B23] text-white'
                                                : ''
                                    }`}
                                    onMouseEnter={() => setHoveredOption('pickup')}
                                    onMouseLeave={() => setHoveredOption(null)}
                                    onClick={() => {
                                        setSelectedDeliveryOption('pickup');
                                        setSelectedAddress('Shop 2C, Modern market, Makurdi');
                                    }}
                                >
                                    <Image
                                        src={
                                            selectedDeliveryOption === 'pickup' || hoveredOption === 'pickup'
                                                ? whiteAddressIcon
                                                : grayAddressIcon
                                        }
                                        alt="Pickup"
                                        width={20}
                                        height={20}
                                    />
                                    <div className="flex-col">
                                        <p className="text-[14px] font-medium">Pick up at market</p>
                                        <p className="text-[12px]">Shop 2C, Modern market, Makurdi</p>
                                    </div>
                                </div>

                                {userAddresses.filter(addr => addr.address !== 'Shop 2C, Modern market, Makurdi').map((address) => (
                                    <div
                                        key={address.id}
                                        className={`flex gap-[10px] py-[10px] px-[8px] cursor-pointer rounded-[10px] transition-colors ${
                                            selectedDeliveryOption === 'delivery' && selectedAddress === address.address
                                                ? 'bg-[#022B23] text-white'
                                                : hoveredOption === address.id
                                                    ? 'bg-[#022B23] text-white'
                                                    : ''
                                        }`}
                                        onMouseEnter={() => setHoveredOption(address.id as HoverOption)}
                                        onMouseLeave={() => setHoveredOption(null)}
                                        onClick={() => {
                                            setSelectedDeliveryOption('delivery');
                                            setSelectedAddress(address.address);
                                        }}
                                    >
                                        <Image
                                            src={
                                                selectedDeliveryOption === 'delivery' && selectedAddress === address.address
                                                    ? whiteAddressIcon
                                                    : grayAddressIcon
                                            }
                                            alt="Delivery"
                                            width={20}
                                            height={20}
                                        />
                                        <div className="flex-col">
                                            <p className="text-[14px] font-medium">Delivery to address</p>
                                            <p className="text-[12px]">{address.address}</p>
                                        </div>
                                    </div>
                                ))}

                                <div
                                    className={`flex gap-[10px] py-[10px] px-[8px] cursor-pointer rounded-[10px] transition-colors ${
                                        hoveredOption === 'add' ? 'bg-[#022B23] text-white' : ''
                                    }`}
                                    onMouseEnter={() => setHoveredOption('add')}
                                    onMouseLeave={() => setHoveredOption(null)}
                                    onClick={() => setShowAddAddressModal(true)}
                                >
                                    <Image src={addIcon} alt="Add" width={20} height={20} />
                                    <div className="flex-col">
                                        <p className="text-[14px] font-medium">Add new address</p>
                                        <p className="text-[12px]">Add a new delivery address</p>
                                    </div>
                                </div>
                            </div>

                            {/* Add Address Modal */}
                            {showAddAddressModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#808080]/20">
                                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                                        <h3 className="text-lg font-medium mb-4">Add New Address</h3>
                                        <textarea
                                            className="w-full p-2 border border-gray-300 rounded mb-4"
                                            rows={3}
                                            placeholder="Enter full address"
                                            value={newAddress}
                                            onChange={(e) => setNewAddress(e.target.value)}
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button
                                                className="px-4 py-2 border border-gray-300 rounded"
                                                onClick={() => setShowAddAddressModal(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="px-4 py-2 bg-[#022B23] text-white rounded"
                                                onClick={handleAddNewAddress}
                                            >
                                                Save Address
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={handleCheckout}
                                disabled={isLoading || cartItems.length === 0 || isSessionLoading}
                                className={`bg-[#022B23] w-full h-[56px] gap-[9px] mt-[10px] rounded-[12px] flex justify-center items-center hover:bg-[#033a30] transition-colors ${
                                    isLoading || cartItems.length === 0 || isSessionLoading ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            >
                                {isLoading || isSessionLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#C6EB5F]"></div>
                                        <p className="text-[#C6EB5F] text-[14px] font-semibold">
                                            {isSessionLoading ? 'Checking session...' : 'Processing...'}
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-[#C6EB5F] text-[14px] font-semibold">Continue to payment</p>
                                        <Image src={limeArrow} alt="Arrow" width={18} height={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default function CartPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Cart />
        </Suspense>
    );
}
