'use client'
import {useRouter} from "next/navigation";
import DashboardHeader from "@/components/dashboardHeader";
import DashboardSubHeader from "@/components/dashboardSubHeader";
import dashImg from "../../../../public/assets/images/Logistics-rafiki.svg";
import Image from "next/image";
import arrow from "../../../../public/assets/images/arrow-right.svg";
import uploadIcon from "../../../../public/assets/images/uploadIcon.png";
import limeArrow from "../../../../public/assets/images/green arrow.png";
import {ChangeEvent, useRef, useState} from "react";
import { useOnboarding } from "@/context/LogisticsOnboardingContext";



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

const Onboarding2 = ()=>{
    const { onboardingData, updateDocuments } = useOnboarding();
    const router = useRouter();
    const [uploadedCacImage, setUploadedCacImage] = useState<string | null>(null);
    const [uploadedOtherDoc, setUploadedOtherDoc] = useState<string | null>(null);
    const cacFileInputRef = useRef<HTMLInputElement>(null);
    const otherDocFileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (field: keyof typeof onboardingData.documents) => (value: string) => {
        updateDocuments({ [field]: value });
    };

    const handleCacImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
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
                    setUploadedCacImage(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
            updateDocuments({ cacImage: file });
        }
    };

    const handleOtherDocUpload = (e: ChangeEvent<HTMLInputElement>) => {
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
                    setUploadedOtherDoc(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
            updateDocuments({ otherDocuments: [file] });
        }
    };

    const triggerCacFileInput = () => {
        cacFileInputRef.current?.click();
    };

    const triggerOtherDocFileInput = () => {
        otherDocFileInputRef.current?.click();
    };

    const removeCacImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setUploadedCacImage(null);
        updateDocuments({ cacImage: null });
        if (cacFileInputRef.current) {
            cacFileInputRef.current.value = "";
        }
    };

    const removeOtherDoc = (e: React.MouseEvent) => {
        e.stopPropagation();
        setUploadedOtherDoc(null);
        updateDocuments({ otherDocuments: [] });
        if (otherDocFileInputRef.current) {
            otherDocFileInputRef.current.value = "";
        }
    };

    return(
        <>
            <DashboardHeader />
            <DashboardSubHeader welcomeText={"Manage your logistics company"} description={"Get started by setting up your company"} image={dashImg}
                                textColor={"#DD6A02"} background={"#FFFAEB"}/>
            <div className="h-[44px] gap-[8px] border-b-[0.5px] px-25 border-[#ededed] flex items-center">
                <Image src={arrow} alt={'arrow image'} className="cursor-pointer" />
                <p className="text-[14px] font-normal text-[#707070]">
                    <span className="cursor-pointer text-[#022B23]">Logistics company //</span> <span className="cursor-pointer text-[#022B23]" > License //</span> <span  className="cursor-pointer"> Fleet onboarding // </span><span className="cursor-pointer" >Bank Details //</span><span className="cursor-pointer" > Completed</span>
                </p>
            </div>
            <div className="flex ml-[366px] w-auto mt-16 gap-25">
                <div className="flex flex-col gap-[14px] w-[268px] leading-tight">
                    <p className="text-[#022B23] text-[16px] font-medium">Licensing and documents</p>
                    <p className="text-[#707070] text-[14px] font-medium">Provide documents tha support your business operations as a logistics company.</p>
                </div>
                <div className="flex flex-col w-[400px]">
                    <div className="flex flex-col gap-[14px]">
                        <div className="">
                            <p className="mb-[5px] text-[12px] font-medium text-[#6D6D6D]">
                                Business registration certification<span className="text-[#EB0000]">*</span>
                            </p>
                            <div
                                className="flex flex-col gap-[8px] text-center items-center w-full h-[102px] rounded-[14px] bg-[#ECFDF6] justify-center border border-dashed border-[#022B23] cursor-pointer relative overflow-hidden"
                                onClick={triggerCacFileInput}
                            >
                                <input
                                    type="file"
                                    ref={cacFileInputRef}
                                    onChange={handleCacImageUpload}
                                    accept="image/*"
                                    className="hidden"
                                />

                                {uploadedCacImage ? (
                                    <>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Image
                                                src={uploadedCacImage}
                                                alt="Uploaded CAC"
                                                width={96}
                                                height={96}
                                                className="rounded-lg object-cover w-[96px] h-[96px]"
                                            />
                                        </div>
                                        <button
                                            onClick={removeCacImage}
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
                                            <span className="underline">Upload</span> your CAC here
                                            <br />(2MB max)
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="">
                            <p className="mb-[5px] text-[12px] font-medium text-[#6D6D6D]">
                                Other supporting document
                            </p>
                            <div
                                className="flex flex-col gap-[8px] text-center items-center w-full h-[102px] rounded-[14px] bg-[#ECFDF6] justify-center border border-dashed border-[#022B23] cursor-pointer relative overflow-hidden"
                                onClick={triggerOtherDocFileInput}
                            >
                                <input
                                    type="file"
                                    ref={otherDocFileInputRef}
                                    onChange={handleOtherDocUpload}
                                    accept="image/*"
                                    className="hidden"
                                />

                                {uploadedOtherDoc ? (
                                    <>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Image
                                                src={uploadedOtherDoc}
                                                alt="Uploaded document"
                                                width={96}
                                                height={96}
                                                className="rounded-lg object-cover w-[96px] h-[96px]"
                                            />
                                        </div>
                                        <button
                                            onClick={removeOtherDoc}
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
                                            <span className="underline">Upload</span> another supporting document here
                                            <br />(2MB max)
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                        <InputField
                            id="cacNumber"
                            label="CAC number"
                            value={onboardingData.documents.cacNumber}
                            onChange={handleChange('cacNumber')}
                            placeholder="CAC number"
                        />
                    </div>

                    <div
                        onClick={()=>{router.push("/logistics/onboarding3")}}
                        className="flex mt-[30px] mb-[20px] gap-[9px] justify-center items-center bg-[#022B23] rounded-[12px] h-[52px] cursor-pointer hover:bg-[#033a30] transition-colors"
                    >
                        <p className="text-[#C6EB5F] font-semibold text-[14px]">Continue to bank details</p>
                        <Image src={limeArrow} alt="Continue arrow" width={18} height={18} />
                    </div>
                </div>
            </div>
        </>
    )
}
export default Onboarding2;