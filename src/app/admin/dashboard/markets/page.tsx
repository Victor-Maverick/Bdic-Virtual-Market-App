'use client'
import Image from "next/image";
import arrowUp from "../../../../../public/assets/images/green arrow up.png";
import redArrow from "../../../../../public/assets/images/red arrow.svg";
import searchImg from "../../../../../public/assets/images/search-normal.png";
import arrowDown from '@/../public/assets/images/arrow-down.svg'
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import DeleteConfirmationModal from "@/components/deleteConfirmationModal";

interface Market {
    id: number;
    name: string;
    state: string;
    marketId: string;
    lines: number;
    status: "INACTIVE" | "ACTIVE";
    numberOfShops: number;
}

interface MarketData {
    totalMarkets: number;
    activeMarkets: number;
    marketLines: number;
    shopsCount: number;
    inactiveMarkets: number;
    markets: Market[];
    marketsChangePercent: number;
    activeChangePercent: number;
    linesChangePercent: number;
    shopsChangePercent: number;
    inactiveChangePercent: number;
}

interface ProductActionsDropdownProps {
    marketId: number;
    children: React.ReactNode;
    onDelete: () => void;
}

const ProductActionsDropdown = ({ marketId, children, onDelete }: ProductActionsDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleOpenDeleteModal = () => {
        setIsOpen(false);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
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
                        <ul className="py-1">
                            <li onClick={() => { router.push("/admin/dashboard/markets/view-market") }} className="px-[8px] py-[4px] h-[38px] text-[12px] hover:bg-[#f9f9f9] text-[#1E1E1E] cursor-pointer">View and edit market</li>
                            <li className="px-[8px] py-[4px] h-[38px] text-[#8C8C8C] hover:border-b-[0.5px] hover:border-t-[0.5px] hover:border-[#F2F2F2] text-[12px]  cursor-pointer">Deactivate market</li>
                            <li onClick={handleOpenDeleteModal} className="px-[8px] rounded-bl-[8px] rounded-br-[8px] py-[4px] h-[38px] text-[12px] hover:bg-[#FFFAF9] hover:border-t-[0.5px] hover:border-[#F2F2F2] cursor-pointer text-[#FF5050]">
                                Delete
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onDelete={() => {
                    onDelete(); // This calls the function passed from the parent
                    handleCloseDeleteModal();
                    console.log(marketId)
                }}
                title="Delete Market"
                message="Are you sure you want to delete this market? This action cannot be undone."
            />
        </>
    );
}

