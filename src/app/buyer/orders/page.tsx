'use client'
import MarketPlaceHeader from "@/components/marketPlaceHeader";
import Image from "next/image";
import arrowBack from "../../../../public/assets/images/arrow-right.svg";
import arrowRight from "../../../../public/assets/images/greyforwardarrow.svg";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface OrderItem {
    id: number;
    productId: number;
    name: string;
    unitPrice: number;
    quantity: number;
    productImage: string;
    description: string;
}

interface OrderResponse {
    id: number;
    orderNumber: string;
    status: string;
    totalAmount: number;
    deliveryFee: number;
    grandTotal: number;
    createdAt: string;
    items: OrderItem[];
}

const Orders = () => {
    const router = useRouter();
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) {
                router.push('/login');
                return;
            }
            try {
                const response = await axios.get(
                    'https://api.digitalmarke.bdic.ng/api/orders/user',
                    { params: { buyerEmail: userEmail } }
                );
                console.log("lists:::", response.data)
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [router]);

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
            case 'PENDING':
                return 'Pending';
            default:
                return status;
        }
    };

    const getProductDisplayName = (items: OrderItem[]) => {
        if (items.length === 0) return 'No items';
        if (items.length === 1) return items[0].name;
        return `${items[0].name} + ${items.length - 1} other item${items.length > 2 ? 's' : ''}`;
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
            <div className="h-[48px] w-full  border-y-[0.5px] border-[#EDEDED]">
                <div className="h-[48px] px-25 gap-[8px] items-center flex">
                    <Image src={arrowBack} alt={'imagw'}/>
                    <p className="text-[14px] text-[#3F3E3E]">Home // <span className="font-medium text-[#022B23]">Wishlist</span></p>
                </div>
            </div>
            <div className="px-25 pt-[62px] h-auto w-full">
                <div className="flex gap-[30px]">
                    <div className="flex flex-col">
                        <div className="w-[381px] text-[#022B23] text-[12px] font-medium h-[44px] bg-[#f8f8f8] rounded-[10px] flex items-center px-[8px] justify-between">
                            <p>Go to profile</p>
                            <Image src={arrowRight} alt={'image'}/>
                        </div>
                        <div  className="flex flex-col h-[80px] w-[381px] mt-[6px] rounded-[12px] border border-[#eeeeee]">
                            <div onClick={()=>{router.push("/buyer/wishlist")}} className="w-full text-[#022B23]  text-[12px] font-medium h-[40px]  rounded-t-[12px] flex items-center px-[8px] ">
                                <p>Wishlist</p>
                            </div>
                            <div onClick={()=>{router.push("/buyer/orders")}} className="w-full text-[#022B23]  text-[12px]  h-[40px] rounded-b-[12px] bg-[#f8f8f8] flex items-center px-[8px] ">
                                <p>My orders</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-[779px] gap-[24px]">
                        <p className="text-[#000000] text-[14px] font-medium">My orders ({orders.length})</p>
                        <div className="h-[604px] border-[0.5px] border-[#ededed] rounded-[12px] mb-[50px]">
                            {orders.map((order, index) => {
                                const isLastItem = index === orders.length - 1;
                                const firstItem = order.items[0] || {
                                    name: 'No product',
                                    productImage: '',
                                    description: ''
                                };

                                return (
                                    <div key={order.id} className={`flex items-center ${!isLastItem ? "border-b h-[151px] overflow-hidden border-[#ededed]" : "border-none"}`}>
                                        <div className="flex border-r border-[#ededed] w-[169px] h-[151px] overflow-hidden">
                                            {firstItem.productImage ? (
                                                <Image
                                                    src={firstItem.productImage}
                                                    alt={`product`}
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
                                                        {getProductDisplayName(order.items)}
                                                    </p>
                                                    <p className="text-[10px] font-normal text-[#3D3D3D] uppercase">
                                                        {firstItem.description || 'No description'}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col">
                                                    <p className="font-medium text-[#1E1E1E] text-[16px]">
                                                        ₦{formatPrice(order.grandTotal)}
                                                    </p>
                                                    <p className="text-[#3D3D3D] text-[10px]">
                                                        {formatDate(order.createdAt)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className={`flex h-[42px] w-[80px] items-center text-[14px] font-medium justify-center rounded-[100px] ${getStatusStyle(order.status)}`}>
                                                <p>{getStatusDisplayText(order.status)}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Orders;