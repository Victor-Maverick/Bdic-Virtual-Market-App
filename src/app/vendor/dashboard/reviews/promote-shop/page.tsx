'use client'
import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import DashboardHeader from "@/components/dashboardHeader";
import DashboardOptions from "@/components/dashboardOptions";
import arrowBack from '@/../public/assets/images/arrow-right.svg'
import crownImg from '@/../public/assets/images/crown.svg'
import gradient1 from '@/../public/assets/images/promote gradient 1.svg'
import gradient2 from '@/../public/assets/images/promote gradient 2.svg'
import gradient3 from '@/../public/assets/images/promote gradient 3.png'
import greenTick from '@/../public/assets/images/promote checkmark.svg'
import arrowRight from '@/../public/assets/images/grey right arrow.png'
import limeArrow from '@/../public/assets/images/green arrow.png'
import PayoutRequestSuccessModal from "@/components/payoutRequestSuccessModal";

type Tier = {
    id: 'basic' | 'premium' | 'platinum';
    name: string;
    price: string;
    description: string;
    benefits: string[];
    gradient: StaticImageData;
    campaignTime: string;
    customers: string;
    reach?: string;
    clicks?: string;
    converted?: string;
};

const TIERS: Tier[] = [
    {
        id: 'basic',
        name: 'Basic tier',
        price: 'NGN 7,000.00',
        description: 'Boost your shop to the top and get more customers to visit and purchase from your shop',
        benefits: [
            '7 days active ranking',
            'Get Discovered by 500+ customers'
        ],
        gradient: gradient1,
        campaignTime: '7 days softer seating',
        customers: 'Get Discounted by 500+ customers',
        reach: '1.2K',
        clicks: '1.2K',
        converted: '92'
    },
    {
        id: 'premium',
        name: 'Premium tier',
        price: 'NGN 12,000.00',
        description: 'Boost your shop to the top and get more customers to visit and purchase from your shop',
        benefits: [
            '28 days active ranking',
            'Get Discovered by 6000+ customers'
        ],
        gradient: gradient2,
        campaignTime: '16 days softer seating',
        customers: 'Get Discounted by 3000+ customers'
    },
    {
        id: 'platinum',
        name: 'Platinum tier',
        price: 'NGN 25,000.00',
        description: 'Boost your shop to the top and get more customers to visit and purchase from your shop',
        benefits: [
            '28 days active ranking',
            'Get Discovered by 6000+ customers'
        ],
        gradient: gradient3,
        campaignTime: '16 days softer seating',
        customers: 'Get Discounted by 9000+ customers'
    }
];

const CURRENTLY_RUNNING_TIER = 'basic';

const PromoteShop = () => {
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [selectedTierInModal, setSelectedTierInModal] = useState<Tier>(TIERS[0]);

    const handleUpgradeClick = () => {
        setShowUpgradeModal(true);
        setSelectedTierInModal(TIERS[0]); // Set basic tier as default
    };

    const closeModal = () => {
        setShowUpgradeModal(false);
    };

    const handleTierSelectInModal = (tier: Tier) => {
        setSelectedTierInModal(tier);
    };

    return (
        <>
            <DashboardHeader />
            <DashboardOptions />

            <div className="flex flex-col py-[10px] px-25 relative">
                {/* Navigation Tabs */}
                <div className="w-[359px] h-[52px] gap-[24px] flex items-end">
                    <p className="py-2 text-[#11151F] cursor-pointer text-[14px] font-medium border-b-2 border-[#C6EB5F]">
                        Reviews & campaigns
                    </p>
                    <p className="py-2 cursor-pointer text-[14px] text-gray-500">
                        Coupons
                    </p>
                </div>

                {/* Back Button */}
                <div className="flex gap-[8px] mt-[15px] text-[#1E1E1E] text-[14px] font-medium items-center">
                    <Image src={arrowBack} alt="Back arrow" width={18} height={18} className="cursor-pointer"/>
                    <p className="cursor-pointer">Back to reviews and campaigns</p>
                </div>

                {/* Header Section */}
                <div className="flex flex-col h-[92px] w-full mt-[20px] pb-[20px]">
                    <p className="text-[#101828] text-[18px] font-medium">Promote shop</p>
                    <p className="text-[#667085] text-[14px]">
                        Boost your shop to the top and get more <br/>customers to visit and purchase from your shop
                    </p>
                </div>

                {/* Current Tier Section */}
                <CurrentTierSection
                    tier={TIERS.find(tier => tier.id === CURRENTLY_RUNNING_TIER)!}
                    onUpgradeClick={handleUpgradeClick}
                />

                {/* Campaign Tiers Section - Removed individual tier click handlers */}
                <div className="flex flex-col h-[388px] mt-[30px] gap-[24px]">
                    <p className="text-[#022B23] text-[16px] font-medium">Campaign Tiers (3)</p>
                    <div className="flex h-[345px] w-full justify-between">
                        {TIERS.map((tier) => (
                            <TierCard
                                key={tier.id}
                                tier={tier}
                            />
                        ))}
                    </div>
                </div>

                {/* Upgrade Modal */}
                {showUpgradeModal && (
                    <UpgradeModal
                        tiers={TIERS}
                        selectedTier={selectedTierInModal}
                        onTierSelect={handleTierSelectInModal}
                        onClose={closeModal}
                    />
                )}
            </div>
        </>
    );
};

