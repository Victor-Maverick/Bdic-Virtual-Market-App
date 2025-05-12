'use client'
import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import searchImg from "../../../../../public/assets/images/search-normal.png";
import arrowDown from "../../../../../public/assets/images/arrow-down.svg";
import TierEditModal from "@/components/tierEditModal";

interface Promotion{
    id: number;
    transactionId: string;
    type: string;
    username: string;
    userType: string;
    amount: number;
    tier: string;
    date: string;
    time: string;
    status: "Successful" | "Failed";
}

const promotions: Promotion[] = [
    {id:1, transactionId: "12345", type: "subscription", username: "Jude Tersoo", userType: "Vendor", amount: 32000, tier: "Tier 1", date: "4th Apr. 2025", time: "09:22:01 AM", status: "Failed"},
    {id:2, transactionId: "12345", type: "subscription", username: "Jude Tersoo", userType: "Vendor", amount: 32000, tier: "Tier 3", date: "4th Apr. 2025", time: "09:22:01 AM", status: "Successful"},
    {id:3, transactionId: "12345", type: "subscription", username: "Jude Tersoo", userType: "Vendor", amount: 32000, tier: "Tier 2", date: "4th Apr. 2025", time: "09:22:01 AM", status: "Successful"},
    {id:4, transactionId: "12345", type: "subscription", username: "Jude Tersoo", userType: "Vendor", amount: 32000, tier: "Tier 2", date: "4th Apr. 2025", time: "09:22:01 AM", status: "Failed"},
    {id:5, transactionId: "12345", type: "subscription", username: "Jude Tersoo", userType: "Vendor", amount: 32000, tier: "Tier 1", date: "4th Apr. 2025", time: "09:22:01 AM", status: "Successful"},
    {id:6, transactionId: "12345", type: "subscription", username: "Jude Tersoo", userType: "Vendor", amount: 32000, tier: "Tier 1", date: "4th Apr. 2025", time: "09:22:01 AM", status: "Successful"},
    {id:7, transactionId: "12345", type: "subscription", username: "Jude Tersoo", userType: "Vendor", amount: 32000, tier: "Tier 1", date: "4th Apr. 2025", time: "09:22:01 AM", status: "Failed"},
    {id:8, transactionId: "12345", type: "subscription", username: "Jude Tersoo", userType: "Vendor", amount: 32000, tier: "Tier 1", date: "4th Apr. 2025", time: "09:22:01 AM", status: "Successful"},
];

