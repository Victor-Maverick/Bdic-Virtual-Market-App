'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import topGraphics from '../../../../public/assets/images/topGraphics.png';
import farmGoLogo from '../../../../public/assets/images/farmGoLogo.png';
import limeArrow from '../../../../public/assets/images/green arrow.png';
import onboardImage from '../../../../public/assets/images/onboard image.png';
import emailIcon from '../../../../public/assets/images/sms.svg';
import eyeOpen from '../../../../public/assets/images/eye.svg';
import eyeClosed from '../../../../public/assets/images/eye.svg';

type FormField = {
    id: keyof FormData;
    label: string;
    type: 'text' | 'email' | 'password';
    withIcon?: boolean;
};

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

const formFields: FormField[] = [
    { id: 'firstName', label: 'First name', type: 'text' },
    { id: 'lastName', label: 'Last name', type: 'text' },
    { id: 'email', label: 'Email', type: 'email', withIcon: true },
    { id: 'password', label: 'Create password', type: 'password' },
    { id: 'confirmPassword', label: 'Confirm password', type: 'password' },
];

const passwordCriteria = [
    { key: 'length', label: '8 characters' },
    { key: 'lowercase', label: 'one lowercase character' },
    { key: 'uppercase', label: 'one uppercase character' },
    { key: 'specialChar', label: 'special character' },
    { key: 'number', label: 'number' },
];