const CurrentTierSection = ({ tier, onUpgradeClick }: { tier: Tier; onUpgradeClick: () => void }) => (
    <div className="flex flex-col h-[290px] w-full rounded-[24px] border border-[#EDEDED] p-[20px]">
        <div className="flex justify-between items-center h-[92px] border-b-[0.5px] border-[#EDEDED]">
            <div className="flex flex-col text-[14px] gap-[4px]">
                <p className="text-[#101828] font-medium">{tier.name}</p>
                <p className="text-[#667085] leading-tight">
                    Reach your customers on the basic tier and enjoy <br/>all benefits
                </p>
            </div>
            <span className="w-[145px] text-[#07A341] text-[14px] font-medium flex items-center justify-center h-[44px] rounded-[100px] bg-[#ECFDF6] border border-[#22C55E]">
        Currently running
      </span>
        </div>
        <div className="h-[68px] flex items-center border-b-[0.5px] border-[#EDEDED]">
            <StatItem label="Reach" value={tier.reach || 'N/A'} />
            <StatItem label="Clicks" value={tier.clicks || 'N/A'} />
            <StatItem label="Converted" value={tier.converted || 'N/A'} />
        </div>
        <button
            onClick={onUpgradeClick}
            className="flex items-center justify-center gap-[9px] text-[14px] text-[#C6EB5F] font-semibold w-[174px] rounded-[12px] mt-[28px] bg-[#022B23] h-[52px]"
        >
            <p>Upgrade</p>
            <Image src={crownImg} alt="Crown icon"/>
        </button>
    </div>
);

const StatItem = ({ label, value }: { label: string; value: string }) => (
    <div className="w-[133px] px-[10px] h-[52px] text-[14px] flex flex-col gap-[4px] border-r-[0.5px] border-[#EDEDED]">
        <p className="text-[#667085]">{label}</p>
        <p className="text-[#101828] font-medium">{value}</p>
    </div>
);

const TierCard = ({ tier }: { tier: Tier }) => (
    <div className="h-full w-[380px] flex flex-col items-center border-[0.5px] rounded-[24px] border-[#EDEDED]">
        <Image
            src={tier.gradient}
            alt={`${tier.name} gradient`}
            className="h-[112px] rounded-tr-[24px] rounded-tl-[24px] w-full"
        />
        <div className="w-[334px] h-[198px] mt-[10px] flex flex-col gap-[20px]">
            <div className="flex flex-col gap-[8px]">
                <div className="flex text-[16px] font-semibold text-[#101828] justify-between">
                    <p>{tier.name}</p>
                    <p>{tier.price}</p>
                </div>
                <p className="text-[12px] font-medium text-[#667085]">
                    {tier.description}
                </p>
            </div>
            <div className="flex flex-col gap-[14px]">
                {tier.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-[4px] text-[12px] text-[#1E1E1E] font-medium">
                        <Image src={greenTick} alt="Green tick icon"/>
                        <p>{benefit}</p>
                    </div>
                ))}
            </div>
            <div className="flex text-[14px] text-[#1E1E1E] font-medium gap-[8px] items-center">
                <p>Subscribe now</p>
                <Image src={arrowRight} alt="Right arrow" width={20} height={20}/>
            </div>
        </div>
    </div>
);


