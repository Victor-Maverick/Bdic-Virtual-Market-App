'use client';
import { useState } from "react";
import ProductDetailHeader from "@/components/productDetailHeader";
import ProductDetailHeroBar from "@/components/productDetailHeroBar";
import NavigationBar from "@/components/navigationBar";
import Toast from "@/components/toast";
import cart from '../../../public/assets/images/black cart.png';
import Image from "next/image";
import arrow from '../../../public/assets/images/blackArrow.png';
import card_tick from '../../../public/assets/images/card-tick.png';
import iphone from "../../../public/assets/images/iphone13.svg";
import trash from '../../../public/assets/images/trash.png';
import fan from "../../../public/assets/images/table fan.png";
import pepper from "../../../public/assets/images/pepper.jpeg";
import grayAddressIcon from '../../../public/assets/images/greyAddressIcon.svg'
import whiteAddressIcon from "../../../public/assets/images/addressIcon.svg";
import addIcon from '../../../public/assets/images/add-circle.svg'
import limeArrow from '../../../public/assets/images/green arrow.png'
import axios from 'axios';

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

const initialProducts = [
    { name: "Sea Blue iPhone 14", description: "6GB ROM / 128GB RAM", image: iphone, price: "850,000", quantity: 1 },
    { name: "Table Fan", description: "Powerful cooling fan", image: fan, price: "950,000", quantity: 1 },
    { name: "Fresh Pepper", description: "Organic farm produce", image: pepper, price: "35,000", quantity: 1 },
    { name: "Sea Blue iPhone 14", description: "6GB ROM / 128GB RAM", image: iphone, price: "40,000", quantity: 1 },
];

