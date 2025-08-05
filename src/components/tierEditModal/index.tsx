'use client'
import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import limeArrow from "../../../public/assets/images/green arrow.png";

interface InputFieldProps {
    id: string;
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    optional?: boolean;
    type?: string;
}

const InputField = ({
                        id,
                        label,
                        value,
                        onChange,
                        placeholder,
                        optional = false,
                        type = "text",
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
                type={type}
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

interface TierEditModalProps {
    tier: {
        id: number;
        name: string;
        color: string;
        amount: string;
    };
    onClose: () => void;
}

const TierEditModal = ({ tier, onClose }: TierEditModalProps) => {
    const [formData, setFormData] = useState({
        tier: tier.name,
        price: parseFloat(tier.amount),
        featuredNumber: 0,
        promotedNumber: 0,
        floatedNumber: 0,
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (field: keyof typeof formData) => (value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: field === "tier" ? value : parseFloat(value) || 0,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.put<string>(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/shops/update-tier?tierId=${tier.id}`,
                {
                    tier: formData.tier,
                    price: formData.price,
                    featuredNumber: formData.featuredNumber,
                    promotedNumber: formData.promotedNumber,
                    floatedNumber: formData.floatedNumber,
                }
            );

            console.log("Tier updated:", response.data);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update tier");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#808080]/20">
            <div className="bg-white w-[597px] h-[620px] flex flex-col gap-[20px] p-[50px]">
                <div className="gap-[-10px] flex flex-col">
                    <h3 className="text-[16px] font-semibold mb-4">Edit {tier.name}</h3>
                    <p className="text-sm mb-2">Edit the pricing and details for {tier.name.toLowerCase()}</p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-[10px]">
                    <div className="w-full">
                        <InputField
                            id="tier"
                            label="Tier Name"
                            value={formData.tier}
                            onChange={handleChange("tier")}
                            placeholder="Tier name"
                        />
                    </div>
                    <div className="w-full">
                        <InputField
                            id="price"
                            label="Price (NGN)"
                            value={formData.price}
                            onChange={handleChange("price")}
                            placeholder="Price"
                            type="number"
                        />
                    </div>
                    <div className="w-full">
                        <InputField
                            id="featuredNumber"
                            label="Featured Number"
                            value={formData.featuredNumber}
                            onChange={handleChange("featuredNumber")}
                            placeholder="Featured number"
                            type="number"
                        />
                    </div>
                    <div className="w-full">
                        <InputField
                            id="promotedNumber"
                            label="Promoted Number"
                            value={formData.promotedNumber}
                            onChange={handleChange("promotedNumber")}
                            placeholder="Promoted number"
                            type="number"
                        />
                    </div>
                    <div className="w-full">
                        <InputField
                            id="floatedNumber"
                            label="Floated Number"
                            value={formData.floatedNumber}
                            onChange={handleChange("floatedNumber")}
                            placeholder="Floated number"
                            type="number"
                        />
                    </div>
                    {error && <p className="text-red-500 text-[14px]">{error}</p>}
                    <div
                        className="flex w-full mt-[20px] gap-[9px] justify-center items-center bg-[#022B23] rounded-[12px] h-[52px] cursor-pointer hover:bg-[#033a30] transition-colors"
                    >
                        <button
                            type="submit"
                            disabled={loading}
                            className="text-[#C6EB5F] font-semibold text-[14px] bg-transparent border-none"
                        >
                            {loading ? "Updating..." : "Update and save"}
                        </button>
                        <Image src={limeArrow} alt="Continue arrow" width={18} height={18} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TierEditModal;