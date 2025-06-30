'use client'
import Image from "next/image";
import arrowBack from "../../../../../../../public/assets/images/arrow-right.svg";
import { useRouter } from "next/navigation";
import searchImg from "../../../../../../../public/assets/images/search-normal.png";
import arrowDown from "../../../../../../../public/assets/images/arrow-down.svg";
import {useEffect, useRef, useState} from "react";
import EditMarketLineModal from "@/components/editMarketLineModal";
import DeleteConfirmationModal from "@/components/deleteConfirmationModal";
import AddNewLineModal from "@/components/addNewLineModal"; // Import the new modal

interface Market {
    id: number;
    name: string;
    state: string;
    marketId: string;
    lines: number;
    status: "Inactive" | "Active";
    numberOfShops: number;
}

const markets: Market[] = [
    { id: 1, name: "Modern market", state: "Benue State", marketId: "21367", lines: 80, numberOfShops: 80,  status: "Inactive"},
    { id: 2, name: "Modern market", state: "Benue State", marketId: "21367", lines: 80, numberOfShops: 80,  status: "Active"},
    { id: 3, name: "Modern market", state: "Benue State", marketId: "21367", lines: 80, numberOfShops: 80,  status: "Active"},
    { id: 4, name: "Modern market", state: "Benue State", marketId: "21367", lines: 80, numberOfShops: 80,  status: "Inactive"}
];

const MarketActionsDropdown = ({ children, marketId }: { marketId: string; children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLDivElement>(null)

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsOpen(!isOpen)
    }
    const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleOpenMarketModal = () => {
        setIsOpen(false);
        setIsMarketModalOpen(true);
    };

    const handleCloseMarketModal = () => {
        setIsMarketModalOpen(false);
    };

    const handleMarketModalContinue = () => {
        setIsMarketModalOpen(false);
    };

    const handleOpenDeleteModal = () => {
        setIsOpen(false);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleDelete = () => {
        // Implement delete logic here
        console.log(`Deleting market line with ID: ${marketId}`);
        setIsDeleteModalOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])

    return (
        <>
            <div className="relative" ref={dropdownRef}>
                <div
                    ref={triggerRef}
                    onClick={handleToggle}
                    className="cursor-pointer flex flex-col gap-[3px] items-center justify-center"
                >
                    {children}
                </div>

                {isOpen && (
                    <div className="absolute right-0 top-full mt-1 h-[114px] bg-white rounded-[8px] shadow-lg z-50 border border-[#ededed] w-[134px]">
                        <ul className="">
                            <li onClick={handleOpenMarketModal} className="px-[8px] py-[4px] h-[38px] text-[12px] hover:bg-[#f9f9f9] text-[#1E1E1E] cursor-pointer">edit line</li>
                            <li className="px-[8px] py-[4px] h-[38px] text-[#8C8C8C] hover:border-b-[0.5px] hover:border-t-[0.5px] hover:border-[#F2F2F2] text-[12px]  cursor-pointer">Deactivate line</li>
                            <li
                                onClick={handleOpenDeleteModal}
                                className="px-[8px] rounded-bl-[8px] rounded-br-[8px] py-[4px] h-[38px] text-[12px] hover:bg-[#FFFAF9] hover:border-t-[0.5px] hover:border-[#F2F2F2] cursor-pointer text-[#FF5050]">
                                Delete
                            </li>
                        </ul>
                    </div>
                )}
            </div>
            <EditMarketLineModal
                isOpen={isMarketModalOpen}
                onClose={handleCloseMarketModal}
                onContinue={handleMarketModalContinue}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onDelete={handleDelete}
            />
        </>
    )
}

