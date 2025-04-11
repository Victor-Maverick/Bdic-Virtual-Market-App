'use client';
import Image from "next/image";
import topGraphics from '../../../../public/assets/images/topGraphics.png';
import farmGoLogo from '../../../../public/assets/images/farmGoLogo.png';
import limeArrow from '../../../../public/assets/images/green arrow.png';
import React, { useState } from "react";
import onboardImage from '../../../../public/assets/images/onboard image.png';
import { useRouter } from "next/navigation";

type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type PasswordValidation = {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    specialChar: boolean;
    number: boolean;
};

const GetStarted = () => {
    const router = useRouter();

    const [form, setForm] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [passwordValid, setPasswordValid] = useState<PasswordValidation>({
        length: false,
        lowercase: false,
        uppercase: false,
        specialChar: false,
        number: false
    });

    const handleContinue = () => {
        router.push("/register/emailVerification");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        if (name === "password") {
            setPasswordValid({
                length: value.length >= 8,
                lowercase: /[a-z]/.test(value),
                uppercase: /[A-Z]/.test(value),
                specialChar: /[^A-Za-z0-9]/.test(value),
                number: /[0-9]/.test(value)
            });
        }
    };

    const getInputType = (key: keyof FormData): string => {
        if (key.includes("password")) return "password";
        if (key === "email") return "email";
        return "text";
    };

    const formatLabel = (key: string): string => {
        return key.replace(/([A-Z])/g, ' $1').trim();
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            <div className="absolute z-20" style={{ left: '660px', top: '1px' }}>
                <Image
                    src={topGraphics}
                    alt="Decorative graphics"
                    width={570}
                    height={300}
                    priority
                />
            </div>

            <div className="flex min-h-screen relative z-10">
                <div className="w-full md:w-[65%] pb-[40px] flex flex-col bg-white">
                    <div className="mt-[60px] ml-[102px]">
                        <Image
                            src={farmGoLogo}
                            alt="FarmGo logo"
                            width={90}
                            height={45}
                        />
                    </div>

                    <div className="ml-[104px] mt-[30px]">
                        <div className="w-[400px] flex justify-between items-center">
                            <p className="text-[#022B23] text-[14px] font-medium">ACCOUNT SETUP</p>
                            <p className="text-[#022B23] text-[14px] font-medium">1/3</p>
                        </div>

                        <div className="flex gap-[10px] mt-2">
                            <div className="w-[80px] h-[6px] bg-[#C6EB5F]"></div>
                            <div className="w-[80px] h-[6px] bg-[#F0FACD]"></div>
                            <div className="w-[80px] h-[6px] bg-[#F0FACD]"></div>
                        </div>

                        <h1 className="mt-[40px] text-[#022B23] text-[20px] font-medium">
                            Get started by providing your details below.
                        </h1>

                        <div className="mt-[20px] w-[400px]">
                            {(Object.keys(form) as Array<keyof FormData>).map((key) => (
                                <div key={key} className="relative mb-[14px]">
                                    {form[key] && (
                                        <label className="absolute top-[-10px] left-2 text-xs bg-white px-1">
                                            {formatLabel(key)}
                                        </label>
                                    )}
                                    <input
                                        type={getInputType(key)}
                                        name={key}
                                        value={form[key]}
                                        onChange={handleChange}
                                        placeholder={formatLabel(key)}
                                        className="w-full h-[58px] border-[#D1D1D1] rounded-[14px] p-2 border focus:outline-none focus:ring-2 focus:ring-[#022B23]"
                                    />
                                </div>
                            ))}

                            <div className="flex flex-wrap gap-2 mt-2">
                                {Object.entries(passwordValid).map(([criteria, isValid]) => (
                                    <span
                                        key={criteria}
                                        className={`px-2 flex items-center justify-center h-[33px] text-[14px] text-[#022B23] rounded-[10px] ${
                                            isValid ? 'bg-[#D1FAE7]' : 'bg-gray-300'
                                        }`}
                                    >
                                        {criteria === 'length' ? '8 characters' :
                                            criteria === 'lowercase' ? 'one lowercase character' :
                                                criteria === 'uppercase' ? 'one uppercase character' :
                                                    criteria === 'specialChar' ? 'special character' : 'number'}
                                    </span>
                                ))}
                            </div>

                            <button
                                onClick={handleContinue}
                                className="w-full h-[52px] flex justify-center items-center gap-[9px] mt-[40px] bg-[#022B23] text-[#C6EB5F] rounded-[12px] hover:bg-[#011C17] transition-colors"
                            >
                                Continue
                                <Image src={limeArrow} alt="Continue arrow" width={16} height={16} />
                            </button>

                            <p className="text-[14px] mt-[10px] text-[#7C7C7C]">
                                Already have an account? <span className="text-[16px] text-[#001234] cursor-pointer">Login</span>
                            </p>

                            <p className="text-[16px] mt-[10px] text-[#7C7C7C]">
                                By clicking continue you agree with our<br/>
                                <span className="font-medium underline cursor-pointer">Terms of Service</span> and <span className="font-medium underline cursor-pointer">Privacy Policy</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className=" md:flex bg-[#022B23] w-[35%] flex flex-col pt-[171px] relative">
                    <div className="pl-[20px]">
                        <p className="mb-[15px] text-[#FFEEBE] text-[20px] font-medium">Get started</p>
                        <p className="text-[#C6EB5F] text-[25px]">
                            Register on the largest<br/>
                            vendor and buyer marketplace<br/>
                            to buy and sale products.
                        </p>
                    </div>
                    <div className="flex justify-center items-center">

                    </div>
                    <Image
                        src={onboardImage}
                        alt="Onboarding illustration"
                        width={600}
                        className="w-[550px] absolute h-[400px] mt-[270px] ml-[-37px]"
                    />
                </div>
            </div>
        </div>
    );
};

export default GetStarted;