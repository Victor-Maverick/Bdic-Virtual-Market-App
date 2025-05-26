// app/admin/dashboard/index.tsx
import Image from "next/image";
import arrowUp from '@/../public/assets/images/green arrow up.png'
import redArrow from '@/../public/assets/images/red arrow.svg'
import MarketPerformanceChart from "@/components/marketPerformanceChart";

export default function DashboardOverview() {
    return (
        <div className="h-[900px]">
            <div className="h-[46px] flex items-center border-b-[0.5px] border-[#ededed] px-[20px]">
                <p className="text-[#022B23] font-medium text-[14px]">Dashboard overview</p>
            </div>
            <div className="flex w-full px-[20px] gap-[20px] mt-[20px]  h-[110px] justify-between">
                <div className="flex flex-col  w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px] ">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#F7F7F7]">
                        <p className="text-[#707070] text-[12px]">Markets</p>
                    </div>
                    <div className="h-[80px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">82</p>
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <Image src={arrowUp} width={12} height={12} alt={'image'} className="h-[12px] w-[12px]"/>
                                <p className="text-[10px] text-[#707070]"><span className="text-[#52A43E]">+6.41%</span> from yesterday</p>
                            </div>
                            <p className="text-[10px] text-[#022B23] underline font-medium">View markets</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col  w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px] ">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#F7F7F7]">
                        <p className="text-[#707070] text-[12px]">Vendors</p>
                    </div>
                    <div className="h-[80px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">3,000</p>
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <Image src={arrowUp} width={12} height={12} alt={'image'} className="h-[12px] w-[12px]"/>
                                <p className="text-[10px] text-[#707070]"><span className="text-[#52A43E]">+6.41%</span> from yesterday</p>
                            </div>
                            <p className="text-[10px] text-[#022B23] underline font-medium">View vendors</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col  w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px] ">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#F7F7F7]">
                        <p className="text-[#707070] text-[12px]">Logistics</p>
                    </div>
                    <div className="h-[80px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">23</p>
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <Image src={arrowUp} width={12} height={12} alt={'image'} className="h-[12px] w-[12px]"/>
                                <p className="text-[10px] text-[#707070]"><span className="text-[#52A43E]">+1.41%</span> from yesterday</p>
                            </div>
                            <p className="text-[10px] text-[#022B23] underline font-medium">View logistics</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col  w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px] ">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#F7F7F7]">
                        <p className="text-[#707070] text-[12px]">Users (customers)</p>
                    </div>
                    <div className="h-[80px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">5,002</p>
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <Image src={redArrow} width={12} height={12} alt={'image'} className="h-[12px] w-[12px]"/>
                                <p className="text-[10px] text-[#707070]"><span className="text-[#FF5050]">-0.41%</span> from yesterday</p>
                            </div>
                            <p className="text-[10px] text-[#022B23] underline font-medium">View customers</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex w-full px-[20px] gap-[20px] mt-[20px] h-[110px]">
                <div className="flex flex-col  w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px] ">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#000000]">
                        <p className="text-[#FFFFFF] text-[12px]">Total transactions</p>
                    </div>
                    <div className="h-[80px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">₦32,000,382.00</p>
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <Image src={arrowUp} width={12} height={12} alt={'image'} className="h-[12px] w-[12px]"/>
                                <p className="text-[10px] text-[#707070]"><span className="text-[#52A43E]">+4.38%</span> from yesterday</p>
                            </div>
                            <p className="text-[10px] text-[#022B23] underline font-medium">View transactions</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col  w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px] ">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#000000]">
                        <p className="text-[#FFFFFF] text-[12px]">Ads and promotion revenue</p>
                    </div>
                    <div className="h-[80px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">₦8,670,199.00</p>
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <Image src={arrowUp} width={12} height={12} alt={'image'} className="h-[12px] w-[12px]"/>
                                <p className="text-[10px] text-[#707070]"><span className="text-[#52A43E]">+15.6%</span> from yesterday</p>
                            </div>
                            <p className="text-[10px] text-[#022B23] underline font-medium">View details</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col  w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px] ">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#000000]">
                        <p className="text-[#FFFFFF] text-[12px]">Shop sales</p>
                    </div>
                    <div className="h-[80px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">₦16,021,258.00</p>
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <Image src={arrowUp} width={12} height={12} alt={'image'} className="h-[12px] w-[12px]"/>
                                <p className="text-[10px] text-[#707070]"><span className="text-[#52A43E]">+8.75%</span> from yesterday</p>
                            </div>
                            <p className="text-[10px] text-[#022B23] underline font-medium">View details</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col  w-[25%] rounded-[14px] h-full border-[#FF5050] border-[0.5px] ">
                    <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#FFF2F2]">
                        <p className="text-[#FF5050] text-[12px]">Disputes</p>
                    </div>
                    <div className="h-[80px] flex justify-center flex-col p-[14px]">
                        <p className="text-[20px] text-[#022B23] font-medium">82</p>
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <Image src={arrowUp} width={12} height={12} alt={'image'} className="h-[12px] w-[12px]"/>
                                <p className="text-[10px] text-[#707070]"><span className="text-[#52A43E]">+8.75%</span> from yesterday</p>
                            </div>
                            <p className="text-[10px] text-[#022B23] underline font-medium">View disputes</p>
                        </div>
                    </div>
                </div>
            </div>
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
            <div className="w-[calc(100%-40px)] mx-[20px] mt-[30px] h-[391px] border-[0.5px] border-[#f2f2f2] rounded-[14px]">
                <MarketPerformanceChart />
            </div>
        </div>
    );
}