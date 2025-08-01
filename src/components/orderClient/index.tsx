'use client'
import {useEffect, useRef, useState} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardHeader from "@/components/dashboardHeader";
import DashboardOptions from "@/components/dashboardOptions";
import Image from "next/image";
import { Toaster, toast } from 'react-hot-toast';
import arrowDown from "../../../public/assets/images/arrow-down.svg";

import FilterDropdown from "@/components/filterDropdown";

interface OrderItemDto {
    id: number;
    productId: number;
    productName: string;
    description: string;
    productImage: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    vendorName: string;
    buyerName: string;
}

interface DisputeResponse {
    id: number;
    requestTime: string;
    status: string;
    resolvedDate: string;
    orderNumber: string;
    imageUrl: string;
    reason: string;
    orderTime: string;
    deliveryMethod: string;
    orderItem: OrderItemDto;
}

interface ProductActionsDropdownProps {
    children: React.ReactNode;
    orderNumber: string;
    orderStatus: OrderStatus;
    items: OrderItemDto[];
    onProcessOrder: (orderNumber: string, itemIds: number[]) => Promise<void>;
    onDeclineOrder: (orderNumber: string, itemIds: number[]) => Promise<void>;
    onShipOrder: (orderNumber: string, itemIds: number[]) => Promise<void>;
    onViewOrder: (orderNumber: string) => void;
}

