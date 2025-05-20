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

const SetupComplete = () => {
    const router = useRouter();

    const handleContinue = async () => {
        try {
            // Get all saved data from localStorage
            const shopInfo = JSON.parse(localStorage.getItem('shopInfo') || '{}');
            const personalInfo = JSON.parse(localStorage.getItem('personalInfo') || '{}');
            const bankInfo = JSON.parse(localStorage.getItem('bankInfo') || '{}');

            // Prepare FormData for the API call
            const formData = new FormData();

            // Add shop info
            formData.append('dto', JSON.stringify({
                name: shopInfo.shopName,
                address: shopInfo.shopAddress,
                shopNumber: shopInfo.shopNumber,
                homeAddress: personalInfo.homeAddress,
                streetName: personalInfo.street,
                cacNumber: shopInfo.cacNumber,
                taxIdNumber: shopInfo.taxIdNumber,
                nin: personalInfo.NIN,
                bankName: bankInfo.bankName,
                accountNumber: bankInfo.accountNumber,
                marketId: shopInfo.marketId,
                marketSectionId: shopInfo.marketSectionId,
                userId: 1, // This should be the actual user ID from your auth system
                statusId: 1, // Assuming 1 is for pending status
            }));

            // Add logo image if available
            if (shopInfo.logoImage) {
                // Convert data URL to blob
                const blob = await fetch(shopInfo.logoImage).then(res => res.blob());
                formData.append('logoImage', blob, 'logo.jpg');
            }

            // Call the API
            const response = await addShop(formData);
            console.log('Shop added successfully:', response);

            // Redirect to payment or dashboard
            router.push('/vendor/dashboard/payment');
        } catch (error) {
            console.error('Error adding shop:', error);
            alert('Failed to complete setup. Please try again.');
        }
    };

    const handleBack = () => {
        router.push("/vendor/dashboard/personal-info");
    };

    const returnToShoInfo = () => {
        router.push("/vendor/dashboard/shop-info");
    };

    const returnToBankDetails = () => {
        router.push("/vendor/dashboard/bank-info");
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
                    <span className="cursor-pointer" onClick={returnToShoInfo}>Shop information //</span>
                    <span className="cursor-pointer" onClick={handleBack}> Vendor information //</span>
                    <span className="cursor-pointer" onClick={returnToBankDetails}> Bank Details //</span>
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
                </div>
                <div className="flex flex-col w-[400px] h-auto gap-[38px]">
                    <div className="flex flex-col items-center h-[218px] w-full justify-center">
                        <Image src={doneImg} alt={'image'}/>
                    </div>
                    <div
                        className="flex mb-[20px] gap-[9px] justify-center items-center bg-[#022B23] rounded-[12px] h-[52px] cursor-pointer hover:bg-[#033a30] transition-colors"
                        onClick={handleContinue}
                    >
                        <p className="text-[#C6EB5F] font-semibold text-[14px]">Continue to payment</p>
                        <Image src={limeArrow} alt="Continue arrow" width={18} height={18} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default SetupComplete;