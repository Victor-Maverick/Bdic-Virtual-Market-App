'use client'
import {useEffect, useRef, useState} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardHeader from "@/components/dashboardHeader";
import DashboardOptions from "@/components/dashboardOptions";
import Image, {StaticImageData} from "next/image";
import arrowDown from "../../../public/assets/images/arrow-down.svg";
import iPhone from "../../../public/assets/images/blue14.png";
import badProduct from '@/../public/assets/images/brokenPhone.svg';
import arrowRight from '@/../public/assets/images/green arrow.png'

const disputes = [
    { id: 1, productId: 1, prodId:"1234567887654", productImage: iPhone, productName: "iPhone 14 pro max", customerId: "Jude Tersoo",  status: "Processed", reason: "Wrong item received", price: 840000 },
    { id: 2, productId: 2, prodId:"1234567887654", productImage: iPhone, productName: "iPhone 14 pro max", customerId: "Jude Tersoo",   status: "Pending", reason: "Defect on product", price: 840000 },
    { id: 3, productId: 3,prodId:"1234567887654", productImage: iPhone, productName: "iPhone 14 pro max", customerId: "Jude Tersoo", status: "Inspecting", reason: "Damaged product", price: 840000 },
    { id: 4, productId: 4,prodId:"1234567887654", productImage: iPhone, productName: "iPhone 14 pro max", customerId: "Jude Tersoo",  status: "Processed", reason: "Damaged product",price: 840000},
    { id: 5, productId: 5,prodId:"1234567887654", productImage: iPhone, productName: "iPhone 14 pro max",  customerId: "Jude Tersoo", status: "Pending", reason: "Damaged product",price: 840000},
    { id: 6, productId: 6, prodId:"1234567887654", productImage: iPhone, productName: "iPhone 14 pro max", customerId: "Jude Tersoo",  status: "Inspecting", reason: "Damaged product", price: 840000 },
    { id: 7, productId: 7, prodId:"1234567887654", productImage: iPhone, productName: "iPhone 14 pro max", customerId: "Jude Tersoo", status: "Pending", reason: "Not satisfied",price: 840000},
    { id: 8, productId: 8, prodId:"1234567887654", productImage: iPhone, productName: "iPhone 14 pro max", customerId: "Jude Tersoo", status: "Inspecting", reason: "Damaged product", price: 840000 },
    { id: 9, productId: 9,prodId:"1234567887654", productImage: iPhone, productName: "iPhone 14 pro max", customerId: "Jude Tersoo", status: "Processed", reason: "Damaged product",price: 840000},
    { id: 10, productId: 10,prodId:"1234567887654", productImage: iPhone, productName: "iPhone 14 pro max", customerId: "Jude Tersoo", status: "Pending", reason: "Damaged product", price: 840000}
];

interface ProductActionsDropdownProps {
    children: React.ReactNode;
    orderNumber: string;  // Changed from orderId to orderNumber
    orderStatus: OrderStatus;
    onMarkDelivered: (orderNumber: string) => Promise<void>;  // Now accepts orderNumber
    onViewOrder: (orderNumber: string) => void;  // Now accepts orderNumber
}

