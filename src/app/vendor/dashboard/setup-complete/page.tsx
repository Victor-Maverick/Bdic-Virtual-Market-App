'use client'
import DashboardHeader from "@/components/dashboardHeader";
import DashboardSubHeader from "@/components/dashboardSubHeader";
import Image from "next/image";
import arrow from "../../../../../public/assets/images/arrow-left.png";
import {useRouter} from "next/navigation";
import limeArrow from "../../../../../public/assets/images/green arrow.png";
import doneImg from '../../../../../public/assets/images/doneImg.png'
import dashSlideImg from "../../../../../public/assets/images/dashSlideImg.png";

const SetupComplete = ()=>{
    const router = useRouter();


    const handleContinue = () => {
        router.push('/vendor/dashboard/bank-info');
    };
    const handleBack = ()=>{
        router.push("/vendor/dashboard/personal-info");
    }
    const returnToShoInfo =()=>{
        router.push("/vendor/dashboard/shop-info");
    }
    const returnToBankDetails = ()=>{
        router.push("/vendor/dashboard/bank-info");
    }

    return(
        <>
            <DashboardHeader />
            <DashboardSubHeader welcomeText={"Hey, welcome"} description={"Get started by setting up your shop"}
                                background={'#ECFDF6'} image={dashSlideImg} textColor={'#05966F'} />            <div className="h-[44px] gap-[8px] border-b-[0.5px] px-25 border-[#ededed] flex items-center">
                <Image src={arrow} alt={'arrow image'} className="cursor-pointer" onClick={handleBack}/>
                <p className="text-[14px] font-normal">
                    <span className="cursor-pointer" onClick={returnToShoInfo}>Shop information //</span> <span className="cursor-pointer" onClick={handleBack}>Vendor information //</span>
                    <span className="cursor-pointer" onClick={returnToBankDetails}> Bank Details //</span>
                    <span className="cursor-pointer font-medium"> Complete</span>
                </p>
            </div>
            <div className="flex ml-[366px] w-auto mt-16 gap-25">
                <div className="flex flex-col w-[268px] h-[67px] gap-[10px]">
                    <p className="text-[#022B23] text-[16px] font-medium">Setup complete</p>
                    <p className="text-[#707070] font-medium text-[14px]">
                        Your setup is complete and pending approval, you’ll be notified when approved.
                    </p>
                </div>
                <div className="flex flex-col w-[400px] h-auto gap-[38px]">
                    <div className="flex flex-col items-center h-[218px] w-full justify-center">
                        <Image src={doneImg} alt={'image'}/>
                    </div>
                    <div
                        className="flex mb-[20px] gap-[9px] justify-center items-center bg-[#022B23] rounded-[12px] h-[52px] cursor-pointer hover:bg-[#033a30] transition-colors"
                        onClick={handleContinue}
                    >
                        <p className="text-[#C6EB5F] font-semibold text-[14px]">Continue to store</p>
                        <Image src={limeArrow} alt="Continue arrow" width={18} height={18} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default SetupComplete;