'use client'
import MarketPlaceHeader from "@/components/marketPlaceHeader";
import Image from "next/image";
import arrowRight from "../../../../public/assets/images/greyforwardarrow.svg";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { toast } from 'react-toastify';
import { LoadingButton } from "@/components/LoadingButton";
import { useLoading } from "@/contexts/LoadingContext";


interface OrderItemDto {
    id: number;
    productId: number;
    productName: string;
    description?: string;
    productImage: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    vendorName: string;
    buyerName?: string;
}

interface ShopOrderInfo {
    shopId: number;
    shopName: string;
    vendorName: string;
    vendorEmail: string;
    subtotal: number;
    items: OrderItemDto[];
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
    itemsByShop: Record<number, OrderItemDto[]>; // Keep for backward compatibility
    items: OrderItemDto[]; // Flat list of all items
    shopOrders: ShopOrderInfo[]; // Shop-specific information
}


const OrderItemActionsDropdown = ({
    item,
    children,
    onDispute,
    onReview,
    onRefund,
    orderStatus
}: {
    item: OrderItemDto;
    children: React.ReactNode;
    onDispute: (item: OrderItemDto) => void;
    onReview: (item: OrderItemDto) => void;
    onRefund?: (item: OrderItemDto) => void;
    orderStatus: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);


    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleAction = (e: React.MouseEvent, action: string) => {
        e.stopPropagation();
        if (action === 'dispute') {
            onDispute(item);
        } else if (action === 'review') {
            onReview(item);
        } else if (action === 'refund' && onRefund) {
            onRefund(item);
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
        <div className="relative" ref={dropdownRef}>
            <div
                ref={buttonRef}
                onClick={handleToggle}
                className="cursor-pointer w-full h-full flex items-center justify-center"
            >
                {children}
            </div>

            {isOpen && (
                <div
                    className="fixed bg-white rounded-md shadow-lg z-[1000] border border-[#ededed] w-[125px]"
                    style={{
                        top: `${buttonRef.current?.getBoundingClientRect().bottom || 0}px`,
                        left: `${(buttonRef.current?.getBoundingClientRect().right || 0) - 125}px`
                    }}
                >
                    <ul className="py-1">
                        {orderStatus === 'DELIVERED' && (
                            <>
                                <li
                                    className="px-4 py-2 text-[12px] hover:bg-[#ECFDF6] cursor-pointer"
                                    onClick={(e) => handleAction(e, 'dispute')}
                                >
                                    Dispute
                                </li>
                                <li
                                    className="px-4 py-2 text-[12px] hover:bg-[#ECFDF6] cursor-pointer"
                                    onClick={(e) => handleAction(e, 'review')}
                                >
                                    Review
                                </li>
                            </>
                        )}
                        {(orderStatus === 'CANCELLED' || orderStatus === 'DECLINED') && onRefund && (
                            <li
                                className="px-4 py-2 text-[12px] hover:bg-[#ECFDF6] cursor-pointer"
                                onClick={(e) => handleAction(e, 'refund')}
                            >
                                Request Refund
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};


const OrderModal = ({
    order,
    onClose,
    onDispute,
    onReview,
    onRefund
}: {
    order: BuyerOrderResponse | null;
    onClose: () => void;
    onDispute: (item: OrderItemDto) => void;
    onReview: (item: OrderItemDto) => void;
    onRefund: (item: OrderItemDto) => void;
}) => {
    if (!order) return null;

    const allItems = order ? (order.items || Object.values(order.itemsByShop || {}).flat()) : [];

    // Status styling
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED':
                return 'bg-[#0C4F24] text-white';
            case 'SHIPPED':
            case 'PENDING_DELIVERY':
                return 'bg-[#FFFAEB] text-[#B54708]';
            case 'PROCESSING':
                return 'bg-[#E1F5FE] text-[#0277BD]';
            case 'CANCELLED':
            case 'DECLINED':
                return 'bg-[#FFEBEB] text-[#F90707]';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'DELIVERED':
                return 'Delivered';
            case 'SHIPPED':
                return 'Shipped';
            case 'PROCESSING':
                return 'Processing';
            case 'PENDING':
                return 'Pending';
            case 'PENDING_DELIVERY':
                return 'Pending Delivery';
            case 'CANCELLED':
            case 'DECLINED':
                return 'Cancelled';
            default:
                return 'Paid';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#808080]/20 p-2 sm:p-4">
            <div className="bg-white rounded-lg p-3 sm:p-6 lg:p-[30px] w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                <div className="flex border-b-[0.5px] pb-3 border-[#ededed] justify-between items-center">
                    <h2 className="text-[14px] sm:text-[16px] text-[#022B23] font-medium">Order Details</h2>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                        </span>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
                            &times;
                        </button>
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-0">
                    <div className="w-full lg:w-[50%] lg:pr-[12px] pt-[12px] lg:border-r-[0.5px] lg:border-[#ededed]">
                        <div className="mb-6">
                            <h3 className="text-[14px] sm:text-[16px] text-[#022B23]">#{order.orderNumber}</h3>
                            <p className="text-[#7c7c7c] text-[12px] sm:text-[14px]">Order date: {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</p>
                        </div>
                        <div className="mb-6">
                            <h4 className="font-semibold mb-2 text-[14px] sm:text-[16px]">Products in order</h4>
                            <div className="max-h-[250px] sm:max-h-[300px] overflow-y-auto pr-2 relative" style={{ scrollbarGutter: 'stable' }}>
                                {allItems.map((item) => (
                                    <div key={item.id} className="w-full min-h-[60px] flex justify-between pr-[8px] sm:pr-[12px] items-center border border-[#ededed] rounded-[10px] mb-2 relative p-2">
                                        <div className="flex gap-[8px] sm:gap-[12px] items-center flex-1">
                                            <div className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] bg-[#f9f9f9] rounded-[8px] sm:rounded-bl-[10px] sm:rounded-tl-[10px] flex items-center justify-center overflow-hidden flex-shrink-0">
                                                {item.productImage ? (
                                                    <Image
                                                        src={item.productImage}
                                                        alt={item.productName}
                                                        width={60}
                                                        height={60}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-xs text-gray-500">No image</span>
                                                )}
                                            </div>
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <p className="text-[#101828] text-[12px] sm:text-[14px] font-medium truncate">{item.productName}</p>
                                                <p className="text-[#7c7c7c] text-[10px] sm:text-[12px]">Qty: {item.quantity}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <p className="text-[#101828] text-[12px] sm:text-[14px] font-medium">₦{item.unitPrice.toLocaleString()}</p>

                                            {(order.status === 'DELIVERED' || order.status === 'CANCELLED' || order.status === 'DECLINED') && (
                                                <OrderItemActionsDropdown
                                                    item={item}
                                                    onDispute={onDispute}
                                                    onReview={onReview}
                                                    onRefund={onRefund}
                                                    orderStatus={order.status}
                                                >
                                                    <div className="flex flex-col gap-[2px] cursor-pointer p-2 -m-2">
                                                        <span className="w-[4px] h-[4px] rounded-full bg-[#7c7c7c]"></span>
                                                        <span className="w-[4px] h-[4px] rounded-full bg-[#7c7c7c]"></span>
                                                        <span className="w-[4px] h-[4px] rounded-full bg-[#7c7c7c]"></span>
                                                    </div>
                                                </OrderItemActionsDropdown>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-[50%] flex flex-col justify-between lg:pl-[12px] border-t lg:border-t-0 pt-4 lg:pt-0">
                        <div className="gap-y-[12px] pt-[12px] flex flex-col border-b-[0.5px] pb-[12px] border-[#ededed]">
                            <div className="flex w-full justify-between items-center">
                                <p className="text-[#707070] font-medium text-[12px] sm:text-[14px]">Order time: </p>
                                <span className="text-[#000000] font-medium text-[12px] sm:text-[14px]">
                                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <p className="text-[#707070] font-medium text-[12px] sm:text-[14px]">Order amount: </p>
                                <span className="text-[#000000] font-medium text-[12px] sm:text-[14px]">₦{order.totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <p className="text-[#707070] font-medium text-[12px] sm:text-[14px]">Delivery method: </p>
                                <span className="text-[#000000] font-medium text-[12px] sm:text-[14px]">{order.deliveryInfo.method}</span>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <p className="text-[#707070] font-medium text-[12px] sm:text-[14px]">Delivery fee: </p>
                                <span className="text-[#000000] font-medium text-[12px] sm:text-[14px]">₦{order.deliveryFee.toLocaleString()}</span>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <p className="text-[#707070] font-medium text-[12px] sm:text-[14px]">Total: </p>
                                <span className="text-[#000000] font-medium text-[12px] sm:text-[14px]">₦{order.grandTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="flex justify-end mt-4">
                            <button
                                className="bg-[#022B23] text-[#C6EB5F] font-semibold cursor-pointer px-4 py-2 rounded hover:bg-green-700 text-[14px]"
                                onClick={onClose}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ReviewModal = ({
    product,
    onClose,
    onSubmit
}: {
    product: OrderItemDto;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
}) => {
    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');

    const handleSubmit = () => {
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }
        onSubmit(rating, comment);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#808080]/20">
            <div className="bg-white rounded-lg p-[30px] w-full max-w-md">
                <div className="flex border-b-[0.5px] pb-3 border-[#ededed] justify-between items-center">
                    <h2 className="text-[16px] text-[#022B23] font-medium">Review Product</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        &times;
                    </button>
                </div>

                <div className="mt-4">
                    <div className="mb-4">
                        <h3 className="text-[14px] font-medium mb-2">{product.productName}</h3>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    className="text-2xl focus:outline-none"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                >
                                    {star <= (hoverRating || rating) ? (
                                        <span className="text-yellow-500">★</span>
                                    ) : (
                                        <span className="text-gray-300">★</span>
                                    )}
                                </button>
                            ))}
                            <span className="ml-2 text-sm text-gray-500">
                                {hoverRating || rating > 0 ? `${hoverRating || rating}.0` : 'Rate this product'}
                            </span>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-1">
                            Your Review
                        </label>
                        <textarea
                            id="review-comment"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#022B23]"
                            placeholder="Share your experience with this product..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={rating === 0}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${rating === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#022B23] hover:bg-[#033a30]'
                                }`}
                        >
                            Submit Review
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RefundModal = ({
    product,
    order,
    onClose,
    onSubmit
}: {
    product: OrderItemDto;
    order: BuyerOrderResponse;
    onClose: () => void;
    onSubmit: (reason: string, description: string) => void;
}) => {
    const [reason, setReason] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const handleSubmit = () => {
        if (!reason.trim()) {
            alert('Please select a reason for the refund');
            return;
        }
        onSubmit(reason, description);
    };

    const refundReasons = [
        'Product was damaged/defective',
        'Wrong product received',
        'Product not as described',
        'Order was cancelled by vendor',
        'Order was declined by vendor',
        'Other'
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#808080]/20">
            <div className="bg-white rounded-lg p-[30px] w-full max-w-md">
                <div className="flex border-b-[0.5px] pb-3 border-[#ededed] justify-between items-center">
                    <h2 className="text-[16px] text-[#022B23] font-medium">Request Refund</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        &times;
                    </button>
                </div>

                <div className="mt-4">
                    <div className="mb-4">
                        <h3 className="text-[14px] font-medium mb-2">{product.productName}</h3>
                        <p className="text-[12px] text-gray-600 mb-2">Order: {order.orderNumber}</p>
                        <p className="text-[12px] text-gray-600">Refund Amount: ₦{product.unitPrice.toLocaleString()}</p>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="refund-reason" className="block text-sm font-medium text-gray-700 mb-1">
                            Reason for Refund *
                        </label>
                        <select
                            id="refund-reason"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#022B23]"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        >
                            <option value="">Select a reason</option>
                            {refundReasons.map((reasonOption) => (
                                <option key={reasonOption} value={reasonOption}>
                                    {reasonOption}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="refund-description" className="block text-sm font-medium text-gray-700 mb-1">
                            Additional Details
                        </label>
                        <textarea
                            id="refund-description"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#022B23]"
                            placeholder="Please provide additional details about your refund request..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!reason.trim()}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${!reason.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#022B23] hover:bg-[#033a30]'
                                }`}
                        >
                            Submit Refund Request
                        </button>
                    </div>
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
                        {(order.status === 'SHIPPED' || order.status === 'PENDING_DELIVERY') ? (
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
    const [disputeModalOpen, setDisputeModalOpen] = useState(false);
    const [disputeItem, setDisputeItem] = useState<OrderItemDto | null>(null);
    const [disputeReason, setDisputeReason] = useState('');
    const [disputeImage, setDisputeImage] = useState<File | null>(null);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewItem, setReviewItem] = useState<OrderItemDto | null>(null);
    const [refundModalOpen, setRefundModalOpen] = useState(false);
    const [refundItem, setRefundItem] = useState<OrderItemDto | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [debugInfo, setDebugInfo] = useState<string>('');
    const [showDebug, setShowDebug] = useState(false);
    const { isLoading, withLoading } = useLoading();
    const ordersPerPage = 6;
    // Calculate pagination
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    const handleOpenReviewModal = (item: OrderItemDto) => {
        setReviewItem(item);
        setReviewModalOpen(true);
    };

    const handleCloseReviewModal = () => {
        setReviewModalOpen(false);
        setReviewItem(null);
    };

    const handleOpenRefundModal = (item: OrderItemDto) => {
        setRefundItem(item);
        setRefundModalOpen(true);
    };

    const handleCloseRefundModal = () => {
        setRefundModalOpen(false);
        setRefundItem(null);
    };

    const handleSubmitReview = async (rating: number, comment: string) => {
        if (!reviewItem) return;

        try {
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) {
                router.push('/login');
                return;
            }

            await toast.promise(
                axios.post(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/review/review-product`,
                    {
                        email: userEmail,
                        productId: reviewItem.productId,
                        rating: rating,
                        comment: comment
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                ),
                {
                    pending: 'Submitting review...',
                    success: 'Review submitted successfully!',
                    error: 'Failed to submit review. Please try again.'
                }
            );

            handleCloseReviewModal();
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const handleSubmitRefund = async (reason: string, description: string) => {
        if (!refundItem || !selectedOrder) return;

        try {
            const userEmail = localStorage.getItem('userEmail');
            const userName = localStorage.getItem('userName') || 'Unknown User';
            if (!userEmail) {
                router.push('/login');
                return;
            }

            // Get shop info from the order - we need to find which shop this item belongs to
            let shopId: number | null = null;
            let shopName = '';
            let vendorEmail = '';
            let vendorName = '';

            // Find the shop for this item
            if (selectedOrder.shopOrders) {
                for (const shopOrder of selectedOrder.shopOrders) {
                    if (shopOrder.items.some(item => item.id === refundItem.id)) {
                        shopId = shopOrder.shopId;
                        shopName = shopOrder.shopName;
                        vendorEmail = shopOrder.vendorEmail;
                        vendorName = shopOrder.vendorName;
                        break;
                    }
                }
            } else {
                // Fallback to old structure
                for (const [shopIdStr, items] of Object.entries(selectedOrder.itemsByShop || {})) {
                    if (items.some(item => item.id === refundItem.id)) {
                        shopId = parseInt(shopIdStr);
                        // You might need to fetch shop details here or store them in the order
                        // For now, we'll use placeholder values
                        shopName = `Shop ${shopId}`;
                        vendorEmail = `vendor${shopId}@example.com`;
                        vendorName = `Vendor ${shopId}`;
                        break;
                    }
                }
            }

            if (!shopId) {
                toast.error('Unable to identify shop for this item');
                return;
            }

            const refundRequest = {
                orderId: parseInt(selectedOrder.orderNumber.replace(/\D/g, '')) || 1, // Extract numeric ID from order number
                orderNumber: selectedOrder.orderNumber,
                buyerEmail: userEmail,
                buyerName: userName,
                vendorEmail: vendorEmail,
                vendorName: vendorName,
                shopId: shopId,
                shopName: shopName,
                refundAmount: refundItem.unitPrice * refundItem.quantity,
                reason: reason,
                description: description
            };

            await toast.promise(
                axios.post(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/refunds`,
                    refundRequest,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                ),
                {
                    pending: 'Submitting refund request...',
                    success: 'Refund request submitted successfully!',
                    error: {
                        render({ data }) {
                            if (axios.isAxiosError(data) && data.response?.data) {
                                return data.response.data;
                            }
                            return 'Failed to submit refund request. Please try again.';
                        }
                    }
                }
            );

            handleCloseRefundModal();
        } catch (error) {
            console.error('Error submitting refund request:', error);
        }
    };

    const handleOpenDisputeModal = (item: OrderItemDto) => {
        setDisputeItem(item);
        setDisputeModalOpen(true);
    };

    const handleCloseDisputeModal = () => {
        setDisputeModalOpen(false);
        setDisputeReason('');
        setDisputeImage(null);
        setDisputeItem(null);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setDisputeImage(e.target.files[0]);
        }
    };

    const handleSubmitDispute = async () => {
        if (!disputeItem || !disputeReason || !selectedOrder) {
            toast.warn('Please provide all required information');
            return;
        }

        await withLoading('submitDispute', async () => {
            try {
                const userEmail = localStorage.getItem('userEmail');
                if (!userEmail) {
                    router.push('/login');
                    return;
                }

                const formData = new FormData();
                formData.append('buyerEmail', userEmail);
                formData.append('orderNumber', selectedOrder.orderNumber);
                formData.append('itemId', disputeItem.id.toString());
                if (disputeImage) {
                    formData.append('itemImage', disputeImage);
                }
                formData.append('reason', disputeReason);

                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dispute/add`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                
                toast.success('Dispute submitted successfully!');
                handleCloseDisputeModal();
            } catch (error) {
                console.error('Error submitting dispute:', error);
                if (axios.isAxiosError(error) && error.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('Failed to submit dispute. Please try again.');
                }
            }
        });
    };

    useEffect(() => {
        const fetchOrders = async () => {
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) {
                router.push('/login');
                return;
            }
            
            await withLoading('fetchOrders', async () => {
                try {
                    console.log('🔍 Fetching orders for:', userEmail);
                    const response = await axios.get<BuyerOrderResponse[]>(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/user`,
                        { params: { buyerEmail: userEmail } }
                    );

                    console.log('📦 Raw orders data:', response.data);
                    
                    // Process orders to ensure items are properly populated
                    const processedOrders = response.data.map((order: BuyerOrderResponse) => {
                        console.log(`📦 Processing order ${order.orderNumber}:`, {
                            items: order.items?.length || 0,
                            shopOrders: order.shopOrders?.length || 0,
                            itemsByShop: Object.keys(order.itemsByShop || {}).length
                        });
                        
                        // If items is empty but shopOrders has items, flatten them
                        if ((!order.items || order.items.length === 0) && order.shopOrders && order.shopOrders.length > 0) {
                            const flattenedItems = order.shopOrders.flatMap(shop => shop.items || []);
                            console.log(`📦 Flattened ${flattenedItems.length} items from shopOrders`);
                            return { ...order, items: flattenedItems };
                        }
                        
                        // If items is empty but itemsByShop has items, flatten them
                        if ((!order.items || order.items.length === 0) && order.itemsByShop) {
                            const flattenedItems = Object.values(order.itemsByShop).flat();
                            console.log(`📦 Flattened ${flattenedItems.length} items from itemsByShop`);
                            return { ...order, items: flattenedItems };
                        }
                        
                        return order;
                    });

                    // Sort orders by createdAt in descending order (newest first)
                    const sortedOrders = processedOrders.sort((a, b) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );

                    setOrders(sortedOrders);
                    console.log("📦 Final processed orders:", sortedOrders);
                } catch (error) {
                    console.error('Error fetching orders:', error);
                } finally {
                    setLoading(false);
                }
            });
        };
        fetchOrders();
    }, [router, withLoading]);

    const fetchDebugInfo = async () => {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
            setDebugInfo('No user email found in localStorage');
            setShowDebug(true);
            return;
        }
        
        await withLoading('debugInfo', async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/user/debug`,
                    { params: { buyerEmail: userEmail } }
                );
                
                setDebugInfo(response.data);
                setShowDebug(true);
            } catch (error) {
                setDebugInfo('Error fetching debug info: ' + (error instanceof Error ? error.message : String(error)));
                setShowDebug(true);
            }
        });
    };

    const handleMarkDelivered = async (orderNumber: string) => {
        const toastId = toast.loading('Marking order as delivered...', {
            position: "top-right"
        });
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/validate-pickUp`,
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
            toast.update(toastId, {
                render: 'Order marked as delivered',
                type: "success",
                isLoading: false,
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            console.error('Error marking order as delivered:', error);
            toast.update(toastId, {
                render: 'Failed to mark order as delivered',
                type: "error",
                isLoading: false,
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const handleViewOrder = (order: BuyerOrderResponse) => {
        setSelectedOrder(order);
    };

    const closeModal = () => {
        setSelectedOrder(null);
    };

    const getAllItemsFromOrder = (order: BuyerOrderResponse): OrderItemDto[] => {
        return order.items || Object.values(order.itemsByShop || {}).flat();
    };

    const getProductDisplayName = (order: BuyerOrderResponse) => {
        const allItems = getAllItemsFromOrder(order);
        if (allItems.length === 0) return 'No items';
        if (allItems.length === 1) return allItems[0].productName;
        return `${allItems[0].productName} + ${allItems.length - 1} other item${allItems.length > 2 ? 's' : ''}`;
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
            case 'SHIPPED':
            case 'IN_TRANSIT':
                return 'bg-[#FFFAEB] text-[#F99007]';
            case 'PROCESSING':
                return 'bg-[#E1F5FE] text-[#0277BD]';
            case 'RETURNED':
            case 'CANCELLED':
            case 'DECLINED':
                return 'bg-[#FFEBEB] text-[#F90707]';
            case 'PENDING_DELIVERY':
            case 'PENDING':
                return 'bg-[#FFFAEB] text-[#B54708]';
            default:
                return 'bg-[#E7E7E7] text-[#1E1E1E]';
        }
    };

    const getStatusDisplayText = (status: string) => {
        switch (status) {
            case 'DELIVERED':
                return 'Delivered';
            case 'SHIPPED':
                return 'Shipped';
            case 'IN_TRANSIT':
                return 'In-transit';
            case 'PROCESSING':
                return 'Processing';
            case 'RETURNED':
                return 'Returned';
            case 'CANCELLED':
            case 'DECLINED':
                return 'Cancelled';
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
                <div className="h-[48px] w-full border-y-[0.5px] border-[#EDEDED]">
                    <div className="h-[48px] px-4 sm:px-6 lg:px-25 gap-[8px] items-center flex">
                        <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>
                <div className="px-4 sm:px-6 lg:px-[100px] py-[10px] border-b border-[#ededed]">
                    <div className="w-full max-w-[182px] h-[46px] flex border-[0.5px] border-[#ededed] rounded-[4px] p-[2px]">
                        <div className="flex justify-center gap-[2px] items-center bg-[#F9F9F9] w-full h-[40px]">
                            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
                <div className="px-4 sm:px-6 lg:px-[100px] py-8">
                    <div className="space-y-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="border border-[#ededed] rounded-lg p-4 animate-pulse">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-200 rounded"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                    </div>
                                    <div className="w-20 h-6 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <MarketPlaceHeader />
            <div className="h-[48px] w-full border-y-[0.5px] border-[#EDEDED]">
                <div className="h-[48px] px-4 sm:px-6 lg:px-25 gap-[8px] items-center flex">
                    <BackButton variant="default" text="Go back" />
                    <p className="text-[12px] sm:text-[14px] text-[#3F3E3E]">Home // <span className="font-medium text-[#022B23]">Orders</span></p>
                </div>
            </div>
            <div className="px-4 sm:px-6 lg:px-25 pt-4 sm:pt-8 lg:pt-[62px] h-auto w-full">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-[30px]">
                    {/* Sidebar - Hidden on mobile, shown as horizontal tabs on tablet */}
                    <div className="flex flex-col lg:block">
                        <div className="w-full lg:w-[381px] text-[#022B23] text-[12px] font-medium h-[44px] bg-[#f8f8f8] rounded-[10px] flex items-center px-[8px] justify-between mb-2 lg:mb-0">
                            <p>Go to profile</p>
                            <Image src={arrowRight} alt={'image'} />
                        </div>
                        <div className="flex flex-row lg:flex-col h-auto w-full lg:w-[381px] mt-0 lg:mt-[6px] rounded-[12px] border border-[#eeeeee] overflow-hidden">
                            <div onClick={() => { router.push("/buyer/wishlist") }} className="flex-1 lg:w-full text-[#022B23] text-[12px] h-[40px] lg:rounded-t-[12px] flex items-center justify-center lg:justify-start px-[8px] cursor-pointer hover:bg-gray-50">
                                <p>Wishlist</p>
                            </div>
                            <div onClick={() => { router.push("/buyer/orders") }} className="flex-1 lg:w-full text-[#022B23] text-[12px] h-[40px] font-medium bg-[#f8f8f8] flex items-center justify-center lg:justify-start px-[8px] cursor-pointer">
                                <p>My orders</p>
                            </div>
                            <div onClick={() => { router.push("/buyer/disputes") }} className="flex-1 lg:w-full text-[#022B23] text-[12px] h-[40px] lg:rounded-b-[12px] flex items-center justify-center lg:justify-start px-[8px] cursor-pointer hover:bg-gray-50">
                                <p>Order disputes</p>
                            </div>
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="flex flex-col w-full lg:w-[779px] gap-4 lg:gap-[24px]">
                        <div className="flex items-center justify-between">
                            <p className="text-[#000000] text-[14px] sm:text-[16px] font-medium">My orders ({orders.length})</p>
                            <LoadingButton
                                onClick={fetchDebugInfo}
                                isLoading={isLoading('debugInfo')}
                                loadingText="Loading Debug..."
                                className="text-sm"
                                size="sm"
                            >
                                Debug Orders
                            </LoadingButton>
                        </div>
                        <div className="border-[0.5px] border-[#ededed] rounded-[12px] mb-[50px]">
                            {currentOrders.length === 0 ? (
                                <div className="flex items-center justify-center h-[100px] sm:h-[151px] text-[#3D3D3D] text-[14px]">
                                    <p>No orders yet</p>
                                </div>
                            ) : (
                                currentOrders
                                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                    .map((order, index) => {
                                        const isLastItem = index === orders.length - 1;
                                        const firstItem = getFirstItem(order);
                                        const statusText = getStatusDisplayText(order.status);

                                        return (
                                            <div key={order.orderNumber} className={`flex flex-col sm:flex-row items-start sm:items-center ${!isLastItem ? "border-b border-[#ededed]" : "border-none"} p-3 sm:p-0`}>
                                                {/* Mobile layout */}
                                                <div className="flex w-full sm:hidden gap-3 mb-3">
                                                    <div className="w-[80px] h-[80px] rounded-[8px] overflow-hidden flex-shrink-0">
                                                        {firstItem.productImage ? (
                                                            <Image
                                                                src={firstItem.productImage}
                                                                alt={`product`}
                                                                width={80}
                                                                height={80}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs">
                                                                No image
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[12px] sm:text-[14px] text-[#1E1E1E] font-medium mb-1 truncate">
                                                            {getProductDisplayName(order)}
                                                        </p>
                                                        <p className="text-[10px] font-normal text-[#3D3D3D] uppercase mb-2">
                                                            Order #{order.orderNumber}
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="font-medium text-[#1E1E1E] text-[14px]">
                                                                    ₦{formatPrice(order.totalAmount)}
                                                                </p>
                                                                <p className="text-[#3D3D3D] text-[10px]">
                                                                    {formatDate(order.createdAt)}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <div className={`flex h-[32px] px-2 items-center text-[12px] font-medium justify-center rounded-[100px] ${getStatusStyle(order.status)}`}>
                                                                    <p>{statusText}</p>
                                                                </div>
                                                                <OrderActionsDropdown
                                                                    order={order}
                                                                    onMarkDelivered={handleMarkDelivered}
                                                                    onViewOrder={handleViewOrder}
                                                                >
                                                                    <div className="flex flex-col gap-[2px] items-center justify-center p-2">
                                                                        <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                                                                        <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                                                                        <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                                                                    </div>
                                                                </OrderActionsDropdown>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Desktop layout */}
                                                <div className="hidden sm:flex items-center w-full h-[151px]">
                                                    <div className="flex border-r border-[#ededed] w-[120px] sm:w-[169px] h-[151px] overflow-hidden">
                                                        {firstItem.productImage ? (
                                                            <Image
                                                                src={firstItem.productImage}
                                                                alt={`product`}
                                                                width={168}
                                                                height={150}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm">
                                                                No image
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center w-full px-3 sm:px-[20px] justify-between">
                                                        <div className="flex flex-col w-[40%] sm:w-[30%]">
                                                            <div className="mb-[13px]">
                                                                <p className="text-[12px] sm:text-[14px] text-[#1E1E1E] font-medium mb-[4px] line-clamp-2">
                                                                    {getProductDisplayName(order)}
                                                                </p>
                                                                <p className="text-[10px] font-normal text-[#3D3D3D] uppercase">
                                                                    Order #{order.orderNumber}
                                                                </p>
                                                            </div>

                                                            <div className="flex flex-col">
                                                                <p className="font-medium text-[#1E1E1E] text-[14px] sm:text-[16px]">
                                                                    ₦{formatPrice(order.totalAmount)}
                                                                </p>
                                                                <p className="text-[#3D3D3D] text-[10px]">
                                                                    {formatDate(order.createdAt)}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className={`flex h-[36px] sm:h-[42px] px-2 sm:px-3 items-center text-[12px] sm:text-[14px] font-medium justify-center rounded-[100px] ${getStatusStyle(order.status)}`} style={{ width: 'fit-content' }}>
                                                            <p>{statusText}</p>
                                                        </div>

                                                        <div className="flex items-center justify-center">
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
                                            </div>
                                        );
                                    })
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {selectedOrder && (
                <OrderModal
                    order={selectedOrder}
                    onClose={closeModal}
                    onDispute={handleOpenDisputeModal}
                    onReview={handleOpenReviewModal}
                    onRefund={handleOpenRefundModal}
                />
            )}

            {disputeModalOpen && disputeItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#808080]/20">
                    <div className="bg-white rounded-lg p-[30px] w-full max-w-md">
                        <div className="flex border-b-[0.5px] pb-3 border-[#ededed] justify-between items-center">
                            <h2 className="text-[16px] text-[#022B23] font-medium">File Dispute</h2>
                            <button onClick={handleCloseDisputeModal} className="text-gray-500 hover:text-gray-700">
                                &times;
                            </button>
                        </div>

                        <div className="mt-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Upload Image (Optional)
                                </label>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            {disputeImage ? (
                                                <Image
                                                    src={URL.createObjectURL(disputeImage)}
                                                    alt={`Dispute preview`}
                                                    width={80}
                                                    height={80}
                                                    className="h-20 object-contain mb-2"
                                                />
                                            ) : (
                                                <>
                                                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                    </svg>
                                                    <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            id="dropzone-file"
                                            type="file"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                        />
                                    </label>
                                </div>
                                {disputeImage && (
                                    <button
                                        onClick={() => setDisputeImage(null)}
                                        className="mt-2 text-sm text-red-500 hover:text-red-700"
                                    >
                                        Remove image
                                    </button>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="dispute-reason" className="block text-sm font-medium text-gray-700 mb-1">
                                    Reason for Dispute *
                                </label>
                                <textarea
                                    id="dispute-reason"
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#022B23]"
                                    placeholder="Please describe the issue with this item..."
                                    value={disputeReason}
                                    onChange={(e) => setDisputeReason(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={handleCloseDisputeModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <LoadingButton
                                    onClick={handleSubmitDispute}
                                    disabled={!disputeReason}
                                    isLoading={isLoading('submitDispute')}
                                    loadingText="Submitting..."
                                    className={!disputeReason
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-[#022B23] hover:bg-[#033a30]'
                                    }
                                    size="sm"
                                >
                                    Submit Dispute
                                </LoadingButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {orders.length > ordersPerPage && (
                <div className="flex justify-center mb-4 px-4">
                    <div className="flex items-center gap-4 sm:gap-8 lg:gap-[70px] justify-between w-full max-w-md">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-2 sm:px-3 py-1 rounded-md text-sm ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#022B23] text-white hover:bg-[#033a30]'}`}
                        >
                            Previous
                        </button>

                        <div className="flex items-center gap-1 sm:gap-[5px] overflow-x-auto">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-2 sm:px-3 py-1 rounded-md text-sm flex-shrink-0 ${currentPage === page ? 'bg-[#022B23] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-2 sm:px-3 py-1 rounded-md text-sm ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#022B23] text-white hover:bg-[#033a30]'}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
            {reviewModalOpen && reviewItem && (
                <ReviewModal
                    product={reviewItem}
                    onClose={handleCloseReviewModal}
                    onSubmit={handleSubmitReview}
                />
            )}

            {refundModalOpen && refundItem && selectedOrder && (
                <RefundModal
                    product={refundItem}
                    order={selectedOrder}
                    onClose={handleCloseRefundModal}
                    onSubmit={handleSubmitRefund}
                />
            )}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            {/* Debug Modal */}
            {showDebug && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Debug Information</h2>
                            <button
                                onClick={() => setShowDebug(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
                            <pre className="text-sm whitespace-pre-wrap">{debugInfo}</pre>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
export default Orders;