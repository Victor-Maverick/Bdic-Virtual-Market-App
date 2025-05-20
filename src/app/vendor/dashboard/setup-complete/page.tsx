'use client'
import DashboardHeader from "@/components/dashboardHeader";
import DashboardSubHeader from "@/components/dashboardSubHeader";
import Image from "next/image";
import arrow from "../../../../../public/assets/images/arrow-right.svg";
import {useRouter} from "next/navigation";
import limeArrow from "../../../../../public/assets/images/green arrow.png";
import doneImg from '../../../../../public/assets/images/doneImg.png'
import dashSlideImg from "../../../../../public/assets/images/dashSlideImg.png";
import { addShop } from "@/utils/api";
import { useState } from "react";

const SetupComplete = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleContinue = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Get all saved data from localStorage
            const shopInfo = JSON.parse(localStorage.getItem('shopInfo') || '{}');
            const personalInfo = JSON.parse(localStorage.getItem('personalInfo') || '{}');
            const bankInfo = JSON.parse(localStorage.getItem('bankInfo') || '{}');

            // Log what we have from localStorage (for debugging)
            console.log('Shop Info:', shopInfo);
            console.log('Personal Info:', personalInfo);
            console.log('Bank Info:', bankInfo);

            // Validate required fields
            if (!shopInfo.shopName || !personalInfo.NIN || !bankInfo.accountNumber) {
                throw new Error('Missing required information. Please complete all previous steps.');
            }

            // Create FormData object
            const formData = new FormData();

            // Create the DTO object with all required fields matching the expected backend structure
            const dto = {
                name: shopInfo.shopName || '',
                address: shopInfo.shopAddress || '',
                shopNumber: shopInfo.shopNumber || '',
                homeAddress: personalInfo.homeAddress || '',
                streetName: personalInfo.street || '',
                cacNumber: shopInfo.cacNumber || '',
                taxIdNumber: shopInfo.taxIdNumber || '',
                nin: personalInfo.NIN || '',
                bankName: bankInfo.bankName || '',
                accountNumber: bankInfo.accountNumber || '',
                marketId: shopInfo.marketId || 0,
                marketSectionId: shopInfo.marketSectionId || 0,
                userId: parseInt(localStorage.getItem('userId') || '1'), // Convert to number
                statusId: 1, // Assuming 1 is for pending status
            };

            console.log('DTO to be sent:', dto);

            // Append stringified JSON to FormData
            // Important: Make sure this matches exactly what the backend expects
            formData.append('dto', JSON.stringify(dto));

            // Add logo image if available
            if (shopInfo.logoImage) {
                try {
                    // Convert data URL to blob
                    const response = await fetch(shopInfo.logoImage);
                    const blob = await response.blob();

                    // Append blob to FormData with filename - ensure the field name matches backend expectation
                    formData.append('logoImage', blob, 'logo.jpg');
                    console.log('Logo image added to FormData');
                } catch (imageError) {
                    console.error('Error processing logo image:', imageError);
                    // Continue without the image if there's an error
                }
            }

            // Call the API
            const apiResponse = await addShop(formData);
            console.log('Shop added successfully:', apiResponse);

            // Redirect to payment page
            router.push('/vendor/dashboard/payment');
        } catch (error) {
            console.error('Error adding shop:', error);
            setError(error instanceof Error ? error.message : 'Failed to complete setup. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        router.push("/vendor/dashboard/bank-info");
    };

    const returnToShopInfo = () => {
        router.push("/vendor/dashboard/shop-info");
    };

    const returnToPersonalInfo = () => {
        router.push("/vendor/dashboard/personal-info");
    };

    return (
        <>
            <DashboardHeader />
            <DashboardSubHeader
                welcomeText={"Hey, welcome"}
                description={"Get started by setting up your shop"}
                background={'#ECFDF6'}
                image={dashSlideImg}
                textColor={'#05966F'}
            />
            <div className="h-[44px] gap-[8px] border-b-[0.5px] px-25 border-[#ededed] flex items-center">
                <Image src={arrow} alt={'arrow image'} className="cursor-pointer" onClick={handleBack}/>
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
                            Pay a store activation fee<br/>
                            to continue
                        </p>
                        <p className="text-[#000000] font-semibold text-[20px]">
                            NGN 5,000.00
                        </p>
                    </div>

                    {/* Show error message if exists */}
                    {error && (
                        <div className="w-[268px] mt-4 p-3 bg-red-50 border border-red-200 rounded-[12px] text-red-700 text-[14px]">
                            {error}
                        </div>
                    )}
                </div>
                <div className="flex flex-col w-[400px] h-auto gap-[38px]">
                    <div className="flex flex-col items-center h-[218px] w-full justify-center">
                        <Image src={doneImg} alt={'image'}/>
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