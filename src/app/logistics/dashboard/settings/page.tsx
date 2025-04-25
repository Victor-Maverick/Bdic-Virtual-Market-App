import DashboardHeader from "@/components/dashboardHeader";
import LogisticsDashboardOptions from "@/components/logisticsDashboardOptions";
import Image from "next/image";
import verifiedImg from '@/../public/assets/images/verify.svg'
import blueGradient from '@/../public/assets/images/blueGreenCircle.png'
import locationImg from '@/../public/assets/images/location.png'
import tick from '@/../public/assets/images/tick-circle.svg'
import emptyTick from '@/../public/assets/images/empty-tick.svg'
import clock from '@/../public/assets/images/clock.png'
import rating from '@/../public/assets/images/rating.svg'

const Settings = ()=>{
    return (
        <>
            <DashboardHeader />
            <LogisticsDashboardOptions />
            <div className="flex flex-col px-25 mt-[30px] gap-[40px]">
                <div className="flex flex-col">
                    <p className="text-[18px] font-medium text-[#101828]">Settings</p>
                    <p className="text-[#667085] text-[14px]">Manage your account here</p>
                </div>
                <div className="flex  gap-[30px] mt-[-10px]">

                    <div className="flex flex-col gap-[14px]">
                        <div className="flex flex-col w-[380px] h-[201px] rounded-[24px] border-[1px] border-[#EDEDED]">
                            <div className="border-b-[0.5px] items-center py-[8px] px-[20px] h-[58px] border-[#EDEDED] flex justify-between w-full">
                                <div className="flex gap-[4px] items-center">
                                    <Image src={blueGradient} alt={'image'}/>
                                    <p>Spiff Logistics</p>
                                </div>
                                <div className="flex rounded-[8px] p-[6px] text-[#461602] text-[12px] font-medium items-center gap-[4px]  bg-[#FFEEBE]">
                                    <Image src={verifiedImg} alt={'image'}/>
                                    <p>Verified</p>
                                </div>
                            </div>
                            <div className="px-[21px] text-[14px] text-[#707070] mt-[18px] gap-[4px] flex items-center">
                                <Image src={locationImg} width={18} height={18} alt={'image'}/>
                                <p>No. 22 Aki Plaza Modern market, Makurdi,<br/>
                                    Benue State</p>
                            </div>
                            <div className="flex ml-[40px] mt-[18px] justify-center gap-[4px] p-[6px] items-center text-[#018124] text-[12px] bg-[#EEFFF6] rounded-[100px] w-[72px] h-[32px] ">
                                <Image src={tick} alt={'image'}/>
                                <p>Active</p>
                            </div>
                        </div>
                        <div className="flex flex-col w-[380px] h-[160px] rounded-[12px] border-[1px] border-[#EDEDED]">
                            <span className="text-[#022B23] bg-[#F8F8F8] rounded-tr-[12px] rounded-tl-[12px] text-[12px] py-[10px] px-[8px] h-[40px]">General settings</span>
                            <span className="text-[#022B23] text-[12px] py-[10px] px-[8px] h-[40px]">Team</span>
                            <span className="text-[#022B23] text-[12px] py-[10px] px-[8px] h-[40px]">Security</span>
                            <span className="text-[#022B23] rounded-br-[12px] rounded-bl-[12px] text-[12px] py-[10px] px-[8px] h-[40px]">Notifications</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-[24px] mb-10 w-[900px]">
                        <div className="flex-col flex w-full h-auto rounded-[24px] border-[1px] border-[#EDEDED]">
                            <div className="flex flex-col h-[92px] w-full px-[37px] py-[14px] border-b border-[#ededed]">
                                <p className="text-[#101828] text-[18px] font-medium">General settings</p>
                                <p className="text-[#667085] text-[14px]">View and manage all your settings</p>
                            </div>
                            <div className="flex flex-col h-[77px] w-full px-[37px] py-[14px] leading-tight">
                                <p className="text-[#6A6C6E] text-[14px] ">Full Name</p>
                                <p className="text-[#141415] text-[16px] font-medium">Tordue Francis</p>
                            </div>
                            <div className="flex flex-col h-[77px] w-full px-[37px] py-[14px] leading-tight">
                                <p className="text-[#6A6C6E] text-[14px] ">Company name</p>
                                <p className="text-[#141415] text-[16px] font-medium">View and manage all your settings</p>
                            </div>
                            <div className="flex flex-col h-[77px] w-full px-[37px] py-[14px] leading-tight">
                                <p className="text-[#6A6C6E] text-[14px] ">Phone No</p>
                                <p className="text-[#141415] text-[16px] font-medium">+234 801 2345 678</p>
                            </div>
                            <div className="flex flex-col h-[77px] w-full px-[37px] py-[14px] leading-tight">
                                <p className="text-[#6A6C6E] text-[14px] ">LGA</p>
                                <p className="text-[#141415] text-[16px] font-medium">Makurdi</p>
                            </div>
                            <div className="flex flex-col h-[77px] w-full px-[37px] py-[14px] leading-tight">
                                <p className="text-[#6A6C6E] text-[14px] ">State</p>
                                <p className="text-[#141415] text-[16px] font-medium">Benue</p>
                            </div>
                            <div className="flex h-[77px] gap-[50px] w-full px-[37px] py-[14px] leading-tight">
                                <div className="flex-col flex ">
                                    <p className="text-[#6A6C6E] text-[14px]">Company rating (321)</p>
                                    <div className="flex gap-[2px] items-center">
                                        <Image src={rating} alt={'image'}/>
                                        <p className="text-[#141415] font-medium text-[16px]">4.8</p>
                                    </div>
                                </div>
                                <div className="flex-col flex ">
                                    <p className="text-[#6A6C6E] text-[14px]">Availability</p>
                                    <div className="flex gap-[2px] items-center">
                                        <Image src={emptyTick} alt={'image'}/>
                                        <p className="text-[#141415] font-medium text-[16px]">Yes</p>
                                    </div>
                                </div>
                                <div className="flex-col flex ">
                                    <p className="text-[#6A6C6E] text-[14px]">Work hours</p>
                                    <div className="flex gap-[2px] items-center">
                                        <Image src={clock} alt={'image'} width={18} height={18}/>
                                        <p className="text-[#141415] font-medium text-[16px]">7:00am-9:00pm</p>
                                    </div>
                                </div>
                                                            </div>
                            <div className="flex flex-col h-[77px] w-full px-[37px] py-[14px] leading-tight">
                                <p className="text-[#6A6C6E] text-[14px] ">Orders delivered</p>
                                <p className="text-[#141415] text-[16px] font-medium">128 successful orders</p>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Settings;