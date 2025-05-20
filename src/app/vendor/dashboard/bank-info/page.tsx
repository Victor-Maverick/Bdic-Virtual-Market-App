'use client'
import DashboardHeader from "@/components/dashboardHeader";
import DashboardSubHeader from "@/components/dashboardSubHeader";
import Image from "next/image";
import arrow from "../../../../../public/assets/images/arrow-right.svg";
import {ChevronDown} from "lucide-react";
import {useRouter} from "next/navigation";
import limeArrow from "../../../../../public/assets/images/green arrow.png";
import greenTick from '../../../../../public/assets/images/green tick.png'
import {useState} from "react"
import dashSlideImg from '@/../public/assets/images/dashSlideImg.png'

type Bank = {
    id: number;
    name: string;
};

const banks: Bank[] = [
    { id: 1, name: "UNITED BANK OF AFRICA" },
    { id: 2, name: "FIRST BANK OF NIGERIA" },
    { id: 3, name: "GT BANK" },
    { id: 4, name: "FIDELITY BANK" },
    { id: 5, name: "ZENITH BANK" },
];

const DropDown = ({
                      selectedBank,
                      onSelect,
                  }: {
    selectedBank: Bank | null;
    onSelect: (bank: Bank) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="border-[1.5px] rounded-[14px] h-[58px] flex justify-between px-[18px] border-[#D1D1D1] items-center cursor-pointer"
            >
                <p className={`${selectedBank ? "text-[#121212]" : "text-[#BDBDBD]"} text-[16px] font-medium`}>
                    {selectedBank ? selectedBank.name : "Bank name"}
                </p>
                <ChevronDown
                    size={24}
                    className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    color="#D1D1D1"
                />
            </div>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-full bg-white text-black rounded-md shadow-lg z-10 border border-[#ededed]">
                    <ul className="py-1">
                        {banks.map((bank) => (
                            <li
                                key={bank.id}
                                className="px-4 py-2 text-black hover:bg-[#ECFDF6] cursor-pointer"
                                onClick={() => {
                                    onSelect(bank);
                                    setIsOpen(false);
                                }}
                            >
                                {bank.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const InputField = ({
                        id,
                        label,
                        value,
                        onChange,
                        placeholder,
                        optional = false,
                    }: {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    optional?: boolean;
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative w-full flex flex-col">
            <label
                htmlFor={id}
                className={`absolute left-4 transition-all ${
                    isFocused || value
                        ? "text-[#6D6D6D] text-[12px] font-medium top-[6px]"
                        : "hidden"
                }`}
            >
                {label} {optional && <span className="text-[#B0B0B0]">(optional)</span>}
            </label>
            <input
                id={id}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={!isFocused && !value ? placeholder : ""}
                className={`px-4 h-[58px] w-full border-[1.5px] border-[#D1D1D1] rounded-[14px] outline-none focus:border-[2px] focus:border-[#022B23] ${
                    isFocused || value
                        ? "pt-[14px] pb-[4px] text-[#121212] text-[14px] font-medium"
                        : "text-[#BDBDBD] text-[16px] font-medium"
                }`}
            />
        </div>
    );
};

const BankInfo = () => {
    const [formData, setFormData] = useState({
        accountNumber: "",
    });
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
    const router = useRouter();

    const handleChange = (field: keyof typeof formData) => (value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleContinue = () => {
        if (!formData.accountNumber || !selectedBank) {
            alert("Please fill in all required fields");
            return;
        }

        // Save bank info to localStorage or context
        const bankInfo = {
            ...formData,
            bankName: selectedBank.name,
        };
        localStorage.setItem('bankInfo', JSON.stringify(bankInfo));

        router.push('/vendor/dashboard/setup-complete');
    };

    const handleBack = () => {
        router.push("/vendor/dashboard/personal-info");
    };

    const returnToShoInfo = () => {
        router.push("/vendor/dashboard/shop-info");
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
                    <span className="cursor-pointer font-medium"> Bank details</span>
                </p>
            </div>
            <div className="flex ml-[366px] w-auto mt-16 gap-25">
                <div className="flex flex-col w-[268px] h-[67px] gap-[10px]">
                    <p className="text-[#022B23] text-[16px] font-medium">Vendor information</p>
                    <p className="text-[#707070] font-medium text-[14px]">
                        Information about yourself
                    </p>
                </div>
                <div className="flex flex-col w-[400px] h-auto gap-[38px]">
                    <div className="flex flex-col gap-[10px]">
                        <DropDown selectedBank={selectedBank} onSelect={setSelectedBank} />
                        <InputField
                            id="accountNumber"
                            label="Account number"
                            value={formData.accountNumber}
                            onChange={handleChange('accountNumber')}
                            placeholder="Account number"
                        />
                        <div className="flex-col flex ">
                            <div className="h-[40px] flex justify-between font-medium text-[#121212] w-full rounded-[8px] items-center px-[18px] text-[14px] bg-[#ECFDF6]">
                                <p>Terngu paul</p>
                                <Image src={greenTick} alt={'image'}/>
                            </div>
                        </div>
                    </div>
                    <div
                        className="flex mb-[20px] gap-[9px] justify-center items-center bg-[#022B23] rounded-[12px] h-[52px] cursor-pointer hover:bg-[#033a30] transition-colors"
                        onClick={handleContinue}
                    >
                        <p className="text-[#C6EB5F] font-semibold text-[14px]">Complete KYC & setup shop</p>
                        <Image src={limeArrow} alt="Continue arrow" width={18} height={18} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default BankInfo;