const UpgradeModal = ({
                          tiers,
                          selectedTier,
                          onTierSelect,
                          onClose
                      }: {
    tiers: Tier[];
    selectedTier: Tier;
    onTierSelect: (tier: Tier) => void;
    onClose: () => void;
}) => {
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const handlePayoutRequestSuccess = () => {
        setIsSuccessModalOpen(true);
    };

    const handleCloseSuccessModal = () => {
        setIsSuccessModalOpen(false);
    };

    return(
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#808080]/20">
                <div className="relative z-10 bg-white w-[1100px] mx-4 px-[60px] py-[30px] shadow-lg">
                    <div className="flex flex-col pb-2  border-b-[0.5px] border-[#EDEDED]">
                        <p className="text-[#022B23] text-[16px] font-medium">Promote shop payment</p>
                        <p className="text-[#707070] text-[14px] font-medium">Pay for your preferred tier to help your business rank better</p>
                    </div>

                    <div className="flex ">
                        {/* Tier Selection Panel */}
                        <div className="w-[40%]">
                            <h3 className="text-[#101828] text-[16px] mt-[4px] font-medium mb-2">Campaign Tiers ({tiers.length})</h3>
                            <div className=" w-[325px] max-h-[80vh]  flex flex-col gap-[10px]">
                                {tiers.map((tier) => (
                                    <div
                                        key={tier.id}
                                        className={`p-3 rounded-[24px] w-full h-[140px] cursor-pointer border ${
                                            selectedTier.id === tier.id
                                                ? 'border-[#C6EB5F]  h-[170px] shadow-md relative'
                                                : 'border-[#EDEDED] h-[140px]'
                                        }`}
                                        onClick={() => onTierSelect(tier)}
                                    >
                                        <div className="flex justify-between text-[12px] items-center mb-2">
                                            <h4 className="text-[#101828] font-medium">{tier.name}</h4>
                                            <p className="text-[#101828] font-semibold">{tier.price}</p>
                                        </div>
                                        <p className="text-[#667085] text-[12px] leading-tight mb-2">{tier.description}</p>
                                        <div className="flex flex-col gap-[8px]">
                                            {tier.benefits.map((benefit, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-[4px] text-[12px] text-[#1E1E1E] font-medium"
                                                >
                                                    <Image src={greenTick} alt="Green tick icon" />
                                                    <p>{benefit}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {selectedTier.id === tier.id && (
                                            <div className="absolute bottom-0 left-0 right-0 text-center text-[#1E1E1E] font-medium text-[12px] bg-[#C6EB5F] rounded-b-[12px] h-[24px] flex items-center justify-center">
                                                Selected tier
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tier Details Panel */}
                        <div className="w-[60%] flex flex-col gap-[20px] pl-[50px] pt-[24px] pb-[2px] border-l border-[#EDEDED]">
                            <p className="text-[#022B23] text-[16px] font-medium">Tier details</p>

                            <div className="flex flex-col gap-[8px] pb-[24px] border-b-[0.5px] border-[#ededed]">
                                <div className="flex justify-between items-center">
                                    <p className="text-[14px] text-[#707070] font-medium">Order date</p>
                                    <p className="text-[14px] text-[#000000] font-medium">4th April, 2025</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[14px] text-[#707070] font-medium">Order time</p>
                                    <p className="text-[14px] text-[#000000] font-medium">02:32:00 PM</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[14px] text-[#707070] font-medium">Order amount</p>
                                    <p className="text-[14px] text-[#000000] font-medium">{selectedTier.price}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[14px] text-[#707070] font-medium">Tier</p>
                                    <p className="text-[14px] text-[#000000] font-medium">{selectedTier.name}</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-[8px] mb-[24px]">
                                <div className="flex justify-between items-center">
                                    <p className="text-[14px] text-[#707070] font-medium">Shop name</p>
                                    <p className="text-[14px] text-[#000000] font-medium">Abba technologies</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[14px] text-[#707070] font-medium">Vendor</p>
                                    <p className="text-[14px] text-[#000000] font-medium">Abba Tersoo</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[14px] text-[#707070] font-medium">Email</p>
                                    <p className="text-[14px] text-[#000000] font-medium">abbatersoo@gmail.com</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[14px] text-[#707070] font-medium">Phone</p>
                                    <p className="text-[14px] text-[#000000] font-medium">+234 801 2345 678</p>
                                </div>
                            </div>

                            <div className="flex gap-[10px] justify-end mt-8">
                                <div
                                    onClick={onClose}
                                    className="justify-center  w-[116px] h-[52px] text-[#707070] flex items-center text-[16px] font-medium border border-[#707070] rounded-[12px] "
                                >
                                    <p>Cancel</p>
                                </div>
                                <div

                                    onClick={()=> {
                                        handlePayoutRequestSuccess()
                                    }}
                                    className="flex items-center justify-center gap-[8px] w-[179px] h-[52px] bg-[#022B23] text-[#C6EB5F] rounded-[12px] text-[14px] font-semibold"
                                >
                                    <p>Make payment</p>
                                    <Image src={limeArrow} alt={'image'}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <PayoutRequestSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={handleCloseSuccessModal}
            />
        </>


    );
}

export default PromoteShop;