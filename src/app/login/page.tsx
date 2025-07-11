'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import shadow from '../../../public/assets/images/shadow.png';
import headerIcon from '../../../public/assets/images/headerImg.png';
import emailIcon from '../../../public/assets/images/sms.svg';
import eyeOpen from '../../../public/assets/images/eye.svg';
import eyeClosed from '../../../public/assets/images/eye.svg';
import loginImg from '@/../public/assets/images/loginImg.svg';
import Toast from '@/components/Toast';

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

const Login = () => {
    const [form, setForm] = useState<FormData>({ email: '', password: '' });
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [toastMessage, setToastMessage] = useState('');
    const [toastSubMessage, setToastSubMessage] = useState('');

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [focusedFields, setFocusedFields] = useState<Record<keyof FormData, boolean>>(
        Object.fromEntries(Object.keys(form).map((key) => [key, false])) as Record<keyof FormData, boolean>
    );

    const handleFocus = (field: keyof FormData) => {
        setFocusedFields((prev) => ({ ...prev, [field]: true }));
    };

    const handleBlur = (field: keyof FormData) => {
        setFocusedFields((prev) => ({ ...prev, [field]: false }));
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

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
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                email: form.email,
                password: form.password,
                redirect: false,
            });


            if (result?.error) {
                // Handle session conflict specifically
                if (result.error.includes('logged in from another device')) {
                    setToastType('error');
                    setToastMessage('Session Conflict');
                    setToastSubMessage('You were logged out because you logged in from another device');
                } else {
                    setToastType('error');
                    setToastMessage('Login failed');
                    setToastSubMessage(result.error);
                }
                setShowToast(true);
            } else {
                const response = await fetch('/api/auth/session');
                const session = await response.json();
                const roles = session?.user?.roles || [];
                localStorage.setItem("userEmail", form.email)
                setToastType('success');
                setToastMessage('Login successful');
                setToastSubMessage('You are being redirected');
                setShowToast(true);

                // Check for pre-auth URL
                const preAuthUrl = localStorage.getItem('preAuthUrl');
                localStorage.removeItem('preAuthUrl');

                // Redirect to pre-auth URL if it exists, otherwise use role-based routing
                if (preAuthUrl) {
                    router.push(preAuthUrl);
                } else if (roles.includes('VENDOR')) {
                    router.push('/vendor/dashboard');
                } else if (roles.includes('ADMIN')) {
                    router.push('/admin/dashboard/main');
                } else if (roles.includes('LOGISTICS')) {
                    router.push('/logistics/dashboard');
                } else if (roles.includes('RIDER')) {
                    router.push('/rider/dashboard');
                } else if (roles.includes('BUYER')) {
                    router.push('/marketPlace');
                } else {
                    router.push('/dashboard');
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setToastType('error');
            setToastMessage('Login failed');
            setToastSubMessage('An unexpected error occurred');
            setShowToast(true);
        } finally {
            setIsLoading(false);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    const handleCloseToast = () => setShowToast(false);
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
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="flex items-center gap-[4px] w-[95px] h-[47px]">
                    <Image src={headerIcon} alt="icon" className="w-[50%] h-full" />
                    <div className="flex flex-col">
                        <p className="text-[12px] font-semibold text-[#022B23] leading-tight">
                            Market
                            <br />
                            <span className="text-[#C6EB5F]">Go</span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex">
                <div
                    className={`w-full md:w-[49%] px-6 md:pl-[185px] md:pr-0 flex-col flex ${
                        isMobile ? 'pt-[60px] pb-[60px]' : 'pt-[190px]'
                    }`}
                >
                    <div className={`w-full md:w-[400px] flex flex-col gap-[40px] md:gap-[60px] ${isMobile ? 'h-auto' : 'h-[361px]'}`}>
                        <div className="flex flex-col leading-tight gap-[14px]">
                            <div className="flex flex-col leading-tight">
                                <p className="font-['Instrument_Serif'] text-[#707070] font-medium text-[24px] italic">Hello there</p>
                                <p className="text-[24px] font-medium text-[#022B23]">We&#39;ve missed you</p>
                            </div>
                            <p className="text-[#1E1E1E] text-[16px]">Sign in to continue to your dashboard</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            {formFields.map((field) => (
                                <div key={field.id} className="relative w-full flex flex-col mb-[14px]">
                                    <label
                                        htmlFor={field.id}
                                        className={`absolute left-4 transition-all ${
                                            focusedFields[field.id] || form[field.id] ? 'text-[#6D6D6D] text-[12px] font-medium top-[6px]' : 'hidden'
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
                                            placeholder={!focusedFields[field.id] && !form[field.id] ? field.label : ''}
                                            className={`px-4 h-[58px] w-full border-[1.5px] border-[#D1D1D1] rounded-[14px] outline-none focus:border-[2px] focus:border-[#022B23] ${
                                                focusedFields[field.id] || form[field.id]
                                                    ? 'pt-[14px] pb-[4px] text-[#121212] text-[14px] font-medium'
                                                    : 'text-[#BDBDBD] text-[16px] font-medium'
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
                                                onClick={togglePasswordVisibility}
                                            >
                                                <Image
                                                    src={showPassword ? eyeOpen : eyeClosed}
                                                    alt={showPassword ? 'Hide password' : 'Show password'}
                                                    width={16}
                                                    height={16}
                                                />
                                                <span>{showPassword ? 'Hide' : 'Show'}</span>
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
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </form>
                    </div>
                    <p className="mt-6 md:mt-[-15px] text-[#7C7C7C] text-[14px]">
                        Don&#39;t have an account?{' '}
                        <span onClick={() => router.push('/register/getStarted')} className="text-[#001234] text-[16px] cursor-pointer">
              Register
            </span>
                    </p>
                </div>
                <div className="hidden md:flex mt-[-90px] w-[51%] justify-between flex-col bg-[#f9f9f9] pt-[136px] h-[902px]">
                    <p className="ml-[100px] text-[#000000] leading-tight text-[40px] italic font-['Instrument_Serif']">
                        Buying and selling <br /> made easy
                    </p>
                    <div className="flex justify-end">
                        <Image src={loginImg} alt="image" width={670} height={700} className="w-[670px]" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;