const TransactionDetailsModal = ({
                                     transactionId,
                                     onClose,
                                 }: {
    transactionId: string;
    onClose: () => void;
}) => {
    // Ideally you'd fetch transaction details with useEffect here

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#808080]/20">
            <div className="bg-white px-[60px] py-[50px] w-[597px] h-[620px] shadow-lg relative">

                <div className="w-full flex justify-between h-[60px] border-b-[0.5px] border-[#D9D9D9]">
                    <div className={`flex flex-col`}>
                        <p className={`text-[#022B23] text-[16px] font-medium`}>View details</p>
                        <p className="text-[#707070] text-[14px] font-medium">View details of transaction</p>
                    </div>
                    <span className="w-[77px] text-[12px] text-[#DD6A02] font-medium flex justify-center items-center h-[32px] rounded-[8px] bg-[#fffaeb] border border-[#DD6A02]">
                        Pending
                    </span>
                </div>

                <div className="w-full flex flex-col h-[430px] pt-[20px] pb-[2px]  gap-[30px]">
                    <div className="flex flex-col h-[79px] gap-[6px]">
                        <p className="text-[16px] font-semibold text-[#022B23]">ID: <span>{transactionId}</span></p>
                        <p className="text-[14px] font-medium text-[#707070]">User: <span className="text-[#000000] underline">Abba technologies</span></p>
                        <p className="text-[14px] font-medium text-[#707070]">Type: <span className="text-[#000000] underline">Vendor</span></p>
                    </div>
                    <div className="flex flex-col w-full pr-[30px]">
                        <p className="text-[14px] text-[#022B23] font-medium">Request details</p>
                        <div className="flex flex-col w-full">
                            <div className="flex justify-between items-center">
                                <p className="text-[14px] text-[#707070] font-medium">Request amount</p>
                                <p className="text-[14px] text-[#1E1E1E] font-medium">N 123,000.00</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-[14px] text-[#707070] font-medium">Fee</p>
                                <p className="text-[14px] text-[#1E1E1E] font-medium">N 1,000.00</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-[14px] text-[#707070] font-medium">Date</p>
                                <p className="text-[14px] text-[#1E1E1E] font-medium">4th Apr. 2025</p>
                            </div>
                            <div className="flex text-start justify-between items-center">
                                <p className="text-[14px] text-[#707070] font-medium">Time</p>
                                <p className="text-[14px] text-[#1E1E1E] font-medium">02:33:09 PM</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-[97%] px-[22px] flex flex-col gap-[9px] py-[14px] h-[130px] rounded-[24px] border-[1px]  border-[#ededed] ">
                        <p className="text-[16px] text-[#000000] font-medium">Bank details</p>
                        <div className="flex flex-col gap-[5px]">
                            <p className="text-[14px] text-[#707070]">BANK NAME: ACCESS BANK</p>
                            <p className="text-[14px] text-[#707070]">ACCOUNT NUMBER: 00112233445</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-3 h-[46px] gap-[6px]">
                    <button onClick={onClose} className=" justify-center text-[16px] font-medium flex items-center text-[#FF5050] w-[87px] border border-[#FF5050] rounded-[12px] ">
                        Decline
                    </button>
                    <button className="flex w-[159px] text-[16px] font-medium items-center justify-center border border-[#022B23] text-[#022B23] rounded-[12px] ">
                        Approve pay-out
                    </button>
                </div>
            </div>
        </div>
    );
};


const ActionsDropdown = ({
                             children,
                             transactionId,
                         }: {
    children: React.ReactNode;
    transactionId: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleViewDetails = () => {
        setShowModal(true);
        setIsOpen(false);
    };

    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                onClick={handleToggle}
                className="cursor-pointer flex flex-col gap-[3px] items-center justify-center"
            >
                {children}
            </div>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 h-[38px] bg-white rounded-[8px] shadow-lg z-50 border flex items-center justify-center border-[#ededed] w-[175px]">
                    <ul>
                        <li
                            onClick={handleViewDetails}
                            className="px-[8px] py-[4px] h-[38px] text-[12px] hover:bg-[#f9f9f9] text-[#1E1E1E] cursor-pointer flex items-center"
                        >
                            View transaction details
                        </li>
                    </ul>
                </div>
            )}

            {showModal && (
                <TransactionDetailsModal
                    transactionId={transactionId}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};
const AdsTableRow = ({ promotion, isLast }: { promotion: Promotion; isLast: boolean }) => {
    return (
        <div className={`flex h-[72px] ${!isLast ? 'border-b border-[#EAECF0]' : ''}`}>
            <div className="flex items-center w-[10%] pl-[24px]">
                <p className="text-[#101828] text-[14px] font-medium">{promotion.transactionId}</p>
            </div>

            <div className="flex items-center pl-[15px] w-[12%] ">
                <p className="text-[#101828] text-[14px] font-medium">{promotion.type}</p>
            </div>

            <div className="flex flex-col justify-center w-[17%] px-[15px]">
                <p className="text-[#101828] text-[14px] font-medium">{promotion.username}</p>
                <p className="text-[#667085] text-[14px]">{promotion.userType}</p>
            </div>

            <div className="flex items-center w-[15%] pl-[24px]">
                <p className="text-[#101828] text-[14px]">{promotion.amount}</p>
            </div>

            <div className="flex items-center w-[15%] pl-[24px]">
                <p className="text-[#101828] text-[14px]">{promotion.tier}</p>
            </div>

            <div className="flex flex-col justify-center w-[15%] ">
                <p className="text-[#101828] text-[14px] font-medium">{promotion.date}</p>
                <p className="text-[#667085] text-[14px]">{promotion.time}</p>
            </div>

            <div className="flex items-center w-[15%] px-[10px]">
                <div className={`w-[55px] h-[22px] rounded-[8px] flex items-center justify-center ${
                    promotion.status === 'Successful'
                        ? 'bg-[#ECFDF3] text-[#027A48]'
                        : 'bg-[#FEF3F2] text-[#FF5050]'
                }`}>
                    <p className="text-[12px] font-medium">{promotion.status}</p>
                </div>
            </div>

            <div className="flex items-center justify-center w-[3%]">
                <ActionsDropdown transactionId={promotion.transactionId}>
                    <div className="flex flex-col gap-1">
                        <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                        <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                        <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                    </div>
                </ActionsDropdown>
            </div>
        </div>
    );
};


const Ads = ()=>{
    const [selectedTier, setSelectedTier] = useState<{
        id: number;
        name: string;
        color: string;
        amount: string;
    } | null>(null);

    const tiers = [
        { id: 1, name: 'Tier 1', color: '#EBFF70', amount: '826,791.00' },
        { id: 2, name: 'Tier 2', color: '#AA63ED', amount: '826,791.00' },
        { id: 3, name: 'Tier 3', color: '#A1FFCC', amount: '826,791.00' }
    ];

    return(
        <>
            <div className="w-full flex border-b-[0.5px] border-[#ededed] text-[#022B23] text-[14px] font-medium h-[49px] px-[20px] items-center">
                <p>Ads and promotion</p>
            </div>
            <div className="w-full flex border-b-[0.5px] border-[#ededed] text-[#1e1e1e] text-[14px] font-medium h-[49px] px-[20px] items-center">
                <p>View all ads and promotions</p>
            </div>
            <div className="p-[20px] ">
                <div className="flex w-full gap-[20px]  h-[86px] justify-between">
                    <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[34px] bg-[#000000]">
                            <p className="text-[#ffffff] text-[12px]">Total promotions earnings</p>
                        </div>
                        <div className="h-[52px] flex justify-center flex-col p-[14px]">
                            <p className="text-[20px] text-[#022B23] font-medium">N3,026,791.00</p>
                        </div>
                    </div>
                    <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[34px] bg-[#000000]">
                            <p className="text-white text-[12px]">Tier 1</p>
                        </div>
                        <div className="h-[52px] flex justify-center flex-col p-[14px]">
                            <p className="text-[20px] text-[#022B23] font-medium">N826,791.00</p>
                        </div>
                    </div>
                    <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[34px] bg-[#000000]">
                            <p className="text-white text-[12px]">Tier 2</p>
                        </div>
                        <div className="h-[52px] w-[239px] flex justify-center flex-col p-[14px]">
                            <p className="text-[20px] text-[#022B23] font-medium">N826,791.00</p>
                        </div>
                    </div>
                    <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[34px] bg-[#000000]">
                            <p className="text-white text-[12px]">Tier 3</p>
                        </div>
                        <div className="h-[52px] flex justify-center flex-col p-[14px]">
                            <p className="text-[20px] text-[#022B23] font-medium">N6,826,791.00</p>
                        </div>
                    </div>
                </div>
                <div className="mt-[30px] flex flex-col gap-[4px]">
                    <p className="text-[16px] text-[#1E1E1E] font-medium">Tiers</p>
                    <p className="text-[14px] text-[#707070]">View and edit tier pricing</p>
                </div>
                <div className="flex w-full gap-[20px] mt-[10px] h-[86px]">
                    {tiers.map((tier) => (
                        <div
                            key={tier.id}
                            className="flex flex-col w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]"
                        >
                            <div
                                className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[34px]"
                                style={{ backgroundColor: tier.color }}
                            >
                                <p className="text-[#022B23] text-[12px] font-medium">{tier.name}</p>
                            </div>
                            <div className="h-[52px] flex items-center justify-between p-[14px]">
                                <p className="text-[20px] text-[#022B23] font-medium">N{tier.amount}</p>
                                <p
                                    className="underline text-[12px] text-[#022B23] font-medium cursor-pointer"
                                    onClick={() => setSelectedTier({
                                        id: tier.id,
                                        name: tier.name,
                                        color: tier.color,
                                        amount: tier.amount
                                    })}
                                >
                                    Edit tier
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedTier && (
                    <TierEditModal
                        tier={selectedTier}
                        onClose={() => setSelectedTier(null)}
                    />
                )}

                <div className="w-full flex mt-[50px] flex-col h-auto border-[#EAECF0] border rounded-[24px]">
                    <div className="w-full h-[91px] flex items-center justify-between px-[24px] pt-[20px] pb-[19px]">
                        <div className="flex flex-col gap-[4px]">
                            <div className="h-[28px] flex items-center">
                                <p className="text-[18px] font-medium text-[#101828]">Transactions ({promotions.length})</p>
                            </div>
                            <div className="flex h-[20px] items-center">
                                <p className="text-[14px] text-[#667085]">View and manage all transactions here</p>
                            </div>
                        </div>
                        <div className="flex gap-2 items-center bg-[#FFFFFF] border-[0.5px] border-[#F2F2F2] text-black px-4 py-2 shadow-sm rounded-sm">
                            <Image src={searchImg} alt="Search Icon" width={20} height={20} className="h-[20px] w-[20px]" />
                            <input placeholder="Search" className="w-[175px] text-[#707070] text-[14px] focus:outline-none" />
                        </div>
                    </div>

                    <div className="w-full h-[44px] flex bg-[#F9FAFB] border-b-[0.5px] border-[#EAECF0]">
                        <div className="h-full w-[10%] flex justify-center items-center font-medium text-[#667085] text-[12px]">
                            <p>Transaction ID</p>
                        </div>
                        <div className="h-full w-[12%] gap-[4px] flex justify-center items-center font-medium text-[#667085] text-[12px]">
                            <p>Transaction type</p>
                            <Image src={arrowDown} alt={'image'} />
                        </div>
                        <div className="h-full w-[17%] gap-[4px] flex px-[24px] items-center font-medium text-[#667085] text-[12px]">
                            <p>User</p>
                            <Image src={arrowDown} alt={'image'} />
                        </div>

                        <div className="h-full w-[15%] gap-[4px] flex px-[20px] items-center font-medium text-[#667085] text-[12px]">
                            <p>Amount (NGN)</p>
                            <Image src={arrowDown} alt={'image'} />
                        </div>
                        <div className="h-full w-[15%] gap-[4px] flex justify-center items-center font-medium text-[#667085] text-[12px]">
                            <p>Tier subscriptions</p>
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
                        {promotions.map((promotion, index) => (
                            <AdsTableRow
                                key={promotion.id}
                                promotion={promotion}
                                isLast={index === promotions.length - 1}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Ads;