const MarketTableRow = ({ market, isLast }: { market: Market; isLast: boolean }) => {
    const router = useRouter();
    return (
        <>
            <div className={`flex h-[72px] ${!isLast ? 'border-b border-[#EAECF0]' : ''}`}>
                <div className="flex flex-col justify-center w-[50%] pl-[24px] ">
                    <p className="text-[#101828] text-[14px] font-medium">Lagos line</p>
                    <p className="text-[#667085] text-[14px]">Modern market</p>
                </div>

                <div className="flex items-center w-[17%]  px-[10px]">
                    <div className={`w-[55px] h-[22px] rounded-[8px] flex items-center justify-center ${
                        market.status === 'Active'
                            ? 'bg-[#ECFDF3] text-[#027A48]'
                            : 'bg-[#FEF3F2] text-[#FF5050]'
                    }`}>
                        <p className="text-[12px] font-medium">{market.status}</p>
                    </div>
                </div>

                <div className="flex flex-col justify-center w-[30%] pl-[24px] ">
                    <p className="text-[#101828] text-[14px]">{market.numberOfShops}</p>
                    <p onClick={()=>{router.push("/admin/dashboard/markets/view-shops")}} className="cursor-pointer underline text-[12px] font-medium text-[#667085]">View shop</p>
                </div>
                <div className="flex items-center justify-center w-[3%]">
                    <MarketActionsDropdown marketId={market.marketId}>
                        <div>
                            <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                            <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                            <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                        </div>
                    </MarketActionsDropdown>
                </div>
            </div>
        </>
    )
}

