'use client'
import { useRouter } from "next/navigation";
import Image from "next/image";
import farmGoLogo from "../../../../../public/assets/images/farmGoLogo.png";
import arrowLeft from "../../../../../public/assets/images/arrow-right.svg";
import limeArrow from "../../../../../public/assets/images/green arrow.png";
import goodsPack from "../../../../../public/assets/images/goodsPack.png";

const VerifyEmail = () => {
    const router = useRouter();

    const handleClick = () => {
        router.push("/register/userType");
    };

    const handleBack = () => {
        router.push("/register/getStarted");
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Left Panel - Form section */}
            <div className="w-full md:w-2/3 pb-10 z-10 flex flex-col">
                <div className="mt-8 md:mt-16 mx-auto md:mx-0 md:ml-24">
                    <Image src={farmGoLogo} alt="logo" width={90} height={45} />
                </div>

                <div className="px-6 mx-auto md:mx-0 md:ml-52 mt-6 md:mt-10 w-full max-w-[400px]">
                    <div className="flex justify-between items-center">
                        <p className="text-[#022B23] text-sm font-medium">EMAIL VERIFICATION</p>
                        <p className="text-[#022B23] text-sm font-medium">2/3</p>
                    </div>

                    <div className="flex gap-2.5 mt-2">
                        <div className="w-20 h-1.5 bg-[#C6EB5F]"></div>
                        <div className="w-20 h-1.5 bg-[#C6EB5F]"></div>
                        <div className="w-20 h-1.5 bg-[#F0FACD]"></div>
                    </div>

                    <div onClick={handleBack} className="flex items-center mt-4 gap-1 cursor-pointer">
                        <Image src={arrowLeft} alt="arrow" width={24} height={24} />
                        <p className="text-[#7C7C7C] text-[16px]">Go back</p>
                    </div>

                    <div className="mt-10 md:mt-16">
                        <div className="flex flex-col gap-6 md:gap-[38px]">
                            <div className="flex flex-col">
                                <p className="text-[#022B23] font-medium text-[18px] md:text-[20px]">
                                    Kindly verify your mail with the link sent
                                    <br />to your mail address
                                </p>
                                <p className="text-[#1E1E1E] text-[14px] md:text-[16px] font-medium mt-2">
                                    A verification link has been sent to your mail
                                </p>
                            </div>

                            <div
                                onClick={handleClick}
                                className="flex cursor-pointer gap-[9px] justify-center items-center bg-[#022B23] rounded-[12px] h-[52px]"
                            >
                                <p className="text-[#C6EB5F] font-semibold text-[14px]">Go to mail</p>
                                <Image src={limeArrow} alt={'arrow'} width={18} height={18} />
                            </div>

                            <div className="flex w-full flex-col gap-[10px]">
                                <span className="w-full bg-[#ECFDF6] h-[44px] items-center px-[12px] text-[14px] md:text-[16px] font-medium text-[#022B23] rounded-[8px] flex">
                                    terdoopaul@gmail.com
                                </span>
                                <p className="text-[14px] md:text-[16px] text-[#7C7C7C]">
                                    Not your email address? <span className="font-medium underline text-[#022B23] cursor-pointer">Change email address</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Image section - Hidden on mobile */}
            <div className="hidden md:flex md:flex-col bg-[#fffaeb] h-auto w-1/3">
                <div className="flex-col pt-[161px] px-[20px]">
                    <p className="font-medium text-[#461602] text-[20px]">Get started</p>
                    <p className="pt-[10px] text-[#022B23] font-medium text-[24px] leading-tight">
                        Get the best prices from
                        <br />vendors around you
                    </p>
                </div>
                <div className="mt-auto">
                    <Image
                        src={goodsPack}
                        alt={'goods'}
                        className="mt-[80px] w-full"
                        width={600}
                        height={400}
                        priority
                    />
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