const ProductActionsDropdown = ({
                                    children,
                                    orderNumber,
                                    orderStatus,
                                    items,
                                    onProcessOrder,
                                    onDeclineOrder,
                                    onShipOrder,
                                    onViewOrder
                                }: ProductActionsDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleActionClick = async (
        e: React.MouseEvent,
        action: 'process' | 'decline' | 'ship' | 'view'
    ) => {
        e.stopPropagation();
        try {
            // Validate we have items
            if (!items || items.length === 0) {
                throw new Error('No items found in this order');
            }

            // For view action, we don't need itemIds
            if (action === 'view') {
                onViewOrder(orderNumber);
                setIsOpen(false);
                return;
            }

            // Get all item IDs
            const itemIds = items.map(item => item.id);
            console.log("Item IDs: ", itemIds);

            // Validate we have itemIds
            if (itemIds.length === 0) {
                throw new Error('No item IDs found');
            }

            // Call the appropriate handler
            switch (action) {
                case 'process':
                    await onProcessOrder(orderNumber, itemIds);
                    break;
                case 'decline':
                    await onDeclineOrder(orderNumber, itemIds);
                    break;
                case 'ship':
                    await onShipOrder(orderNumber, itemIds);
                    break;
            }

            setIsOpen(false);
        } catch (error) {
            console.error('Error:', error);
            toast.error((error as Error).message || 'Failed to perform action', {
                position: 'top-center',
                style: {
                    background: '#FF3333',
                    color: '#fff',
                },
            });
        }
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
                <div className="absolute right-0 top-full mt-1 bg-white rounded-md shadow-lg z-50 border border-[#ededed] w-[150px]">
                    <ul className="py-1">
                        {orderStatus === OrderStatus.PENDING && (
                            <>
                                <li
                                    className="px-4 py-2 text-[12px] hover:bg-[#ECFDF6] cursor-pointer"
                                    onClick={(e) => handleActionClick(e, 'process')}
                                >
                                    Process order
                                </li>
                                <li
                                    className="px-4 py-2 text-[12px] hover:bg-[#ECFDF6] cursor-pointer"
                                    onClick={(e) => handleActionClick(e, 'decline')}
                                >
                                    Decline order
                                </li>
                                <li
                                    className="px-4 py-2 text-[12px] hover:bg-[#ECFDF6] cursor-pointer"
                                    onClick={(e) => handleActionClick(e, 'ship')}
                                >
                                    Ship order
                                </li>
                            </>
                        )}
                        {orderStatus === OrderStatus.PROCESSING && (
                            <li
                                className="px-4 py-2 text-[12px] hover:bg-[#ECFDF6] cursor-pointer"
                                onClick={(e) => handleActionClick(e, 'ship')}
                            >
                                Ship order
                            </li>
                        )}
                        {orderStatus === OrderStatus.SHIPPED && (
                            <li
                                className="px-4 py-2 text-[12px] hover:bg-[#ECFDF6] cursor-pointer"
                                onClick={(e) => handleActionClick(e, 'view')}
                            >
                                View order
                            </li>
                        )}
                        {orderStatus === OrderStatus.DELIVERED && (
                            <li
                                className="px-4 py-2 text-[12px] hover:bg-[#ECFDF6] cursor-pointer"
                                onClick={(e) => handleActionClick(e, 'view')}
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


const DisputeDetailsModal = ({
                                 dispute,
                                 onClose,
                             }: {
    dispute: DisputeResponse;
    onClose: () => void;
}) => {
    const requestDate = new Date(dispute.requestTime);
    const formattedRequestDate = requestDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const orderDate = new Date(dispute.orderTime);
    const formattedOrderDate = orderDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedOrderTime = orderDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    const handleProcessDispute = async () => {
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/dispute/process?disputeId=${dispute.id}`
            );
            console.log("Response:", response);
            if (response.status === 200) {
                toast.success('Dispute processed successfully', {
                    position: 'top-center',
                    style: {
                        background: '#4BB543',
                        color: '#fff',
                    },
                });
                onClose();
            } else {
                throw new Error('Failed to process dispute');
            }
        } catch (error) {
            console.error('Error processing dispute:', error);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            toast.error(error.response?.data?.message || 'Failed to process dispute', {
                position: 'top-center',
                style: {
                    background: '#FF3333',
                    color: '#fff',
                },
            });
        }
    };

    const handleResolveDispute = async () => {
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/dispute/send-resolve?disputeId=${dispute.id}`
            );
            console.log("Resolve Response:", response);
            if (response.status === 200) {
                toast.success('Dispute resolved successfully', {
                    position: 'top-center',
                    style: {
                        background: '#4BB543',
                        color: '#fff',
                    },
                });
                onClose();
            } else {
                throw new Error('Failed to resolve dispute');
            }
        } catch (error) {
            console.error('Error resolving dispute:', error);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            toast.error(error.response?.data?.message || 'Failed to resolve dispute', {
                position: 'top-center',
                style: {
                    background: '#FF3333',
                    color: '#fff',
                },
            });
        }
    };

    const handleRejectDispute = async () => {
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/dispute/reject?disputeId=${dispute.id}`
            );
            if (response.status === 200) {
                toast.success('Dispute rejected successfully', {
                    position: 'top-center',
                    style: {
                        background: '#4BB543',
                        color: '#fff',
                    },
                });
                onClose();
            } else {
                throw new Error('Failed to reject dispute');
            }
        } catch (error) {
            console.error('Error rejecting dispute:', error);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            toast.error(error.response?.data?.message || 'Failed to reject dispute', {
                position: 'top-center',
                style: {
                    background: '#FF3333',
                    color: '#fff',
                },
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#808080]/20">
            <Toaster
                position="top-center"
                containerStyle={{
                    position: 'absolute',
                    top: '20px',
                    left: 0,
                    right: 0,
                }}
                toastOptions={{
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        style: {
                            background: '#4BB543',
                        },
                        duration: 3000,
                    },
                    error: {
                        style: {
                            background: '#FF3333',
                        },
                        duration: 4000,
                    },
                }}
            />
            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative z-10 bg-white w-[1100px]  mx-4 px-[60px] py-[40px] shadow-lg">
                <div className="flex justify-between border-b-[0.5px] border-[#ededed] pb-[14px] items-start ">
                    <div className="flex flex-col">
                        <p className="text-[16px] text-[#022B23] font-medium">Dispute request</p>
                        <p className="text-[14px] text-[#707070] font-medium">View and process dispues on products with customers</p>
                    </div>
                    <div
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            dispute.status === "PENDING"
                                ? "bg-[#ECFDF3] text-[#027A48]"
                                : dispute.status === "PROCESSING"
                                    ? "bg-[#FFFAEB] text-[#F99007]"
                                    : "bg-[#EDEDED] text-[#707070]"
                        }`}
                    >
                        {dispute.status}
                    </div>
                </div>

                <div className="w-full flex ">
                    <div className="w-[50%] pt-[24px]  pr-[32px] border-r-[0.5px] border-[#ededed] pb-[2px] gap-[30px] flex flex-col">
                        <div className="flex flex-col gap-[14px]">
                            <p className="text-[#022B23] text-[16px] font-semibold">{dispute.orderNumber}</p>
                            <div>
                                <p className="text-[#707070] font-medium text-[14px] leading-tight">Request date: <span className="text-[#000000]">{formattedRequestDate}</span></p>
                                <p className="text-[#707070] font-medium text-[14px] leading-tight">From: <span className="text-[#000000]">{dispute.orderItem.buyerName}</span></p>
                            </div>
                        </div>
                        <div className="w-[100%] flex items-center justify-between h-[72px] border-[1px] border-[#ededed] rounded-[14px]">
                            <div className="flex items-center h-full gap-[10px]">
                                <div className="h-full bg-[#f9f9f9] rounded-bl-[14px] rounded-tl-[14px] w-[70px] border-l-[0.5px] border-[#ededed]">
                                    <Image src={dispute.orderItem.productImage} alt={'image'} width={70} height={70} className="h-full w-[70px] rounded-bl-[14px] rounded-tl-[14px]"/>
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <p className="text-[#101828] text-[14px] font-medium">
                                        {dispute.orderItem.productName}
                                    </p>
                                </div>
                            </div>
                            <p className="text-[#667085] text-[14px] mr-[10px]">Quantity: 1</p>
                        </div>
                        <div className="h-[230px] p-[20px] rounded-[24px] bg-[#FFFBF6] w-[100%] border-[#FF9500] flex flex-col gap-[12px] border">
                            <div className="flex flex-col leading-tight">
                                <p className="text-[#101828] text-[14px] font-medium">Reason for return</p>
                                <p className="text-[#525252] text-[14px]">{dispute.reason}</p>
                            </div>
                            <div className="bg-[#EFEFEF] w-[100%] flex justify-center rounded-[24px] h-[150px]">
                                <Image src={dispute.imageUrl} width={150} height={150} alt={'image'} className="rounded-[24px] w-[100%] h-[150px]"/>
                            </div>
                        </div>
                    </div>
                    <div className="w-[50%] flex justify-between flex-col gap-[20px] pl-[15px] pt-[20px] pb-[5px]">
                        <p className="text-[#022B23] font-semibold text-[16px]">Product details</p>
                        <div className="flex flex-col gap-[8px] pb-[25px] border-b-[0.5px] border-[#ededed]">
                            <div className="flex justify-between">
                                <p className="text-[#707070] text-[14px] font-medium">Order date</p>
                                <p className="text-[#000000] text-[14px] font-medium">{formattedOrderDate}</p>
                            </div>
                            <div className="flex justify-between ">
                                <p className="text-[#707070] text-[14px] font-medium">Order time</p>
                                <p className="text-[#000000] text-[14px] font-medium">{formattedOrderTime}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-[#707070] text-[14px] font-medium">Order amount</p>
                                <p className="text-[#000000] text-[14px] font-medium">NGN {dispute.orderItem.totalPrice}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-[8px] pb-[25px] border-b-[0.5px] border-[#ededed]">
                            <div className="flex justify-between">
                                <p className="text-[#707070] text-[14px] font-medium">Customer name</p>
                                <p className="text-[#000000] text-[14px] font-medium">{dispute.orderItem.buyerName}</p>
                            </div>
                        </div>

                        {dispute.status === "PENDING" && (
                            <div className="h-[48px] flex gap-[4px]">
                                <div
                                    className="flex cursor-pointer text-[#707070] text-[16px] font-semibold items-center justify-center w-[116px] h-full border-[0.5px] border-[#707070] rounded-[12px]"
                                    onClick={handleRejectDispute}
                                >
                                    Reject
                                </div>
                                <div
                                    className="flex cursor-pointer text-[#461602] text-[16px] font-semibold items-center justify-center w-[163px] bg-[#FFEEBE] h-full rounded-[12px]"
                                    onClick={handleProcessDispute}
                                >
                                    Process dispute
                                </div>
                            </div>
                        )}

                        {dispute.status === "PROCESSING" && (
                            <div className="h-[48px] flex gap-[4px]">
                                <div
                                    className="flex cursor-pointer text-[#461602] text-[16px] font-semibold items-center justify-center w-full bg-[#FFEEBE] h-full rounded-[12px]"
                                    onClick={handleResolveDispute}
                                >
                                    Resolve dispute
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DisputeActionsDropdown = ({  onViewDispute }: { productId: number; onViewDispute: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
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
                <div className="flex flex-col gap-[3px] items-center justify-center p-2 -m-2">
                    <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                    <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                    <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                </div>
            </div>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-md shadow-lg z-50 border border-[#ededed] w-[125px]">
                    <ul className="py-1">
                        <li
                            className="px-4 py-2 text-[12px] hover:bg-[#ECFDF6] cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                onViewDispute();
                                setIsOpen(false);
                            }}
                        >
                            View dispute
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

const DisputeTableRow = ({
                             dispute,
                             isLast,
                             onViewDispute
                         }: {
    dispute: DisputeResponse;
    isLast: boolean;
    onViewDispute: () => void
}) => {
    return (
        <div className={`flex h-[72px] ${!isLast ? 'border-b border-[#EAECF0]' : ''}`}>
            <div className="flex items-center w-[30%] pr-[24px] gap-3">
                <div className="bg-[#f9f9f9] h-full w-[70px] overflow-hidden mt-[2px]">
                    <Image
                        src={dispute.orderItem.productImage}
                        alt={'product image'}
                        width={70}
                        height={70}
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <p className="text-[14px] font-medium text-[#101828]">{dispute.orderItem.productName}</p>
                    <p className="text-[12px] text-[#667085]">ID #: {dispute.orderItem.productId}</p>
                </div>
            </div>

            <div className="flex items-center w-[10%] px-[24px]">
                <div className={`w-[63px] h-[22px] rounded-[8px] flex items-center justify-center ${
                    dispute.status === 'Processed'
                        ? 'bg-[#ECFDF3] text-[#027A48]'
                        : dispute.status === 'Inspecting'
                            ? 'bg-[#FFFAEB] text-[#F99007]'
                            : 'w-[69px] bg-[#EDEDED] text-[#707070]'
                }`}>
                    <p className="text-[12px] font-medium">{dispute.status}</p>
                </div>
            </div>
            <div className="flex items-center text-[#344054] text-[14px] w-[15%] px-[24px]">
                <p>{dispute.orderItem.buyerName || "Unknown"}</p>
            </div>
            <div className="flex items-center justify-center text-[#101828] text-[14px] w-[25%] px-[24px]">
                <p className="text-[#101828] text-[14px]">Product issue</p>
            </div>
            <div className="flex items-center text-[#344054] text-[14px] w-[15%] px-[24px]">
                <p>₦{dispute.orderItem.totalPrice?.toLocaleString() || "0"}</p>
            </div>

            <div className="flex items-center justify-center w-[5%]">
                <DisputeActionsDropdown productId={dispute.id} onViewDispute={onViewDispute} />
            </div>
        </div>
    );
};

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
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    PENDING_DELIVERY = 'PENDING_DELIVERY',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    DECLINED = 'DECLINED',
    CANCELLED = 'CANCELLED'
}

interface ProductTableRowProps {
    order: OrderResponse;
    isLast: boolean;
    onProcessOrder: (orderNumber: string, itemIds: number[]) => Promise<void>;
    onDeclineOrder: (orderNumber: string, itemIds: number[]) => Promise<void>;
    onShipOrder: (orderNumber: string, itemIds: number[]) => Promise<void>;
    onViewOrder: (orderNumber: string) => void;
}

const ProductTableRow = ({
                             order,
                             isLast,
                             onProcessOrder,
                             onDeclineOrder,
                             onShipOrder,
                             onViewOrder
                         }: ProductTableRowProps) => {
    const firstItem = order.items[0];

    return (
        <div className={`flex h-[72px] ${!isLast ? 'border-b border-[#EAECF0]' : 'border-b border-[#EAECF0]'}`}>
            <div className="flex items-center w-[30%] pr-[24px] gap-3">
                <div className="bg-[#f9f9f9] h-[70px] w-[70px] flex items-center justify-center overflow-hidden">
                    {firstItem.productImage && (
                        <Image
                            src={firstItem.productImage}
                            alt={firstItem.productName}
                            width={70}
                            height={70}
                            className="object-cover w-full h-full"
                        />
                    )}
                </div>
                <div className="flex flex-col">
                    <p className="text-[14px] font-medium text-[#101828]">{firstItem.productName}</p>
                    {order.items.length > 1 && (
                        <p className="text-[12px] text-[#667085]">+{order.items.length - 1} more items</p>
                    )}
                </div>
            </div>

            <div className="flex justify-center items-center w-[10%]">
                <span className={`px-2 py-1 text-xs rounded-full ${
                    order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-800' :
                        order.status === OrderStatus.SHIPPED ? 'bg-green-100 text-green-800' :
                            order.status === OrderStatus.PROCESSING ? 'bg-yellow-100 text-yellow-800' :
                                order.status === OrderStatus.DECLINED ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                }`}>
                    {order.status}
                </span>
            </div>
            <div className="flex items-center w-[13%]">
                <p className="text-[#101828] text-[10px]">
                    {order.orderNumber}
                </p>
            </div>
            <div className="flex pl-[24px] items-center w-[20%]">
                <p className="text-[#101828] text-[14px] capitalize">
                    {order.deliveryInfo?.method || ''}
                </p>
            </div>
            <div className="flex pl-[24px] items-center w-[15%]">
                <p className="text-[#101828] text-[14px]">
                    ₦{order.items.reduce((sum, item) => sum + item.totalPrice, 0).toLocaleString()}
                </p>
            </div>
            <div className="flex items-center pl-[24px] w-[10%]">
                <p className="text-[#101828] text-[14px]">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
            </div>
            <div className="flex items-center justify-center w-[2%]">
                <ProductActionsDropdown
                    orderNumber={order.orderNumber}
                    orderStatus={order.status}
                    items={order.items}
                    onProcessOrder={onProcessOrder}
                    onDeclineOrder={onDeclineOrder}
                    onShipOrder={onShipOrder}
                    onViewOrder={onViewOrder}
                >
                    <div className="flex flex-col gap-[3px] items-center justify-center p-2 -m-2">
                        <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                        <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                        <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                    </div>
                </ProductActionsDropdown>
            </div>
        </div>
    );
};

interface PendingOrdersProps {
    orders: OrderResponse[];
    loading: boolean;
}

const PendingOrders = ({ orders: initialOrders, loading }: PendingOrdersProps) => {
    const [orders, setOrders] = useState<OrderResponse[]>(initialOrders);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState<'all' | 'today' | '1day' | '7days' | '30days'>('all');
    const router = useRouter();

    const handleProcessOrder = async (orderNumber: string, itemIds: number[]) => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/process-item`,
                { orderNumber, itemIds },
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.status === 200) {
                toast.success('Order processed successfully');
                updateOrderStatus(orderNumber, OrderStatus.PROCESSING);
            } else {
                throw new Error('Failed to process order');
            }
        } catch (error) {
            console.error('Error processing order:', error);
            toast.error('Failed to process order');
        }
    };

    const handleDeclineOrder = async (orderNumber: string, itemIds: number[]) => {
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/decline-order`,
                { orderNumber, itemIds },
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.status === 200) {
                toast.success('Order declined successfully');
                updateOrderStatus(orderNumber, OrderStatus.CANCELLED);
            } else {
                throw new Error('Failed to decline order');
            }
        } catch (error) {
            console.error('Error declining order:', error);
            toast.error('Failed to decline order');
        }
    };

    const handleShipOrder = async (orderNumber: string, itemIds: number[]) => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/ship-item`,
                { orderNumber, itemIds },
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.status === 200) {
                toast.success('Order shipped successfully');
                updateOrderStatus(orderNumber, OrderStatus.SHIPPED);
            } else {
                throw new Error('Failed to ship order');
            }
        } catch (error) {
            console.error('Error shipping order:', error);
            toast.error('Failed to ship order');
        }
    };

    const updateOrderStatus = (orderNumber: string, newStatus: OrderStatus) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.orderNumber === orderNumber
                    ? { ...order, status: newStatus }
                    : order
            )
        );
    };

    const handleViewOrder = (orderNumber: string) => {
        router.push(`/vendor/dashboard/order/${orderNumber}`);
    };

    useEffect(() => {
        setOrders(initialOrders);
    }, [initialOrders]);

    const getFilteredOrders = () => {
        const now = new Date();
        const today = new Date(now.setHours(0, 0, 0, 0));

        switch (filter) {
            case 'today':
                return orders.filter(order => {
                    const orderDate = new Date(order.createdAt);
                    return orderDate >= today;
                });
            case '1day':
                const oneDayAgo = new Date(today);
                oneDayAgo.setDate(oneDayAgo.getDate() - 1);
                return orders.filter(order => {
                    const orderDate = new Date(order.createdAt);
                    return orderDate >= oneDayAgo && orderDate < today;
                });
            case '7days':
                const sevenDaysAgo = new Date(today);
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                return orders.filter(order => {
                    const orderDate = new Date(order.createdAt);
                    return orderDate >= sevenDaysAgo;
                });
            case '30days':
                const thirtyDaysAgo = new Date(today);
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return orders.filter(order => {
                    const orderDate = new Date(order.createdAt);
                    return orderDate >= thirtyDaysAgo;
                });
            default:
                return orders;
        }
    };

    const PRODUCTS_PER_PAGE = 5;
    const filteredOrders = getFilteredOrders();
    const totalPages = Math.ceil(filteredOrders.length / PRODUCTS_PER_PAGE);
    const currentOrders = filteredOrders.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
    );

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

    if (loading) {
        return <div className="p-4 text-center">Loading orders...</div>;
    }

    if (!orders || orders.length === 0) {
        return <div className="p-4 text-center">No orders found.</div>;
    }

    if (filteredOrders.length === 0) {
        return (
            <div className="p-4 text-center">
                No orders found for the selected filter.
                <button
                    onClick={() => setFilter('all')}
                    className="mt-2 text-[#022B23] hover:underline"
                >
                    Clear filters
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-[50px]">
            <div className="flex flex-col rounded-[24px] border-[1px] border-[#EAECF0]">
                <div className="my-[20px] mx-[25px] flex flex-col">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-[#101828] font-medium">Orders ({filteredOrders.length})</p>
                            <p className="text-[#667085] text-[14px]">View your product orders</p>
                        </div>
                        <FilterDropdown
                            filter={filter}
                            setFilter={setFilter}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                </div>

                <div className="flex h-[44px] bg-[#F9FAFB] border-b-[1px] border-[#EAECF0]">
                    <div className="flex items-center px-[24px] w-[30%] py-[12px] gap-[4px]">
                        <p className="text-[#667085] font-medium text-[12px]">Products</p>
                        <Image src={arrowDown} alt="Sort" width={12} height={12} />
                    </div>
                    <div className="flex justify-center items-center px-[24px] w-[10%] py-[12px]">
                        <p className="text-[#667085] font-medium text-[12px]">Status</p>
                    </div>
                    <div className="flex items-center px-[24px] w-[13%] py-[12px]">
                        <p className="text-[#667085] font-medium text-[12px]">Order Number</p>
                    </div>
                    <div className="flex items-center px-[15px] w-[20%] py-[12px]">
                        <p className="text-[#667085] font-medium text-[12px]">Delivery method</p>
                    </div>
                    <div className="flex items-center px-[10px] w-[15%] py-[12px]">
                        <p className="text-[#667085] font-medium text-[12px]">Total Amount</p>
                    </div>
                    <div className="flex items-center px-[10px] w-[10%] py-[12px]">
                        <p className="text-[#667085] font-medium text-[12px]">Items</p>
                    </div>
                    <div className="w-[2%]"></div>
                </div>

                <div className="flex flex-col">
                    {filteredOrders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <p className="text-[#667085] text-[14px] mb-4">No orders</p>
                            <button
                                onClick={() => setFilter('all')}
                                className="text-[#022B23] text-[14px] font-medium hover:underline"
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        currentOrders.map((order, index) => (
                            <ProductTableRow
                                key={order.id}
                                order={order}
                                isLast={index === currentOrders.length - 1}
                                onProcessOrder={handleProcessOrder}
                                onDeclineOrder={handleDeclineOrder}
                                onShipOrder={handleShipOrder}
                                onViewOrder={handleViewOrder}
                            />
                        ))
                    )}
                </div>

                {filteredOrders.length > 0 && (
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
        </div>
    );
};

const Disputes = () => {
    const [disputes, setDisputes] = useState<DisputeResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDispute, setSelectedDispute] = useState<DisputeResponse | null>(null);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchDisputes = async () => {
            if (session?.user?.email) {
                try {
                    setLoading(true);
                    // First get the shop ID
                    const shopResponse = await fetch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/shops/getbyEmail?email=${session.user.email}`
                    );
                    if (!shopResponse.ok) {
                        throw new Error('Failed to fetch shop details');
                    }
                    const shopData = await shopResponse.json();


                    // Then get the disputes for this shop
                    const disputesResponse = await fetch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/dispute/get-shop-disputes?id=${shopData.id}`
                    );
                    if (!disputesResponse.ok) {
                        throw new Error('Failed to fetch disputes');
                    }
                    const disputesData = await disputesResponse.json();
                    setDisputes(disputesData);
                    console.log("Disputes: ",disputesData);
                } catch (error) {
                    console.error('Error fetching disputes:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchDisputes();
    }, [session]);

    const handleViewDispute = (dispute: DisputeResponse) => {
        setSelectedDispute(dispute);
    };

    const closeModal = () => {
        setSelectedDispute(null);
    };

    if (loading) {
        return <div className="p-4 text-center">Loading disputes...</div>;
    }

    if (!disputes || disputes.length === 0) {
        return <div className="p-4 text-center">No disputes found.</div>;
    }

    return (
        <>
            <div className="flex flex-col gap-[50px]">
                <div className="flex flex-col rounded-[24px] border-[1px] border-[#EAECF0]">
                    <div className="my-[20px] mx-[25px] flex flex-col">
                        <p className="text-[#101828] font-medium">Disputes ({disputes.length})</p>
                        <p className="text-[#667085] text-[14px]">View all disputes</p>
                    </div>

                    <div className="flex h-[44px] bg-[#F9FAFB] border-b-[1px] border-[#EAECF0]">
                        <div className="flex items-center px-[24px] w-[30%] py-[12px] gap-[4px]">
                            <p className="text-[#667085] font-medium text-[12px]">Products</p>
                            <Image src={arrowDown} alt="Sort" width={12} height={12} />
                        </div>
                        <div className="flex items-center justify-center px-[24px] w-[10%] py-[12px]">
                            <p className="text-[#667085] font-medium text-[12px]">Status</p>
                        </div>
                        <div className="flex items-center px-[24px] w-[15%] py-[12px]">
                            <p className="text-[#667085] font-medium text-[12px]">Customer ID</p>
                        </div>
                        <div className="flex items-center justify-center px-[15px] w-[25%] py-[12px]">
                            <p className="text-[#667085] font-medium text-[12px]">Reason for request</p>
                        </div>
                        <div className="flex items-center px-[24px] w-[15%] py-[12px]">
                            <p className="text-[#667085] font-medium text-[12px]">Price</p>
                        </div>
                        <div className="w-[5%]"></div>
                    </div>

                    <div className="flex flex-col">
                        {disputes.map((dispute, index) => (
                            <DisputeTableRow
                                key={dispute.id}
                                dispute={dispute}
                                isLast={index === disputes.length - 1}
                                onViewDispute={() => handleViewDispute(dispute)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {selectedDispute && (
                <DisputeDetailsModal
                    dispute={{
                        id: selectedDispute.id,
                        requestTime: selectedDispute.requestTime,
                        status: selectedDispute.status,
                        resolvedDate: selectedDispute.resolvedDate,
                        orderNumber: selectedDispute.orderNumber,
                        imageUrl: selectedDispute.orderItem.productImage,
                        reason: selectedDispute.reason,
                        orderTime: selectedDispute.orderTime,
                        deliveryMethod: selectedDispute.deliveryMethod,
                        orderItem: selectedDispute.orderItem
                    }}
                    onClose={closeModal}
                />
            )}
        </>
    );
};

import { useSession } from "next-auth/react";
import axios from "axios";

const OrderClient = () => {
    const searchParams = useSearchParams();
    const initialTab = (searchParams.get('tab') as 'pending' | 'disputes') || 'pending';
    const [activeTab, setActiveTab] = useState<'pending' | 'disputes'>(initialTab);
    const [pendingOrders, setPendingOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        const fetchPendingOrders = async (): Promise<void> => {
            if (session?.user?.email) {
                try {
                    setLoading(true);
                    const response = await fetch(`https://digitalmarket.benuestate.gov.ng/api/shops/getbyEmail?email=${session.user.email}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch orders');
                    }
                    const data = await response.json();
                    const orderResponse = await fetch(`https://digitalmarket.benuestate.gov.ng/api/orders/get-shop-orders?shopId=${data.id}`);
                    const orderData = await orderResponse.json();
                    setPendingOrders(orderData);
                    console.log("Orders: ", orderData);
                } catch (error) {
                    console.error('Error fetching orders:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchPendingOrders();
    }, [session]);

    const handleTabChange = (tab: 'pending' | 'disputes') => {
        setActiveTab(tab);
        router.replace(`/vendor/dashboard/order?tab=${tab}`, { scroll: false });
    };

    return (
        <>
            <DashboardHeader />
            <DashboardOptions />
            <div className="flex flex-col">
                <div className="flex border-b border-[#ededed] mb-6 px-[100px]">
                    <div className="w-[359px] h-[52px] gap-[24px] flex items-end">
                        <p
                            className={`py-2 text-[#11151F] cursor-pointer text-[14px] ${activeTab === 'pending' ? 'font-medium border-b-2 border-[#C6EB5F]' : 'text-gray-500'}`}
                            onClick={() => handleTabChange('pending')}
                        >
                            Pending
                        </p>
                        <p
                            className={`py-2 text-[#11151F] cursor-pointer text-[14px] ${activeTab === 'disputes' ? 'font-medium border-b-2 border-[#C6EB5F]' : 'text-gray-500'}`}
                            onClick={() => handleTabChange('disputes')}
                        >
                            Disputes
                        </p>
                    </div>
                </div>
                <div className="bg-white rounded-lg mx-[100px] mb-8">
                    {activeTab === 'pending' && (
                        <PendingOrders
                            orders={pendingOrders}
                            loading={loading}
                        />
                    )}
                    {activeTab === 'disputes' && <Disputes />}
                </div>
            </div>
        </>
    );
};

export default OrderClient;