const ProductActionsDropdown = ({

                                    children,
                                    orderNumber,
                                    orderStatus,
                                    onMarkDelivered,
                                    onViewOrder
                                }: ProductActionsDropdownProps) =>{
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleActionClick = async (e: React.MouseEvent, action: 'markDelivered' | 'viewOrder') => {
        e.stopPropagation();
        try {
            if (action === 'markDelivered') {
                await onMarkDelivered(orderNumber);  // Pass orderNumber instead of orderId
            } else {
                onViewOrder(orderNumber);  // Pass orderNumber instead of orderId
            }
            setIsOpen(false);
        } catch (error) {
            console.error('Error:', error);
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
                <div className="absolute right-0 top-full mt-1 bg-white rounded-md shadow-lg z-50 border border-[#ededed] w-[125px]">
                    <ul className="py-1">
                        {orderStatus === OrderStatus.PAID ? (
                            <li
                                className="px-4 py-2 text-[12px] hover:bg-[#ECFDF6] cursor-pointer"
                                onClick={(e) => handleActionClick(e, 'markDelivered')}
                            >
                                Mark delivered
                            </li>
                        ) : (
                            <li
                                className="px-4 py-2 text-[12px] hover:bg-[#ECFDF6] cursor-pointer"
                                onClick={(e) => handleActionClick(e, 'viewOrder')}
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


interface Dispute {
    id: number;
    customerId: string;
    productId: number;
    prodId: string;
    productImage: StaticImageData;
    productName: string;
    status: string;
    price: number;
    reason: string;
}

const DisputeDetailsModal = ({
                                 dispute,
                                 onClose,
                             }: {
    dispute: Dispute;
    onClose: () => void;
}) => {
    return (
        <div             className="fixed inset-0 z-50 flex items-center justify-center bg-[#808080]/20">
            <div
                 className="absolute inset-0" onClick={onClose} />

            <div
                className="relative z-10 bg-white w-[1100px]  mx-4 px-[60px] py-[40px] shadow-lg">
                <div className="flex justify-between border-b-[0.5px] border-[#ededed] pb-[14px] items-start ">
                    <div className="flex flex-col">
                        <p className="text-[16px] text-[#022B23] font-medium">Dispute request</p>
                        <p className="text-[14px] text-[#707070] font-medium">View and process dispues on products with customers</p>
                    </div>
                    <div
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            dispute.status === "Processed"
                                ? "bg-[#ECFDF3] text-[#027A48]"
                                : dispute.status === "Inspecting"
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
                            <p className="text-[#022B23] text-[16px] font-semibold">#ORDR-1234</p>
                            <div>
                                <p className="text-[#707070] font-medium text-[14px] leading-tight">Request date: <span className="text-[#000000]">April 20, 2025</span></p>
                                <p className="text-[#707070] font-medium text-[14px] leading-tight">From: <span className="text-[#000000]">Jude Tersoo</span></p>
                            </div>
                        </div>
                        <div className="w-[100%] flex items-center justify-between h-[72px] border-[1px] border-[#ededed] rounded-[14px]">
                            <div className="flex items-center h-full gap-[10px]">
                                <div className="h-full bg-[#f9f9f9] rounded-bl-[14px] rounded-tl-[14px] w-[70px] border-l-[0.5px] border-[#ededed]">
                                    <Image src={dispute.productImage} alt={'image'} className="h-full w-[70px] rounded-bl-[14px] rounded-tl-[14px]"/>
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <p className="text-[#101828] text-[14px] font-medium">
                                        {dispute.productName}
                                    </p>
                                    <p className="text-[#667085] text-[14px]">
                                        ID: #{dispute.prodId}
                                    </p>
                                </div>
                            </div>
                            <p className="text-[#667085] text-[14px] mr-[10px]">Quantity: 1</p>
                        </div>
                        <div className="h-[230px] p-[20px] rounded-[24px] bg-[#FFFBF6] w-[100%] border-[#FF9500] flex flex-col gap-[12px] border">
                            <div className="flex flex-col leading-tight">
                                <p className="text-[#101828] text-[14px] font-medium">Reason for return</p>
                                <p className="text-[#525252] text-[14px]">Product was damaged when delivered</p>
                            </div>
                            <div className="bg-[#EFEFEF] w-[100%] flex justify-center rounded-[24px] h-[150px]">
                                <Image src={badProduct} alt={'image'} className="rounded-[24px] w-[100%] h-[150px]"/>
                            </div>
                        </div>
                    </div>
                    <div className="w-[50%] flex justify-between flex-col gap-[20px] pl-[15px] pt-[20px] pb-[5px]">
                        <p className="text-[#022B23] font-semibold text-[16px]">Product details</p>
                        <div className="flex flex-col gap-[8px] pb-[25px] border-b-[0.5px] border-[#ededed]">
                            <div className="flex justify-between">
                                <p className="text-[#707070] text-[14px] font-medium">Order date</p>
                                <p className="text-[#000000] text-[14px] font-medium">4th April, 2025</p>
                            </div>
                            <div className="flex justify-between ">
                                <p className="text-[#707070] text-[14px] font-medium">Order time</p>
                                <p className="text-[#000000] text-[14px] font-medium">02:32:00 PM</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-[#707070] text-[14px] font-medium">Order amount</p>
                                <p className="text-[#000000] text-[14px] font-medium">NGN {dispute.price}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-[#707070] text-[14px] font-medium">Delivery method</p>
                                <p className="text-[#000000] text-[14px] font-medium">Home delivery</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-[8px] pb-[25px] border-b-[0.5px] border-[#ededed]">
                            <div className="flex justify-between">
                                <p className="text-[#707070] text-[14px] font-medium">Customer name</p>
                                <p className="text-[#000000] text-[14px] font-medium">{dispute.customerId}</p>
                            </div>
                            <div className="flex justify-between ">
                                <p className="text-[#707070] text-[14px] font-medium">Email</p>
                                <p className="text-[#000000] text-[14px] font-medium">jtersoo@gmail.com</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-[#707070] text-[14px] font-medium">Phone</p>
                                <p className="text-[#000000] text-[14px] font-medium">+234 801 2345 678</p>
                            </div>
                        </div>
                        <div className="w-[466px] h-[48px]  flex gap-[4px]">
                            <div className="flex text-[#707070] text-[16px] font-semibold items-center justify-center w-[116px] h-full border-[0.5px] border-[#707070] rounded-[12px]">
                                Reject
                            </div>
                            <div className="flex text-[#461602] text-[16px] font-semibold items-center justify-center w-[163px] bg-[#FFEEBE] h-full  rounded-[12px]">
                                Start inspection
                            </div>
                            <div className="flex gap-[6px] text-[#C6EB5F] text-[16px] font-semibold items-center justify-center w-[179px] bg-[#033228] h-full  rounded-[12px]">
                                Process refund
                                <Image src={arrowRight} alt={'image'}/>
                            </div>
                        </div>
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

const DisputeTableRow = ({ dispute, isLast, onViewDispute }: { dispute: Dispute; isLast: boolean; onViewDispute: () => void }) => {
    return (
        <div className={`flex h-[72px] ${!isLast ? 'border-b border-[#EAECF0]' : ''}`}>
            <div className="flex items-center w-[30%] pr-[24px] gap-3">
                <div className="bg-[#f9f9f9] h-full w-[70px] overflow-hidden mt-[2px]">
                    <Image
                        src={dispute.productImage}
                        alt={'image'}
                        width={70}
                        height={70}
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <p className="text-[14px] font-medium text-[#101828]">{dispute.productName}</p>
                    <p className="text-[12px] text-[#667085]">ID #: {dispute.prodId}</p>
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
                <p>{dispute.customerId}</p>
            </div>
            <div className="flex items-center justify-center text-[#101828] text-[14px] w-[25%] px-[24px]">
                <p className="text-[#101828] text-[14px] ">{dispute.reason}</p>
            </div>
            <div className="flex items-center text-[#344054] text-[14px] w-[15%] px-[24px]">
                <p>₦{dispute.price.toLocaleString()}</p>
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
    PENDING_DELIVERY = 'PENDING_DELIVERY',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

interface PendingOrdersProps {
    orders: OrderResponse[];
    loading: boolean;
}

const PendingOrders = ({ orders: initialOrders, loading }: PendingOrdersProps) => {
    const [orders, setOrders] = useState<OrderResponse[]>(initialOrders);
    const router = useRouter();


    const handleMarkDelivered = async (orderNumber: string) => {
        try {
            const response = await axios.post(
                'https://digitalmarket.benuestate.gov.ng/api/orders/process-order',
                { orderNumber }, // Request body
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status !== 200) {
                throw new Error('Failed to mark order as delivered');
            }

            // Optimistically update the UI
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.orderNumber === orderNumber
                        ? { ...order, status: OrderStatus.DELIVERED }
                        : order
                )
            );
        } catch (error) {
            console.error('Error:', error);
            // Optionally show an error message to the user
        }
    };

    const handleViewOrder = (orderNumber: string) => {
        router.push(`/vendor/dashboard/order/${orderNumber}`);
    };

    // Update orders if initialOrders changes
    useEffect(() => {
        setOrders(initialOrders);
    }, [initialOrders]);

    if (loading) {
        return <div className="p-4 text-center">Loading orders...</div>;
    }

    if (!orders || orders.length === 0) {
        return <div className="p-4 text-center">No pending orders found.</div>;
    }

    // Filter only pending orders if needed (your API might already do this)
    const pendingOrders = orders.filter(order =>
        order.status === OrderStatus.PAID ||
        order.status === OrderStatus.PENDING_DELIVERY ||
        order.status === OrderStatus.DELIVERED
    );
    return (
        <div className="flex flex-col gap-[50px]">
            <div className="flex flex-col rounded-[24px] border-[1px] border-[#EAECF0]">
                <div className="my-[20px] mx-[25px] flex flex-col">
                    <p className="text-[#101828] font-medium">Orders ({pendingOrders.length})</p>
                    <p className="text-[#667085] text-[14px]">View your product orders</p>
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
                    {pendingOrders.map((order) => (
                        <div
                            key={order.id}
                            className="flex flex-col border-b-[1px] border-[#EAECF0] hover:bg-[#F9FAFB]"
                        >
                            {/* Order items */}
                            {order.items.map((item) => (
                                <div
                                    key={`${order.id}-${item.id}`}
                                    className="flex items-center h-[72px] "
                                >
                                    <div className="flex items-center w-[30%] px-[24px] gap-3">
                                        <Image
                                            src={item.productImage}
                                            alt={item.productName}
                                            width={70}
                                            height={72}
                                            className="h-full object-cover"
                                        />
                                        <div>
                                            <p className="text-[#101828] text-[14px]">{item.productName}</p>
                                            <p className="text-[#667085] text-[12px]">ID: {item.productId}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-center items-center w-[10%]">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            order.status === OrderStatus.PAID ? 'bg-green-100 text-green-800' :
                                                order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-800' :
                                                order.status === OrderStatus.PENDING_DELIVERY ? 'bg-yellow-100 text-yellow-800' :
                                                    order.status === OrderStatus.CANCELLED ? 'bg-red-100 text-red-800' :
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
                                            ₦{item.totalPrice.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center pl-[24px] w-[10%]">
                                        <p className="text-[#101828] text-[14px]">
                                            {item.quantity}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-center w-[2%]">
                                        <ProductActionsDropdown
                                            orderNumber={order.orderNumber}  // Pass orderNumber instead of orderId
                                            orderStatus={order.status}
                                            onMarkDelivered={handleMarkDelivered}
                                            onViewOrder={handleViewOrder}
                                        >
                                            <div className="flex flex-col gap-[3px] items-center justify-center p-2 -m-2">
                                                <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                                                <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                                                <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                                            </div>
                                        </ProductActionsDropdown>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Disputes = () => {
    const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

    const handleViewDispute = (dispute: Dispute) => {
        setSelectedDispute(dispute);
    };

    const closeModal = () => {
        setSelectedDispute(null);
    };
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
                    dispute={selectedDispute}
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
    const initialTab = searchParams.get('tab') as 'pending' | 'disputes' || 'pending';
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
                    const orderResponse =  await fetch(`https://digitalmarket.benuestate.gov.ng/api/orders/get-shop-orders?shopId=${data.id}`)
                    const orderData = await orderResponse.json();
                    setPendingOrders(orderData);
                    console.log("Orders: ",orderData)
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
                            className={`py-2 text-[#11151F] cursor-pointer text-[14px] ${activeTab === 'pending' ? 'font-medium  border-b-2 border-[#C6EB5F]' : 'text-gray-500'}`}
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