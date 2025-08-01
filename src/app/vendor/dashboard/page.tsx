'use client'
import DashboardHeader from "@/components/dashboardHeader";
import DashboardSubHeader from "@/components/dashboardSubHeader";
import archiveImg from '../../../../public/assets/images/archive.svg'
import Image from "next/image";
import biArrows from '../../../../public/assets/images/biArrows.svg'
import awardImg from '../../../../public/assets/images/award.svg'
import dropBoxImg from '../../../../public/assets/images/dropbox.svg'
import flag from '../../../../public/assets/images/flag-2.svg'
import arrowUp from '../../../../public/assets/images/arrow-up.svg'
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import {useEffect, useState, useCallback} from "react";
import DashboardOptions from "@/components/dashboardOptions";
import dashSlideImg from "../../../../public/assets/images/dashSlideImg.png";
import axios from "axios";
import {useSearchParams} from "next/navigation";
import Toast from "@/components/Toast";
import VendorVideoCallWrapper from "@/components/VendorVideoCallWrapper";

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


interface ShopStatistics {
    pendingOrderCount: number;
    deliveredOrderCount: number;
    shippedOrderCount: number;
    totalOrderCount: number;
    processingOrderCount: number;
}

type Product = {
    id: number;
    mainImageUrl: string;
    name: string;
    review: number;
    status: string;
    quantitySold: number;
    price: number;
    salesAmount: string;
    quantity: number;
    remainingStock: string;
};

