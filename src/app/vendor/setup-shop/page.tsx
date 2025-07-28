'use client'
import Image from "next/image";
import DashboardHeader from "@/components/dashboardHeader";
import arrow from '../../../../public/assets/images/dashArrow.png'
import vendorStarterPack from '../../../../public/assets/images/starterPack.png'
import limeArrow from "../../../../public/assets/images/green arrow.png";
import DashboardSubHeader from "@/components/dashboardSubHeader";
import DashboardOptions from "@/components/dashboardOptions";
import dashSlideImg from "../../../../public/assets/images/dashSlideImg.png";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import BackButton from "@/components/BackButton";

const DashBoard = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const handleContinue =()=>{
        router.push("/vendor/setup-shop/shop-info");
    }

    if (!session) {
        router.push("/login");
        return null;
    }
    return (
        <div className="w-full pb-25 ">
            <DashboardHeader/>
            <DashboardOptions/>
            <DashboardSubHeader welcomeText={"Hey, welcome"} description={"Get started by setting up your shop"}
                                background={'#ECFDF6'} image={dashSlideImg} textColor={'#05966F'} />
            <div className="px-25 py-4">
                <BackButton variant="default" text="Back to Dashboard" />
            </div>
            <div className="h-[65px] bg-[#1E1E1E] px-25  flex items-center justify-between py-[12px]">
                <div className="flex-col">
                    <p className="text-[16px] text-[#FFFFFF] font-medium">KYC</p>
                    <p className="text-[14px] font-normal text-[#FFFFFF]">Vendor and shop KYC</p>
                </div>
                <div className="flex gap-[8px] items-center">
                    <p className="text-[#FFEEBE] text-[14px]">Complete KYC</p>
                    <Image src={arrow} alt={'arrow'}/>
                </div>
            </div>
            <div className="flex flex-col justify-start items-center">
                <div className="mt-[120px] w-[268px] flex-col flex items-center text-center justify-center">
                    <Image src={vendorStarterPack} alt={'pack'}/>
                    <div>
                        <p className="mb-[10px] text-[16px] text-[#022B23] font-medium">Setup shop and complete KYC </p>
                        <p className="font-medium text-[#707070] text-[14px]">Provide information about your shop <br/>and yourself to complete setup</p>
                    </div>
                    <div  onClick={handleContinue} className="flex cursor-pointer mt-[35px] gap-[9px] w-[268px] justify-center items-center bg-[#022B23] rounded-[12px] h-[52px]">
                        <p className="text-[#C6EB5F] font-semibold text-[14px]">Setup shop</p>
                        <Image src={limeArrow} alt={'image'} className="h-[18px] w-[18px]"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashBoard;
