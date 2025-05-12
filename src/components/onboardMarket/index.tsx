'use client';
import Image from "next/image";
import limeArrow from "../../../public/assets/images/green arrow.png";
import {useState} from "react";

interface OnboardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: () => void;
}

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

const OnboardMarketModal = ({ isOpen, onClose, onContinue }: OnboardModalProps) => {
    const [formData, setFormData] = useState({
        line: "",
        shops: ""
    });

    const handleChange = (field: keyof typeof formData) => (value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleClose = () => {
        onClose();
        onContinue();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#808080]/20">
            <div className="bg-white px-10 py-25 w-[722px] justify-center gap-[30px] h-[461px] flex flex-col items-center">
                <div className="w-[542px] flex flex-col gap-[64px] text-left ">
                    <div className="w-[268px] flex font-medium flex-col gap-[14px] ">
                        <p className="text-[#022B23] text-[16px] ">Lines and shops</p>
                        <p className="text-[14px]  text-[#707070]">Add the number of lines and shops in this market</p>
                    </div>

                    <div className="flex flex-col w-[528px] gap-[40px]">
                        <div className="flex gap-[12px]  w-full">
                            <div className="w-[65%]">
                                <InputField
                                    id="line"
                                    label="Line"
                                    value={formData.line}
                                    onChange={handleChange('line')}
                                    placeholder="Line"
                                />
                            </div>
                            <div className="w-[35%]">
                                <InputField
                                    id="shops"
                                    label="Shops"
                                    value={formData.shops}
                                    onChange={handleChange('shops')}
                                    placeholder="Shops"
                                />
                            </div>
                        </div>
                        <div
                            onClick={handleClose}
                            className="flex w-[513px] gap-[9px] justify-center items-center bg-[#022B23] rounded-[12px] h-[52px] cursor-pointer hover:bg-[#033a30] transition-colors"
                        >
                            <p className="text-[#C6EB5F] font-semibold text-[14px]">
                                Continue
                            </p>
                            <Image src={limeArrow} alt="Continue arrow" width={18} height={18} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardMarketModal;