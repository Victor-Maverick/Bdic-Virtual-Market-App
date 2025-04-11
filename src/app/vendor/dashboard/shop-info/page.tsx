'use client'
import DashboardSubHeader from "@/components/dashboardSubHeader";
import DashboardHeader from "@/components/dashboardHeader";
import uploadIcon from '../../../../../public/assets/images/uploadIcon.png'
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useState, useRef, ChangeEvent } from "react";
import limeArrow from "../../../../../public/assets/images/green arrow.png";
import { useRouter } from "next/navigation";
import dashSlideImg from "../../../../../public/assets/images/dashSlideImg.png";

const markets = [
    { label: "WURUKUM MARKET" },
    { label: "MODERN MARKET" },
    { label: "WADATA MARKET" },
    { label: "NORTHBANK MARKET" },
];

type InputFieldProps = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    optional?: boolean;
};

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
        <div className="relative w-full mb-[10px] flex flex-col">
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

const MarketDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<{ label: string } | null>(null);

    return (
        <div className="relative mt-[10px] mb-[10px]">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="border-[1.5px] rounded-[14px] h-[58px] flex justify-between px-[18px] border-[#D1D1D1] items-center cursor-pointer"
            >
                <p className={`${selectedOption ? "text-[#121212]" : "text-[#BDBDBD]"} text-[16px] font-normal`}>
                    {selectedOption ? selectedOption.label : "Market"}
                </p>
                <ChevronDown
                    size={24}
                    className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    color="#BDBDBD"
                />
            </div>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-full bg-white text-black rounded-md shadow-lg z-10 border border-[#ededed]">
                    <ul className="py-1">
                        {markets.map((option, index) => (
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

const Setup1 = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        shopName: "",
        shopAddress: "",
        shopLine: "",
        shopNumber: "",
        cacNumber: "",
        taxIdNumber: "",
    });
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (field: keyof typeof formData) => (value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("File size exceeds 2MB limit");
                return;
            }

            if (!file.type.match('image.*')) {
                alert("Please select an image file");
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setUploadedImage(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setUploadedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleContinue = () => {
        if (!formData.shopName || !formData.shopAddress) {
            alert("Please fill in all required fields");
            return;
        }
        router.push('/vendor/dashboard/personal-info');
    };

    return (
        <>
            <DashboardHeader />
            <DashboardSubHeader welcomeText={"Hey, welcome"} description={"Get started by setting up your shop"}
                                background={'#ECFDF6'} image={dashSlideImg} textColor={'#05966F'} />            <div className="h-[44px] gap-[8px] border-b-[0.5px] px-25 border-[#ededed] flex items-center">
                <p className="text-[14px] font-medium">
                    Shop information
                </p>
            </div>
            <div className="flex ml-[366px] w-auto mt-16 gap-25">
                <div className="flex flex-col w-[268px] h-[67px] gap-[10px]">
                    <p className="text-[#022B23] text-[16px] font-medium">Shop information</p>
                    <p className="text-[#707070] font-medium text-[14px]">
                        Provide information about your shop to complete setup
                    </p>
                </div>
                <div className="flex flex-col w-[400px]">
                    <InputField
                        id="shopName"
                        label="Shop name"
                        value={formData.shopName}
                        onChange={handleChange('shopName')}
                        placeholder="Shop name"
                    />

                    <div className="mt-[38px]">
                        <p className="mb-[5px] text-[12px] font-medium text-[#6D6D6D]">
                            Upload business logo<span className="text-[#B0B0B0]">(optional)</span>
                        </p>
                        <div
                            className="flex flex-col gap-[8px] text-center items-center w-full h-[102px] rounded-[14px] bg-[#ECFDF6] justify-center border border-dashed border-[#022B23] cursor-pointer relative overflow-hidden"
                            onClick={triggerFileInput}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden"
                            />

                            {uploadedImage ? (
                                <>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Image
                                            src={uploadedImage}
                                            alt="Uploaded logo"
                                            width={96}
                                            height={96}
                                            className="rounded-lg object-cover w-[96px] h-[96px]"
                                        />
                                    </div>
                                    <button
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Image src={uploadIcon} alt="Upload icon" width={24} height={24} />
                                    <p className="text-[12px] font-medium text-[#022B23]">
                                        <span className="underline">Upload</span> your company logo
                                        <br />(2MB max)
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    <MarketDropdown />

                    <InputField
                        id="shopAddress"
                        label="Shop address"
                        value={formData.shopAddress}
                        onChange={handleChange('shopAddress')}
                        placeholder="Shop address"
                    />

                    <InputField
                        id="shopLine"
                        label="Shop line / Street name"
                        value={formData.shopLine}
                        onChange={handleChange('shopLine')}
                        placeholder="Shop line / Street name"
                    />

                    <InputField
                        id="shopNumber"
                        label="Shop number"
                        value={formData.shopNumber}
                        onChange={handleChange('shopNumber')}
                        placeholder="Shop number"
                    />

                    <InputField
                        id="cacNumber"
                        label="CAC number"
                        value={formData.cacNumber}
                        onChange={handleChange('cacNumber')}
                        placeholder="CAC number"
                    />

                    <InputField
                        id="taxIdNumber"
                        label="TAXID number"
                        value={formData.taxIdNumber}
                        onChange={handleChange('taxIdNumber')}
                        placeholder="TAXID number"
                    />

                    <div
                        className="flex mt-[30px] mb-[20px] gap-[9px] justify-center items-center bg-[#022B23] rounded-[12px] h-[52px] cursor-pointer hover:bg-[#033a30] transition-colors"
                        onClick={handleContinue}
                    >
                        <p className="text-[#C6EB5F] font-semibold text-[14px]">Continue to vendor information</p>
                        <Image src={limeArrow} alt="Continue arrow" width={18} height={18} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Setup1;