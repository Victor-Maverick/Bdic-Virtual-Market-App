'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import shadow from "../../../public/assets/images/shadow.png";
import headerIcon from "../../../public/assets/images/headerImg.png";
import emailIcon from "../../../public/assets/images/sms.svg";
import eyeOpen from "../../../public/assets/images/eye.svg";
import eyeClosed from "../../../public/assets/images/eye.svg";
import loginImg from '@/../public/assets/images/loginImg.svg';
import {useRouter} from "next/navigation";
import axios from 'axios';

type FormField = {
    id: keyof FormData;
    label: string;
    type: 'text' | 'email' | 'password';
    withIcon?: boolean;
};

type FormData = {
    email: string;
    password: string;
};

const formFields: FormField[] = [
    { id: 'email', label: 'Email', type: 'email', withIcon: true },
    { id: 'password', label: 'Password', type: 'password' },
];

const Toast = ({
                   type,
                   message,
                   subMessage,
                   onClose,
               }: {
    type: "success" | "error";
    message: string;
    subMessage: string;
    onClose: () => void;
}) => {
    return (
        <div className={`fixed top-6 right-6 w-[243px] bg-white ${type === "success" ? 'h-auto' : 'h-[138px]'} rounded-md shadow-lg z-50 border border-[#ededed]`}>
            <div className="flex w-full gap-[16px] px-[16px] py-[12px]">
                <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full ${
                        type === "success" ? "bg-green-100" : "bg-red-100"
                    }`}
                >
                    <div
                        className={`w-3 h-3 rounded-full ${
                            type === "success" ? "bg-green-500" : "bg-red-500"
                        }`}
                    ></div>
                </div>
                <div className="flex-1">
                    <p className="text-[#001234] text-[12px] font-medium">{message}</p>
                    <p className="text-[11px] text-[#707070] font-medium">{subMessage}</p>
                    {type === "error" && (
                        <button
                            onClick={onClose}
                            className="mt-[10px] text-[#022B23] text-[12px] font-medium"
                        >
                            Try again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const Login = () => {
    const [form, setForm] = useState<FormData>({
        email: '',
        password: ''
    });
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<"success" | "error">("success");
    const [toastMessage, setToastMessage] = useState("");
    const [toastSubMessage, setToastSubMessage] = useState("");

    // Handle responsive detection
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initial check
        handleResize();

        // Add resize listener
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const [focusedFields, setFocusedFields] = useState<Record<keyof FormData, boolean>>(
        Object.fromEntries(Object.keys(form).map(key => [key, false])) as Record<keyof FormData, boolean>
    );

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
        return field.type;
    };

    const shouldShowIcon = (field: FormField) => {
        return (focusedFields[field.id] || form[field.id]) && field.withIcon;
    };

    const shouldShowPasswordToggle = (field: FormField) => {
        return (focusedFields[field.id] || form[field.id]) && field.type === 'password';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post('https://api.digitalmarke.bdic.ng/api/auth/login', {
                email: form.email,
                password: form.password
            });

            console.log('API Response:', response.data); // Log the response data

            if (response.status === 200) {
                setToastType("success");
                setToastMessage("Login successful");
                setToastSubMessage("You are being redirected to your dashboard");
                setShowToast(true);

                // Redirect after 2 seconds
                setTimeout(() => {
                    router.push("/admin/dashboard/markets");
                }, 2000);
            } else {
                setToastType("error");
                setToastMessage("Login failed");
                setToastSubMessage(response.data.message || "Invalid email or password");
                setShowToast(true);
            }
        } catch (error: any) {
            console.error('Login error:', error.response?.data || error.message);

            setToastType("error");
            setToastMessage("Login failed");
            setToastSubMessage(
                error.response?.data?.message ||
                error.message ||
                "Unable to connect to the server"
            );
            setShowToast(true);
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
        }
    };

    const handleCloseToast = () => {
        setShowToast(false);
    };

    return (
        <>
            {showToast && (
                <Toast
                    type={toastType}
                    message={toastMessage}
                    subMessage={toastSubMessage}
                    onClose={handleCloseToast}
                />
            )}

            <div
                className="h-[90px] md:pl-[185px] pl-[20px] py-[10px] w-full flex items-center gap-[14px]"
                style={{
                    backgroundImage: `url(${shadow.src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
                <div className="flex items-center gap-[4px] w-[95px] h-[47px]">
                    <Image src={headerIcon} alt={'icon'} className="w-[50%] h-full"/>
                    <div className="flex flex-col">
                        <p className="text-[12px] font-semibold text-[#022B23] leading-tight">
                            Market<br/><span className="text-[#C6EB5F]">Go</span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex">
                <div className={`w-full md:w-[49%] px-6 md:pl-[185px] md:pr-0 flex-col flex ${isMobile ? 'pt-[60px] pb-[60px]' : 'pt-[190px]'}`}>
                    <div className={`w-full md:w-[400px] flex flex-col gap-[40px] md:gap-[60px] ${isMobile ? 'h-auto' : 'h-[361px]'}`}>
                        <div className="flex flex-col leading-tight gap-[14px]">
                            <div className="flex flex-col leading-tight">
                                <p className="font-['Instrument_Serif']  text-[#707070] font-medium text-[24px] italic">Hello there</p>
                                <p className="text-[24px]  font-medium text-[#022B23]">We&#39;ve missed you</p>
                            </div>
                            <p className="text-[#1E1E1E] text-[16px]">Sign in to continue to your dashboard</p>
                        </div>
                        <form onSubmit={handleSubmit}>
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
                                            required
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
                            <button
                                type="submit"
                                className="flex items-center justify-center cursor-pointer bg-[#033228] rounded-[12px] w-full h-[52px] text-[14px] font-semibold text-[#C6EB5F]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#C6EB5F]"></div>
                                    </div>
                                ) : 'Sign in'}
                            </button>
                        </form>
                    </div>
                    <p className="mt-6 md:mt-[-15px] text-[#7C7C7C] text-[14px]">Don&#39;t have an account?
                        <span className="text-[#001234] text-[16px] cursor-pointer"> Register</span>
                    </p>
                </div>
                {/* Right side section - hidden on mobile */}
                <div className="hidden md:flex mt-[-90px] w-[51%] justify-between flex-col bg-[#f9f9f9] pt-[136px] h-[902px]">
                    <p className="ml-[100px] text-[#000000] leading-tight text-[40px] italic font-['Instrument_Serif']">
                        Buying and selling <br/>made easy
                    </p>
                    <div className="flex justify-end">
                        <Image src={loginImg} alt={'image'} width={670} height={700} className="w-[670px]"/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;