const Cart = () => {
    const [products, setProducts] = useState(initialProducts);
    const [hover, setHover] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);
    const [authorizationUrl, setAuthorizationUrl] = useState('');

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

    // Calculate total amount
    const calculateTotal = () => {
        const subtotal = products.reduce((sum, product) => {
            const price = parseFloat(product.price.replace(',', ''));
            return sum + (price * product.quantity);
        }, 0);
        const delivery = 20000;
        return subtotal + delivery;
    };

    // Initialize payment with backend API using axios
    const initializePayment = async (): Promise<string> => {
        try {
            const customerEmail = `customer@digitalmarket.com`; // Replace with actual customer email
            const totalAmount = calculateTotal();

            const requestData: InitializePaymentRequest = {
                email: customerEmail,
                amount: totalAmount * 100, // Convert to kobo
                currency: 'NGN',
                callbackUrl: `/buyer/track-order`
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

    const handlePaymentSuccess = () => {
        // Close the modal
        setShowPaymentSuccessModal(false);
        // Redirect to payment page
        window.location.href = authorizationUrl;
    };

    const handleClick = async () => {
        setIsLoading(true);

        try {
            // Validate cart has items
            if (products.length === 0) {
                throw new Error('Your cart is empty. Please add items before proceeding to payment.');
            }

            showSuccessToast('Processing Order', 'Initializing payment...');

            // Initialize payment and get authorization URL
            const url = await initializePayment();
            setAuthorizationUrl(url);

            console.log('Payment initialized successfully, showing success modal');

            // Show success modal instead of immediately redirecting
            setShowPaymentSuccessModal(true);
            setIsLoading(false);

        } catch (error) {
            console.error('Error in handleClick:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
            showErrorToast('Payment Error', errorMessage);
            setIsLoading(false);
        }
    };

    const updateQuantity = (index: number, change: number) => {
        setProducts((prevProducts) =>
            prevProducts.map((product, i) =>
                i === index
                    ? { ...product, quantity: Math.max(1, product.quantity + change) }
                    : product
            )
        );
    };

    const removeProduct = (index: number) => {
        setProducts((prevProducts) => prevProducts.filter((_, i) => i !== index));
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

            {/* Payment Success Modal */}
            {showPaymentSuccessModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full text-center">
                        <h2 className="text-lg font-semibold text-green-600 mb-4">Payment Initialized Successfully!</h2>
                        <p className="text-gray-600 text-sm mb-6">
                            You&#39;re about to be redirected to the payment page to complete your transaction.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowPaymentSuccessModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePaymentSuccess}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Proceed to Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ProductDetailHeader />
            <ProductDetailHeroBar />
            <NavigationBar page="//smart phone//product name//" name="cart" />

            <div className="px-[100px] py-[10px] border-b border-[#ededed]">
                <div className="w-[182px] h-[46px] flex border-[0.5px] border-[#ededed] rounded-[4px] p-[2px]">
                    <div className="flex justify-center gap-[2px] items-center bg-[#F9F9F9] w-[180px] h-[40px]">
                        <Image src={cart} alt={'cart icon'} width={20} height={20} />
                        <p className="text-[14px] text-[#1E1E1E]">My cart</p>
                        <p className="font-medium text-[14px] text-[#1E1E1E]">({products.length} products)</p>
                    </div>
                </div>
            </div>

            <div className="flex px-[100px] items-center mt-[20px] gap-[24px]">
                <div className="flex gap-[6px] items-center">
                    <Image src={cart} alt={'cart'} width={20} height={20} />
                    <p className="text-[14px] font-medium">Cart / checkout</p>
                </div>
                <Image src={arrow} alt={'arrow'} className="w-[14px] h-[14px]" />
                <div className="flex gap-[6px] items-center">
                    <Image src={card_tick} alt={'card'} />
                    <p className="text-[14px] text-[#707070]">Payment</p>
                </div>
            </div>

            <div className="flex gap-[12px] mt-[20px] px-[100px] py-4">
                <div className="border-[0.5px] border-[#ededed] w-[60%] h-full rounded-[14px]">
                    {products.map((product, index) => {
                        const isLastItem = index === products.length - 1;
                        return (
                            <div
                                key={index}
                                className={`flex items-center ${!isLastItem ? 'border-b border-[#ededed]' : 'border-none'}`}
                            >
                                <div className="flex border-r border-[#ededed] w-[133px] h-[110px] overflow-hidden">
                                    <Image src={product.image} alt="image" width={133} height={110} className="w-full h-full" />
                                </div>

                                <div className="flex items-center w-full px-[20px] justify-between">
                                    <div className="flex flex-col w-[30%]">
                                        <div className="mb-[13px]">
                                            <p className="text-[14px] text-[#1E1E1E] font-medium mb-[4px]">{product.name}</p>
                                            <p className="text-[10px] font-normal text-[#3D3D3D]">{product.description}</p>
                                        </div>
                                        <p className="font-medium text-[16px]">₦{product.price}.00</p>
                                    </div>

                                    <div className="w-[114px] h-[38px] flex justify-center items-center shrink-0">
                                        <button
                                            className="w-[38px] h-[38px] flex justify-center items-center rounded-[8px] bg-[#F9F9F9] border-[0.5px] border-[#ededed]"
                                            onClick={() => updateQuantity(index, -1)}
                                        >
                                            <p className="text-[14px] font-medium">-</p>
                                        </button>
                                        <div className="w-[38px] h-[38px] flex justify-center items-center">
                                            <p className="text-[14px] font-medium">{product.quantity}</p>
                                        </div>
                                        <button
                                            className="w-[38px] h-[38px] flex rounded-[8px] justify-center items-center bg-[#F9F9F9] border-[0.5px] border-[#ededed]"
                                            onClick={() => updateQuantity(index, 1)}
                                        >
                                            <p className="text-[14px] font-medium">+</p>
                                        </button>
                                    </div>

                                    <div className="flex gap-[4px] items-center w-[20%] justify-end">
                                        <Image
                                            src={trash}
                                            alt={'trash'}
                                            width={19}
                                            height={19}
                                            className="w-[19px] h-[19px] cursor-pointer"
                                            onClick={() => removeProduct(index)}
                                        />
                                        <p
                                            className="text-[14px] text-[#707070] font-normal cursor-pointer"
                                            onClick={() => removeProduct(index)}
                                        >
                                            Remove
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex-col w-[40%] space-y-[10px]">
                    <p className="text-[#022B23] font-weight text-[14px] mb-[10px]">Order summary</p>
                    <div className="h-[215px] bg-[#F9F9F9] p-[24px] space-y-[10px]  rounded-[14px]">
                        <div className="flex justify-between items-center">
                            <p className="text-[#022B23] text-[14px] font-normal">Subtotal</p>
                            <p className="text-[14px] font-semibold text-[#1E1E1E]">₦{calculateTotal() - 20000}.00</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-[#022B23] text-[14px] font-normal">Discount</p>
                            <p className="text-[14px] font-semibold text-[#1E1E1E]">₦0.00</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-[#022B23] text-[14px] font-normal">VAT</p>
                            <p className="text-[14px] font-semibold text-[#1E1E1E]">0%</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-[#022B23] text-[14px] font-normal">Delivery</p>
                            <p className="text-[14px] font-semibold text-[#1E1E1E]">₦20,000.00</p>
                        </div>
                        <div className="flex justify-between items-center mt-[20px]">
                            <p className="text-[#022B23] text-[18px] font-normal">Total</p>
                            <p className="text-[18px] font-semibold text-[#1E1E1E]">₦{calculateTotal().toLocaleString()}.00</p>
                        </div>
                    </div>
                    <div className="flex gap-[20px]">
                        <div className="w-[380px] flex rounded-[12px] border-[1.5px] border-[#D1D1D1] h-[48px]">
                            <div className="flex justify-center items-center w-[98px] border-r border-[#D1D1D1] rounded-tl-[12px] rounded-bl-[12px] h-full bg-[#F6F6F6]">
                                <p className="text-[14px] font-medium text-[#121212]">COUPON</p>
                            </div>
                            <input className="p-[10px] w-full outline-none bg-transparent text-[14px] font-medium text-[#121212]" placeholder="Enter coupon code" />
                        </div>
                        <div className="w-[116px] bg-[#022B23] h-[48px] flex justify-center items-center rounded-[12px]">
                            <p className="text-[#C6EB5F] font-semibold text-[16px]">Apply</p>
                        </div>
                    </div>
                    <div className="flex-col mt-[30px] space-y-[5px]">
                        <p className="font-medium text-[14px] text-[#022B23]">Delivery option</p>
                        <div className="min-h-[200px] bg-[#f9f9f9] rounded-[14px]  p-[10px] flex-col ">
                            <div className="flex gap-[10px] py-[10px] px-[8px] cursor-pointer hover:bg-[#022B23] hover:text-white hover:rounded-[14px]">
                                <Image
                                    src={hover ? whiteAddressIcon : grayAddressIcon}
                                    alt="icon"
                                    width={20}
                                    height={20}
                                    onMouseEnter={() => setHover(true)}
                                    onMouseLeave={() => setHover(false)}
                                />
                                <div className="flex-col ">
                                    <p className="text-[14px]  font-medium">Pick up at the market</p>
                                    <p className="text-[12px] ">Shop 2C,  Abba Technologies, Modern market, Makurdi</p>
                                </div>
                            </div>
                            <div className="flex gap-[10px] py-[10px] px-[8px] cursor-pointer hover:bg-[#022B23] hover:text-white hover:rounded-[14px]">
                                <Image
                                    src={hover ? whiteAddressIcon : grayAddressIcon}
                                    alt="icon"
                                    width={20}
                                    height={20}
                                    onMouseEnter={() => setHover(true)}
                                    onMouseLeave={() => setHover(false)}
                                />
                                <div className="flex-col ">
                                    <p className="text-[14px]  font-medium">Delivery at my address</p>
                                    <p className="text-[12px] ">No. 4 Vandeikya Street, Hight Level, Makurdi</p>
                                </div>
                            </div>
                            <div className="flex gap-[10px] py-[10px] px-[8px] cursor-pointer hover:bg-[#022B23] hover:text-white hover:rounded-[14px]">
                                <Image
                                    src={hover ? addIcon : addIcon}
                                    alt="icon"
                                    width={20}
                                    height={20}
                                    onMouseEnter={() => setHover(true)}
                                    onMouseLeave={() => setHover(false)}
                                />
                                <div className="flex-col ">
                                    <p className="text-[14px]  font-medium">Add new address</p>
                                    <p className="text-[12px] ">No address set yet? add a new delivery address</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleClick}
                            disabled={isLoading || products.length === 0}
                            className={`bg-[#022B23] cursor-pointer w-full h-[56px] gap-[9px] mt-[10px] rounded-[12px] flex justify-center items-center hover:bg-[#033a30] transition-colors ${
                                isLoading || products.length === 0 ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#C6EB5F]"></div>
                                    <p className="text-[#C6EB5F] text-[14px] font-semibold">Processing...</p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-[#C6EB5F] text-[14px] font-semibold">Continue to payment</p>
                                    <Image src={limeArrow} alt={'image'} className="w-[18px] h-[18px]"/>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;