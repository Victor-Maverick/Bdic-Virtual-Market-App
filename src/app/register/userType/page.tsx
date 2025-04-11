'use client';
import Image from "next/image";
import farmGoLogo from "../../../../public/assets/images/farmGoLogo.png";
import arrowLeft from "../../../../public/assets/images/arrow-left.png";
import shop from "../../../../public/assets/images/shop.svg";
import profileCirle from '../../../../public/assets/images/profile-circle.svg';
import logCar from '../../../../public/assets/images/logCar.png';
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import limeArrow from "../../../../public/assets/images/green arrow.png";
import threeImages from '../../../../public/assets/images/threeImages.png';
import { useRouter } from "next/navigation";

type StateOption = {
    label: string;
};

type UserTypeOption = 'buyer' | 'seller' | 'logistics';

const states: StateOption[] = [
    { label: "BENUE STATE" },
    { label: "LAGOS STATE" },
    { label: "OGUN STATE" },
    { label: "FCT ABUJA" },
];

const UserType = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<StateOption | null>(null);
    const [selectedUserType, setSelectedUserType] = useState<UserTypeOption | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [address, setAddress] = useState("");

    const handleClick = () => {
        router.push("/welcome");
    };

    const handleUserTypeSelect = (type: UserTypeOption) => {
        setSelectedUserType(type);
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Form */}
            <div className="w-full md:w-[879px] pb-[65px] flex flex-col">
                <Image
                    src={farmGoLogo}
                    alt="FarmGo logo"
                    className="mt-[60px] ml-[102px]"
                    width={90}
                    height={45}
                />

                <div className="mt-[40px] w-[400px] ml-[204px]">
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

                    <div className="flex items-center mt-4 gap-1 cursor-pointer">
                        <Image src={arrowLeft} alt="Back arrow" width={20} height={20} />
                        <p className="text-[#7C7C7C] text-lg">Go back</p>
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
                                className={`flex items-center h-[58px] px-[18px] py-[8px] cursor-pointer gap-[10px] border-b-[0.5px] border-[#ededed] transition-all
                  ${selectedUserType === option.type ? 'bg-[#ECFDF6] border-[1px] border-black' : 'hover:bg-[#ECFDF6] hover:border-[1px] hover:border-black'}
                  ${option.type === 'buyer' ? 'rounded-t-[14px]' : ''}
                  ${option.type === 'logistics' ? 'rounded-b-[14px] border-b-0' : ''}
                `}
                                onClick={() => handleUserTypeSelect(option.type as UserTypeOption)}
                            >
                                <Image src={option.icon} alt={`${option.type} icon`} width={24} height={24} />
                                <div>
                                    <p className="font-medium text-[14px] text-[#121212]">{option.title}</p>
                                    <p className="text-[#707070] text-[12px]">{option.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="relative mt-[30px]">
                        <div
                            onClick={() => setIsOpen(!isOpen)}
                            className="border-[1.5px] rounded-[14px] h-[58px] flex justify-between px-[18px] border-[#ededed] items-center cursor-pointer"
                        >
                            <p className={`text-[16px] font-medium ${
                                selectedOption ? 'text-[#022B23]' : 'text-[#BDBDBD]'
                            }`}>
                                {selectedOption ? selectedOption.label : "State of origin"}
                            </p>
                            <ChevronDown
                                size={24}
                                className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                                color="#ededed"
                            />
                        </div>

                        {isOpen && (
                            <div className="absolute left-0 mt-2 w-full bg-white text-black rounded-md shadow-lg z-10 border border-[#ededed]">
                                <ul className="py-1">
                                    {states.map((option, index) => (
                                        <li
                                            key={index}
                                            className="px-4 py-2 text-black hover:bg-[#ECFDF6] cursor-pointer"
                                            onClick={() => {
                                                setSelectedOption(option);
                                                setIsOpen(false);
                                            }}
                                        >
                                            {option.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="relative mt-[20px] w-full h-[58px]">
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(address !== "")}
                            className={`w-full px-4 pt-6 pb-2 text-lg border-[2px] h-full rounded-[14px] outline-none transition-all duration-300 caret-[#C0DDFD] ${
                                isFocused ? "border-[#022B23]" : "border-[#ededed]"
                            }`}
                        />
                        <label
                            className={`absolute left-4 transition-all duration-300 ${
                                isFocused || address
                                    ? "top-2 text-[12px] font-normal text-[#6D6D6D]"
                                    : "top-1/2 transform -translate-y-1/2 text-[#BDBDBD] text-[14px] font-medium"
                            }`}
                        >
                            Your address
                        </label>
                    </div>

                    <button
                        onClick={handleClick}
                        className="flex mt-[35px] cursor-pointer gap-[9px] justify-center items-center bg-[#022B23] rounded-[12px] h-[52px] w-full hover:bg-[#011C17] transition-colors"
                    >
                        <p className="text-[#C6EB5F] font-semibold text-[14px]">Complete onboarding</p>
                        <Image src={limeArrow} alt="Continue arrow" width={18} height={18} />
                    </button>
                </div>
            </div>

            <div className="flex flex-col bg-[#ecfdf6] h-auto w-[471px] pl-[20px]">
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