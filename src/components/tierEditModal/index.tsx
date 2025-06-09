import {useState} from "react";
import Image from "next/image";
import limeArrow from "../../../public/assets/images/green arrow.png";



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


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const TierEditModal = ({ tier, onClose }) => {
    const [formData, setFormData] = useState({
        amount: "",
        firstBenefit: "",
        secondBenefit: "",
    });

    const handleChange = (field: keyof typeof formData) => (value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#808080]/20">
            <div className="bg-white w-[597px] h-[620px] flex flex-col gap-[50px]  p-[50px]">
                <div className="gap-[-10px] flex flex-col">
                    <h3 className="text-[16px] font-semibold mb-4">Edit {tier.name}</h3>
                    <p className="text-sm mb-2">Edit the pricing and benefits for {tier.name.toLowerCase()}</p>
                </div>
                <div className="flex flex-col gap-[50px]">
                    <div className="w-full">
                        <InputField
                            id="amount"
                            label="NGN"
                            value={formData.amount}
                            onChange={handleChange("amount")}
                            placeholder="Amount"
                        />
                    </div>
                    <div className="flex flex-col w-full gap-[12px]">
                        <p className="text-[#707070] text-[14px] font-medium">Benefits</p>
                        <div className="w-full">
                            <InputField
                                id="firstBenefit"
                                label="Benefit"
                                value={formData.firstBenefit}
                                onChange={handleChange("firstBenefit")}
                                placeholder="Benefit here"
                            />
                        </div>
                        <div className="w-full">
                            <InputField
                                id="secondBenefit"
                                label="Benefit"
                                value={formData.secondBenefit}
                                onChange={handleChange("secondBenefit")}
                                placeholder="Benefit here"
                            />
                        </div>
                        <span className="rounded-[8px]  text-[#B7B7B7] text-[12px] flex items-center justify-center font-medium border border-[#EEEEEE] h-[34px] w-[80px]">Add benefit</span>
                        <div
                            onClick={onClose}
                            className="flex w-full mt-[20px] gap-[9px] justify-center items-center bg-[#022B23] rounded-[12px] h-[52px] cursor-pointer hover:bg-[#033a30] transition-colors"
                        >
                            <p className="text-[#C6EB5F] font-semibold text-[14px]">
                                Update and save
                            </p>
                            <Image
                                src={limeArrow}
                                alt="Continue arrow"
                                width={18}
                                height={18}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TierEditModal;