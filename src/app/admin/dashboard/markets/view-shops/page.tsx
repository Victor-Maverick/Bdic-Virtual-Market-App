'use client'
import Image from "next/image";
import arrowBack from "../../../../../../public/assets/images/arrow-right.svg";
import {useRouter} from "next/navigation";
import searchImg from "../../../../../../public/assets/images/search-normal.png";
import arrowDown from "../../../../../../public/assets/images/arrow-down.svg";
import {useEffect, useRef, useState} from "react";
import DeleteConfirmationModal from "@/components/deleteConfirmationModal";

interface Market {
    id: number;
    name: string;
    shopName: string;
    shopLine: string;
    vendor: string;
    state: string;
    shopId: string;
    lines: number;
    status: "Inactive" | "Active";
    numberOfShops: number;
}

const markets: Market[] = [
    { id: 1, name: "Modern market", shopName: "Abba technologies", shopLine: 'Shop 2C', vendor: "Jude Tersoo", state: "Benue State", shopId: "21367", lines: 80, numberOfShops: 80,  status: "Inactive"},
    { id: 2, name: "Modern market", shopName: "Abba technologies", shopLine: 'Shop 2C', vendor: "Jude Tersoo", state: "Benue State", shopId: "21367", lines: 80, numberOfShops: 80,  status: "Active"},
    { id: 3, name: "Modern market", shopName: "Abba technologies", shopLine: 'Shop 2C', vendor: "Jude Tersoo", state: "Benue State", shopId: "21367", lines: 80, numberOfShops: 80,  status: "Active"},
    { id: 4, name: "Modern market", shopName: "Abba technologies", shopLine: 'Shop 2C', vendor: "Jude Tersoo", state: "Benue State", shopId: "21367", lines: 80, numberOfShops: 80,  status: "Inactive"},
    { id: 5, name: "Modern market", shopName: "Abba technologies", shopLine: 'Shop 2C', vendor: "Jude Tersoo", state: "Benue State", shopId: "21367", lines: 80, numberOfShops: 80,  status: "Active"},
    { id: 6, name: "Modern market", shopName: "Abba technologies", shopLine: 'Shop 2C', vendor: "Jude Tersoo", state: "Benue State", shopId: "21367", lines: 80, numberOfShops: 80,  status: "Active"}
];

const MarketActionsDropdown = ({ children, marketId }: { marketId: string; children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLDivElement>(null)

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsOpen(!isOpen)
    }
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);




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
                            <li onClick={()=>{router.push("/admin/dashboard/markets/view-shop")}} className="px-[8px] py-[4px] h-[38px] text-[12px] hover:bg-[#f9f9f9] text-[#1E1E1E] cursor-pointer">view and edit shop</li>
                            <li className="px-[8px] py-[4px] h-[38px] text-[#8C8C8C] hover:border-b-[0.5px] hover:border-t-[0.5px] hover:border-[#F2F2F2] text-[12px]  cursor-pointer">Deactivate shop</li>
                            <li
                                onClick={handleOpenDeleteModal}
                                className="px-[8px] rounded-bl-[8px] rounded-br-[8px] py-[4px] h-[38px] text-[12px] hover:bg-[#FFFAF9] hover:border-t-[0.5px] hover:border-[#F2F2F2] cursor-pointer text-[#FF5050]">
                                Delete
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onDelete={handleDelete}
            />
        </>
    )
}

