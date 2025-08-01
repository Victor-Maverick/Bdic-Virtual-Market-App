'use client'
import MarketPlaceHeader from "@/components/marketPlaceHeader";
import Image from "next/image";
import arrowRight from "../../../../public/assets/images/greyforwardarrow.svg";
import React, {useCallback, useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Toaster, toast } from 'react-hot-toast';

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

const DisputeDetailsModal = ({
                                 dispute,
                                 onClose,
                                 onAcceptResolution
                             }: {
    dispute: DisputeResponse;
    onClose: () => void;
    onAcceptResolution: () => void;
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#808080]/20">
            <div className="absolute inset-0" onClick={onClose} />
            <div className="relative z-10 bg-white w-[1100px] mx-4 px-[60px] py-[40px] shadow-lg">
                <div className="flex justify-between border-b-[0.5px] border-[#ededed] pb-[14px] items-start ">
                    <div className="flex flex-col">
                        <p className="text-[16px] text-[#022B23] font-medium">Dispute request</p>
                        <p className="text-[14px] text-[#707070] font-medium">View and process disputes on products with customers</p>
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

                <div className="w-full flex">
                    <div className="w-[50%] pt-[24px] pr-[32px] border-r-[0.5px] border-[#ededed] pb-[2px] gap-[30px] flex flex-col">
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
                                    <Image
                                        src={dispute.orderItem.productImage}
                                        alt={'product image'}
                                        width={70}
                                        height={70}
                                        className="h-full w-[70px] rounded-bl-[14px] rounded-tl-[14px]"
                                    />
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <p className="text-[#101828] text-[14px] font-medium">
                                        {dispute.orderItem.productName}
                                    </p>
                                </div>
                            </div>
                            <p className="text-[#667085] text-[14px] mr-[10px]">Quantity: {dispute.orderItem.quantity}</p>
                        </div>
                        <div className="h-[230px] p-[20px] rounded-[24px] bg-[#FFFBF6] w-[100%] border-[#FF9500] flex flex-col gap-[12px] border">
                            <div className="flex flex-col leading-tight">
                                <p className="text-[#101828] text-[14px] font-medium">Reason for dispute</p>
                                <p className="text-[#525252] text-[14px]">{dispute.reason}</p>
                            </div>
                            <div className="bg-[#EFEFEF] w-[100%] flex justify-center rounded-[24px] h-[150px]">
                                <Image
                                    src={dispute.imageUrl}
                                    width={150}
                                    height={150}
                                    alt={'dispute image'}
                                    className="rounded-[24px] w-[100%] h-[150px] object-cover"
                                />
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
                                <p className="text-[#000000] text-[14px] font-medium">NGN {dispute.orderItem.totalPrice.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-[8px] pb-[25px] border-b-[0.5px] border-[#ededed]">
                            <div className="flex justify-between">
                                <p className="text-[#707070] text-[14px] font-medium">Vendor name</p>
                                <p className="text-[#000000] text-[14px] font-medium">{dispute.orderItem.vendorName}</p>
                            </div>
                        </div>
                        {dispute.status === 'PENDING_RESOLUTION' && (
                            <div className="h-[48px] flex gap-[4px]">
                                <div
                                    className="flex cursor-pointer text-[#461602] text-[16px] font-semibold items-center justify-center w-full bg-[#FFEEBE] h-full rounded-[12px]"
                                    onClick={onAcceptResolution}
                                >
                                    Accept Resolution
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DisputeActionsDropdown = ({
                                    onViewDispute,
                                    disputeStatus,
                                    onAcceptResolution
                                }: {
    onViewDispute: () => void;
    disputeStatus: string;
    onAcceptResolution: () => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

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
                        {disputeStatus === 'PENDING_RESOLUTION' && (
                            <li
                                className="px-4 py-2 text-[12px] hover:bg-[#ECFDF6] cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAcceptResolution();
                                    setIsOpen(false);
                                }}
                            >
                                Accept resolution
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

const DisputeTableRow = ({
                             dispute,
                             isLast,
                             onViewDispute,
                             onAcceptResolution
                         }: {
    dispute: DisputeResponse;
    isLast: boolean;
    onViewDispute: () => void;
    onAcceptResolution: () => void;
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
                    <p className="text-[12px] text-[#667085]">Amount: N {dispute.orderItem.totalPrice?.toLocaleString() || "0"}</p>
                </div>
            </div>

            <div className="flex items-center w-[25%] px-[24px]">
                <div className={`w-auto p-3 h-[22px] rounded-[8px] flex items-center justify-center ${
                    dispute.status === 'PROCESSING'
                        ? 'bg-[#ECFDF3] text-[#027A48]'
                        : dispute.status === 'PENDING'
                            ? 'bg-[#FFFAEB] text-[#F99007]'
                            : 'w-[69px] bg-[#EDEDED] text-[#707070]'
                }`}>
                    <p className="text-[10px] font-medium">{dispute.status}</p>
                </div>
            </div>
            <div className="flex items-center text-[#344054] text-[14px] w-[15%] px-[24px]">
                <p>{dispute.orderItem.vendorName || "Unknown"}</p>
            </div>
            <div className="flex items-center justify-center text-[#101828] text-[14px] w-[25%] px-[24px]">
                <p className="text-[#101828] text-[14px]">{dispute.reason}</p>
            </div>

            <div className="flex items-center justify-center w-[5%]">
                <DisputeActionsDropdown
                    onViewDispute={onViewDispute}
                    disputeStatus={dispute.status}
                    onAcceptResolution={onAcceptResolution}
                />
            </div>
        </div>
    );
};

const Disputes = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [disputes, setDisputes] = useState<DisputeResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDispute, setSelectedDispute] = useState<DisputeResponse | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const disputesPerPage = 6;

    const fetchDisputes = useCallback(async () => {
        if (session?.user?.email) {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/dispute/get-user?email=${session.user.email}`
                );
                setDisputes(response.data);
            } catch (error) {
                console.error('Error fetching disputes:', error);
                toast.error('Failed to fetch disputes', {
                    position: 'top-center',
                    style: {
                        background: '#FF3333',
                        color: '#fff',
                    },
                });
            } finally {
                setLoading(false);
            }
        }
    }, [session]);

    // Calculate current disputes to display
    const indexOfLastDispute = currentPage * disputesPerPage;
    const indexOfFirstDispute = indexOfLastDispute - disputesPerPage;
    const currentDisputes = disputes.slice(indexOfFirstDispute, indexOfLastDispute);
    const totalPages = Math.ceil(disputes.length / disputesPerPage);

    useEffect(() => {
        fetchDisputes();
    }, [session, fetchDisputes]);


    const handleAcceptResolution = async (disputeId: number) => {
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/dispute/resolve?disputeId=${disputeId}`
            );

            if (response.status === 200) {
                toast.success('Resolution accepted successfully', {
                    position: 'top-center',
                    style: {
                        background: '#4BB543',
                        color: '#fff',
                    },
                });
                // Refresh disputes or update the specific dispute's status
                fetchDisputes();
                setSelectedDispute(null);
            } else {
                throw new Error('Failed to accept resolution');
            }
        } catch (error) {
            console.error('Error accepting resolution:', error);
            toast.error('Failed to accept resolution', {
                position: 'top-center',
                style: {
                    background: '#FF3333',
                    color: '#fff',
                },
            });
        }
    };

    const handleViewDispute = (dispute: DisputeResponse) => {
        setSelectedDispute(dispute);
    };

    const closeModal = () => {
        setSelectedDispute(null);
    };

    if (loading) {
        return (
            <div className="flex flex-col text-center h-64">
                <MarketPlaceHeader/>
                <p>Loading disputes...</p>
            </div>
        );
    }

    if (!disputes || disputes.length === 0) {
        return (

            <div className="flex flex-col text-center h-64">
                <MarketPlaceHeader/>
                <p className="mt-10">No disputes found.</p>
            </div>
        );
    }

    return (
        <>
            <MarketPlaceHeader />
            <div className="h-[48px] w-full border-b-[0.5px] border-[#EDEDED]">
                <div className="h-[48px] px-25 gap-[8px] items-center flex">
                    <BackButton variant="default" text="Go back" />
                    <p className="text-[14px] text-[#3F3E3E]">Home // <span className="font-medium text-[#022B23]">Disputes</span></p>
                </div>
            </div>
            <div className="px-25 pt-[62px] h-auto w-full">
                <div className="flex gap-[30px]">
                    <div className="flex flex-col">
                        <div className="w-[381px] text-[#022B23] text-[12px] font-medium h-[44px] bg-[#f8f8f8] rounded-[10px] flex items-center px-[8px] justify-between cursor-pointer">
                            <p>Go to profile</p>
                            <Image src={arrowRight} alt={'arrow right'}/>
                        </div>
                        <div className="flex flex-col h-auto w-[381px] mt-[6px] rounded-[12px] border border-[#eeeeee]">
                            <div
                                onClick={() => router.push("/buyer/wishlist")}
                                className="w-full text-[#022B23] text-[12px] h-[40px] rounded-t-[12px] flex items-center px-[8px] cursor-pointer">
                                <p>Wishlist</p>
                            </div>
                            <div
                                onClick={() => router.push("/buyer/orders")}
                                className="w-full text-[#022B23] text-[12px] h-[40px] flex items-center px-[8px] cursor-pointer"
                            >
                                <p>My orders</p>
                            </div>
                            <div
                                onClick={() => router.push("/buyer/disputes")}
                                className="w-full bg-[#f8f8f8] font-medium text-[#022B23] text-[12px] h-[40px] rounded-b-[12px] flex items-center px-[8px] cursor-pointer"
                            >
                                <p>Order disputes</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-[80%] gap-[24px]">
                        <p className="text-[#000000] text-[16px] font-medium">My Order disputes</p>

                        <div className="border-[0.5px] border-[#ededed] rounded-[12px] mb-[50px]">
                            <div className="flex h-[44px] bg-[#F9FAFB] border-b-[1px] border-[#EAECF0]">
                                <div className="flex items-center px-[24px] w-[30%] py-[12px] gap-[4px]">
                                    <p className="text-[#667085] font-medium text-[12px]">Products</p>
                                </div>
                                <div className="flex justify-center items-center px-[24px] w-[25%] py-[12px]">
                                    <p className="text-[#667085] font-medium text-[12px]">Status</p>
                                </div>
                                <div className="flex items-center px-[24px] w-[15%] py-[12px]">
                                    <p className="text-[#667085] font-medium text-[12px]">Customer</p>
                                </div>
                                <div className="flex items-center justify-center px-[15px] w-[25%] py-[12px]">
                                    <p className="text-[#667085] font-medium text-[12px]">Reason</p>
                                </div>
                                <div className="w-[5%]"></div>
                            </div>

                            <div className="flex flex-col">
                                {currentDisputes.map((dispute, index) => (
                                    <DisputeTableRow
                                        key={dispute.id}
                                        dispute={dispute}
                                        isLast={index === currentDisputes.length - 1}
                                        onViewDispute={() => handleViewDispute(dispute)}
                                        onAcceptResolution={() => handleAcceptResolution(dispute.id)}
                                    />
                                ))}
                            </div>
                            {/* Pagination controls */}
                            {disputes.length > disputesPerPage && (
                                <div className="flex justify-center mt-4 mb-[50px]">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#022B23] text-white hover:bg-[#033a30]'}`}
                                        >
                                            Previous
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-[#022B23] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#022B23] text-white hover:bg-[#033a30]'}`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {selectedDispute && (
                <DisputeDetailsModal
                    dispute={selectedDispute}
                    onClose={closeModal}
                    onAcceptResolution={() => handleAcceptResolution(selectedDispute.id)}
                />
            )}


            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    error: {
                        style: {
                            background: '#FF3333',
                        },
                        duration: 4000,
                    },
                }}
            />
        </>
    );
};

export default Disputes;