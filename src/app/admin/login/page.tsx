'use client'
import shadow from "../../../../public/assets/images/shadow.png";
import headerIcon from '@/../public/assets/images/headerImg.png'
import Image from "next/image";
import {useState} from "react";
import emailIcon from "../../../../public/assets/images/sms.svg";
import eyeOpen from "../../../../public/assets/images/eye.svg";
import eyeClosed from "../../../../public/assets/images/eye.svg";

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

const Login = ()=>{
    const [form, setForm] = useState<FormData>({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    return(
        <div className="h-[982px] flex flex-col justify-between items-center">
            <div className="h-[90px]  px-25 py-[10px] w-full relative flex items-center gap-[14px]"
                 style={{
                     backgroundImage: `url(${shadow.src})`,
                     backgroundSize: "cover",
                     backgroundPosition: "center"
                 }}>
                <div className="flex items-center gap-[4px] w-[95px] h-[47px]">
                    <Image src={headerIcon} alt={'icon'} className="w-[50%] h-full"/>
                    <div className="flex flex-col">
                        <p className="text-[12px] font-semibold text-[#022B23] leading-tight">
                            Market<br/><span className="text-[#C6EB5F]">Go</span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center ">
                <div className="w-[400px] flex flex-col gap-[60px] h-[361px] ">
                    <div className="flex flex-col leading-tight gap-[14px]">
                        <p className="text-[#707070] leading-tight text-[24px] font-medium">Hello<br/>
                            <span className="text-[#022B23]">Welcome back</span></p>
                        <p className="text-[#1E1E1E] text-[16px]">Sign in to continue to your dashboard</p>

                    </div>
                    <div>
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
                        <div className="flex items-center bg-[#033228] rounded-[12px] w-full h-[52px] text-[14px] font-semibold text-[#C6EB5F] justify-center">
                            <p>Sign in</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-[60px]  px-25 py-[10px] w-full relative flex items-center gap-[14px]"
                 style={{
                     backgroundImage: `url(${shadow.src})`,
                     backgroundSize: "cover",
                     backgroundPosition: "center"
                 }}>

            </div>
        </div>
    )
}

export default Login