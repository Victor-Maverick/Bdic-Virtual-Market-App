'use client'
import Image from "next/image";
import arrowBack from "../../../../../../public/assets/images/arrow-right.svg";
import {useRouter} from "next/navigation";

const ViewShop=()=>{
    const router = useRouter();
    return(
        <>
            <div className="text-[#707070] text-[14px] px-[20px] font-medium gap-[8px] flex items-center h-[56px] w-full border-b-[0.5px] border-[#ededed]">
                <Image src={arrowBack} alt={'image'} width={24} height={24} className="cursor-pointer" onClick={()=>{router.push("/admin/dashboard/markets/view-shops")}}/>
                <p className="cursor-pointer" onClick={()=>{router.push("/admin/dashboard/markets/view-shops")}}>Back to shops</p>
            </div>
            <div className="text-[#022B23] text-[14px] px-[20px] font-medium gap-[8px] flex items-center h-[49px] w-full border-b-[0.5px] border-[#ededed]">
                <p>Shop 2A</p>
            </div>
            <div className="p-[20px]">
                <div className="flex flex-col gap-[4px]">
                    <div className="flex gap-[8px] items-center">
                        <h2 className="text-[18px] font-semibold text-[#022B23]">Shop 2A</h2>
                        <span className="text-[12px] font-medium w-[87px]  rounded-[8px] h-[25px] bg-[#F9FAFB] flex items-center justify-center text-[#667085]">ID: 0012345</span>
                    </div>
                    <p className="text-[14px] text-[#707070] font-medium">View and manage this shop</p>
                </div>
                <div className="flex w-full  gap-[20px] mt-[20px]  h-[86px] justify-between">
                    <div className="flex flex-col  w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px] ">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[34px] bg-[#F7F7F7]">
                            <p className="text-[#707070] text-[12px]">Shop name</p>
                        </div>
                        <div className="h-[52px] flex justify-center flex-col p-[14px]">
                            <p className="text-[20px] text-[#022B23] font-medium">Abba technologies</p>
                        </div>
                    </div>
                    <div className="flex flex-col  w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px] ">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[34px] bg-[#F7F7F7]">
                            <p className="text-[#707070] text-[12px]">Market</p>
                        </div>
                        <div className="h-[52px] flex justify-center flex-col p-[14px]">
                            <p className="text-[20px] text-[#022B23] font-medium">Modern market</p>
                        </div>
                    </div>
                    <div className="flex flex-col  w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px] ">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[34px] bg-[#F7F7F7]">
                            <p className="text-[#707070] text-[12px]">Line</p>
                        </div>
                        <div className="h-[52px] flex justify-center flex-col p-[14px]">
                            <p className="text-[20px] text-[#022B23] font-medium">Lagos line</p>
                        </div>
                    </div>
                    <div className="flex flex-col  w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px] ">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[34px] bg-[#F7F7F7]">
                            <p className="text-[#707070] text-[12px]">Shop name</p>
                        </div>
                        <div className="h-[52px] w-[239px] flex justify-center flex-col p-[14px]">
                            <p className="text-[12px] text-[#022B23] font-medium">No. 24, Vandeikya Street, High Level,
                                Makurdi</p>
                        </div>
                    </div>
                </div>
                <div className="flex w-full  gap-[20px] mt-[20px] h-[86px]">
                    <div className="flex flex-col  w-[244px] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px] ">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[34px] bg-[#000000]">
                            <p className="text-[#FFFFFF] text-[12px]">Total transactions</p>
                        </div>
                        <div className="h-[52px] flex justify-center flex-col p-[14px]">
                            <p className="text-[20px] text-[#022B23] font-medium">₦32,000,382.00</p>

                        </div>
                    </div>
                    <div className="flex flex-col  w-[244px] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px] ">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[34px] bg-[#FFEEBE]">
                            <p className="text-[#000000] text-[12px]">Ads and promotion revenue</p>
                        </div>
                        <div className="h-[52px] flex justify-between  p-[14px]">
                            <p className="text-[20px] text-[#022B23] font-medium">4.3</p>
                            <span className="text-[12px] w-[47px] h-[25px] font-medium text-[#52A43E] border border-[#52A43E] flex items-center justify-center bg-[#E3FFF0] rounded-[8px]">Good</span>
                        </div>
                    </div>
                    <div className="flex flex-col  w-[244px] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px] ">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[34px] bg-[#F7F7F7]">
                            <p className="text-[#707070] text-[12px]">Vendor</p>
                        </div>
                        <div className="h-[52px] flex justify-between items-center p-[14px]">
                            <p className="text-[20px] text-[#022B23] font-medium">Tersoo Jude</p>
                            <p className="text-[10px] text-[#022B23] underline font-medium">View vendor</p>
                        </div>
                    </div>
                </div>
                <div className="w-[157px] h-[48px] border border-[#FF5050] mt-[40px] rounded-[12px] flex items-center justify-center text-[#FF5050] font-medium text-[16px]">
                    Deactivate shop
                </div>
            </div>
        </>
    )
}
export default ViewShop