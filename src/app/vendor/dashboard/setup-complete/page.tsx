'use client';
import DashboardHeader from "@/components/dashboardHeader";
import DashboardSubHeader from "@/components/dashboardSubHeader";
import Image from "next/image";
import arrow from "../../../../../public/assets/images/arrow-right.svg";
import limeArrow from "../../../../../public/assets/images/green arrow.png";
import doneImg from "../../../../../public/assets/images/doneImg.png";
import dashSlideImg from "../../../../../public/assets/images/dashSlideImg.png";
import { addShop } from "@/utils/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SetupComplete = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleContinue = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const dto = JSON.parse(localStorage.getItem('dto') || '{}');
            const logoImage = localStorage.getItem('logoImage');



            const formData = new FormData();

            // Append plain dto object as-is (assuming backend accepts JSON object via FormData)
            formData.append('dto', JSON.stringify(dto));

            // Append logo image if available (assuming it's stored as a Blob URL or file data in localStorage)
            if (logoImage) {

                formData.append('logoImage', logoImage);
            }

            // Send to API
            const apiResponse = await addShop(formData);
            console.log('Shop added successfully:', apiResponse);

            router.push('/vendor/dashboard/payment');
        } catch (error) {
            console.error('Error submitting form:', error);
            setError(error instanceof Error ? error.message : 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => router.push("/vendor/dashboard/bank-info");
    const returnToShopInfo = () => router.push("/vendor/dashboard/shop-info");
    const returnToPersonalInfo = () => router.push("/vendor/dashboard/personal-info");

    return (
        <>
            <DashboardHeader />
            <DashboardSubHeader
                welcomeText="Hey, welcome"
                description="Get started by setting up your shop"
                background="#ECFDF6"
                image={dashSlideImg}
                textColor="#05966F"
            />
            <div className="h-[44px] gap-[8px] border-b-[0.5px] px-25 border-[#ededed] flex items-center">
                <Image src={arrow} alt="arrow image" className="cursor-pointer" onClick={handleBack} />
                <p className="text-[14px] font-normal">
                    <span className="cursor-pointer" onClick={returnToShopInfo}>Shop information //</span>
                    <span className="cursor-pointer" onClick={returnToPersonalInfo}> Vendor information //</span>
                    <span className="cursor-pointer" onClick={handleBack}> Bank Details //</span>
                    <span className="cursor-pointer font-medium"> Complete</span>
                </p>
            </div>
            <div className="flex ml-[366px] w-auto mt-16 gap-25">
                <div className="flex flex-col gap-15 h-auto">
                    <div className="flex flex-col w-[268px] h-[67px] gap-[10px]">
                        <p className="text-[#022B23] text-[16px] font-medium">Setup complete</p>
                        <p className="text-[#707070] font-medium text-[14px]">
                            Your setup is complete and pending approval, you&#39;ll be notified when approved.
                        </p>
                    </div>
                    <div className="flex flex-col w-[244px] py-[10px] px-[12px] border border-[#ededed] h-[87px] bg-[#FCFCFC] rounded-[12px] gap-[7px]">
                        <p className="text-[#707070] text-[14px] font-medium leading-tight">
                            Pay a store activation fee<br />
                            to continue
                        </p>
                        <p className="text-[#000000] font-semibold text-[20px]">
                            NGN 5,000.00
                        </p>
                    </div>
                    {error && (
                        <div className="w-[268px] mt-4 p-3 bg-red-50 border border-red-200 rounded-[12px] text-red-700 text-[14px]">
                            {error}
                        </div>
                    )}
                </div>
                <div className="flex flex-col w-[400px] h-auto gap-[38px]">
                    <div className="flex flex-col items-center h-[218px] w-full justify-center">
                        <Image src={doneImg} alt="setup complete image" />
                    </div>
                    <button
                        className={`flex mb-[20px] gap-[9px] justify-center items-center bg-[#022B23] rounded-[12px] h-[52px] cursor-pointer hover:bg-[#033a30] transition-colors w-full ${
                            isLoading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                        onClick={handleContinue}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <p className="text-[#C6EB5F] font-semibold text-[14px]">Processing...</p>
                            </div>
                        ) : (
                            <>
                                <p className="text-[#C6EB5F] font-semibold text-[14px]">Continue to payment</p>
                                <Image src={limeArrow} alt="Continue arrow" width={18} height={18} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
};

export default SetupComplete;
