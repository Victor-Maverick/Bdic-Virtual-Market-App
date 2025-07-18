'use client'
import Image from "next/image";
import farmGoLogo from "../../../../public/assets/images/farmGoLogo.png";
import arrowLeft from "../../../../public/assets/images/arrow-right.svg";
import limeArrow from "../../../../public/assets/images/green arrow.png";
import goodsPack from "../../../../public/assets/images/goodsPack.png";
import envelopeImg from '@/../public/assets/images/envelopeImg.svg';
import { useRouter } from "next/navigation";

const EmailVerification = () => {
    const router = useRouter();

    const handleClick = () => {
        router.push("/register/userType");
    };

    const handleBack = () => {
        router.push("/register/getStarted");
    };
    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Left Panel - Main content */}
            <div className="w-full md:w-2/3 pb-10 z-10 flex flex-col">
                {/* Logo */}
                <div className="mt-8 md:mt-16 ml-[20px] mx-auto md:mx-0 md:ml-24">
                    <Image src={farmGoLogo} alt="logo" width={90} height={45} />
                </div>

                {/* Main content container */}
                <div className="px-6 mx-auto md:mx-0 md:ml-52 mt-6 md:mt-10 w-full max-w-[400px]">
                    {/* Progress indicator */}
                    <div className="flex justify-between items-center">
                        <p className="text-[#022B23] text-sm font-medium">EMAIL VERIFICATION</p>
                        <p className="text-[#022B23] text-sm font-medium">2/3</p>
                    </div>

                    <div className="flex gap-2.5 mt-2">
                        <div className="w-20 h-1.5 bg-[#C6EB5F]"></div>
                        <div className="w-20 h-1.5 bg-[#C6EB5F]"></div>
                        <div className="w-20 h-1.5 bg-[#F0FACD]"></div>
                    </div>

                    {/* Back button */}
                    <div onClick={handleBack} className="flex items-center mt-4 gap-1 cursor-pointer">
                        <Image src={arrowLeft} alt="arrow" width={24} height={24} />
                        <p className="text-[#7C7C7C] text-[16px]">Go back</p>
                    </div>

                    {/* Verification content */}
                    <div className="mt-10 md:mt-16">
                        <div className="flex flex-col items-center md:items-start gap-6 md:gap-[38px]">
                            {/* Envelope image */}
                            <div className="flex justify-center w-full md:justify-start">
                                <Image
                                    src={envelopeImg}
                                    alt="verification envelope"
                                    width={110}
                                    height={110}
                                    className="md:w-[130px] md:h-[130px]"
                                />
                            </div>

                            {/* Verification text */}
                            <div className="flex flex-col md:text-left">
                                <p className="text-[#022B23] font-medium text-[18px] md:text-[20px]">
                                    Mail verified successfully
                                </p>
                                <p className="text-[#1E1E1E] text-[14px] md:text-[16px] font-medium mt-1">
                                    Your email address has been verified successfully
                                </p>
                            </div>

                            {/* Continue button */}
                            <div
                                onClick={handleClick}
                                className="w-full flex cursor-pointer gap-[9px] justify-center items-center bg-[#022B23] rounded-[12px] h-[52px]"
                            >
                                <p className="text-[#C6EB5F] font-semibold text-[14px]">Verify and continue</p>
                                <Image
                                    src={limeArrow}
                                    alt="continue arrow"
                                    width={18}
                                    height={18}
                                />
                            </div>
                        </div>

                        {/* Resend option */}
                        <p className="mt-[10px] md:text-left text-[14px] md:text-[16px] text-[#7C7C7C]">
                            Didn&apos;t receive mail? <span className="font-medium underline text-[#022B23] cursor-pointer">Resend</span>
                        </p>
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
                        alt="goods package"
                        width={600}
                        height={400}
                        className="mt-[80px] w-full"
                        priority
                    />
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;
