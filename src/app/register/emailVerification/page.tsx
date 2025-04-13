'use client'
import Image from "next/image";
import farmGoLogo from "../../../../public/assets/images/farmGoLogo.png";
import arrowLeft from "../../../../public/assets/images/arrow-right.svg";
import limeArrow from "../../../../public/assets/images/green arrow.png";
import goodsPack from "../../../../public/assets/images/goodsPack.png";
import { useRouter } from "next/navigation";
import envelopeImg from '@/../public/assets/images/envelopeImg.svg'

const EmailVerification = () => {
    const router = useRouter();

    const handleClick = ()=>{
        router.push("/register/userType");
    }
    return (
        <div className="flex">
            <div className="pb-10 z-10 w-2/3 flex-col space-y-2.5">
                <Image src={farmGoLogo} alt="logo" className="mt-16 ml-24" />

                <div className="ml-52 mt-10 w-[400px]">
                    <div className="flex justify-between items-center">
                        <p className="text-[#022B23] text-sm font-medium">EMAIL VERIFICATION</p>
                        <p className="text-[#022B23] text-sm font-medium">2/3</p>
                    </div>
                    <div className="flex gap-2.5">
                        <div className="w-20 h-1.5 bg-[#C6EB5F]"></div>
                        <div className="w-20 h-1.5 bg-[#C6EB5F]"></div>
                        <div className="w-20 h-1.5 bg-[#F0FACD]"></div>
                    </div>

                    <div className="flex items-center mt-4 gap-1">
                        <Image src={arrowLeft} alt="arrow" />
                        <p className="text-[#7C7C7C] text-lg">Go back</p>
                    </div>

                    <div className="mt-16">
                        <div className="flex flex-col gap-[38px]">
                            <Image src={envelopeImg} alt={'image'} width={130} height={130}/>
                            <div className="flex flex-col ">
                                <p className="text-[#022B23] font-medium text-[20px]">Mail verified successfully</p>
                                <p className="text-[#1E1E1E] text-[16px] font-medium">Your email address has been verified successfully</p>
                            </div>
                            <div onClick={handleClick} className="flex  cursor-pointer gap-[9px] justify-center items-center bg-[#022B23] rounded-[12px] h-[52px]">
                                <p className="text-[#C6EB5F] font-semibold text-[14px]">Verify and continue</p>
                                <Image src={limeArrow} alt={'image'} className="h-[18px] w-[18px]"/>
                            </div>
                        </div>

                        <p className="mt-[10px] text-[16px] text-[#7C7C7C]">Didn&apos;t receive mail? <span className="font-medium underline  text-[#022B23]">Resend</span></p>
                    </div>
                </div>
            </div>
            <div className="flex-col bg-[#fffaeb] h-auto w-1/3">
                <div className="flex-col pt-[161px] px-[20px]">
                    <p className="font-medium text-[#461602] text-[20px]">Get started</p>
                    <p className="pt-[10px] text-[#022B23] font-medium text-[24px] leading-tight">Get the best prices from
                        <br/>vendors around you</p>
                </div>
                <Image src={goodsPack} alt={'goods'} className="mt-[80px] w-[600px]"/>
            </div>
        </div>
    );
};

export default EmailVerification;
