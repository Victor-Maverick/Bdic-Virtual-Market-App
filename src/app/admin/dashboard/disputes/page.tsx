'use client'
import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import arrowDown from "../../../../../public/assets/images/arrow-down.svg";
import badProduct from "../../../../../public/assets/images/brokenPhone.svg";
import iPhone from "../../../../../public/assets/images/blue14.png";
import searchImg from "../../../../../public/assets/images/search-normal.png";

const disputes:Dispute[] = [
    { id: 1, transactionId:"12345",  productName: "iPhone 14 pro max", username: "Jude Tersoo", userType: "Vendor", status: "Resolved", date: "4th Apr. 2025", time: "09:22:01 AM", disputeType: "Wrong item", price: 840000 },
    { id: 2, transactionId:"12345",productName: "iPhone 14 pro max", username: "Jude Tersoo", userType: "Vendor",  status: "Rejected",date: "4th Apr. 2025", time: "09:22:01 AM", disputeType: "Defect", price: 840000 },
    { id: 3,transactionId:"12345", productName: "iPhone 14 pro max", username: "Jude Tersoo",userType: "Vendor", status: "Inspecting", date: "4th Apr. 2025", time: "09:22:01 AM",disputeType: "Damaged", price: 840000 },
    { id: 4, transactionId:"12345", productName: "iPhone 14 pro max", username: "Jude Tersoo", userType: "Vendor", status: "Resolved", date: "4th Apr. 2025", time: "09:22:01 AM",disputeType: "Wrong item",price: 840000},
    { id: 5, transactionId:"12345", productName: "iPhone 14 pro max",  username: "Jude Tersoo",userType: "Vendor", status: "Resolved", date: "4th Apr. 2025", time: "09:22:01 AM",disputeType: "Damaged",price: 840000},
    { id: 6, transactionId:"12345", productName: "iPhone 14 pro max", username: "Jude Tersoo", userType: "Vendor", status: "Inspecting", date: "4th Apr. 2025", time: "09:22:01 AM",disputeType: "Damaged", price: 840000 },
    { id: 7, transactionId:"12345",productName: "iPhone 14 pro max", username: "Jude Tersoo",userType: "Vendor",status: "Resolved", date: "4th Apr. 2025", time: "09:22:01 AM",disputeType: "Damaged",price: 840000},
    { id: 8, transactionId:"12345", productName: "iPhone 14 pro max", username: "Jude Tersoo",userType: "Vendor", status: "Inspecting", date: "4th Apr. 2025", time: "09:22:01 AM",disputeType: "Damaged", price: 840000 },
    { id: 9, transactionId:"12345", productName: "iPhone 14 pro max", username: "Jude Tersoo", userType: "Vendor",status: "Resolved", date: "4th Apr. 2025", time: "09:22:01 AM",disputeType: "Damaged",price: 840000},
    { id: 10, transactionId:"12345", productName: "iPhone 14 pro max", username: "Jude Tersoo", userType: "Vendor",status: "Resolved", date: "4th Apr. 2025", time: "09:22:01 AM",disputeType: "Damaged", price: 840000}
];


interface Dispute {
    id: number;
    transactionId: string;
    disputeType: string;
    username: string;
    userType: string;
    price: number;
    productName: string;
    date: string;
    time: string;
    status: "Resolved" | "Rejected" | "Inspecting";
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
                            dispute.status === "Resolved"
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
                                    <Image src={iPhone} alt={'image'} className="h-full w-[70px] rounded-bl-[14px] rounded-tl-[14px]"/>
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <p className="text-[#101828] text-[14px] font-medium">
                                        {dispute.productName}
                                    </p>
                                    <p className="text-[#667085] text-[14px]">
                                        ID: #{dispute.transactionId}
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
                                <p className="text-[#000000] text-[14px] font-medium">{dispute.username}</p>
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
                        <div className="flex justify-end">
                            <div className="w-[283px] h-[48px] flex gap-[4px]">
                                <div className="flex text-[#707070] text-[16px] font-semibold items-center justify-center w-[116px] h-full border-[0.5px] border-[#707070] rounded-[12px]">
                                    Resolved
                                </div>
                                <div className="flex text-[#461602] text-[16px] font-semibold items-center justify-center w-[163px] bg-[#FFEEBE] h-full  rounded-[12px]">
                                    Remind vendor
                                </div>
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
            <div className="flex items-center w-[10%] pl-[24px]">
                <p className="text-[#101828] text-[14px] font-medium">{dispute.transactionId}</p>
            </div>

            <div className="flex items-center pl-[15px] w-[12%] ">
                <p className="text-[#101828] text-[14px] font-medium">{dispute.disputeType}</p>
            </div>

            <div className="flex flex-col justify-center w-[17%] px-[15px]">
                <p className="text-[#101828] text-[14px] font-medium">{dispute.username}</p>
                <p className="text-[#667085] text-[14px]">{dispute.userType}</p>
            </div>

            <div className="flex items-center w-[15%] pl-[24px]">
                <p className="text-[#101828] text-[14px]">{dispute.productName}</p>
            </div>

            <div className="flex items-center w-[15%] pl-[24px]">
                <p className="text-[#101828] text-[14px]">{dispute.price}</p>
            </div>

            <div className="flex flex-col justify-center w-[15%] pl-[15px]">
                <p className="text-[#101828] text-[14px] font-medium">{dispute.date}</p>
                <p className="text-[#667085] text-[14px]">{dispute.time}</p>
            </div>

