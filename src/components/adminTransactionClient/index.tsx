import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import searchImg from "../../../public/assets/images/search-normal.png";
import arrowDown from "../../../public/assets/images/arrow-down.svg";

interface Transaction {
    id: number;
    transactionId: string;
    username: string;
    type: string;
    userType: string;
    amount: number;
    commission: number;
    date: string;
    time: string;
    status: "Successful" | "Failed";
}

const allTransactions:Transaction[] = [
    {id:1, transactionId: "1234", type: "Order payment", username: "Jude Tersoo", userType: "Buyer", amount: 123000, commission: 1200, date: "4th June, 2025", time: "09:22:01 AM" , status: "Failed"},
    {id:2, transactionId: "1234", type: "Refund", username: "Jude Tersoo", userType: "Vendor", amount: 123000, commission: 1200, date: "4th June, 2025", time: "09:22:01 AM" , status: "Successful"},
    {id:3, transactionId: "1234", type: "Order payment", username: "Jude Tersoo", userType: "Buyer", amount: 123000, commission: 1200, date: "4th June, 2025", time: "09:22:01 AM" , status: "Failed"},
    {id:4, transactionId: "1234", type: "Payout", username: "Jude Tersoo", userType: "Logistics", amount: 123000, commission: 1200, date: "4th June, 2025", time: "09:22:01 AM" , status: "Successful"},
    {id:5, transactionId: "1234", type: "Refund", username: "Jude Tersoo", userType: "Buyer", amount: 123000, commission: 1200, date: "4th June, 2025", time: "09:22:01 AM" , status: "Failed"},
    {id:6, transactionId: "1234", type: "Payout", username: "Jude Tersoo", userType: "Vendor", amount: 123000, commission: 1200, date: "4th June, 2025", time: "09:22:01 AM" , status: "Successful"},
    {id:7, transactionId: "1234", type: "Order payment", username: "Jude Tersoo", userType: "Buyer", amount: 123000, commission: 1200, date: "4th June, 2025", time: "09:22:01 AM" , status: "Failed"},
    {id:8, transactionId: "1234", type: "Payout", username: "Jude Tersoo", userType: "Buyer", amount: 123000, commission: 1200, date: "4th June, 2025", time: "09:22:01 AM" , status: "Successful"},
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
const TransactionTableRow = ({ transaction, isLast }: { transaction: Transaction; isLast: boolean }) => {
    return (
        <div className={`flex h-[72px] ${!isLast ? 'border-b border-[#EAECF0]' : ''}`}>
            <div className="flex items-center w-[10%] pl-[24px]">
                <p className="text-[#101828] text-[14px] font-medium">{transaction.transactionId}</p>
            </div>

            <div className="flex items-center pl-[15px] w-[12%] ">
                <p className="text-[#101828] text-[14px] font-medium">{transaction.type}</p>
            </div>

            <div className="flex flex-col justify-center w-[17%] px-[15px]">
                <p className="text-[#101828] text-[14px] font-medium">{transaction.username}</p>
                <p className="text-[#667085] text-[14px]">{transaction.userType}</p>
            </div>

            <div className="flex items-center w-[15%] pl-[24px]">
                <p className="text-[#101828] text-[14px]">{transaction.amount}</p>
            </div>

            <div className="flex items-center w-[15%] pl-[24px]">
                <p className="text-[#101828] text-[14px]">{transaction.commission}</p>
            </div>

            <div className="flex flex-col justify-center w-[15%] ">
                <p className="text-[#101828] text-[14px] font-medium">{transaction.date}</p>
                <p className="text-[#667085] text-[14px]">{transaction.time}</p>
            </div>

            <div className="flex items-center w-[10%] px-[10px]">
                <div className={`w-[55px] h-[22px] rounded-[8px] flex items-center justify-center ${
                    transaction.status === 'Successful'
                        ? 'bg-[#ECFDF3] text-[#027A48]'
                        : 'bg-[#FEF3F2] text-[#FF5050]'
                }`}>
                    <p className="text-[12px] font-medium">{transaction.status}</p>
                </div>
            </div>

            <div className="flex items-center justify-center w-[3%]">
                <ActionsDropdown transactionId={transaction.transactionId}>
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

const TransactionsTable = ({ transactions }: { transactions: Transaction[] }) => {
    return (
        <div className="w-full flex flex-col h-auto border-[#EAECF0] border rounded-[24px]">
            <div className="w-full h-[91px] flex items-center justify-between px-[24px] pt-[20px] pb-[19px]">
                <div className="flex flex-col gap-[4px]">
                    <div className="h-[28px] flex items-center">
                        <p className="text-[18px] font-medium text-[#101828]">Transactions ({transactions.length})</p>
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
                    <p>Commission (NGN)</p>
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
                {transactions.map((transaction, index) => (
                    <TransactionTableRow
                        key={transaction.id}
                        transaction={transaction}
                        isLast={index === transactions.length - 1}
                    />
                ))}
            </div>
        </div>
    );
};

const OverviewTab = () => {
    return (
        <>
            <div className="flex w-full gap-[20px] mt-[20px] h-[86px] justify-between">
                <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[34px] bg-[#000000]">
                        <p className="text-[#ffffff] text-[12px]">Total transactions</p>
                    </div>
                    <div className="h-[52px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">N3,026,791.00</p>
                    </div>
                </div>
                <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[34px] bg-[#000000]">
                        <p className="text-white text-[12px]">Pay-outs processed</p>
                    </div>
                    <div className="h-[52px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">N826,791.00</p>
                    </div>
                </div>
                <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[34px] bg-[#000000]">
                        <p className="text-white text-[12px]">Total refunds processed</p>
                    </div>
                    <div className="h-[52px] w-[239px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">N826,791.00</p>
                    </div>
                </div>
                <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#C6EB5F] border-[0.5px]">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[34px] bg-[#022B23]">
                        <p className="text-[#C6EB5F] text-[12px]">Commission earned</p>
                    </div>
                    <div className="h-[52px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">N6,826,791.00</p>
                    </div>
                </div>
            </div>
            <div className="mt-[50px]">
                <TransactionsTable transactions={allTransactions} />
            </div>
        </>
    );
};

const PayoutsTab = () => {
    const payouts = allTransactions.filter(transaction => transaction.type === "Payout");

    return (
        <>
            <div className="flex w-full gap-[20px] mt-[20px] h-[86px] ">
                <div className="flex flex-col w-[270px] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[34px] bg-[#000000]">
                        <p className="text-[#ffffff] text-[12px]">Total payouts</p>
                    </div>
                    <div className="h-[52px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">N3,026,791.00</p>
                    </div>
                </div>
                <div className="flex flex-col w-[270px] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[34px] bg-[#000000]">
                        <p className="text-white text-[12px]">Pending</p>
                    </div>
                    <div className="h-[52px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">N826,791.00</p>
                    </div>
                </div>
                <div className="flex flex-col w-[270px] rounded-[14px] h-full border-[#FF2121] border-[0.5px]">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[34px] bg-[#FFE8E8]">
                        <p className="text-[#FF2121] text-[12px]">Declined</p>
                    </div>
                    <div className="h-[52px] w-[239px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">N826,791.00</p>
                    </div>
                </div>

            </div>
            <div className="mt-[50px]">
                <TransactionsTable transactions={payouts} />
            </div>
        </>

    );
};

const RefundsTab = () => {
    const refunds = allTransactions.filter(transaction => transaction.type === "Refund");

    return (
        <>
            <div className="flex w-full gap-[20px] mt-[20px] h-[86px] ">
                <div className="flex flex-col w-[270px] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[34px] bg-[#000000]">
                        <p className="text-[#ffffff] text-[12px]">Total refunds</p>
                    </div>
                    <div className="h-[52px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">N3,026,791.00</p>
                    </div>
                </div>
                <div className="flex flex-col w-[270px] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[34px] bg-[#000000]">
                        <p className="text-white text-[12px]">Pending</p>
                    </div>
                    <div className="h-[52px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">N826,791.00</p>
                    </div>
                </div>
                <div className="flex flex-col w-[270px] rounded-[14px] h-full border-[#FF2121] border-[0.5px]">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[34px] bg-[#FFE8E8]">
                        <p className="text-[#FF2121] text-[12px]">Declined</p>
                    </div>
                    <div className="h-[52px] w-[239px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">N826,791.00</p>
                    </div>
                </div>

            </div>
            <div className="mt-[50px]">
                <TransactionsTable transactions={refunds} />
            </div>
        </>

    );
};

const AdminTransactionClient = () => {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') as 'overview' | 'pay-outs' | 'refunds' || 'overview';
    const [activeTab, setActiveTab] = useState<'overview' | 'pay-outs' | 'refunds'>(initialTab);
    const router = useRouter();

    const handleTabChange = (tab: 'overview' | 'pay-outs' | 'refunds') => {
        setActiveTab(tab);
        router.replace(`/admin/dashboard/transactions?tab=${tab}`, { scroll: false });
    };

    return (
        <>
            <div className="text-[#022B23] text-[14px] px-[20px] font-medium gap-[8px] flex items-center h-[49px] w-full border-b-[0.5px] border-[#ededed]">
                <p>Transactions</p>
            </div>
            <div className="flex flex-col">
                <div className="flex border-b border-[#ededed] mb-6 px-[20px]">
                    <div className="w-[403px] h-[52px] gap-[24px] flex items-end">
                        <p
                            className={`py-2 text-[#11151F] cursor-pointer text-[14px] ${activeTab === 'overview' ? 'font-medium  border-b-2 border-[#000000]' : 'text-[#707070]'}`}
                            onClick={() => handleTabChange('overview')}
                        >
                            Transactions overview
                        </p>
                        <p
                            className={`py-2 text-[#11151F] cursor-pointer text-[14px] ${activeTab === 'pay-outs' ? 'font-medium  border-b-2 border-[#000000]' : 'text-[#707070]'}`}
                            onClick={() => handleTabChange('pay-outs')}
                        >
                            Pay-outs (withdrawals)
                        </p>
                        <p
                            className={`py-2 text-[#11151F] cursor-pointer text-[14px] ${activeTab === 'refunds' ? 'font-medium border-b-2 border-[#000000]' : 'text-[#707070]'}`}
                            onClick={() => handleTabChange('refunds')}
                        >
                            Refunds
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-lg mx-[20px] mb-8">
                    {activeTab === 'overview' && <OverviewTab />}
                    {activeTab === 'pay-outs' && <PayoutsTab />}
                    {activeTab === 'refunds' && <RefundsTab />}
                </div>
            </div>
        </>
    );
};

export default AdminTransactionClient;