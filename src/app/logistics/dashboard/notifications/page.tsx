import LogisticsCompanyGuard from "@/components/LogisticsCompanyGuard";
import Image from "next/image";
import iPhone from "../../../../../public/assets/images/blue14.png";


const Notifications = ()=>{
    return(
        <LogisticsCompanyGuard>
            <div className="flex px-25 mt-[30px] gap-[40px]">
                <div className="flex flex-col gap-[14px]">
                    <div className="flex flex-col">
                        <p className="text-[18px] font-medium text-[#101828]">All Notifications</p>
                        <p className="text-[#667085] text-[14px]">View all your notifications here</p>
                    </div>
                    <p className="text-[#667085] text-[14px] underline cursor-pointer">Mark all as read</p>
                </div>
                <div className="flex flex-col gap-[8px] mb-10 w-[645px]">
                   <div className="flex px-[20px] rounded-[14px] py-[15px] h-auto w-full flex-col bg-[#F9F9F9] border-[0.5px] border-[#EDEDED]">
                       <div className="flex flex-col ">
                           <p className="text-[#101828] text-[14px] font-semibold">🚚 New Delivery Request (ORDR #13568)</p>
                           <p className="text-[#667085] text-[12px] mt-[4px]">New delivery request from Vendor XYZ. </p>
                           <div className="w-[548px] flex flex-col justify-between  py-[8px] px-[12px] border-[#F0F0F0] mt-[4px] border bg-[#fdfdfd] h-[104px] rounded-[12px]">
                               <p className="text-[#54575D] text-[12px] ml-[8px]">Pickup at No. 4 Iye Street, High Level Makurdi...</p>
                               <div className="w-[1px] h-[24px] bg-[#FF6644]">

                               </div>
                               <p className="text-[#54575D] ml-[8px] text-[12px]">Drop-off Shop A3, Market Line B, Modern market</p>
                           </div>
                       </div>
                       <p className="mt-[10px] text-[10px] text-[#667085]">20th April, 2025 // 9:23 AM</p>
                       <div className="w-[550px] gap-[12px] flex items-center mt-[20px] bg-white h-[72px] rounded-[14px] border-[1px] border-[#EAECF0]">
                           <div className="bg-[#f9f9f9] h-full w-[70px] overflow-hidden rounded-bl-[14px] rounded-tl-[14px]">
                               <Image
                                   src={iPhone}
                                   alt={'image'}
                                   width={70}
                                   height={70}
                                   className="object-cover"
                               />
                           </div>
                           <div className="flex flex-col">
                               <p className="text-[14px] text-[#101828] font-medium">iPhone 14 pro max</p>
                               <p className="text-[14px] text-[#667085]">ID: #1234567887654</p>
                           </div>
                       </div>
                       <p className="text-[12px] mt-[15px] mb-[8px] text-[#022B23] font-medium">View request</p>
                   </div>
                    <div className="flex px-[20px] rounded-[14px] py-[15px] h-auto w-full flex-col bg-[#FfFfFf] border-[0.5px] border-[#EDEDED]">
                        <div className="flex flex-col ">
                            <p className="text-[#101828] text-[14px] font-semibold">⚠️ Order disputes (ORDR #21456)</p>
                            <p className="text-[#667085] text-[12px] mt-[4px]">A customer has requested a product return. </p>
                            <div className="w-[548px] flex flex-col bg-[#FDFDFD] justify-between  py-[8px] px-[12px] border-[#F0F0F0] mt-[4px] border  h-[104px] rounded-[12px]">
                                <p className="text-[#54575D] text-[12px] ml-[8px]">Pickup at No. 4 Iye Street, High Level Makurdi...</p>
                                <div className="w-[1px] h-[24px] bg-[#FF6644]">

                                </div>
                                <p className="text-[#54575D] ml-[8px] text-[12px]">Drop-off Shop A3, Market Line B, Modern market</p>
                            </div>
                        </div>
                        <p className="mt-[10px] text-[10px] text-[#667085]">20th April, 2025 // 9:23 AM</p>
                        <div className="w-[550px] gap-[12px] flex items-center mt-[20px] bg-white h-[72px] rounded-[14px] border-[1px] border-[#EAECF0]">
                            <div className="bg-[#f9f9f9] h-full w-[70px] overflow-hidden rounded-bl-[14px] rounded-tl-[14px]">
                                <Image
                                    src={iPhone}
                                    alt={'image'}
                                    width={70}
                                    height={70}
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-[14px] text-[#101828] font-medium">iPhone 14 pro max</p>
                                <p className="text-[14px] text-[#667085]">ID: #1234567887654</p>
                            </div>
                        </div>
                        <p className="text-[12px] mt-[15px] mb-[8px] text-[#022B23] font-medium">Begin pickup</p>
                    </div>
                    <div className="w-full py-[15px] flex flex-col gap-[8px] px-[20px] h-auto border-[#ededed] border-[0.5px] rounded-[14px]">
                        <p className="text-[#101828] text-[14px] font-semibold">⚠️ Delay notification</p>
                        <p className="text-[#667085] text-[12px] ">ORDR #13456 will be delayed due to traffic experienced by the rider</p>
                        <p className="text-[10px] text-[#667085]">20th April, 2025 // 9:23 AM</p>
                        <p className="text-[12px] mt-[8px]  text-[#022B23] font-medium">View order</p>
                    </div>
                    <div className="w-full py-[15px] flex flex-col gap-[8px] px-[20px] h-auto border-[#ededed] border-[0.5px] rounded-[14px]">
                        <p className="text-[#101828] text-[14px] font-semibold">✅ Order Successfully Delivered</p>
                        <p className="text-[#667085] text-[12px] ">ORDR #12345 has been successfully delivered to the customer</p>
                        <p className="text-[10px] text-[#667085]">20th April, 2025 // 9:23 AM</p>
                    </div>
                    <div className="w-full py-[15px] flex flex-col gap-[8px] px-[20px] h-auto border-[#ededed] border-[0.5px] rounded-[14px]">
                        <p className="text-[#101828] text-[14px] font-semibold">⭐ 4.2 Star rating & review</p>
                        <p className="text-[#667085] text-[12px] ">ORDR #12345 you got a 4.2 rating your services on this order</p>
                        <p className="text-[10px] text-[#667085]">20th April, 2025 // 9:23 AM</p>
                    </div>
                    <div className="w-full py-[15px] flex flex-col gap-[8px] px-[20px] h-auto border-[#ededed] border-[0.5px] rounded-[14px]">
                        <p className="text-[#101828] text-[14px] font-semibold">💰 Payout successfully paid</p>
                        <p className="text-[#667085] text-[12px] ">Your pay-out request of NGN 2,000,000.00 has been paid to your account successfully</p>
                        <p className="text-[10px] text-[#667085]">20th April, 2025 // 9:23 AM</p>
                    </div>
                    <div className="w-full py-[15px] flex flex-col gap-[8px] px-[20px] h-auto border-[#ededed] border-[0.5px] rounded-[14px]">
                        <p className="text-[#101828] text-[14px] font-semibold">🔄 System Update or Downtime Notification</p>
                        <p className="text-[#667085] text-[12px] ">🛠️ The platform will be undergoing maintenance at midnight. You may experience brief service interruptions.</p>
                        <p className="text-[10px] text-[#667085]">20th April, 2025 // 9:23 AM</p>
                    </div>
                </div>
            </div>
        </LogisticsCompanyGuard>
    )
}

export default Notifications;