const Markets = () => {
    const router = useRouter();
    const [marketData, setMarketData] = useState<MarketData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMarketData = async () => {
        try {
            setLoading(true);
            // Fetch all data in parallel
            const [
                marketsRes,
                shopsRes,
                activeMarketsRes,
                marketSectionsRes
            ] = await Promise.all([
                axios.get('https://digitalmarket.benuestate.gov.ng/api/markets/all'),
                axios.get('https://digitalmarket.benuestate.gov.ng/api/shops/allCount'),
                axios.get('https://digitalmarket.benuestate.gov.ng/api/markets/getActiveMarketsCount'),
                axios.get('https://digitalmarket.benuestate.gov.ng/api/market-sections/all')
            ]);

            const markets = marketsRes.data;
            const shopsCount = shopsRes.data;
            const activeMarkets = activeMarketsRes.data;
            const marketSections = marketSectionsRes.data;
            console.log("active markets", activeMarkets);

            // Calculate total lines (assuming each market has lines)
            const marketLines = marketSections.length || 0;

            // Format the data
            const data: MarketData = {
                totalMarkets: markets.length || 0,
                activeMarkets: markets.length,
                marketLines: marketLines,
                shopsCount: shopsCount,
                inactiveMarkets: 0,
                markets: markets.map((market: Market) => ({
                    id: market.id,
                    name: market.name || "Modern market",
                    state: market.state || "Benue State",
                    marketId: market.marketId || "21367",
                    lines: market.lines || 0,
                    numberOfShops: market.numberOfShops || 0,
                    status: market.status === "ACTIVE" ? "ACTIVE" : "INACTIVE"
                })),
                marketsChangePercent: 6.41,
                activeChangePercent: 6.41,
                linesChangePercent: 1.41,
                shopsChangePercent: -0.41,
                inactiveChangePercent: -0.41
            };

            setMarketData(data);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch market data");
            setLoading(false);
            console.error("Error fetching market data:", err);
        }
    };

    const handleDeleteMarket = async (marketId: number) => {
        try {
            await axios.delete(`https://digitalmarket.benuestate.gov.ng/api/markets/delete/${marketId}`);
            // Refresh the market data after successful deletion
            await fetchMarketData();
        } catch (err) {
            console.error("Error deleting market:", err);
            // You might want to show an error message to the user here
        }
    };

    useEffect(() => {
        fetchMarketData();
    }, []);

    if (loading) return <div className="h-[900px] flex items-center justify-center">Loading market data...</div>;
    if (error) return <div className="h-[900px] flex items-center justify-center text-red-500">{error}</div>;
    if (!marketData) return <div className="h-[900px] flex items-center justify-center">No market data available</div>;

    const MarketTableRow = ({ market, isLast }: { market: Market; isLast: boolean }) => {
        return (
            <div className={`flex h-[72px] ${!isLast ? 'border-b border-[#EAECF0]' : ''}`}>
                <div className="flex flex-col justify-center w-[40%] pl-[24px] ">
                    <p className="text-[#101828] text-[14px] font-medium">{market.name}</p>
                    <p className="text-[#667085] text-[14px]">{market.state}</p>
                </div>
                <div className="flex flex-col justify-center w-[17%] pl-[24px] ">
                    <p className="text-[#101828] text-[14px]">{market.marketId}</p>
                </div>

                <div className="flex items-center w-[13%]  px-[10px]">
                    <div className={`w-[55px] h-[22px] rounded-[8px] flex items-center justify-center ${
                        market.status === 'ACTIVE'
                            ? 'bg-[#ECFDF3] text-[#027A48]'
                            : 'bg-[#FEF3F2] text-[#FF5050]'
                    }`}>
                        <p className="text-[12px] font-medium">{market.status}</p>
                    </div>
                </div>
                <div className="flex flex-col justify-center w-[10%] pl-[24px] ">
                    <p className="text-[#101828] text-[14px]">{market.lines}</p>
                </div>
                <div className="flex flex-col justify-center w-[17%] pl-[24px] ">
                    <p className="text-[#101828] text-[14px]">{market.numberOfShops}</p>
                    <p className="underline text-[12px] font-medium text-[#667085]">View shop</p>
                </div>
                <div className="flex items-center justify-center w-[3%]">
                    <ProductActionsDropdown
                        marketId={market.id}
                        onDelete={() => handleDeleteMarket(market.id)}
                    >
                        <div>
                            <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                            <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                            <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                        </div>
                    </ProductActionsDropdown>
                </div>
            </div>
        )
    }

    return (
        <div className="h-[900px]">
            <div className="h-[46px] flex items-center border-b-[0.5px] border-[#ededed] px-[20px]">
                <p className="text-[#022B23] font-medium text-[14px]">Dashboard overview</p>
            </div>
            <div className="flex w-full px-[20px] gap-[20px] mt-[20px] h-[110px] justify-between">
                {/* Total Markets Card */}
                <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#F7F7F7]">
                        <p className="text-[#707070] text-[12px]">Total markets</p>
                    </div>
                    <div className="h-[80px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">{marketData.totalMarkets}</p>
                        <div className="flex items-center">
                            <Image
                                src={marketData.marketsChangePercent >= 0 ? arrowUp : redArrow}
                                width={12}
                                height={12}
                                alt={'image'}
                                className="h-[12px] w-[12px]"
                            />
                            <p className="text-[10px] text-[#707070]">
                                <span className={marketData.marketsChangePercent >= 0 ? "text-[#52A43E]" : "text-[#FF5050]"}>
                                    {marketData.marketsChangePercent >= 0 ? '+' : ''}{marketData.marketsChangePercent}%
                                </span> from yesterday
                            </p>
                        </div>
                    </div>
                </div>

                {/* Active Markets Card */}
                <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#F7F7F7]">
                        <p className="text-[#707070] text-[12px]">Active markets</p>
                    </div>
                    <div className="h-[80px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">{marketData.activeMarkets}</p>
                        <div className="flex items-center">
                            <Image
                                src={marketData.activeChangePercent >= 0 ? arrowUp : redArrow}
                                width={12}
                                height={12}
                                alt={'image'}
                                className="h-[12px] w-[12px]"
                            />
                            <p className="text-[10px] text-[#707070]">
                                <span className={marketData.activeChangePercent >= 0 ? "text-[#52A43E]" : "text-[#FF5050]"}>
                                    {marketData.activeChangePercent >= 0 ? '+' : ''}{marketData.activeChangePercent}%
                                </span> from yesterday
                            </p>
                        </div>
                    </div>
                </div>

                {/* Market Lines Card */}
                <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#F7F7F7]">
                        <p className="text-[#707070] text-[12px]">Market lines</p>
                    </div>
                    <div className="h-[80px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">{marketData.marketLines}</p>
                        <div className="flex items-center">
                            <Image
                                src={marketData.linesChangePercent >= 0 ? arrowUp : redArrow}
                                width={12}
                                height={12}
                                alt={'image'}
                                className="h-[12px] w-[12px]"
                            />
                            <p className="text-[10px] text-[#707070]">
                                <span className={marketData.linesChangePercent >= 0 ? "text-[#52A43E]" : "text-[#FF5050]"}>
                                    {marketData.linesChangePercent >= 0 ? '+' : ''}{marketData.linesChangePercent}%
                                </span> from yesterday
                            </p>
                        </div>
                    </div>
                </div>

                {/* Shops Card */}
                <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#F7F7F7]">
                        <p className="text-[#707070] text-[12px]">Shops</p>
                    </div>
                    <div className="h-[80px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">{marketData.shopsCount.toLocaleString()}</p>
                        <div className="flex items-center">
                            <Image
                                src={marketData.shopsChangePercent >= 0 ? arrowUp : redArrow}
                                width={12}
                                height={12}
                                alt={'image'}
                                className="h-[12px] w-[12px]"
                            />
                            <p className="text-[10px] text-[#707070]">
                                <span className={marketData.shopsChangePercent >= 0 ? "text-[#52A43E]" : "text-[#FF5050]"}>
                                    {marketData.shopsChangePercent >= 0 ? '+' : ''}{marketData.shopsChangePercent}%
                                </span> from yesterday
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inactive Markets Card */}
            <div className="flex flex-col w-[237px] rounded-[14px] h-[110px] mt-[20px] ml-[20px] border-[#FF2121] border-[0.5px]">
                <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#FFE8E8]">
                    <p className="text-[#707070] text-[12px]">Inactive markets</p>
                </div>
                <div className="h-[80px] flex justify-center flex-col p-[14px]">
                    <p className="text-[20px] text-[#022B23] font-medium">{marketData.inactiveMarkets}</p>
                    <div className="flex items-center">
                        <Image
                            src={marketData.inactiveChangePercent >= 0 ? arrowUp : redArrow}
                            width={12}
                            height={12}
                            alt={'image'}
                            className="h-[12px] w-[12px]"
                        />
                        <p className="text-[10px] text-[#707070]">
                            <span className={marketData.inactiveChangePercent >= 0 ? "text-[#52A43E]" : "text-[#FF5050]"}>
                                {marketData.inactiveChangePercent >= 0 ? '+' : ''}{marketData.inactiveChangePercent}%
                            </span> from yesterday
                        </p>
                    </div>
                </div>
            </div>

            <div
                onClick={() => {router.push("/admin/dashboard/markets/onboard-market")}}
                className="ml-[20px] mt-[30px] cursor-pointer text-[#C6EB5F] text-[14px] font-semibold flex justify-center items-center rounded-[12px] bg-[#022B23] h-[48px] w-[189px]"
            >
                Onboard new market
            </div>

            {/* Markets Table */}
            <div className="px-[20px] my-[50px]">
                <div className="w-full flex flex-col  border-[#EAECF0] border rounded-[24px]">
                    <div className="w-full h-[121px] flex items-center justify-between px-[24px] pt-[20px] pb-[19px]">
                        <div className="flex flex-col gap-[4px]">
                            <div className="h-[28px] flex items-center">
                                <p className="text-[18px] font-medium text-[#101828]">Markets</p>
                            </div>
                            <div className="flex h-[20px] items-center">
                                <p className="text-[14px] text-[#667085]">View and manage markets here</p>
                            </div>
                            <div className="w-[302px] h-[26px] flex rounded-[6px] border-[0.5px] border-[#f2f2f2]">
                                <div className="w-[69px] text-[#03071E] text-[10px] flex items-center justify-center h-full border-r-[0.5px] border-[#F2F2F2] rounded-bl-[6px] rounded-tl-[6px] bg-[#F8FAFB]">
                                    All Markets
                                </div>
                                <div className="w-[57px] text-[#8c8c8c] text-[10px] flex items-center justify-center h-full border-r-[0.5px] border-[#F2F2F2]">
                                    Market 1
                                </div>
                                <div className="w-[58px] text-[#8c8c8c] text-[10px] flex items-center justify-center h-full border-r-[0.5px] border-[#F2F2F2]">
                                    Market 2
                                </div>
                                <div className="w-[59px] text-[#8c8c8c] text-[10px] flex items-center justify-center h-full border-r-[0.5px] border-[#F2F2F2]">
                                    Market 3
                                </div>
                                <div className="w-[59px] text-[#8c8c8c] text-[10px] flex items-center justify-center h-full border-r-[0.5px] border-[#F2F2F2] rounded-br-[6px] rounded-tr-[6px]">
                                    Market 4
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 items-center bg-[#FFFFFF] border-[0.5px] border-[#F2F2F2] text-black px-4 py-2 shadow-sm rounded-sm">
                            <Image src={searchImg} alt="Search Icon" width={20} height={20} className="h-[20px] w-[20px]"/>
                            <input placeholder="Search" className="w-[175px] text-[#707070] text-[14px] focus:outline-none"/>
                        </div>
                    </div>

                    <div className="w-full h-[44px] flex bg-[#F9FAFB] border-b-[0.5px] border-[#EAECF0]">
                        <div className="h-full w-[40%] gap-[4px] flex px-[24px] items-center font-medium text-[#667085] text-[12px]">
                            <p>Markets</p>
                            <Image src={arrowDown} alt={'image'}/>
                        </div>
                        <div className="flex w-[17%] items-center px-[24px] font-medium text-[#667085] text-[12px]">
                            Market ID
                        </div>
                        <div className="flex w-[13%] items-center px-[24px] font-medium text-[#667085] text-[12px]">
                            Status
                        </div>
                        <div className="flex w-[10%] items-center px-[24px] font-medium text-[#667085] text-[12px]">
                            Lines
                        </div>
                        <div className="flex w-[17%] items-center px-[24px] font-medium text-[#667085] text-[12px]">
                            Shops
                        </div>
                        <div className="w-[3%]"></div>
                    </div>

                    <div className="flex flex-col">
                        {marketData.markets.map((market, index) => (
                            <MarketTableRow
                                key={market.id}
                                market={market}
                                isLast={index === marketData.markets.length - 1}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Markets;