'use client';
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import farmGoLogo from "../../../../public/assets/images/farmGoLogo.png";
import arrowLeft from "../../../../public/assets/images/arrow-right.svg";
import shop from "../../../../public/assets/images/shop.svg";
import profileCirle from '../../../../public/assets/images/profile-circle.svg';
import logCar from '../../../../public/assets/images/logCar.png';
import limeArrow from "../../../../public/assets/images/green arrow.png";
import threeImages from '../../../../public/assets/images/threeImages.png';
import greenTick from '@/../public/assets/images/greentick.svg';
import greyTick from '@/../public/assets/images/greytick.svg';



type UserTypeOption = 'buyer' | 'seller' | 'logistics';


const UserType = () => {
    const router = useRouter();
    const [selectedUserType, setSelectedUserType] = useState<UserTypeOption | null>(null);

    const handleClick = () => {
        if (selectedUserType) {
            switch (selectedUserType) {
                case 'buyer':
                    router.push("/welcome/buyer");
                    break;
                case 'seller':
                    router.push("/welcome/vendor");
                    break;
                case 'logistics':
                    router.push("/welcome/logistics");
                    break;
                default:
                    router.push("/welcome");
            }
        }
    };

    const handleBack = () => {
        router.push("/register/emailVerification");
    };

    const handleUserTypeSelect = (type: UserTypeOption) => {
        setSelectedUserType(type);
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Form */}
            <div className="w-full px-[20px] md:w-[65%] pb-[65px] z-10  flex flex-col">
                <Image
                    src={farmGoLogo}
                    alt="FarmGo logo"
                    className="mt-[60px] ml-[102px]"
                    width={90}
                    height={45}
                />

                <div className="mt-[40px] w-full md:w-[400px] md:ml-[204px]">
                    <div className="flex justify-between items-center">
                        <p className="text-[#022B23] text-[14px] font-medium">ACCOUNT SETUP</p>
                        <p className="text-[#022B23] text-[14px] font-medium">3/3</p>
                    </div>
                    <div className="flex mt-[10px] gap-[10px]">
                        {[1, 2, 3].map((step) => (
                            <div
                                key={step}
                                className={`w-[80px] h-[6px] ${step <= 3 ? 'bg-[#C6EB5F]' : 'bg-[#F0FACD]'}`}
                            />
                        ))}
                    </div>

                    <div onClick={handleBack} className="flex items-center mt-4 gap-1 ">
                        <Image src={arrowLeft} alt="Back arrow" width={24} height={24} />
                        <p className="text-[#7C7C7C] cursor-pointer text-lg">Go back</p>
                    </div>

                    <div className="mt-16">
                        <h1 className="text-[#022B23] text-[20px] font-medium leading-tight">
                            What do you want to do
                        </h1>
                        <p className="text-lg mt-2.5 font-medium text-[#1E1E1E]">
                            Select your user type
                        </p>
                    </div>

                    <div className="mt-[30px] rounded-[14px] border-[0.5px] border-[#ededed]">
                        {[
                            {
                                type: 'buyer',
                                icon: shop,
                                title: 'Buyer',
                                description: 'Order products from available vendors'
                            },
                            {
                                type: 'seller',
                                icon: profileCirle,
                                title: 'Seller',
                                description: 'Create your own shop and sell products'
                            },
                            {
                                type: 'logistics',
                                icon: logCar,
                                title: 'Logistics',
                                description: 'Help buyers and sellers pick-up and deliver products'
                            }
                        ].map((option) => (
                            <div
                                key={option.type}
                                className={`flex items-center justify-between h-[58px] px-[18px] py-[8px] cursor-pointer gap-[10px] border-b-[0.5px] border-[#ededed] transition-all
                                    ${selectedUserType === option.type ? 'bg-[#ECFDF6] border-[1px] border-black' : 'hover:bg-[#ECFDF6] hover:border-[1px] hover:border-black'}
                                    ${option.type === 'buyer' ? 'rounded-t-[14px]' : ''}
                                    ${option.type === 'logistics' ? 'rounded-b-[14px] border-b-0' : ''}
                                `}
                                onClick={() => handleUserTypeSelect(option.type as UserTypeOption)}
                            >
                                <div className="flex items-center gap-[10px]">
                                    <Image src={option.icon} alt={`${option.type} icon`} width={24} height={24} />
                                    <div>
                                        <p className="font-medium text-[14px] text-[#121212]">{option.title}</p>
                                        <p className="text-[#707070] text-[10px] md:text-[12px]">{option.description}</p>
                                    </div>
                                </div>
                                <Image
                                    src={selectedUserType === option.type ? greenTick : greyTick}
                                    alt={selectedUserType === option.type ? "Selected" : "Not selected"}
                                    width={20}
                                    height={20}
                                />
                            </div>
                        ))}
                    </div>



                    <button
                        onClick={handleClick}
                        disabled={!selectedUserType}
                        className={`flex mt-[35px] gap-[9px] justify-center items-center rounded-[12px] h-[52px] w-full transition-colors ${
                            selectedUserType
                                ? "bg-[#022B23] text-[#C6EB5F] hover:bg-[#011C17] cursor-pointer"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        <p className="font-semibold text-[14px]">Complete onboarding</p>
                        {selectedUserType && (
                            <Image src={limeArrow} alt="Continue arrow" width={18} height={18} />
                        )}
                    </button>
                </div>
            </div>

            <div className="hidden md:flex md:flex-col bg-[#ecfdf6] h-auto w-[35%] pl-[20px]">
                <div className="mt-[231px]">
                    <p className="text-[#461602] text-[22px]">Get started</p>
                    <p className="mt-[10px] text-[26px] leading-tight">
                        Let&apos;s help you get the best
                        <br />on any of this.
                    </p>
                </div>
                <Image
                    src={threeImages}
                    alt="Illustration of user types"
                    className="mt-[100px] w-[415px] h-[227px]"
                />
            </div>
        </div>
    );
};

export default UserType;