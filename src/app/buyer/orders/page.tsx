'use client'
import MarketPlaceHeader from "@/components/marketPlaceHeader";
import Image from "next/image";
import arrowBack from "../../../../public/assets/images/arrow-right.svg";
import arrowRight from "../../../../public/assets/images/greyforwardarrow.svg";
import React, {useEffect, useRef, useState} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface OrderItemDto {
    id: number;
    productId: number;
    name: string;
    unitPrice: number;
    quantity: number;
    productImage: string;
}

interface BuyerOrderResponse {
    orderNumber: string;
    status: string;
    deliveryInfo: {
        method: string;
        address: string;
    };
    createdAt: string;
    totalAmount: number;
    deliveryFee: number;
    grandTotal: number;
    itemsByShop: Record<number, OrderItemDto[]>;
}

const OrderModal = ({
                        order,
                        onClose
                    }: {
    order: BuyerOrderResponse | null;
    onClose: () => void
}) => {
    if (!order) return null;

    // const firstItem = Object.values(order.itemsByShop)[0]?.[0] || {
    //     name: 'No product',
    //     productId: 0,
    //     quantity: 0,
    //     unitPrice: 0
    // };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#808080]/20">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Order Details</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        &times;
                    </button>
                </div>

                <p className="text-gray-600 mb-6">View Order details</p>

                <div className="mb-6">
                    <h3 className="font-bold text-lg">#{order.orderNumber}</h3>
                    <p className="text-gray-600">Order date: {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</p>
                </div>


                <div className="mb-6">
                    <h4 className="font-bold mb-2">Product details</h4>
                    <div className="grid grid-cols-2 gap-4 text-gray-600">
                        <div>
                            <p>Order date: {new Date(order.createdAt).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}</p>
                            <p>Order time: {new Date(order.createdAt).toLocaleTimeString()}</p>
                            <p>Order amount: NGN {order.totalAmount.toLocaleString()}</p>
                            <p>Delivery method: {order.deliveryInfo.method}</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        className="bg-[#022B23] text-[#C6EB5F] font-semibold cursor-pointer px-4 py-2 rounded hover:bg-green-700"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const OrderActionsDropdown = ({
                                  order,
                                  onMarkDelivered,
                                  onViewOrder,
                                  children
                              }: {
    order: BuyerOrderResponse;
    onMarkDelivered: (orderNumber: string) => void;
    onViewOrder: (order: BuyerOrderResponse) => void;
    children: React.ReactNode;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleAction = (e: React.MouseEvent, action: 'mark' | 'view') => {
        e.stopPropagation();
        if (action === 'mark') {
            onMarkDelivered(order.orderNumber);
        } else {
            onViewOrder(order);
        }
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full h-full" ref={dropdownRef}>
            <div
                onClick={handleToggle}
                className="cursor-pointer w-full h-full flex items-center justify-center"
            >
                {children}
            </div>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-md shadow-lg z-50 border border-[#ededed] w-[125px]">
                    <ul className="py-1">
                        {order.status === 'PENDING_DELIVERY' ? (
                            <li
                                className="px-4 py-2 text-[12px] hover:bg-[#ECFDF6] cursor-pointer"
                                onClick={(e) => handleAction(e, 'mark')}
                            >
                                Mark delivered
                            </li>
                        ) : (
                            <li
                                className="px-4 py-2 text-[12px] hover:bg-[#ECFDF6] cursor-pointer"
                                onClick={(e) => handleAction(e, 'view')}
                            >
                                View order
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

const Orders = () => {
    const router = useRouter();
    const [orders, setOrders] = useState<BuyerOrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<BuyerOrderResponse | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) {
                router.push('/login');
                return;
            }
            try {
                const response = await axios.get<BuyerOrderResponse[]>(
                    'https://digitalmarket.benuestate.gov.ng/api/orders/user',
                    { params: { buyerEmail: userEmail } }
                );
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [router]);

    const handleMarkDelivered = async (orderNumber: string) => {
        try {
            await axios.post(
                'https://digitalmarket.benuestate.gov.ng/api/orders/validate-pickUp',
                { orderNumber },
                { headers: { 'Content-Type': 'application/json' } }
            );

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.orderNumber === orderNumber
                        ? { ...order, status: 'DELIVERED' }
                        : order
                )
            );
        } catch (error) {
            console.error('Error marking order as delivered:', error);
        }
    };

    const handleViewOrder = (order: BuyerOrderResponse) => {
        setSelectedOrder(order);
    };

    const closeModal = () => {
        setSelectedOrder(null);
    };

    const getAllItemsFromOrder = (order: BuyerOrderResponse): OrderItemDto[] => {
        return Object.values(order.itemsByShop).flat();
    };

    const getProductDisplayName = (order: BuyerOrderResponse) => {
        const allItems = getAllItemsFromOrder(order);
        if (allItems.length === 0) return 'No items';
        if (allItems.length === 1) return allItems[0].name;
        return `${allItems[0].name} + ${allItems.length - 1} other item${allItems.length > 2 ? 's' : ''}`;
    };

    const getFirstItem = (order: BuyerOrderResponse) => {
        const allItems = getAllItemsFromOrder(order);
        return allItems[0] || {
            name: 'No product',
            productImage: '',
            productId: 0,
            id: 0,
            quantity: 0,
            unitPrice: 0
        };
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'decimal',
            maximumFractionDigits: 2
        }).format(price);
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'DELIVERED':
                return 'bg-[#F9FDE8] text-[#0C4F24]';
            case 'IN_TRANSIT':
                return 'bg-[#FFFAEB] text-[#F99007]';
            case 'RETURNED':
                return 'bg-[#FFEBEB] text-[#F90707]';
            case 'PENDING_DELIVERY':
                return 'bg-[#FFFAEB] text-[#B54708]'; // Yellowish gold color
            default:
                return 'bg-[#E7E7E7] text-[#1E1E1E]';
        }
    };

    const getStatusDisplayText = (status: string) => {
        switch (status) {
            case 'DELIVERED':
                return 'Delivered';
            case 'IN_TRANSIT':
                return 'In-transit';
            case 'RETURNED':
                return 'Returned';
            case 'PENDING_DELIVERY':
                return 'Pending Delivery';
            case 'PENDING':
                return 'Pending';
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <>
                <MarketPlaceHeader />
                <div className="flex justify-center items-center h-screen">
                    <p>Loading...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <MarketPlaceHeader />
            <div className="h-[48px] w-full border-y-[0.5px] border-[#EDEDED]">
                <div className="h-[48px] px-25 gap-[8px] items-center flex">
                    <Image src={arrowBack} alt={'imagw'}/>
                    <p className="text-[14px] text-[#3F3E3E]">Home // <span className="font-medium text-[#022B23]">Wishlist</span></p>
                </div>
            </div>
            <div className="px-25 pt-[62px] h-auto w-full">
                <div className="flex gap-[30px]">
                    {/* Left sidebar - keep as is */}
                    <div className="flex flex-col">
                        <div className="w-[381px] text-[#022B23] text-[12px] font-medium h-[44px] bg-[#f8f8f8] rounded-[10px] flex items-center px-[8px] justify-between">
                            <p>Go to profile</p>
                            <Image src={arrowRight} alt={'image'}/>
                        </div>
                        <div className="flex flex-col h-[80px] w-[381px] mt-[6px] rounded-[12px] border border-[#eeeeee]">
                            <div onClick={() => {router.push("/buyer/wishlist")}} className="w-full text-[#022B23] text-[12px] font-medium h-[40px] rounded-t-[12px] flex items-center px-[8px]">
                                <p>Wishlist</p>
                            </div>
                            <div onClick={() => {router.push("/buyer/orders")}} className="w-full text-[#022B23] text-[12px] h-[40px] rounded-b-[12px] bg-[#f8f8f8] flex items-center px-[8px]">
                                <p>My orders</p>
                            </div>
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="flex flex-col w-[779px] gap-[24px]">
                        <p className="text-[#000000] text-[14px] font-medium">My orders ({orders.length})</p>
                        <div className="border-[0.5px] border-[#ededed] rounded-[12px] mb-[50px]">
                            {orders.length === 0 ? (
                                <div className="flex items-center justify-center h-[151px] text-[#3D3D3D] text-[14px]">
                                    <p>No orders yet</p>
                                </div>
                            ) : (
                                orders.map((order, index) => {
                                    const isLastItem = index === orders.length - 1;
                                    const firstItem = getFirstItem(order);
                                    const statusText = getStatusDisplayText(order.status);

                                    return (
                                        <div key={order.orderNumber} className={`flex items-center ${!isLastItem ? "border-b h-[151px] overflow-hidden border-[#ededed]" : "border-none h-[151px]"}`}>
                                            <div className="flex border-r border-[#ededed] w-[169px] h-[151px] overflow-hidden">
                                                {firstItem.productImage ? (
                                                    <Image
                                                        src={firstItem.productImage}
                                                        alt={`product`}
                                                        width={168}
                                                        height={150}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                        No image
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center w-full px-[20px] justify-between">
                                                <div className="flex flex-col w-[30%]">
                                                    <div className="mb-[13px]">
                                                        <p className="text-[14px] text-[#1E1E1E] font-medium mb-[4px]">
                                                            {getProductDisplayName(order)}
                                                        </p>
                                                        <p className="text-[10px] font-normal text-[#3D3D3D] uppercase">
                                                            Order #{order.orderNumber}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-col">
                                                        <p className="font-medium text-[#1E1E1E] text-[16px]">
                                                            ₦{formatPrice(order.totalAmount)}
                                                        </p>
                                                        <p className="text-[#3D3D3D] text-[10px]">
                                                            {formatDate(order.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className={`flex h-[42px] px-3 items-center text-[14px] font-medium justify-center rounded-[100px] ${getStatusStyle(order.status)}`} style={{ width: 'fit-content' }}>
                                                    <p>{statusText}</p>
                                                </div>

                                                <div className="flex items-center justify-center w-[2%]">
                                                    <OrderActionsDropdown
                                                        order={order}
                                                        onMarkDelivered={handleMarkDelivered}
                                                        onViewOrder={handleViewOrder}
                                                    >
                                                        <div className="flex flex-col gap-[3px] items-center justify-center p-2 -m-2">
                                                            <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                                                            <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                                                            <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                                                        </div>
                                                    </OrderActionsDropdown>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <OrderModal
                    order={selectedOrder}
                    onClose={closeModal}
                />
            )}
        </>
    );
};
export default Orders;