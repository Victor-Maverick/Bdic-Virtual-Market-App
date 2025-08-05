'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import shadow from '../../../public/assets/images/shadow.png';
import { userService } from '@/services/userService';
import headerIcon from '../../../public/assets/images/headerImg.png';
import emailIcon from '../../../public/assets/images/sms.svg';
import eyeOpen from '../../../public/assets/images/eye.svg'; // Fixed: separate icons
import eyeClosed from '../../../public/assets/images/eye.svg'; // Fixed: separate icons
import loginImg from '@/../public/assets/images/loginImg.svg';
import Toast from '@/components/Toast';
import ReCAPTCHA from "react-google-recaptcha";

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
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [toastMessage, setToastMessage] = useState('');
    const [toastSubMessage, setToastSubMessage] = useState('');
    const [captchaToken, setCaptchaToken] = useState('');
    const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
    const [isResendingVerification, setIsResendingVerification] = useState(false);

    // Helper function to handle localStorage safely
    const safeLocalStorage = useMemo(() => ({
        getItem: (key: string): string | null => {
            if (typeof window !== 'undefined') {
                return localStorage.getItem(key);
            }
            return null;
        },
        setItem: (key: string, value: string): void => {
            if (typeof window !== 'undefined') {
                localStorage.setItem(key, value);
            }
        },
        removeItem: (key: string): void => {
            if (typeof window !== 'undefined') {
                localStorage.removeItem(key);
            }
        }
    }), []);

    // Check for unverified email on component mount
    useEffect(() => {
        const unverifiedEmail = safeLocalStorage.getItem('unverifiedEmail');
        if (unverifiedEmail && !form.email) {
            setForm(prev => ({ ...prev, email: unverifiedEmail }));
            setShowVerificationPrompt(true);
        }
    }, [form.email, safeLocalStorage]);

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

    // Helper function to show toast messages
    const showToastMessage = useCallback((type: 'success' | 'error', message: string, subMessage: string) => {
        setToastType(type);
        setToastMessage(message);
        setToastSubMessage(subMessage);
        setShowToast(true);
    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!captchaToken) {
            showToastMessage('error', 'Captcha Required', 'Please complete the captcha challenge');
            return;
        }

        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                email: form.email,
                password: form.password,
                redirect: false,
            });

            if (result?.error) {
                console.log('Login error:', result.error); // Debug log
                
                // Handle session conflict specifically
                if (result.error.includes('logged in from another device')) {
                    showToastMessage('error', 'Session Conflict', 'You were logged out because you logged in from another device');
                    setShowVerificationPrompt(false);
                } else if (
                    result.error.toLowerCase().includes('user not verified') || 
                    result.error.toLowerCase().includes('not verified') ||
                    result.error.toLowerCase().includes('verify') ||
                    result.error.toLowerCase().includes('verification')
                ) {
                    showToastMessage('error', 'Account not verified', result.error);
                    // Store email for potential resend
                    safeLocalStorage.setItem('unverifiedEmail', form.email);
                    setShowVerificationPrompt(true);
                } else {
                    showToastMessage('error', 'Login failed', result.error);
                    setShowVerificationPrompt(false);
                }
            } else {
                const response = await fetch('/api/auth/session');
                const session = await response.json();
                const roles = session?.user?.roles || [];

                safeLocalStorage.setItem("userEmail", form.email);
                showToastMessage('success', 'Login successful', 'You are being redirected');

                // Check for pre-auth URL
                const preAuthUrl = safeLocalStorage.getItem('preAuthUrl');
                safeLocalStorage.removeItem('preAuthUrl');

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
        } catch (error) {
            console.error('Login error:', error);
            showToastMessage('error', 'Login failed', 'An unexpected error occurred during login');
            setShowVerificationPrompt(false);
        } finally {
            setIsLoading(false);
            // Clean up toast after 3 seconds
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    };

    const handleCloseToast = () => setShowToast(false);

    // Fixed: Proper typing for ReCAPTCHA onChange
    const handleCaptchaChange = (token: string | null) => {
        setCaptchaToken(token || '');
    };

    const handleResendVerification = async () => {
        const email = safeLocalStorage.getItem('unverifiedEmail') || form.email;
        if (!email) {
            showToastMessage('error', 'Email required', 'Please enter your email address first');
            return;
        }

        setIsResendingVerification(true);
        try {
            const result = await userService.resendVerificationEmail(email);
            
            if (result.success) {
                showToastMessage('success', 'Verification email sent', `A new verification email has been sent to ${email}`);
            } else {
                showToastMessage('error', 'Failed to send email', result.message);
            }
        } catch (error) {
            console.error('Resend verification error:', error);
            showToastMessage('error', 'Resend failed', 'Unable to send verification email. Please try again.');
        } finally {
            setIsResendingVerification(false);
        }
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
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="flex items-center gap-[4px] w-[95px] h-[47px]">
                    <Image src={headerIcon} alt="MarketGo icon" className="w-[50%] h-full" />
                    <div className="flex flex-col">
                        <p className="text-[12px] font-semibold text-[#022B23] leading-tight">
                            Market
                            <br />
                            <span className="text-[#C6EB5F]">Go</span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-90px)]">
                <div className="w-full lg:w-[49%] px-4 sm:px-6 lg:pl-[185px] lg:pr-0 flex-col flex pt-8 sm:pt-12 lg:pt-[190px] pb-8">
                    <div className="w-full lg:w-[400px] flex flex-col gap-6 sm:gap-8 lg:gap-[60px]">
                        <div className="flex flex-col leading-tight gap-3 sm:gap-[14px]">
                            <div className="flex flex-col leading-tight">
                                <p className="font-['Instrument_Serif'] text-[#707070] font-medium text-xl sm:text-[24px] italic">Hello there</p>
                                <p className="text-xl sm:text-[24px] font-medium text-[#022B23]">We&#39;ve missed you</p>
                            </div>
                            <p className="text-[#1E1E1E] text-sm sm:text-[16px]">Sign in to continue to your dashboard</p>
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
                                            className={`px-3 sm:px-4 h-12 sm:h-[58px] w-full border-[1.5px] border-[#D1D1D1] rounded-xl sm:rounded-[14px] outline-none focus:border-[2px] focus:border-[#022B23] transition-all ${
                                                focusedFields[field.id] || form[field.id]
                                                    ? 'pt-3 sm:pt-[14px] pb-1 sm:pb-[4px] text-[#121212] text-sm sm:text-[14px] font-medium'
                                                    : 'text-[#BDBDBD] text-sm sm:text-[16px] font-medium'
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
                                className="flex items-center justify-center cursor-pointer bg-[#033228] rounded-xl sm:rounded-[12px] w-full h-12 sm:h-[52px] text-sm sm:text-[14px] font-semibold text-[#C6EB5F] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
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
                    
                    {/* Simplified verification prompt */}
                    {showVerificationPrompt && (
                        <p className="mt-3 sm:mt-4 text-[#7C7C7C] text-sm sm:text-[14px]">
                            Account not verified?{' '}
                            <span 
                                onClick={handleResendVerification}
                                className="text-[#001234] text-sm sm:text-[16px] cursor-pointer hover:underline transition-all"
                            >
                                {isResendingVerification ? 'Sending...' : 'Resend verification email'}
                            </span>
                        </p>
                    )}
                    
                    <p className="mt-4 sm:mt-6 md:mt-[-15px] text-[#7C7C7C] text-sm sm:text-[14px]">
                        Don&#39;t have an account?{' '}
                        <span onClick={() => router.push('/register/getStarted')} className="text-[#001234] text-sm sm:text-[16px] cursor-pointer hover:underline transition-all">
                            Register
                        </span>
                    </p>
                    
                    {/* Test button - remove in production */}
                    {process.env.NODE_ENV === 'development' && (
                        <button
                            onClick={() => {
                                setShowVerificationPrompt(true);
                                safeLocalStorage.setItem('unverifiedEmail', form.email || 'test@example.com');
                            }}
                            className="mt-2 text-[12px] text-gray-500 underline"
                        >
                            Test Verification Prompt
                        </button>
                    )}
                    {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
                        <ReCAPTCHA
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                            onChange={handleCaptchaChange}
                            className="mt-4"
                        />
                    )}
                </div>
                <div className="hidden lg:flex mt-[-90px] w-[51%] justify-between flex-col bg-[#f9f9f9] pt-[136px] min-h-[calc(100vh-90px)]">
                    <p className="ml-[60px] xl:ml-[100px] text-[#000000] leading-tight text-[28px] xl:text-[40px] italic font-['Instrument_Serif']">
                        Buying and selling <br /> made easy
                    </p>
                    <div className="flex justify-end items-end flex-1">
                        <Image src={loginImg} alt="Login illustration" width={670} height={700} className="w-[450px] xl:w-[670px] h-auto" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;