const GetStarted = () => {
    const router = useRouter();
    const [form, setForm] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [focusedFields, setFocusedFields] = useState<Record<keyof FormData, boolean>>(
        Object.fromEntries(Object.keys(form).map(key => [key, false])) as Record<keyof FormData, boolean>
    );
    const [passwordValid, setPasswordValid] = useState<PasswordValidation>({
        length: false,
        lowercase: false,
        uppercase: false,
        specialChar: false,
        number: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        if (name === 'password') {
            setPasswordValid({
                length: value.length >= 8,
                lowercase: /[a-z]/.test(value),
                uppercase: /[A-Z]/.test(value),
                specialChar: /[^A-Za-z0-9]/.test(value),
                number: /[0-9]/.test(value)
            });
        }
    };

    const handleFocus = (field: keyof FormData) => {
        setFocusedFields(prev => ({ ...prev, [field]: true }));
    };

    const handleBlur = (field: keyof FormData) => {
        setFocusedFields(prev => ({ ...prev, [field]: false }));
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const getInputType = (field: FormField): string => {
        if (field.id === 'password') return showPassword ? 'text' : 'password';
        if (field.id === 'confirmPassword') return showConfirmPassword ? 'text' : 'password';
        return field.type;
    };

    const shouldShowIcon = (field: FormField) => {
        return (focusedFields[field.id] || form[field.id]) && field.withIcon;
    };

    const shouldShowPasswordToggle = (field: FormField) => {
        return (focusedFields[field.id] || form[field.id]) && field.type === 'password';
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            <div className="absolute z-20 left-[660px] top-[1px]">
                <Image src={topGraphics} alt="Decorative graphics" width={570} height={300} priority />
            </div>

            <div className="flex min-h-screen relative z-10">
                {/* Left Panel - Form */}
                <div className="w-full md:w-[65%] pb-[40px] flex flex-col bg-white">
                    <div className="mt-[60px] ml-[102px]">
                        <Image src={farmGoLogo} alt="FarmGo logo" width={90} height={45} />
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
                            {formFields.map((field) => (
                                <div key={field.id} className="relative w-full flex flex-col mb-[14px]">
                                    <label
                                        htmlFor={field.id}
                                        className={`absolute left-4 transition-all ${
                                            focusedFields[field.id] || form[field.id]
                                                ? "text-[#6D6D6D] text-[12px] font-medium top-[6px]"
                                                : "hidden"
                                        }`}
                                    >
                                        {field.label}
                                    </label>
                                    <div className="relative">
                                        <input
                                            id={field.id}
                                            type={getInputType(field)}
                                            name={field.id}
                                            value={form[field.id]}
                                            onChange={handleChange}
                                            onFocus={() => handleFocus(field.id)}
                                            onBlur={() => handleBlur(field.id)}
                                            placeholder={!focusedFields[field.id] && !form[field.id] ? field.label : ""}
                                            className={`px-4 h-[58px] w-full border-[1.5px] border-[#D1D1D1] rounded-[14px] outline-none focus:border-[2px] focus:border-[#022B23] ${
                                                focusedFields[field.id] || form[field.id]
                                                    ? "pt-[14px] pb-[4px] text-[#121212] text-[14px] font-medium"
                                                    : "text-[#BDBDBD] text-[16px] font-medium"
                                            }`}
                                        />

                                        {shouldShowIcon(field) && (
                                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                                <Image src={emailIcon} alt="Email icon" width={20} height={20} />
                                            </div>
                                        )}

                                        {shouldShowPasswordToggle(field) && (
                                            <div
                                                className="absolute right-4 px-[6px] py-[4px] flex items-center text-[#DCDCDC] text-[12px] shadow-md gap-[8px] rounded-[8px] border-[1px] border-[#EAEAEA] w-[72px] top-1/2 transform -translate-y-1/2 cursor-pointer bg-white"
                                                onClick={field.id === 'password' ? togglePasswordVisibility : toggleConfirmPasswordVisibility}
                                            >
                                                <Image
                                                    src={(field.id === 'password' ? showPassword : showConfirmPassword) ? eyeOpen : eyeClosed}
                                                    alt={field.id === 'password' ? (showPassword ? "Hide password" : "Show password") : (showConfirmPassword ? "Hide password" : "Show password")}
                                                    width={16}
                                                    height={16}
                                                />
                                                <span>{(field.id === 'password' ? showPassword : showConfirmPassword) ? "Hide" : "Show"}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <div className="flex flex-wrap gap-2 mt-2">
                                {passwordCriteria.map((criteria) => (
                                    <span
                                        key={criteria.key}
                                        className={`px-2 flex items-center justify-center h-[33px] text-[14px] text-[#022B23] rounded-[10px] ${
                                            passwordValid[criteria.key as keyof PasswordValidation] ? 'bg-[#D1FAE7]' : 'bg-gray-300'
                                        }`}
                                    >
                    {criteria.label}
                  </span>
                                ))}
                            </div>

                            <button
                                onClick={() => router.push("/register/emailVerification")}
                                className="w-full cursor-pointer h-[52px] flex justify-center items-center gap-[9px] mt-[40px] bg-[#022B23] text-[#C6EB5F] rounded-[12px] hover:bg-[#011C17] transition-colors"
                            >
                                Continue
                                <Image src={limeArrow} alt="Continue arrow" width={16} height={16} />
                            </button>

                            <p className="text-[14px] mt-[10px] text-[#7C7C7C]">
                                Already have an account? <span className="text-[16px] text-[#001234] cursor-pointer">Login</span>
                            </p>

                            <p className="text-[16px] mt-[10px] text-[#7C7C7C]">
                                By clicking continue you agree with our<br />
                                <span className="font-medium underline cursor-pointer">Terms of Service</span> and{' '}
                                <span className="font-medium underline cursor-pointer">Privacy Policy</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Graphics */}
                <div className="hidden md:flex bg-[#022B23] w-[35%] flex-col pt-[171px] relative">
                    <div className="pl-[20px]">
                        <p className="mb-[15px] text-[#FFEEBE] text-[20px] font-medium">Get started</p>
                        <p className="text-[#C6EB5F] text-[25px]">
                            Register on the largest<br />
                            vendor and buyer marketplace<br />
                            to buy and sale products.
                        </p>
                    </div>
                    <Image
                        src={onboardImage}
                        alt="Onboarding illustration"
                        width={600}
                        height={400}
                        className="w-[550px] absolute h-[400px] mt-[270px] ml-[-37px]"
                    />
                </div>
            </div>
        </div>
    );
};

export default GetStarted;
