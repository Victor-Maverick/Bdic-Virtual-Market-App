'use client'
import { useState, useEffect } from 'react';
import Image from "next/image";
import farmGoLogo from "../../../../public/assets/images/farmGoLogo.png";
import arrowLeft from "../../../../public/assets/images/arrow-right.svg";
import limeArrow from "../../../../public/assets/images/green arrow.png";
import goodsPack from "../../../../public/assets/images/goodsPack.png";
import envelopeImg from '@/../public/assets/images/envelopeImg.svg';
import { useRouter } from "next/navigation";
import Toast from '@/components/Toast';
import { userService } from '@/services/userService';
import { useTokenVerification } from '@/hooks/useTokenVerification';

const EmailVerification = () => {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [toast, setToast] = useState<{
        show: boolean;
        type: "success" | "error";
        message: string;
        subMessage: string;
    } | null>(null);
    
    // Use token verification hook
    const { verificationStatus, message: verificationMessage } = useTokenVerification();

    useEffect(() => {
        // Get user email from localStorage
        const email = localStorage.getItem('userEmail');
        if (email) {
            setUserEmail(email);
        }
    }, []);

    // Handle verification status changes
    useEffect(() => {
        if (verificationStatus === 'success') {
            setToast({
                show: true,
                type: "success",
                message: "Email Verified",
                subMessage: verificationMessage
            });
            // Redirect to next step after verification
            setTimeout(() => {
                router.push("/register/userType");
            }, 2000);
        } else if (verificationStatus === 'error') {
            setToast({
                show: true,
                type: "error",
                message: "Verification Failed",
                subMessage: verificationMessage
            });
        }
    }, [verificationStatus, verificationMessage, router]);

    const handleClick = () => {
        router.push("/register/userType");
    };

    const handleBack = () => {
        router.push("/register/getStarted");
    };

    const handleResendVerification = async () => {
        if (!userEmail) {
            setToast({
                show: true,
                type: "error",
                message: "Email not found",
                subMessage: "Please go back and register again"
            });
            return;
        }

        setIsResending(true);
        try {
            const result = await userService.resendVerificationEmail(userEmail);
            
            if (result.success) {
                setToast({
                    show: true,
                    type: "success",
                    message: "Email sent",
                    subMessage: "Verification email has been resent to your inbox"
                });
            } else {
                setToast({
                    show: true,
                    type: "error",
                    message: "Resend failed",
                    subMessage: result.message
                });
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setToast({
                show: true,
                type: "error",
                message: "Resend failed",
                subMessage: "Failed to resend verification email"
            });
        } finally {
            setIsResending(false);
        }
    };

    const closeToast = () => {
        setToast(null);
    };
    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    subMessage={toast.subMessage}
                    onClose={closeToast}
                />
            )}
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
                        <div className={`w-20 h-1.5 ${verificationStatus === 'success' ? 'bg-[#C6EB5F]' : 'bg-[#C6EB5F]'}`}></div>
                        <div className={`w-20 h-1.5 ${verificationStatus === 'success' ? 'bg-[#C6EB5F]' : 'bg-[#F0FACD]'}`}></div>
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
                                {verificationStatus === 'verifying' ? (
                                    <>
                                        <p className="text-[#022B23] font-medium text-[18px] md:text-[20px]">
                                            Verifying your email...
                                        </p>
                                        <p className="text-[#1E1E1E] text-[14px] md:text-[16px] font-medium mt-1">
                                            Please wait while we verify your email address
                                        </p>
                                    </>
                                ) : verificationStatus === 'success' ? (
                                    <>
                                        <p className="text-[#22c55e] font-medium text-[18px] md:text-[20px]">
                                            Email verified successfully!
                                        </p>
                                        <p className="text-[#1E1E1E] text-[14px] md:text-[16px] font-medium mt-1">
                                            Redirecting you to the next step...
                                        </p>
                                    </>
                                ) : verificationStatus === 'error' ? (
                                    <>
                                        <p className="text-[#dc2626] font-medium text-[18px] md:text-[20px]">
                                            Verification failed
                                        </p>
                                        <p className="text-[#1E1E1E] text-[14px] md:text-[16px] font-medium mt-1">
                                            {verificationMessage}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-[#022B23] font-medium text-[18px] md:text-[20px]">
                                            Check your email
                                        </p>
                                        <p className="text-[#1E1E1E] text-[14px] md:text-[16px] font-medium mt-1">
                                            We&apos;ve sent a verification link to {userEmail || 'your email'}
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Continue button */}
                            <div
                                onClick={verificationStatus === 'verifying' ? undefined : 
                                        verificationStatus === 'success' ? () => router.push("/register/userType") : handleClick}
                                className={`w-full flex gap-[9px] justify-center items-center rounded-[12px] h-[52px] ${
                                    verificationStatus === 'verifying' 
                                        ? 'bg-[#6b7280] cursor-not-allowed'
                                        : verificationStatus === 'success' 
                                        ? 'bg-[#22c55e] cursor-pointer' 
                                        : verificationStatus === 'error'
                                        ? 'bg-[#dc2626] cursor-pointer'
                                        : 'bg-[#022B23] cursor-pointer'
                                }`}
                            >
                                {verificationStatus === 'verifying' ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <p className={`font-semibold text-[14px] ${
                                            verificationStatus === 'success' || verificationStatus === 'error' 
                                                ? 'text-white' 
                                                : 'text-[#C6EB5F]'
                                        }`}>
                                            {verificationStatus === 'success' ? 'Continue' : 
                                             verificationStatus === 'error' ? 'Try Again' : 
                                             'Continue'}
                                        </p>
                                        <Image
                                            src={limeArrow}
                                            alt="continue arrow"
                                            width={18}
                                            height={18}
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Resend option */}
                        <p className="mt-[10px] md:text-left text-[14px] md:text-[16px] text-[#7C7C7C]">
                            Didn&apos;t receive mail? {' '}
                            <span 
                                onClick={handleResendVerification}
                                className={`font-medium underline text-[#022B23] cursor-pointer ${isResending ? 'opacity-50' : 'hover:text-[#033228]'}`}
                            >
                                {isResending ? 'Sending...' : 'Resend'}
                            </span>
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
