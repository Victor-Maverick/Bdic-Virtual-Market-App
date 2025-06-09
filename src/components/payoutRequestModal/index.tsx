'use client'
import {useState} from "react";
import Image from "next/image";
import limeArrow from "../../../public/assets/images/green arrow.png";

interface PayoutRequestModalProps {
    isPayoutRequestModalOpen: boolean;
    onClosePayoutRequestModal: () => void;
    onRequestSuccess: () => void; // New prop for success flow
}

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

const PayoutRequestModal = ({
                                isPayoutRequestModalOpen,
                                onRequestSuccess
                            }: PayoutRequestModalProps) => {
    const [formData, setFormData] = useState({
        amount: "",
    });

    const handleChange = (field: keyof typeof formData) => (value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleContinue = () => {
        onRequestSuccess(); // Call parent's success handler
    };

    if (!isPayoutRequestModalOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#808080]/20">
            <div className="bg-white px-10 py-20 w-[950px] max-h-[90vh] flex flex-col items-center gap-6 overflow-hidden">
                <div className="w-[530px] h-[447px] gap-[28px] flex flex-col flex-shrink-0 mx-auto">
                    <div>
                        <h2 className="text-[16px] font-medium text-[#022B23]">Payout request</h2>
                        <p className="text-[14px] font-medium leading-tight text-[#707070]">
                            Request for pay-out from your available <br/>balance
                        </p>
                    </div>
                    <InputField
                        id="amount"
                        label="Amount to request"
                        value={formData.amount}
                        onChange={handleChange('amount')}
                        placeholder="Amount to request"
                    />
                    <div className="w-full h-[178px] flex flex-col gap-[10px] border border-[#ededed] rounded-[24px] px-[24px] py-[16px]">
                        <div className="flex flex-col gap-[14px]">
                            <p className="text-[16px] font-medium text-[#000000]">Bank details</p>
                            <p className="text-[14px] text-[#707070]">BANK NAME: ACCESS BANK</p>
                            <p className="text-[14px] text-[#707070]">ACCOUNT NUMBER: 00112233445</p>
                        </div>
                        <button className="w-[80px] hover:shadow-sm cursor-pointer rounded-[8px] px-[8px] py-[6px] text-[#022B23] font-medium text-[12px] h-[32px] border border-[#E4E4E4]">
                            Edit details
                        </button>
                    </div>
                    <div
                        className="flex mb-[20px] gap-[9px] justify-center items-center bg-[#022B23] rounded-[12px] h-[52px] cursor-pointer hover:bg-[#033a30] transition-colors"
                        onClick={handleContinue}
                    >
                        <p className="text-[#C6EB5F] font-semibold text-[14px]">Request pay-out</p>
                        <Image src={limeArrow} alt="Continue arrow" width={18} height={18} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayoutRequestModal;