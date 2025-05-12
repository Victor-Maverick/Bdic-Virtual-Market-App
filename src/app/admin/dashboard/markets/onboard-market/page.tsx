'use client';
import Image from "next/image";
import arrowBack from '@/../public/assets/images/arrow-right.svg'
import {useRouter} from "next/navigation";
import {useState} from "react";
import {ChevronDown} from "lucide-react";
import arrowRight from '@/../public/assets/images/green arrow.png'
import OnboardMarketModal from "@/components/onboardMarket";
import OnboardMarketSuccessModal from "@/components/onboardMarketSuccessModal";

const states = [
    { label: "BENUE STATE" },
    { label: "LAGOS STATE" },
    { label: "OGUN STATE" }
];

const localGovernments = [
    { label: "GBOKO" },
    { label: "MAKURDI" },
    { label: "VANDEIKYA" }
];

const councils = [
    { label: "HIGH LEVEL" },
    { label: "NORTH BANK" },
    { label: "AKPEHE" }
];

interface InputFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    optional?: boolean;
}

const InputField = ({
                        id,
                        label,
                        value,
                        onChange,
                        placeholder,
                        optional = false,
                    }: InputFieldProps) => {
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

const StateDropDown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<{ label: string } | null>(null);

    return (
        <div className="relative w-[400px]">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="border-[1.5px] rounded-[14px] h-[58px] flex justify-between px-[18px] border-[#D1D1D1] items-center cursor-pointer"
            >
                <p className={`${selectedOption ? "text-[#121212]" : "text-[#BDBDBD]"} text-[16px] font-normal`}>
                    {selectedOption ? selectedOption.label : "State"}
                </p>
                <ChevronDown
                    size={24}
                    className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    color="#BDBDBD"
                />
            </div>

            {isOpen && (
                <div className="absolute left-0 w-full bg-white text-black rounded-md shadow-lg z-10 border border-[#ededed]">
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
    );
};

const LocalGovernmentDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<{ label: string } | null>(null);

    return (
        <div className="relative w-[400px]">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="border-[1.5px] rounded-[14px] h-[58px] flex justify-between px-[18px] border-[#D1D1D1] items-center cursor-pointer"
            >
                <p className={`${selectedOption ? "text-[#121212]" : "text-[#BDBDBD]"} text-[16px] font-normal`}>
                    {selectedOption ? selectedOption.label : "Local Government"}
                </p>
                <ChevronDown
                    size={24}
                    className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    color="#BDBDBD"
                />
            </div>

            {isOpen && (
                <div className="absolute left-0 w-full bg-white text-black rounded-md shadow-lg z-10 border border-[#ededed]">
                    <ul className="py-1">
                        {localGovernments.map((option, index) => (
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
    );
};

const CouncilDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<{ label: string } | null>(null);

    return (
        <div className="relative w-[400px]">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="border-[1.5px] rounded-[14px] h-[58px] flex justify-between px-[18px] border-[#D1D1D1] items-center cursor-pointer"
            >
                <p className={`${selectedOption ? "text-[#121212]" : "text-[#BDBDBD]"} text-[16px] font-normal`}>
                    {selectedOption ? selectedOption.label : "Local council area"}
                </p>
                <ChevronDown
                    size={24}
                    className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    color="#BDBDBD"
                />
            </div>

            {isOpen && (
                <div className="absolute left-0 w-full bg-white text-black rounded-md shadow-lg z-10 border border-[#ededed]">
                    <ul className="py-1">
                        {councils.map((option, index) => (
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
    );
};

const OnboardMarket = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        location: "",
        marketName: ""
    });
    const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const handleOpenMarketModal = () => {
        setIsMarketModalOpen(true);
    };

    const handleCloseMarketModal = () => {
        setIsMarketModalOpen(false);
    };

    const handleMarketModalContinue = () => {
        setIsMarketModalOpen(false);
        setIsSuccessModalOpen(true);
    };

    const handleCloseSuccessModal = () => {
        setIsSuccessModalOpen(false);
    };

    const handleChange = (field: keyof typeof formData) => (value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <>
            <div className="text-[#707070] text-[14px] px-[20px] font-medium gap-[8px] flex items-center h-[56px] w-full border-b-[0.5px] border-[#ededed]">
                <Image src={arrowBack} alt={'image'} width={24} height={24} className="cursor-pointer" onClick={()=>{router.push("/admin/dashboard/markets")}}/>
                <p className="cursor-pointer" onClick={()=>{router.push("/admin/dashboard/markets")}}>Back to market management</p>
            </div>
            <div className="text-[#022B23] text-[14px] px-[20px] font-medium gap-[8px] flex items-center h-[49px] w-full border-b-[0.5px] border-[#ededed]">
                <p>Onboard new market</p>
            </div>
            <div className="pt-[69px] pl-[174px] flex gap-[158px]">
                <div className="flex flex-col gap-[7px] w-[268px]">
                    <p className="text-[#022B23] text-[14px] font-medium">Market onboarding</p>
                    <p className="text-[#707070] leading-tight text-[14px] font-medium">Onboard a new new market
                        <br/>within the platform.</p>
                </div>
                <div className="flex flex-col w-[400px] h-[438px] gap-[38px] ">
                    <div className="flex flex-col gap-[14px]">
                        <StateDropDown/>
                        <LocalGovernmentDropdown/>
                        <CouncilDropdown/>
                        <InputField
                            id="location"
                            label="Location"
                            value={formData.location}
                            onChange={handleChange('location')}
                            placeholder="Location"
                        />
                        <InputField
                            id="marketName"
                            label="Market name"
                            value={formData.marketName}
                            onChange={handleChange('marketName')}
                            placeholder="Market name"
                        />
                    </div>
                    <div onClick={handleOpenMarketModal} className="flex h-[52px] cursor-pointer text-[14px] rounded-[12px] font-semibold text-[#C6EB5F] bg-[#022B23] w-full items-center justify-center gap-[9px]">
                        <p>Continue</p>
                        <Image src={arrowRight} alt={'image'}/>
                    </div>
                </div>
            </div>

            <OnboardMarketModal
                isOpen={isMarketModalOpen}
                onClose={handleCloseMarketModal}
                onContinue={handleMarketModalContinue}
            />

            <OnboardMarketSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={handleCloseSuccessModal}
            />
        </>
    )
}

export default OnboardMarket;