const MarketTableRow = ({ market, isLast }: { market: Market; isLast: boolean }) => {
    return (
        <>
            <div className={`flex h-[72px] ${!isLast ? 'border-b border-[#EAECF0]' : ''}`}>
                <div className="flex flex-col justify-center w-[45%] pl-[24px] ">
                    <p className="text-[#101828] text-[14px] font-medium">{market.shopName}</p>
                    <p className="text-[#667085] text-[14px]">{market.shopLine}</p>
                </div>

                <div className="flex  items-center w-[15%] pl-[24px] ">
                    <p className="text-[#101828] text-[14px]">{market.shopId}</p>
                </div>

                <div className="flex items-center w-[13%]  px-[10px]">
                    <div className={`w-[55px] h-[22px] rounded-[8px] flex items-center justify-center ${
                        market.status === 'Active'
                            ? 'bg-[#ECFDF3] text-[#027A48]'
                            : 'bg-[#FEF3F2] text-[#FF5050]'
                    }`}>
                        <p className="text-[12px] font-medium">{market.status}</p>
                    </div>
                </div>

                <div className="flex items-center w-[24%] pl-[24px] ">
                    <p className="text-[#101828] text-[14px]">{market.vendor}</p>
                </div>
                <div className="flex items-center justify-center w-[3%]">
                    <MarketActionsDropdown marketId={market.shopId}>
                        <div className="flex flex-col gap-1">
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

const ViewShops = ()=>{
    const router = useRouter();

    return (
        <>
            <div className="text-[#707070] text-[14px] px-[20px] font-medium gap-[8px] flex items-center h-[56px] w-full border-b-[0.5px] border-[#ededed]">
                <Image src={arrowBack} alt={'image'} width={24} height={24} className="cursor-pointer" onClick={()=>{router.push("/admin/dashboard/markets/view-market")}}/>
                <p className="cursor-pointer" onClick={()=>{router.push("/admin/dashboard/markets/view-market")}}>Back to modern market</p>
            </div>
            <div className="text-[#022B23] text-[14px] px-[20px] font-medium gap-[8px] flex items-center h-[49px] w-full border-b-[0.5px] border-[#ededed]">
                <p>Modern market shops</p>
            </div>
            <div className="px-[20px]">
                <div className="flex w-full mb-[20px] mt-[20px]  h-[110px] justify-between">
                    <div className="flex gap-[20px]">
                        <div className="flex flex-col  w-[278px] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px] ">
                            <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#F7F7F7]">
                                <p className="text-[#707070] text-[12px]">Total shops</p>
                            </div>
                            <div className="h-[80px] flex justify-center flex-col p-[14px]">
                                <p className="text-[20px] text-[#022B23] font-medium">82</p>
                            </div>
                        </div>
                        <div className="flex flex-col  w-[278px] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px] ">
                            <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#F7F7F7]">
                                <p className="text-[#707070] text-[12px]">Active</p>
                            </div>
                            <div className="h-[80px] flex justify-center flex-col p-[14px]">
                                <p className="text-[20px] text-[#022B23] font-medium">62</p>
                            </div>
                        </div>
                        <div className="flex flex-col  w-[278px] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px] ">
                            <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#F7F7F7]">
                                <p className="text-[#707070] text-[12px]">Inactive</p>
                            </div>
                            <div className="h-[80px] flex justify-center flex-col p-[14px]">
                                <p className="text-[20px] text-[#022B23] font-medium">20</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-[53px] cursor-pointer h-[32px] text-[12px] font-medium text-[#93C51D] rounded-[6px] flex justify-center items-center bg-[#F9FDE8] border border-[#93C51D]">
                        Active
                    </div>

                </div>

                {/* Line and Shop Management */}
                <div className="mt-[50px]">
                    <div className="w-full flex flex-col  h-auto border-[#EAECF0] border rounded-[24px] ">
                        <div className="w-full h-[91px] flex items-center justify-between px-[24px] pt-[20px] pb-[19px]">
                            <div className="flex flex-col gap-[4px] ">
                                <div className="h-[28px] flex items-center ">
                                    <p className="text-[18px] font-medium text-[#101828]">Shops</p>
                                </div>
                                <div className="flex h-[20px]  items-center">
                                    <p className="text-[14px] text-[#667085]">View and manage shops here</p>
                                </div>

                            </div>
                            <div className="flex gap-2 items-center bg-[#FFFFFF] border-[0.5px] border-[#F2F2F2] text-black px-4 py-2 shadow-sm rounded-sm">
                                <Image src={searchImg} alt="Search Icon" width={20} height={20} className="h-[20px] w-[20px]"/>
                                <input placeholder="Search" className="w-[175px] text-[#707070] text-[14px] focus:outline-none"/>
                            </div>
                        </div>

                        <div className="w-full h-[44px] flex bg-[#F9FAFB] border-b-[0.5px] border-[#EAECF0]">
                            <div className="h-full w-[45%] gap-[4px] flex px-[24px] items-center font-medium text-[#667085] text-[12px]">
                                <p>Shop</p>
                                <Image src={arrowDown} alt={'image'}/>
                            </div>
                            <div className="flex w-[15%] items-center px-[24px] font-medium text-[#667085] text-[12px]">
                                Shop ID
                            </div>
                            <div className="flex w-[13%] items-center px-[24px] font-medium text-[#667085] text-[12px]">
                                Status
                            </div>
                            <div className="flex w-[24%] items-center px-[24px] font-medium text-[#667085] text-[12px]">
                                Vendor
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
        </>
    )
}

export default ViewShops;