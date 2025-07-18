'use client'
import Image from "next/image";
import arrowBack from "../../../../../../../public/assets/images/arrow-right.svg";
import { useRouter } from "next/navigation";
import searchImg from "../../../../../../../public/assets/images/search-normal.png";
import arrowDown from "../../../../../../../public/assets/images/arrow-down.svg";
import {use, useEffect, useRef, useState} from "react";
import EditMarketLineModal from "@/components/editMarketLineModal";
import DeleteConfirmationModal from "@/components/deleteConfirmationModal";
import AddNewLineModal from "@/components/addNewLineModal";
import axios from "axios";
interface Market {
    id: number;
    name: string;
    address: string;
    city: string;
    lines: number;
    status: "INACTIVE" | "ACTIVE";
    shops: Shop[];
    marketId: string;
    createdAt: string;
}
interface PageParams {
    id: number;
}

interface Shop {
    id: number;
    name: string;
    address: string;
    phone: string;
    shopNumber: string;
    homeAddress: string;
    streetName: string;
    cacNumber: string;
    taxIdNumber: string;
    nin: string;
    bankName: string;
    accountNumber: string;
    marketId: number;
    marketSectionId: string;
    email: string;
}

interface MarketSection {
    id: number;
    marketId: number;
    name: string;
    shops: number;
    createdAt: string;
    updatedAt: string;
}

const MarketSectionTableRow = ({ section, isLast }: { section: MarketSection; isLast: boolean }) => {

    return (
        <div className={`flex h-[72px] ${!isLast ? 'border-b border-[#EAECF0] ' : 'border-b border-[#EAECF0]'}`}>
            <div className="flex flex-col justify-center w-[50%] pl-[24px]">
                <p className="text-[#101828] text-[14px] font-medium">{section.name}</p>
                <p className="text-[#667085] text-[14px]">ID: {section.id}</p>
            </div>

            <div className="flex items-center w-[17%] px-[10px]">
                <div className="w-[55px] h-[22px] rounded-[8px] flex items-center justify-center bg-[#ECFDF3] text-[#027A48]">
                    <p className="text-[12px] font-medium">ACTIVE</p>
                </div>
            </div>

            <div className="flex flex-col justify-center w-[30%] pl-[24px]">
                <p className="text-[#101828] text-[14px]">{section.shops}</p>
            </div>

            <div className="flex items-center justify-center w-[3%]">
                <MarketActionsDropdown section={section.name} marketId={section.id}>
                    <div>
                        <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                        <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                        <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                    </div>
                </MarketActionsDropdown>
            </div>
        </div>
    );
};