const DashBoard = () => {
    const [activeView, setActiveView] = useState('orders');
    const [shopData, setShopData] = useState<ShopData>();
    const [loading, setLoading] = useState(true);
    const [activating, setActivating] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const {data: session} = useSession();
    // Toast state
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<"success" | "error">("success");
    const [toastMessage, setToastMessage] = useState("");
    const [toastSubMessage, setToastSubMessage] = useState("");
    const [completedTransactions, setCompletedTransactions] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [totalStock, setTotalStock] = useState(0);
    const [bestSelling, setBestSelling] = useState<Product>();
    const [shopStatistics, setShopStatistics] = useState<ShopStatistics | null>(null);

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

                // Fetch all related data after shop data is loaded
                if (data.id) {
                    const [
                        countResponse,
                        amountResponse,
                        stockResponse,
                        productResponse,
                        statsResponse
                    ] = await Promise.all([
                        axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/getShopTransactionCount?shopId=${data.id}`),
                        axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/getShopTransactionAmount?shopId=${data.id}`),
                        axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/getShopStockCount?shopId=${data.id}`),
                        axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/getBestSelling?shopId=${data.id}`),
                        axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/getShopStatistics?shopId=${data.id}`)
                    ]);

                    setCompletedTransactions(countResponse.data);
                    setTotalSales(amountResponse.data);
                    setTotalStock(stockResponse.data);
                    setBestSelling(productResponse.data);
                    setShopStatistics(statsResponse.data);
                }
            } catch (error) {
                console.error('Error fetching shop data:', error);
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
                // Verify shop status after successful payment
                if (session?.user.email) {
                    const shopVerified = await verifyShopStatus(session.user.email);
                    if (shopVerified) {
                        showSuccessToast('Payment Successful', 'Your shop has been activated successfully');
                        // Refresh shop data
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
                <DashboardHeader/>
                <div className="flex justify-center items-center h-screen">
                    <p>Loading...</p>
                </div>
            </>
        );
    }

    if (!shopData) {
        return (
            <>
                <DashboardHeader/>
                <DashboardOptions/>
                <DashboardSubHeader welcomeText={"Hey, welcome"} description={"Explore your shop, products, sales and orders"}
                                    background={'#ECFDF6'} image={dashSlideImg} textColor={'#05966F'}/>
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

    if (shopData.status === 'NOT_VERIFIED') {
        return (
            <>
                <DashboardHeader/>
                <DashboardOptions/>
                <DashboardSubHeader welcomeText={"Hey, welcome"} description={"Explore your shop, products, sales and orders"}
                                    background={'#ECFDF6'} image={dashSlideImg} textColor={'#05966F'}/>
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

    // Calculate order percentages for the stats visualization
    const calculateOrderPercentage = (count: number) => {
        if (!shopStatistics?.totalOrderCount || shopStatistics.totalOrderCount === 0) return 0;
        return (count / shopStatistics.totalOrderCount) * 100;
    };

    return (
        <VendorVideoCallWrapper>
            <DashboardHeader/>
            <DashboardOptions/>
            <DashboardSubHeader welcomeText={"Hey, welcome"} description={"Explore your shop, products, sales and orders"}
                                background={'#ECFDF6'} image={dashSlideImg} textColor={'#05966F'}/>
            <div className="h-[58px] px-25 border-b-[0.5px] border-[#EDEDED] items-center flex">
                <p className="text-[#022B23] font-medium text-[20px]">Dashboard overview</p>
            </div>
            <div className="flex flex-col gap-[32px] py-[10px]">
                <div className="px-25 w-[919px] flex flex-col gap-[12px]">
                    <p className="font-medium text-[16px] text-[#022B23]">Sales summary</p>
                    <div className="flex items-center gap-[20px] h-[100px]">
                        <div className="w-[246px] hover:shadow-2xl h-full border-[0.5px] rounded-[14px] bg-[#ECFDF6] border-[#52A43E]">
                            <div className="flex items-center gap-[8px] text-[12px] text-[#52A43E] font-medium p-[15px]">
                                <Image src={biArrows} alt="total sales" width={18} height={18} className="h-[18px] w-[18px]"/>
                                <p>Total sales ({completedTransactions.toLocaleString()})</p>
                            </div>
                            <div className="flex justify-between px-[15px]">
                                <p className="text-[#18181B] font-medium text-[16px]">N {totalSales.toLocaleString()}.00</p>
                            </div>
                        </div>

                        <div className="w-[246px] hover:shadow-2xl h-full border-[0.5px] rounded-[14px] bg-[#FFFFFF] border-[#E4E4E7]">
                            <div className="flex items-center gap-[8px] text-[12px] text-[#707070] font-medium p-[15px]">
                                <Image src={archiveImg} alt="completed transactions" width={18} height={18}
                                       className="h-[18px] w-[18px]"/>
                                <p>Completed transactions</p>
                            </div>
                            <div className="flex justify-between px-[15px]">
                                <p className="text-[#18181B] font-medium text-[16px]">{completedTransactions.toLocaleString()}</p>
                                <div className="flex items-center gap-[4px]">
                                    <Image src={arrowUp} alt={'image'} width={10} height={10}/>
                                    <p className="text-[#22C55E] text-[12px]">2%</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-[246px] hover:shadow-2xl h-full border-[0.5px] rounded-[14px] bg-[#FFFFFF] border-[#FF9500]">
                            <div className="flex items-center gap-[8px] text-[12px] text-[#707070] font-medium p-[15px]">
                                <Image src={awardImg} alt="pending orders" width={18} height={18}
                                       className="h-[18px] w-[18px]"/>
                                <p>Pending orders</p>
                            </div>
                            <p className="text-[#18181B] ml-[15px] font-medium text-[16px]">0</p>
                        </div>
                    </div>

                    <p className="font-medium  text[16px] text-[#022B23] mt-[20px]">Store performance</p>
                    <div className="flex items-center gap-[20px] h-[100px]">
                        <div className="w-[246px] hover:shadow-2xl h-full border-[0.5px] rounded-[14px] bg-[#FFFFFF] border-[#E4E4E7]">
                            <div className="flex items-center gap-[8px] text-[12px] text-[#707070] font-medium p-[15px]">
                                <Image src={dropBoxImg} alt="top product" width={18} height={18}
                                       className="h-[18px] w-[18px]"/>
                                <p>Top selling product</p>
                            </div>
                            <div className="flex justify-between px-[15px]">
                                <p className="text-[#18181B] font-medium text-[16px]">
                                    {bestSelling?.name || 'No best selling product'}
                                </p>
                                <div className="flex items-center gap-[4px]">
                                    <Image src={arrowUp} alt={'image'} width={10} height={10}/>
                                    <p className="text-[#22C55E] text-[12px]">2%</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-[246px] hover:shadow-2xl h-full border-[0.5px] rounded-[14px] bg-[#FFFFFF] border-[#E4E4E7]">
                            <div className="flex items-center gap-[8px] text-[12px] text-[#707070] font-medium p-[15px]">
                                <Image src={flag} alt="inventory" width={18} height={18} className="h-[18px] w-[18px]"/>
                                <p>All products (in stock)</p>
                            </div>
                            <div className="flex justify-between px-[15px]">
                                <p className="text-[#18181B] font-medium text-[16px]">{totalStock.toLocaleString()}</p>
                                <div className="flex items-center gap-[4px]">
                                    <Image src={arrowUp} alt={'image'} width={10} height={10}/>
                                    <p className="text-[#22C55E] text-[12px]">2%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-[366px] mx-[100px] border-[1px] border-[#ededed] rounded-[24px] p-6">
                    <div className="flex items-center text-[#8C8C8C] text-[10px] w-[91px] h-[26px] border-[0.5px] border-[#ededed] rounded-[8px] relative mb-4">
                        <div
                            className={`flex items-center justify-center w-[100%] h-full z-10 cursor-pointer ${
                                activeView === 'orders' ? 'border-l-[1px] border-[#ededed] w-[49px] rounded-tr-[8px] rounded-br-[8px] bg-[#F8FAFB] text-[#8C8C8C]' : ''
                            }`}
                            onClick={() => setActiveView('orders')}
                        >
                            <p>Orders</p>
                        </div>
                        <div
                            className={`absolute top-0 h-full w-[50%] rounded-[6px] transition-all ${
                                activeView === 'visits' ? ' left-0 bg-[#F8FAFB]' : 'left-[50%] bg-[#F8FAFB]'
                            }`}
                        ></div>
                    </div>

                    {activeView === 'orders' && shopStatistics && (
                        <>
                            <div className="flex text-[#7A7A7A] text-[14px] mt-[30px] font-semibold justify-between items-center">
                                <p>ORDERS</p>
                                <select className="text-[#707070] text-[12px] border-[1px] p-[10px] border-[#F2F2F2] shadow-xs w-[123px] h-[38px] rounded-[8px] bg-white">
                                    <option>Last 7 days</option>
                                    <option>Last 30 days</option>
                                    <option>Last 90 days</option>
                                </select>
                            </div>
                            <div className="flex justify-between items-center my-5">
                                <div className="flex items-center gap-[5px]">
                                    <h3 className="text-[#18181B] font-medium text-[44px]">{shopStatistics.totalOrderCount}</h3>
                                </div>
                            </div>
                            <div className="mb-[20px] h-[4px] w-full bg-gray-200 rounded-full">
                                <div className="flex h-full">
                                    <div
                                        className="bg-[#C6EB5F]"
                                        style={{ width: `${calculateOrderPercentage(shopStatistics.deliveredOrderCount)}%` }}
                                    ></div>
                                    <div
                                        className="bg-[#1E1E1E]"
                                        style={{ width: `${calculateOrderPercentage(shopStatistics.shippedOrderCount)}%` }}
                                    ></div>
                                    <div
                                        className="bg-[#FF5050]"
                                        style={{ width: `${calculateOrderPercentage(shopStatistics.pendingOrderCount)}%` }}
                                    ></div>
                                    <div
                                        className="bg-[#F99007]"
                                        style={{ width: `${calculateOrderPercentage(shopStatistics.processingOrderCount)}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <div className="w-[234px] border-[1px] flex flex-col border-[#EDEDED] gap-[9px] rounded-lg p-4">
                                    <div className="flex items-center gap-[9px]">
                                        <span className="rounded-full w-[6px] h-[6px] bg-[#C6EB5F]"></span>
                                        <p className="text-[#707070] text-[12px]">DELIVERED</p>
                                    </div>
                                    <div className="flex w-[108px] h-[28px] items-center gap-[10px]">
                                        <span className="text-[#18181B] font-medium text-[20px]">
                                            {shopStatistics.deliveredOrderCount}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-[326px] border-[1px] flex flex-col border-[#EDEDED] gap-[9px] rounded-[8px] p-4">
                                    <div className="flex items-center gap-[9px]">
                                        <span className="rounded-full w-[6px] h-[6px] bg-[#1E1E1E]"></span>
                                        <p className="text-[#707070] text-[12px]">SHIPPED</p>
                                    </div>
                                    <div className="flex w-[108px] h-[28px] items-center gap-[10px]">
                                        <span className="text-[#18181B] font-medium text-[20px]">
                                            {shopStatistics.shippedOrderCount}
                                        </span>
                                    </div>
                                </div>

                                <div className="w-[234px] border-[1px] flex flex-col border-[#EDEDED] gap-[9px] rounded-lg p-4">
                                    <div className="flex items-center gap-[9px]">
                                        <span className="rounded-full w-[6px] h-[6px] bg-[#FF5050]"></span>
                                        <p className="text-[#707070] text-[12px]">PENDING</p>
                                    </div>
                                    <div className="flex w-[108px] h-[28px] items-center gap-[10px]">
                                        <span className="text-[#18181B] font-medium text-[20px]">
                                            {shopStatistics.pendingOrderCount}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-[234px] border-[1px] flex flex-col border-[#EDEDED] gap-[9px] rounded-lg p-4">
                                    <div className="flex items-center gap-[9px]">
                                        <span className="rounded-full w-[6px] h-[6px] bg-[#F99007]"></span>
                                        <p className="text-[#707070] text-[12px]">PROCESSING</p>
                                    </div>
                                    <div className="flex w-[108px] h-[28px] items-center gap-[10px]">
                                        <span className="text-[#18181B] font-medium text-[20px]">
                                            {shopStatistics.processingOrderCount}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>



            {showToast && (
                <Toast
                    type={toastType}
                    message={toastMessage}
                    subMessage={toastSubMessage}
                    onClose={handleCloseToast}
                />
            )}
        </VendorVideoCallWrapper>
    );
};

export default DashBoard;