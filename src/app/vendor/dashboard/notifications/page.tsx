import DashboardHeader from "@/components/dashboardHeader";
import Image from "next/image";
import iPhone from "../../../../../public/assets/images/blue14.png";
import DashboardOptions from "@/components/dashboardOptions";


const Notifications = ()=>{
    return(
        <>
            <DashboardHeader />
            <DashboardOptions />
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
                           <p className="text-[#101828] text-[14px] font-semibold">✅ Order Confirmation</p>
                           <p className="text-[#667085] text-[12px] mt-[4px]">Your order #12345 has been placed successfully! 🎉 </p>
                           <p className="text-[#667085] text-[12px] mt-[4px]">Thank you for shopping with us.</p>
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
                       <p className="text-[12px] mt-[15px] mb-[8px] text-[#022B23] font-medium">Track order</p>
                   </div>
                    <div className="flex px-[20px] rounded-[14px] py-[15px] h-auto w-full flex-col bg-[#FfFfFf] border-[0.5px] border-[#EDEDED]">
                        <div className="flex flex-col ">
                            <p className="text-[#101828] text-[14px] font-semibold">⚠️ Order delay</p>
                            <p className="text-[#667085] text-[12px] mt-[4px]">We’re sorry! Your order #12345 is experiencing a delay. </p>
                            <p className="text-[#667085] text-[12px] mt-[4px]">We’re working to get it to you ASAP</p>
                        </div>
                        <p className="mt-[10px] text-[10px] text-[#667085]">20th April, 2025 // 9:23 AM</p>
                    </div>
                    <div className="w-full py-[15px] flex flex-col gap-[8px] px-[20px] h-auto border-[#ededed] border-[0.5px] rounded-[14px]">
                        <p className="text-[#101828] text-[14px] font-semibold">✅ Order Delivered</p>
                        <p className="text-[#667085] text-[12px] ">Your order #12345 has been delivered! 🎁 </p>
                        <p className="text-[#667085] text-[12px] ">We hope you enjoy your purchase.</p>
                        <p className="text-[10px] text-[#667085]">20th April, 2025 // 9:23 AM</p>
                    </div>

                    <div className="w-full py-[15px] flex flex-col gap-[8px] px-[20px] h-auto border-[#ededed] border-[0.5px] rounded-[14px]">
                        <p className="text-[#101828] text-[14px] font-semibold">🔄 System Update or Downtime Notification</p>
                        <p className="text-[#667085] text-[12px] ">🛠️ The platform will be undergoing maintenance at midnight. You may experience brief service interruptions.</p>
                        <p className="text-[10px] text-[#667085]">20th April, 2025 // 9:23 AM</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Notifications;