            <div className="flex items-center w-[15%] px-[10px]">
                <div className={`w-[55px] h-[22px] rounded-[8px] flex items-center justify-center ${
                    dispute.status === 'Resolved'
                        ? 'bg-[#ECFDF3] text-[#027A48]'
                        : 'bg-[#FEF3F2] text-[#FF5050]'
                }`}>
                    <p className="text-[12px] font-medium">{dispute.status}</p>
                </div>
            </div>

            <div className="flex items-center justify-center w-[3%]">
                <DisputeActionsDropdown productId={dispute.id} onViewDispute={onViewDispute} />
            </div>
        </div>
    );
};




const Disputes=()=>{
    const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

    const handleViewDispute = (dispute: Dispute) => {
        setSelectedDispute(dispute);
    };

    const closeModal = () => {
        setSelectedDispute(null);
    };

    return (
        <>
            <div className="w-full flex border-b-[0.5px] border-[#ededed] text-[#022B23] text-[14px] font-medium h-[49px] px-[20px] items-center">
                <p>Disputes support</p>
            </div>
            <div className="w-full flex border-b-[0.5px] border-[#ededed] text-[#1e1e1e] text-[14px] font-medium h-[49px] px-[20px] items-center">
                <p>View and help resolve dispute claims</p>
            </div>
            <div className="p-[20px]">
                <div className="flex w-full gap-[20px]  h-[86px] justify-between">
                    <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[34px] bg-[#000000]">
                            <p className="text-[#ffffff] text-[12px]">Total claim amount</p>
                        </div>
                        <div className="h-[52px] flex justify-center flex-col p-[14px]">
                            <p className="text-[20px] text-[#022B23] font-medium">N3,026,791.00</p>
                        </div>
                    </div>
                    <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[34px] bg-[#000000]">
                            <p className="text-white text-[12px]">Disputes recorded</p>
                        </div>
                        <div className="h-[52px] flex justify-center flex-col p-[14px]">
                            <p className="text-[20px] text-[#022B23] font-medium">26</p>
                        </div>
                    </div>
                    <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#022B23] border-[0.5px]">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[34px] bg-[#ECFDF6]">
                            <p className="text-[#022B23] text-[12px]">Resolved</p>
                        </div>
                        <div className="h-[52px] w-[239px] flex justify-center flex-col p-[14px]">
                            <p className="text-[20px] text-[#022B23] font-medium">26</p>
                        </div>
                    </div>
                    <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#FF5050] border-[0.5px]">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[34px] bg-[#FFDEDE]">
                            <p className="text-[#FF5050] text-[12px]">Rejected</p>
                        </div>
                        <div className="h-[52px] flex justify-center flex-col p-[14px]">
                            <p className="text-[20px] text-[#022B23] font-medium">6</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col mt-[50px] gap-[50px]">
                    <div className="flex flex-col rounded-[24px] border-[1px] border-[#EAECF0]">
                        <div className="w-full h-[91px] flex items-center justify-between px-[24px] pt-[20px] pb-[19px]">
                            <div className="flex flex-col gap-[4px]">
                                <div className="h-[28px] flex items-center">
                                    <p className="text-[18px] font-medium text-[#101828]">Disputes</p>
                                </div>
                                <div className="flex h-[20px] items-center">
                                    <p className="text-[14px] text-[#667085]">View all disputes here</p>
                                </div>
                            </div>
                            <div className="flex gap-2 items-center bg-[#FFFFFF] border-[0.5px] border-[#F2F2F2] text-black px-4 py-2 shadow-sm rounded-sm">
                                <Image src={searchImg} alt="Search Icon" width={20} height={20} className="h-[20px] w-[20px]" />
                                <input placeholder="Search" className="w-[175px] text-[#707070] text-[14px] focus:outline-none" />
                            </div>
                        </div>

                        <div className="w-full h-[44px] flex bg-[#F9FAFB] border-b-[0.5px] border-[#EAECF0]">
                            <div className="h-full w-[10%] flex justify-center items-center font-medium text-[#667085] text-[12px]">
                                <p>Dispute ID</p>
                            </div>
                            <div className="h-full w-[12%] gap-[4px] flex justify-center items-center font-medium text-[#667085] text-[12px]">
                                <p>Dispute type</p>
                                <Image src={arrowDown} alt={'image'} />
                            </div>
                            <div className="h-full w-[17%] gap-[4px] flex px-[24px] items-center font-medium text-[#667085] text-[12px]">
                                <p>User</p>
                                <Image src={arrowDown} alt={'image'} />
                            </div>

                            <div className="h-full w-[15%] gap-[4px] flex justify-center items-center font-medium text-[#667085] text-[12px]">
                                <p>Product</p>
                                <Image src={arrowDown} alt={'image'} />
                            </div>

                            <div className="h-full w-[15%] gap-[4px] flex px-[20px] items-center font-medium text-[#667085] text-[12px]">
                                <p>Amount (NGN)</p>
                                <Image src={arrowDown} alt={'image'} />
                            </div>

                            <div className="h-full w-[15%] gap-[4px] flex px-[20px] items-center font-medium text-[#667085] text-[12px]">
                                <p>Date and Time</p>
                                <Image src={arrowDown} alt={'image'} />
                            </div>
                            <div className="flex w-[15%] items-center px-[24px] font-medium text-[#667085] text-[12px]">
                                Status
                            </div>
                            <div className="w-[3%]"></div>
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
            </div>

            {selectedDispute && (
                <DisputeDetailsModal
                    dispute={selectedDispute}
                    onClose={closeModal}
                />
            )}
        </>
    );
}

export default Disputes;