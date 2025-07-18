// app/admin/dashboard/index.tsx
'use client'
import Image from "next/image";
import arrowUp from '@/../public/assets/images/green arrow up.png'
import redArrow from '@/../public/assets/images/red arrow.svg'
import MarketPerformanceChart from "@/components/marketPerformanceChart";
import { useEffect, useState } from "react";
import axios from "axios";

interface DashboardData {
    marketsCount: number;
    vendorsCount: number;
    logisticsCount: number;
    usersCount: number;
    totalTransactions: number;
    adsRevenue: number;
    shopSales: number;
    disputesCount: number;
    marketsChangePercent: number;
    vendorsChangePercent: number;
    logisticsChangePercent: number;
    usersChangePercent: number;
    transactionsChangePercent: number;
    adsChangePercent: number;
    salesChangePercent: number;
    disputesChangePercent: number;
}

export default function DashboardOverview() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch all data in parallel using axios
                const [
                    marketsRes,
                    shopSalesRes,
                    logisticsRes,
                    transactionsRes,
                    vendorRes,
                    usersRes
                ] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/markets/all`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/getTotalTransactionAmount`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/logisticsAll`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/allTransactionAmount`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/getAllVendorsCount`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/allCount`)

                ]);

                // Extract data from responses
                const markets = marketsRes.data;
                const shopSalesAmount = shopSalesRes.data;
                const logistics = logisticsRes.data;
                const transactions = transactionsRes.data;
                const vendors = vendorRes.data;
                const users = usersRes.data;

                // // Calculate vendors count (assuming each section has vendors)
                // const vendorsCount = sections.reduce((acc: number, section: any) => {
                //     return acc + (section.vendors?.length || 0);
                // }, 0);

                // Format the dashboard data
                const dashboardData: DashboardData = {
                    marketsCount: markets.length || 0,
                    vendorsCount: vendors,
                    logisticsCount: logistics,
                    usersCount: users, // Placeholder - you'll need an endpoint for this
                    totalTransactions: transactions || 0,
                    adsRevenue: 0, // Placeholder - you'll need an endpoint for this
                    shopSales: shopSalesAmount, // Placeholder - you'll need an endpoint for this
                    disputesCount: 0, // Placeholder - you'll need an endpoint for this
                    marketsChangePercent: 6.41,
                    vendorsChangePercent: 6.41,
                    logisticsChangePercent: 1.41,
                    usersChangePercent: -0.41,
                    transactionsChangePercent: 4.38,
                    adsChangePercent: 15.6,
                    salesChangePercent: 8.75,
                    disputesChangePercent: 8.75
                };

                setData(dashboardData);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch dashboard data");
                setLoading(false);
                console.error("Error fetching dashboard data:", err);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="h-[900px] flex items-center justify-center">Loading dashboard...</div>;
    if (error) return <div className="h-[900px] flex items-center justify-center text-red-500">{error}</div>;
    if (!data) return <div className="h-[900px] flex items-center justify-center">No data available</div>;

    // Helper function to format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className="h-[900px]">
            <div className="h-[46px] flex items-center border-b-[0.5px] border-[#ededed] px-[20px]">
                <p className="text-[#022B23] font-medium text-[14px]">Dashboard overview</p>
            </div>

            {/* Metrics Section */}
            <div className="flex w-full px-[20px] gap-[20px] mt-[20px] h-[110px] justify-between">
                {/* Markets Card */}
                <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#F7F7F7]">
                        <p className="text-[#707070] text-[12px]">Markets</p>
                    </div>
                    <div className="h-[80px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">{data.marketsCount}</p>
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <Image src={data.marketsChangePercent >= 0 ? arrowUp : redArrow} width={12} height={12} alt="trend" className="h-[12px] w-[12px]"/>
                                <p className="text-[10px] text-[#707070]">
                  <span className={data.marketsChangePercent >= 0 ? "text-[#52A43E]" : "text-[#FF5050]"}>
                    {data.marketsChangePercent >= 0 ? '+' : ''}{data.marketsChangePercent}%
                  </span> from yesterday
                                </p>
                            </div>
                            <p className="text-[10px] text-[#022B23] underline font-medium">View markets</p>
                        </div>
                    </div>
                </div>

                {/* Vendors Card */}
                <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#F7F7F7]">
                        <p className="text-[#707070] text-[12px]">Vendors</p>
                    </div>
                    <div className="h-[80px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">{data.vendorsCount.toLocaleString()}</p>
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <Image src={data.vendorsChangePercent >= 0 ? arrowUp : redArrow} width={12} height={12} alt="trend" className="h-[12px] w-[12px]"/>
                                <p className="text-[10px] text-[#707070]">
                  <span className={data.vendorsChangePercent >= 0 ? "text-[#52A43E]" : "text-[#FF5050]"}>
                    {data.vendorsChangePercent >= 0 ? '+' : ''}{data.vendorsChangePercent}%
                  </span> from yesterday
                                </p>
                            </div>
                            <p className="text-[10px] text-[#022B23] underline font-medium">View vendors</p>
                        </div>
                    </div>
                </div>

                {/* Logistics Card */}
                <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#F7F7F7]">
                        <p className="text-[#707070] text-[12px]">Logistics</p>
                    </div>
                    <div className="h-[80px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">{data.logisticsCount}</p>
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <Image src={data.logisticsChangePercent >= 0 ? arrowUp : redArrow} width={12} height={12} alt="trend" className="h-[12px] w-[12px]"/>
                                <p className="text-[10px] text-[#707070]">
                  <span className={data.logisticsChangePercent >= 0 ? "text-[#52A43E]" : "text-[#FF5050]"}>
                    {data.logisticsChangePercent >= 0 ? '+' : ''}{data.logisticsChangePercent}%
                  </span> from yesterday
                                </p>
                            </div>
                            <p className="text-[10px] text-[#022B23] underline font-medium">View logistics</p>
                        </div>
                    </div>
                </div>

                {/* Users Card */}
                <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#F7F7F7]">
                        <p className="text-[#707070] text-[12px]">Users (customers)</p>
                    </div>
                    <div className="h-[80px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">{data.usersCount.toLocaleString()}</p>
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <Image src={data.usersChangePercent >= 0 ? arrowUp : redArrow} width={12} height={12} alt="trend" className="h-[12px] w-[12px]"/>
                                <p className="text-[10px] text-[#707070]">
                  <span className={data.usersChangePercent >= 0 ? "text-[#52A43E]" : "text-[#FF5050]"}>
                    {data.usersChangePercent >= 0 ? '+' : ''}{data.usersChangePercent}%
                  </span> from yesterday
                                </p>
                            </div>
                            <p className="text-[10px] text-[#022B23] underline font-medium">View customers</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Second Row Metrics */}
            <div className="flex w-full px-[20px] gap-[20px] mt-[20px] h-[110px]">
                {/* Total Transactions Card */}
                <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#000000]">
                        <p className="text-[#FFFFFF] text-[12px]">Total transactions</p>
                    </div>
                    <div className="h-[80px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">{formatCurrency(data.totalTransactions)}</p>
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <Image src={data.transactionsChangePercent >= 0 ? arrowUp : redArrow} width={12} height={12} alt="trend" className="h-[12px] w-[12px]"/>
                                <p className="text-[10px] text-[#707070]">
                  <span className={data.transactionsChangePercent >= 0 ? "text-[#52A43E]" : "text-[#FF5050]"}>
                    {data.transactionsChangePercent >= 0 ? '+' : ''}{data.transactionsChangePercent}%
                  </span> from yesterday
                                </p>
                            </div>
                            <p className="text-[10px] text-[#022B23] underline font-medium">View transactions</p>
                        </div>
                    </div>
                </div>

                {/* Ads Revenue Card */}
                <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#000000]">
                        <p className="text-[#FFFFFF] text-[12px]">Ads and promotion revenue</p>
                    </div>
                    <div className="h-[80px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">{formatCurrency(data.adsRevenue)}</p>
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <Image src={data.adsChangePercent >= 0 ? arrowUp : redArrow} width={12} height={12} alt="trend" className="h-[12px] w-[12px]"/>
                                <p className="text-[10px] text-[#707070]">
                  <span className={data.adsChangePercent >= 0 ? "text-[#52A43E]" : "text-[#FF5050]"}>
                    {data.adsChangePercent >= 0 ? '+' : ''}{data.adsChangePercent}%
                  </span> from yesterday
                                </p>
                            </div>
                            <p className="text-[10px] text-[#022B23] underline font-medium">View details</p>
                        </div>
                    </div>
                </div>

                {/* Shop Sales Card */}
                <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#000000]">
                        <p className="text-[#FFFFFF] text-[12px]">Shop sales</p>
                    </div>
                    <div className="h-[80px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">{formatCurrency(data.shopSales)}</p>
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <Image src={data.salesChangePercent >= 0 ? arrowUp : redArrow} width={12} height={12} alt="trend" className="h-[12px] w-[12px]"/>
                                <p className="text-[10px] text-[#707070]">
                  <span className={data.salesChangePercent >= 0 ? "text-[#52A43E]" : "text-[#FF5050]"}>
                    {data.salesChangePercent >= 0 ? '+' : ''}{data.salesChangePercent}%
                  </span> from yesterday
                                </p>
                            </div>
                            <p className="text-[10px] text-[#022B23] underline font-medium">View details</p>
                        </div>
                    </div>
                </div>

                {/* Disputes Card */}
                <div className="flex flex-col w-[25%] rounded-[14px] h-full border-[#FF5050] border-[0.5px]">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#FFF2F2]">
                        <p className="text-[#FF5050] text-[12px]">Disputes</p>
                    </div>
                    <div className="h-[80px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">{data.disputesCount}</p>
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <Image src={data.disputesChangePercent >= 0 ? arrowUp : redArrow} width={12} height={12} alt="trend" className="h-[12px] w-[12px]"/>
                                <p className="text-[10px] text-[#707070]">
                  <span className={data.disputesChangePercent >= 0 ? "text-[#52A43E]" : "text-[#FF5050]"}>
                    {data.disputesChangePercent >= 0 ? '+' : ''}{data.disputesChangePercent}%
                  </span> from yesterday
                                </p>
                            </div>
                            <p className="text-[10px] text-[#022B23] underline font-medium">View disputes</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analytics Section */}
            <div className="px-[20px] w-full mt-25">
                <p className="text-[#18181B] text-[12px]">Analytics</p>
                <div className="w-[291px] mt-[10px] h-[26px] flex rounded-[6px] border-[0.5px] border-[#F2F2F2]">
                    <div className="w-[55px] h-full border-r-[0.5px] border-[#f2f2f2] flex items-center text-[10px] rounded-tl-[6px] rounded-bl-[6px] bg-[#F8FAFB] text-[#03071E] justify-center">
                        <p>Markets</p>
                    </div>
                    <div className="w-[56px] h-full border-r-[0.5px] border-[#f2f2f2] flex items-center text-[10px] text-[#8c8c8c] justify-center">
                        <p>Vendor</p>
                    </div>
                    <div className="w-[59px] h-full border-r-[0.5px] border-[#f2f2f2] flex items-center text-[10px] text-[#8c8c8c] justify-center">
                        <p>Logistics</p>
                    </div>
                    <div className="w-[44px] h-full border-r-[0.5px] border-[#f2f2f2] flex items-center text-[10px] text-[#8c8c8c] justify-center">
                        <p>Users</p>
                    </div>
                    <div className="w-[77px] h-full rounded-tr-[6px] rounded-br-[6px] flex items-center text-[10px] text-[#8c8c8c] justify-center">
                        <p>Transactions</p>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="w-[calc(100%-40px)] mx-[20px] mt-[30px] h-[391px] border-[0.5px] border-[#f2f2f2] rounded-[14px]">
                <MarketPerformanceChart />
            </div>
        </div>
    );
}