const MarketActionsDropdown = ({ children, section, marketId }: {section: string, marketId: number; children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentSectionName, setCurrentSectionName] = useState(section);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleOpenMarketModal = () => {
        setIsOpen(false);
        setIsMarketModalOpen(true);
    };

    const handleCloseMarketModal = () => {
        setIsMarketModalOpen(false);
    };

    const handleMarketModalContinue = async (newName: string) => {
        try {
            const response = await axios.put(
                `https://digitalmarket.benuestate.gov.ng/api/market-sections/update/${marketId}`,
                { name: newName }
            );

            if (response.status === 200) {
                setCurrentSectionName(newName);
                // You might want to refresh the sections list here or update the parent state
            }
        } catch (error) {
            console.error("Error updating section:", error);
            // Handle error (show toast, etc.)
        }
        setIsMarketModalOpen(false);
    };

    const handleOpenDeleteModal = () => {
        setIsOpen(false);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/market-sections/delete/${marketId}`
            );

            if (response.status === 204) {
                // Section deleted successfully
                // You might want to refresh the sections list here or update the parent state
            }
        } catch (error) {
            console.error("Error deleting section:", error);
            // Handle error (show toast, etc.)
        }
        setIsDeleteModalOpen(false);
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
                            <li
                                onClick={handleOpenMarketModal}
                                className="px-[8px] py-[4px] h-[38px] text-[12px] hover:bg-[#f9f9f9] text-[#1E1E1E] cursor-pointer"
                            >
                                edit line
                            </li>
                            <li className="px-[8px] py-[4px] h-[38px] text-[#8C8C8C] hover:border-b-[0.5px] hover:border-t-[0.5px] hover:border-[#F2F2F2] text-[12px] cursor-pointer">
                                Deactivate line
                            </li>
                            <li
                                onClick={handleOpenDeleteModal}
                                className="px-[8px] rounded-bl-[8px] rounded-br-[8px] py-[4px] h-[38px] text-[12px] hover:bg-[#FFFAF9] hover:border-t-[0.5px] hover:border-[#F2F2F2] cursor-pointer text-[#FF5050]"
                            >
                                Delete
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            <EditMarketLineModal
                id={marketId}
                name={currentSectionName}
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
    );
};

const ViewMarket = ({ params }: { params: Promise<PageParams> }) => {
    const router = useRouter();
    const [isAddNewLineModalOpen, setIsAddNewLineModalOpen] = useState(false);
    const [market, setMarket] = useState<Market | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [marketSections, setMarketSections] = useState<MarketSection[]>([]);
    const { id } = use<PageParams>(params);
    const [currentSectionPage, setCurrentSectionPage] = useState(1);
    const SECTIONS_PER_PAGE = 5;
    const totalSectionPages = Math.ceil(marketSections.length / SECTIONS_PER_PAGE);
    const currentSections = marketSections.slice(
        (currentSectionPage - 1) * SECTIONS_PER_PAGE,
        currentSectionPage * SECTIONS_PER_PAGE
    );

    const handleSectionPrevPage = () => {
        if (currentSectionPage > 1) {
            setCurrentSectionPage(currentSectionPage - 1);
        }
    };

    const handleSectionNextPage = () => {
        if (currentSectionPage < totalSectionPages) {
            setCurrentSectionPage(currentSectionPage + 1);
        }
    };

    const handleSectionPageChange = (page: number) => {
        setCurrentSectionPage(page);
    };

    useEffect(() => {
        const fetchMarketData = async () => {
            try {
                setLoading(true);
                // Fetch market details
                const marketResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/markets/${id}`);
                setMarket(marketResponse.data);
                // Fetch market sections
                const sectionsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/market-sections/allByMarket?marketId=${id}`);
                setMarketSections(sectionsResponse.data);
                console.log("Sections:: ", sectionsResponse.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch market data");
                setLoading(false);
                console.error("Error fetching market data:", err);
            }
        };

        fetchMarketData();
    }, [id]);

    const handleOpenAddNewLineModal = () => {
        setIsAddNewLineModalOpen(true);
    };

    const handleCloseAddNewLineModal = () => {
        setIsAddNewLineModalOpen(false);
    };

    const handleAddNewLineContinue = () => {
        setIsAddNewLineModalOpen(false)
    };

    if (loading) return <div className="h-screen flex items-center justify-center">Loading market data...</div>;
    if (error) return <div className="h-screen flex items-center justify-center text-red-500">{error}</div>;
    if (!market) return <div className="h-screen flex items-center justify-center">Market not found</div>;

    // Calculate stats
    const totalShops = market.shops.length;
    // const inactiveShops = market.shops.filter(shop => /* condition for inactive shops */ false).length;
    // const activeShops = totalShops - inactiveShops;

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
                            <h2 className="text-[18px] font-semibold text-[#022B23]">{market.name}</h2>
                            <span className="text-[12px] font-medium w-[50px] rounded-[8px] h-[25px] bg-[#F9FAFB] flex items-center justify-center text-[#667085]">ID: #{market.id}</span>
                        </div>
                        <p className="text-[14px] text-[#707070] font-medium">{market.address}, {market.city}</p>
                    </div>
                    <span className={`${market.status === 'ACTIVE' ? 'text-[#93C51D] border-[#93C51D] bg-[#F9FDE8]' : 'text-[#FF5050] border-[#FF5050] bg-[#FFFAF9]'} border w-[53px] h-[32px] flex justify-center items-center text-[12px] rounded-[6px]`}>
                        {market.status}
                    </span>
                </div>

                <div className="flex w-full gap-[20px] mb-[20px] mt-[20px] h-[110px] justify-between">
                    <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#F7F7F7]">
                            <p className="text-[#707070] text-[12px]">Lines</p>
                        </div>
                        <div className="h-[80px] flex justify-center flex-col p-[14px]">
                            <p className="text-[20px] text-[#022B23] font-medium">{market.lines}</p>
                        </div>
                    </div>
                    <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#F7F7F7]">
                            <p className="text-[#707070] text-[12px]">Total shops</p>
                        </div>
                        <div className="h-[80px] flex justify-center flex-col p-[14px]">
                            <p className="text-[20px] text-[#022B23] font-medium">{totalShops}</p>
                        </div>
                    </div>
                    <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#F7F7F7]">
                            <p className="text-[#707070] text-[12px]">Inactive shops</p>
                        </div>
                        <div className="h-[80px] flex justify-center flex-col p-[14px]">
                            <p className="text-[20px] text-[#022B23] font-medium">{totalShops}</p>
                        </div>
                    </div>
                    <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#000000]">
                            <p className="text-white text-[12px]">Transactions</p>
                        </div>
                        <div className="h-[80px] flex justify-center flex-col p-[14px]">
                            <p className="text-[20px] text-[#022B23] font-medium">0</p>
                        </div>
                    </div>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-[6px] h-[48px]">
                    <div
                        onClick={handleOpenAddNewLineModal}
                        className="bg-[#022B23] flex items-center h-full justify-center w-[189px] text-[#C6EB5F] text-[14px] font-semibold rounded-[12px] cursor-pointer hover:bg-[#033a30] transition-colors"
                    >
                        Add new line
                    </div>
                    <div className="border flex items-center h-full justify-center w-[112px] text-[14px] font-medium border-[#022B23] text-[#022B23] px-4 py-2 rounded-[12px]">Update</div>
                    <div className="border flex items-center h-full justify-center w-[112px] text-[14px] font-medium border-[#FF5050] text-[#FF5050] px-4 py-2 rounded-[12px]">
                        {market.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </div>
                </div>
                <div className="mt-[30px]">
                    <div className="w-full flex flex-col h-auto border-[#EAECF0] border rounded-[24px]">
                        <div className="w-full h-[91px] flex items-center justify-between px-[24px] pt-[20px] pb-[19px]">
                            <div className="flex flex-col gap-[4px]">
                                <div className="h-[28px] flex items-center">
                                    <p className="text-[18px] font-medium text-[#101828]">Market Lines and Sections</p>
                                </div>
                                <div className="flex h-[20px] items-center">
                                    <p className="text-[14px] text-[#667085]">View and manage sections in {market?.name}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 items-center bg-[#FFFFFF] border-[0.5px] border-[#F2F2F2] text-black px-4 py-2 shadow-sm rounded-sm">
                                <Image src={searchImg} alt="Search Icon" width={20} height={20} className="h-[20px] w-[20px]"/>
                                <input placeholder="Search" className="w-[175px] text-[#707070] text-[14px] focus:outline-none"/>
                            </div>
                        </div>

                        <div className="w-full h-[44px] flex bg-[#F9FAFB] border-b-[0.5px] border-[#EAECF0]">
                            <div className="h-full w-[50%] gap-[4px] flex px-[24px] items-center font-medium text-[#667085] text-[12px]">
                                <p>Section</p>
                                <Image src={arrowDown} alt={'image'}/>
                            </div>
                            <div className="flex w-[17%] items-center px-[24px] font-medium text-[#667085] text-[12px]">
                                Status
                            </div>
                            <div className="flex w-[30%] items-center px-[24px] font-medium text-[#667085] text-[12px]">
                                Shops
                            </div>
                            <div className="w-[3%]"></div>
                        </div>
                        <div className="flex flex-col">
                            {loading ? (
                                <div className="flex justify-center items-center h-[200px]">
                                    <p>Loading sections...</p>
                                </div>
                            ) : marketSections.length > 0 ? (
                                currentSections.map((section, index) => (
                                    <MarketSectionTableRow
                                        key={section.id}
                                        section={section}
                                        isLast={index === currentSections.length - 1}
                                    />
                                ))
                            ) : (
                                <div className="flex justify-center items-center h-[200px]">
                                    <p>No sections found</p>
                                </div>
                            )}
                        </div>

                        {marketSections.length > 0 && (
                            <div className="flex justify-between items-center mt-4 px-6 pb-6">
                                <button
                                    onClick={handleSectionPrevPage}
                                    disabled={currentSectionPage === 1}
                                    className={`px-4 py-2 rounded-md ${
                                        currentSectionPage === 1
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-[#022B23] hover:bg-gray-100'
                                    }`}
                                >
                                    Previous
                                </button>

                                <div className="flex gap-2">
                                    {Array.from({ length: totalSectionPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => handleSectionPageChange(page)}
                                            className={`w-8 h-8 rounded-md flex items-center justify-center ${
                                                currentSectionPage === page
                                                    ? 'bg-[#022B23] text-white'
                                                    : 'text-[#022B23] hover:bg-gray-100'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={handleSectionNextPage}
                                    disabled={currentSectionPage === totalSectionPages}
                                    className={`px-4 py-2 rounded-md ${
                                        currentSectionPage === totalSectionPages
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
            </div>

            {/* Add New Line Modal */}
            <AddNewLineModal
                isOpen={isAddNewLineModalOpen}
                onClose={handleCloseAddNewLineModal}
                onContinue={handleAddNewLineContinue}
                marketId={Number(id)} // Convert to number if needed
            />
        </div>
    )
}

export default ViewMarket;

