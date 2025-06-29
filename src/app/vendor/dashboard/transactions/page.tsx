'use client'
import DashboardHeader from "@/components/dashboardHeader";
import Image from "next/image";
import biArrows from "../../../../../public/assets/images/biArrows.svg";
import arrowUp from "../../../../../public/assets/images/arrow-up.svg";
import exportImg from "../../../../../public/assets/images/exportImg.svg";
import archiveImg from "../../../../../public/assets/images/archive.svg";
import Stats from "../../../../../public/assets/images/Stats.svg";
import { useCallback, useEffect, useState } from "react";
import iPhone from "../../../../../public/assets/images/blue14.png";
import arrowDown from "../../../../../public/assets/images/arrow-down.svg";
import PayoutRequestModal from "@/components/payoutRequestModal";
import PayoutRequestSuccessModal from "@/components/payoutRequestSuccessModal";
import DashboardOptions from "@/components/dashboardOptions";
import axios from "axios";
import { useSession } from "next-auth/react";

interface OrderResponse {
    id: number;
    orderNumber: string;
    buyerEmail: string;
    status: OrderStatus;
    deliveryInfo: DeliveryInfo;
    totalAmount: number;
    deliveryFee: number;
    grandTotal: number;
    createdAt: string;
    items: OrderItemDto[];
    isParentOrder: boolean;
    shopId: number;
    shopOrdersCount: number;
}