const ViewMarket = () => {
    const router = useRouter();
    const [isAddNewLineModalOpen, setIsAddNewLineModalOpen] = useState(false);

    const handleOpenAddNewLineModal = () => {
        setIsAddNewLineModalOpen(true);
    };

    const handleCloseAddNewLineModal = () => {
        setIsAddNewLineModalOpen(false);
    };

    const handleAddNewLineContinue = () => {
        setIsAddNewLineModalOpen(false);
        // Optionally refresh the market data here
    };

    return (
        <div className="w-full">
            {/* Header Navigation */}
            <div className="text-[#707070] text-[14px] px-5 font-medium gap-2 flex items-center h-[56px] w-full border-b border-[#ededed]">
                <Image src={arrowBack} alt="Back" width={24} height={24} className="cursor-pointer" onClick={() => router.push("/admin/dashboard/markets")} />
                <p className="cursor-pointer" onClick={() => router.push("/admin/dashboard/markets")}>Back to market management</p>
            </div>

            {/* Page Title */}
            <div className="text-[#022B23] text-[14px] px-5 font-medium flex items-center h-[49px] border-b border-[#ededed]">
                <p>View market</p>
            </div>

            {/* Market Header Info */}
            <div className="px-[20px] py-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col gap-[4px]">
                        <div className="flex gap-[8px] items-center">
                            <h2 className="text-[18px] font-semibold text-[#022B23]">Modern markets</h2>
                            <span className="text-[12px] font-medium w-[87px]  rounded-[8px] h-[25px] bg-[#F9FAFB] flex items-center justify-center text-[#667085]">ID: 0012345</span>
                        </div>
                        <p className="text-[14px] text-[#707070] font-medium">View and manage this market</p>
                    </div>
                    <span className="text-[#93C51D] border-[#93C51D] border bg-[#F9FDE8] w-[53px] h-[32px] flex justify-center items-center text-[12px] rounded-[6px]">Active</span>
                </div>

                {/* Summary Cards */}
                <div className="flex w-full  gap-[20px] mb-[20px] mt-[20px]  h-[110px] justify-between">
                    <div className="flex flex-col  w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px] ">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#F7F7F7]">
                            <p className="text-[#707070] text-[12px]">Lines</p>
                        </div>
                        <div className="h-[80px] flex justify-center flex-col p-[14px]">
                            <p className="text-[20px] text-[#022B23] font-medium">82</p>
                        </div>
                    </div>
                    <div className="flex flex-col  w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px] ">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#F7F7F7]">
                            <p className="text-[#707070] text-[12px]">Total shops</p>
                        </div>
                        <div className="h-[80px] flex justify-center flex-col p-[14px]">
                            <p className="text-[20px] text-[#022B23] font-medium">62</p>
                        </div>
                    </div>
                    <div className="flex flex-col  w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px] ">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#F7F7F7]">
                            <p className="text-[#707070] text-[12px]">Inactive shops</p>
                        </div>
                        <div className="h-[80px] flex justify-center flex-col p-[14px]">
                            <p className="text-[20px] text-[#022B23] font-medium">20</p>
                        </div>
                    </div>
                    <div className="flex flex-col  w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px] ">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#000000]">
                            <p className="text-white text-[12px]">Transactions</p>
                        </div>
                        <div className="h-[80px] flex justify-center flex-col p-[14px]">
                            <p className="text-[20px] text-[#022B23] font-medium">82</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex  gap-[6px] h-[48px] ">
                    <div
                        onClick={handleOpenAddNewLineModal}
                        className="bg-[#022B23] flex items-center h-full justify-center w-[189px] text-[#C6EB5F] text-[14px] font-semibold  rounded-[12px] cursor-pointer hover:bg-[#033a30] transition-colors"
                    >
                        Add new line
                    </div>
                    <div className="border flex items-center h-full justify-center w-[112px] text-[14px] font-medium border-[#022B23] text-[#022B23] px-4 py-2 rounded-[12px]">Update</div>
                    <div className="border flex items-center h-full justify-center w-[112px] text-[14px] font-medium border-[#FF5050] text-[#FF5050] px-4 py-2 rounded-[12px]">Deactivate</div>
                </div>

                {/* Line and Shop Management */}
                <div className="mt-[50px]">
                    <div className="w-full flex flex-col  h-[453px] border-[#EAECF0] border rounded-[24px] ">
                        <div className="w-full h-[91px] flex items-center justify-between px-[24px] pt-[20px] pb-[19px]">
                            <div className="flex flex-col gap-[4px] ">
                                <div className="h-[28px] flex items-center ">
                                    <p className="text-[18px] font-medium text-[#101828]">Line and shop management</p>
                                </div>
                                <div className="flex h-[20px]  items-center">
                                    <p className="text-[14px] text-[#667085]">View and manage modern markets </p>
                                </div>

                            </div>
                            <div className="flex gap-2 items-center bg-[#FFFFFF] border-[0.5px] border-[#F2F2F2] text-black px-4 py-2 shadow-sm rounded-sm">
                                <Image src={searchImg} alt="Search Icon" width={20} height={20} className="h-[20px] w-[20px]"/>
                                <input placeholder="Search" className="w-[175px] text-[#707070] text-[14px] focus:outline-none"/>
                            </div>
                        </div>

                        <div className="w-full h-[44px] flex bg-[#F9FAFB] border-b-[0.5px] border-[#EAECF0]">
                            <div className="h-full w-[50%] gap-[4px] flex px-[24px] items-center font-medium text-[#667085] text-[12px]">
                                <p>Line</p>
                                <Image src={arrowDown} alt={'image'}/>
                            </div>
                            <div className="flex w-[17%] items-center px-[24px] font-medium text-[#667085] text-[12px]">
                                Status
                            </div>
                            <div className="flex w-[30%] items-center px-[24px] font-medium text-[#667085] text-[12px]">
                                Shops
                            </div>
                            <div className="w-[3%]">

                            </div>
                        </div>
                        <div className="flex flex-col">
                            {markets.map((market, index) => (
                                <MarketTableRow
                                    key={market.id}
                                    market={market}
                                    isLast={index === markets.length - 1}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add New Line Modal */}
            <AddNewLineModal
                isOpen={isAddNewLineModalOpen}
                onClose={handleCloseAddNewLineModal}
                onContinue={handleAddNewLineContinue}
            />
        </div>
    )
}

export default ViewMarket;