interface OrderItemDto {
    id: number;
    productId: number;
    productName: string;
    description: string;
    productImage: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

interface DeliveryInfo {
    method: string;
    address: string;
}

enum OrderStatus {
    PAID = 'PAID',
    PENDING_DELIVERY = 'PENDING_DELIVERY',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

const ProductTableRow = ({ order, isLast }: { order: OrderResponse; isLast: boolean }) => {
    const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    const formattedTime = new Date(order.createdAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    const firstItem = order.items[0];

    return (
        <div className={`flex h-[72px] ${!isLast ? 'border-b border-[#EAECF0]' : ''}`}>
            <div className="flex items-center w-[35%] pr-[24px] gap-3">
                <div className="bg-[#f9f9f9] h-full w-[70px] overflow-hidden mt-[2px]">
                    <Image
                        src={firstItem.productImage || iPhone}
                        alt={firstItem.productName}
                        width={70}
                        height={70}
                        className="object-cover h-full"
                    />
                </div>
                <div className="flex flex-col">
                    <p className="text-[14px] font-medium text-[#101828]">{firstItem.productName}</p>
                    {order.items.length > 1 && (
                        <p className="text-[12px] text-[#667085]">+{order.items.length - 1} more items</p>
                    )}
                </div>
            </div>

            <div className="flex items-center w-[30%] px-[20px]">
                <div className={`w-[50%] h-[22px] rounded-[8px] flex items-center justify-center ${
                    order.status === OrderStatus.PAID || order.status === OrderStatus.DELIVERED
                        ? 'bg-[#ECFDF3] text-[#027A48]'
                        : 'bg-[#FEF3F2] text-[#FF5050]'
                }`}>
                    <p className="text-[12px] font-medium capitalize">{order.status.toLowerCase().replace('_', ' ')}</p>
                </div>
            </div>

            <div className="flex flex-col w-[15%] px-[16px] justify-center">
                <p className="text-[14px] text-[#101828]">{formattedDate}</p>
                <p className="text-[14px] text-[#667085]">{formattedTime}</p>
            </div>

            <div className="flex flex-col gap-[4px] justify-center w-[20%] px-[16px]">
                <p className="text-[14px] font-medium text-[#101828]">
                    {order.deliveryInfo.method}
                </p>
            </div>

        </div>
    );
};

const Transactions = () => {
    const [activeView, setActiveView] = useState<'product-transactions' | 'pay-outs'>('product-transactions');
    const [currentPage, setCurrentPage] = useState(1);
    const [isPayoutRequestModalOpen, setIsPayoutRequestModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [completedTransactions, setCompletedTransactions] = useState(0);
    const [totalSales, setTotalSales] = useState(0);

    const PRODUCTS_PER_PAGE = 5;
    const totalPages = Math.ceil(orders.length / PRODUCTS_PER_PAGE);
    const currentOrders = orders.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
    );

    const fetchShopData = useCallback(async () => {
        if (session?.user?.email) {
            try {
                setLoading(true);
                const response = await axios.get(`https://digitalmarket.benuestate.gov.ng/api/shops/getbyEmail?email=${session.user.email}`);
                const data = response.data;

                if (data.id) {
                    const [countResponse, amountResponse, orderResponse] = await Promise.all([
                        axios.get(`https://digitalmarket.benuestate.gov.ng/api/orders/getShopTransactionCount?shopId=${data.id}`),
                        axios.get(`https://digitalmarket.benuestate.gov.ng/api/orders/getShopTransactionAmount?shopId=${data.id}`),
                        axios.get(`https://digitalmarket.benuestate.gov.ng/api/orders/get-shop-orders?shopId=${data.id}`)
                    ]);

                    setCompletedTransactions(countResponse.data);
                    setTotalSales(amountResponse.data);
                    setOrders(orderResponse.data);
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

    const handleOpenPayoutRequest = () => {
        setIsPayoutRequestModalOpen(true);
    };

    const handlePayoutRequestSuccess = () => {
        setIsPayoutRequestModalOpen(false);
        setIsSuccessModalOpen(true);
    };

    const handleCloseSuccessModal = () => {
        setIsSuccessModalOpen(false);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            <DashboardHeader />
            <DashboardOptions />

            <div className="flex flex-col py-[30px] px-25">
                <div className="flex flex-col gap-[12px]">
                    <p className="text-[#022B23] text-[16px] font-medium">Transaction summary</p>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-[20px]">
                            <div className="flex hover:shadow-xl border-[0.5px] bg-[#FFFAEB] h-[100px] flex-col gap-[12px] p-[12px] border-[#F99007] rounded-[14px] w-[246px]">
                                <div className="flex items-center text-[#022B23] text-[12px] font-medium gap-[8px]">
                                    <Image src={biArrows} alt="Total amount earned" />
                                    <p>Total amount earned</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-[#18181B] hover:shadow-xl text-[16px] font-medium">N {totalSales.toLocaleString()}.00</p>
                                    <div className="flex gap-[4px] items-center">
                                        <Image src={arrowUp} alt="Increase" />
                                        <p className="text-[#22C55E] text-[12px] font-medium">2%</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex hover:shadow-xl border-[0.5px] flex-col gap-[12px] p-[12px] border-[#E4E4E7] rounded-[14px] h-[110px] w-[324px]">
                                <div className="flex justify-between">
                                    <div className="flex items-center text-[#022B23] text-[12px] font-medium gap-[8px]">
                                        <Image src={exportImg} alt="Available for payout" />
                                        <p>Available for payout</p>
                                    </div>
                                    <span
                                        onClick={handleOpenPayoutRequest}
                                        className="text-[#C6EB5F] cursor-pointer flex justify-center items-center text-[12px] font-medium h-[30px] w-[113px] rounded-[100px] px-[8px] py-[6px] bg-[#022B23]"
                                    >
                                        Request payout
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-[#18181B] text-[16px] font-medium">N {totalSales.toLocaleString()}.00</p>
                                    <div className="flex gap-[4px] items-center">
                                        <Image src={arrowUp} alt="Increase" />
                                        <p className="text-[#22C55E] text-[12px] font-medium">2%</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex hover:shadow-xl border-[0.5px] flex-col gap-[12px] p-[12px] border-[#E4E4E7] rounded-[14px] h-[100px] w-[246px]">
                                <div className="flex items-center text-[#71717A] text-[12px] font-medium gap-[8px]">
                                    <Image src={archiveImg} alt="Completed deliveries" />
                                    <p>Completed deliveries</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-[#18181B] text-[16px] font-medium">{completedTransactions}</p>
                                    <div className="flex gap-[4px] items-center">
                                        <Image src={arrowUp} alt="Increase" />
                                        <p className="text-[#22C55E] text-[12px] font-medium">2%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-[100px] border-[1px] border-[#ededed] rounded-[24px] pt-6 mb-10">
                <div className="flex items-center text-[#8C8C8C] text-[10px] w-[174px] mx-6 h-[26px] border-[0.5px] border-[#ededed] rounded-[8px] relative mb-4">
                    <div
                        className={`flex items-center justify-center w-[115px] h-full z-10 cursor-pointer ${
                            activeView === 'product-transactions'
                                ? 'border-r-[1px] border-[#ededed] rounded-tl-[8px] rounded-bl-[8px] bg-[#F8FAFB] text-[#8C8C8C]'
                                : ''
                        }`}
                        onClick={() => {
                            setActiveView('product-transactions');
                            setCurrentPage(1);
                        }}
                    >
                        <p>Product Transactions</p>
                    </div>
                    <div
                        className={`flex items-center justify-center w-[50%] h-full z-10 cursor-pointer ${
                            activeView === 'pay-outs'
                                ? 'border-l-[1px] border-[#ededed] rounded-tr-[8px] rounded-br-[8px] bg-[#F8FAFB] text-[#8C8C8C]'
                                : ''
                        }`}

                    >
                        <p>Pay outs</p>
                    </div>
                    <div
                        className={`absolute top-0 h-full rounded-[6px] transition-all ${
                            activeView === 'product-transactions'
                                ? 'left-0 bg-[#F8FAFB]'
                                : 'left-[50%] bg-[#F8FAFB]'
                        }`}
                    ></div>
                </div>

                {activeView === 'product-transactions' ? (
                    <>
                        <div className="flex flex-col">
                            <div className="mx-6 mb-6 flex flex-col">
                                <p className="text-[#101828] font-medium">All transactions</p>
                                <p className="text-[#667085] text-[14px]">View all your transaction details</p>
                            </div>

                            <div className="flex h-[44px] bg-[#F9FAFB] border-b-[1px] border-[#EAECF0]">
                                <div className="flex items-center px-[24px] w-[35%] py-[12px] gap-[4px]">
                                    <p className="text-[#667085] font-medium text-[12px]">Products</p>
                                    <Image src={arrowDown} alt="Sort" width={12} height={12} />
                                </div>
                                <div className="flex items-center px-[24px] w-[30%] py-[12px]">
                                    <p className="text-[#667085] font-medium text-[12px]">Status</p>
                                </div>
                                <div className="flex items-center px-[24px] w-[15%] py-[12px]">
                                    <p className="text-[#667085] font-medium text-[12px]">Date</p>
                                </div>
                                <div className="flex items-center px-[24px] w-[20%] py-[12px]">
                                    <p className="text-[#667085] font-medium text-[12px]">Delivery method</p>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                {loading ? (
                                    <div className="flex justify-center items-center h-[200px]">
                                        <p>Loading transactions...</p>
                                    </div>
                                ) : currentOrders.length > 0 ? (
                                    currentOrders.map((order, index) => (
                                        <ProductTableRow
                                            key={order.id}
                                            order={order}
                                            isLast={index === currentOrders.length - 1}
                                        />
                                    ))
                                ) : (
                                    <div className="flex justify-center items-center h-[200px]">
                                        <p>No transactions found</p>
                                    </div>
                                )}
                            </div>

                            {orders.length > 0 && (
                                <div className="flex justify-between items-center mt-4 px-6 pb-6">
                                    <button
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                        className={`px-4 py-2 rounded-md ${
                                            currentPage === 1
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'text-[#022B23] hover:bg-gray-100'
                                        }`}
                                    >
                                        Previous
                                    </button>

                                    <div className="flex gap-2">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-8 h-8 rounded-md flex items-center justify-center ${
                                                    currentPage === page
                                                        ? 'bg-[#022B23] text-white'
                                                        : 'text-[#022B23] hover:bg-gray-100'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className={`px-4 py-2 rounded-md ${
                                            currentPage === totalPages
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'text-[#022B23] hover:bg-gray-100'
                                        }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
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
                                <h3 className="text-[#18181B] font-medium text-[44px]">{orders.length}</h3>
                                <div className="flex items-center w-[45px] h-[20px] text-[12px] font-medium rounded-[4px] text-[#377E36] bg-[#E0F0E4] justify-center">
                                    <p>+3.4%</p>
                                </div>
                            </div>
                        </div>
                        <Image src={Stats} alt={'stats'} className="mb-[20px]"/>
                        <div className="flex items-center justify-between gap-4">
                            <div className="w-[234px] border-[1px] flex flex-col border-[#EDEDED] gap-[9px] rounded-lg p-4">
                                <div className="flex items-center gap-[9px]">
                                    <span className="rounded-full w-[6px] h-[6px] bg-[#C6EB5F]"></span>
                                    <p className="text-[#707070] text-[12px]">DELIVERED</p>
                                </div>
                                <div className="flex w-[108px] h-[28px] items-center gap-[10px]">
                                    <span className="text-[#18181B] font-medium text-[20px]">
                                        {orders.filter(o => o.status === OrderStatus.DELIVERED).length}
                                    </span>
                                    <div className="flex bg-[#E0F0E4] w-[53px] px-[4px] py-[2px] rounded-[100px] items-center justify-center">
                                        <span className="text-[#377E36] font-medium text-[12px]">+44.3%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-[326px] border-[1px] flex flex-col border-[#EDEDED] gap-[9px] rounded-[8px] p-4">
                                <div className="flex items-center gap-[9px]">
                                    <span className="rounded-full w-[6px] h-[6px] bg-[#1E1E1E]"></span>
                                    <p className="text-[#707070] text-[12px]">EN-ROUTE</p>
                                </div>
                                <div className="flex w-[108px] h-[28px] items-center gap-[10px]">
                                    <span className="text-[#18181B] font-medium text-[20px]">
                                        {orders.filter(o => o.status === OrderStatus.SHIPPED).length}
                                    </span>
                                    <div className="flex bg-[#E0F0E4] w-[53px] px-[4px] py-[2px] rounded-[100px] items-center justify-center">
                                        <span className="text-[#377E36] font-medium text-[12px]">+11.4%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-[234px] border-[1px] flex flex-col border-[#EDEDED] gap-[9px] rounded-lg p-4">
                                <div className="flex items-center gap-[9px]">
                                    <span className="rounded-full w-[6px] h-[6px] bg-[#1E1E1E]"></span>
                                    <p className="text-[#707070] text-[12px]">PENDING</p>
                                </div>
                                <div className="flex w-[108px] h-[28px] items-center gap-[10px]">
                                    <span className="text-[#18181B] font-medium text-[20px]">
                                        {orders.filter(o => o.status === OrderStatus.PENDING_DELIVERY).length}
                                    </span>
                                    <div className="flex bg-[#FEECEB] w-[53px] px-[4px] py-[2px] rounded-[100px] items-center justify-center">
                                        <span className="text-[#B12F30] font-medium text-[12px]">-1.03%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-[234px] border-[1px] flex flex-col border-[#EDEDED] gap-[9px] rounded-lg p-4">
                                <div className="flex items-center gap-[9px]">
                                    <span className="rounded-full w-[6px] h-[6px] bg-[#1E1E1E]"></span>
                                    <p className="text-[#707070] text-[12px]">FAILED ORDERS</p>
                                </div>
                                <div className="flex w-[108px] h-[28px] items-center gap-[10px]">
                                    <span className="text-[#18181B] font-medium text-[20px]">
                                        {orders.filter(o => o.status === OrderStatus.CANCELLED).length}
                                    </span>
                                    <div className="flex bg-[#FEECEB] w-[53px] px-[4px] py-[2px] rounded-[100px] items-center justify-center">
                                        <span className="text-[#B12F30] font-medium text-[12px]">-1.03%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <PayoutRequestModal
                isPayoutRequestModalOpen={isPayoutRequestModalOpen}
                onClosePayoutRequestModal={() => setIsPayoutRequestModalOpen(false)}
                onRequestSuccess={handlePayoutRequestSuccess}
            />

            <PayoutRequestSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={handleCloseSuccessModal}
            />
        </>
    );
};

export default Transactions;