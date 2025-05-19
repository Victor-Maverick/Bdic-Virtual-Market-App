'use client'
import {useRouter, useSearchParams} from "next/navigation";
import React, {useState} from "react";
import Image from "next/image";
import rating from "../../../public/assets/images/rating.svg";
import emailIcon from "../../../public/assets/images/sms.svg";
import eyeOpen from "../../../public/assets/images/eye.svg";
import eyeClosed from "../../../public/assets/images/eye.svg";
import adminImg from "../../../public/assets/images/AdminAvatar.svg";
import settingUser from "../../../public/assets/images/settingUser.svg";
import limeArrow from '@/../public/assets/images/green arrow.png'

type FormField = {
    id: keyof FormData;
    label: string;
    type: 'password';
    withIcon?: boolean;
};

type FormData = {
    oldPassword: string;
    newPassword: string;
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
    { id: 'oldPassword', label: 'Old password', type: 'password' },
    { id: 'newPassword', label: 'New password', type: 'password' },
    { id: 'confirmPassword', label: 'Confirm password', type: 'password' },
];

const passwordCriteria = [
    { key: 'length', label: '8 characters' },
    { key: 'lowercase', label: 'one lowercase character' },
    { key: 'uppercase', label: 'one uppercase character' },
    { key: 'specialChar', label: 'special character' },
    { key: 'number', label: 'number' },
];

const GeneralTab=()=>{
    const [form, setForm] = useState<FormData>({
        oldPassword: '',
        newPassword: '',
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

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        if (name === 'newPassword') {
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

    const toggleOldPasswordVisibility = () => setShowOldPassword(!showOldPassword);
    const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const getInputType = (field: FormField): string => {
        if (field.id === 'oldPassword') return showOldPassword ? 'text' : 'password';
        if (field.id === 'newPassword') return showNewPassword ? 'text' : 'password';
        if (field.id === 'confirmPassword') return showConfirmPassword ? 'text' : 'password';
        return field.type;
    };

    const shouldShowIcon = (field: FormField) => {
        return (focusedFields[field.id] || form[field.id]) && field.withIcon;
    };

    const shouldShowPasswordToggle = (field: FormField) => {
        return (focusedFields[field.id] || form[field.id]) && field.type === 'password';
    };


    // Split password criteria into two rows
    const firstRowCriteria = passwordCriteria.slice(0, 2);
    const secondRowCriteria = passwordCriteria.slice(2);

    return(
        <>
            <div className="flex gap-[30px] ">

                <div className="flex flex-col gap-[24px] mb-10 w-[820px]">
                    <div
                        className="flex-col flex w-full h-auto rounded-[24px] border-[1px] border-[#EDEDED]"
                    >
                        <div className="flex flex-col h-[92px] w-full px-[37px] py-[14px] border-b border-[#ededed]">
                            <p className="text-[#101828] text-[18px] font-medium">General settings</p>
                            <p className="text-[#667085] text-[14px]">View and manage all your settings</p>
                        </div>
                        <div className="flex flex-col h-[77px] w-full px-[37px] py-[14px] leading-tight">
                            <p className="text-[#6A6C6E] text-[14px] ">Full Name</p>
                            <p className="text-[#141415] text-[16px] font-medium">Tordue Francis</p>
                        </div>
                        <div className="flex flex-col h-[77px] w-full px-[37px] py-[14px] leading-tight">
                            <p className="text-[#6A6C6E] text-[14px] ">Shop name</p>
                            <p className="text-[#141415] text-[16px] font-medium">Abba technologies</p>
                        </div>
                        <div className="flex justify-between items-center h-[77px] w-full px-[37px] py-[14px] leading-tight">
                            <div className="flex flex-col">
                                <p className="text-[#6A6C6E] text-[14px] ">Phone No</p>
                                <p className="text-[#141415] text-[16px] font-medium">+234 801 2345 678</p>
                            </div>
                            <div className="flex hover:shadow-sm cursor-pointer justify-center text-[#023047] text-[14px] items-center rounded-[8px] w-[58px] h-[40px] border-[1px] border-[#D0D5DD]">
                                <p>Edit</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center h-[77px] w-full px-[37px] py-[14px] leading-tight">
                            <div className="flex flex-col">
                                <p className="text-[#6A6C6E] text-[14px] ">Address</p>
                                <p className="text-[#141415] text-[16px] font-medium">No. 24 Child Ave. High Level Makurdi, Lagos</p>
                            </div>
                            <div className="flex cursor-pointer hover:shadow-sm justify-center text-[#023047] text-[14px] items-center rounded-[8px] w-[58px] h-[40px] border-[1px] border-[#D0D5DD]">
                                <p>Edit</p>
                            </div>
                        </div>
                        <div className="flex flex-col h-[77px] w-full px-[37px] py-[14px] leading-tight">
                            <p className="text-[#6A6C6E] text-[14px] ">LGA</p>
                            <p className="text-[#141415] text-[16px] font-medium">Makurdi</p>
                        </div>
                        <div className="flex flex-col h-[77px] w-full px-[37px] py-[14px] leading-tight">
                            <p className="text-[#6A6C6E] text-[14px] ">State</p>
                            <p className="text-[#141415] text-[16px] font-medium">Benue</p>
                        </div>
                        <div className=" h-[77px] gap-[50px] w-full px-[37px] py-[14px] leading-tight">
                            <div className="flex-col flex ">
                                <p className="text-[#6A6C6E] text-[14px]">Shop rating (321)</p>
                                <div className="flex gap-[2px] items-center">
                                    <Image src={rating} alt={'image'} />
                                    <p className="text-[#141415] font-medium text-[16px]">4.8</p>
                                </div>
                            </div>

                        </div>
                        <div className="flex flex-col h-[77px] w-full px-[37px] py-[14px] leading-tight">
                            <p className="text-[#6A6C6E] text-[14px] ">Orders delivered</p>
                            <p className="text-[#141415] text-[16px] font-medium">128 successful orders</p>
                        </div>
                    </div>

                    <div
                        className="flex-col flex w-full h-auto rounded-[24px] border-[1px] border-[#EDEDED]"
                    >
                        <div className="flex flex-col h-[92px] w-full px-[37px] py-[14px] border-b border-[#ededed]">
                            <p className="text-[#101828] text-[18px] font-medium">Security</p>
                            <p className="text-[#667085] text-[14px]">Change and manage passwords</p>
                        </div>
                        {formFields.map((field) => (
                            <div key={field.id} className="relative mt-[15px] w-full flex flex-col">
                                <label
                                    htmlFor={field.id}
                                    className={`absolute left-4 transition-all ${
                                        focusedFields[field.id] || form[field.id]
                                            ? "text-[#6D6D6D] text-[12px] font-medium top-[6px] ml-[16px]"
                                            : "hidden"
                                    }`}
                                >
                                    {field.label}
                                </label>
                                <div className="relative mx-[15px]">
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
                                            onClick={
                                                field.id === 'oldPassword' ? toggleOldPasswordVisibility :
                                                    field.id === 'newPassword' ? toggleNewPasswordVisibility :
                                                        toggleConfirmPasswordVisibility
                                            }
                                        >
                                            <Image
                                                src={
                                                    (field.id === 'oldPassword' ? showOldPassword :
                                                        field.id === 'newPassword' ? showNewPassword :
                                                            showConfirmPassword) ? eyeOpen : eyeClosed
                                                }
                                                alt={
                                                    field.id === 'oldPassword' ? (showOldPassword ? "Hide password" : "Show password") :
                                                        field.id === 'newPassword' ? (showNewPassword ? "Hide password" : "Show password") :
                                                            (showConfirmPassword ? "Hide password" : "Show password")
                                                }
                                                width={16}
                                                height={16}
                                            />
                                            <span>{
                                                field.id === 'oldPassword' ? (showOldPassword ? "Hide" : "Show") :
                                                    field.id === 'newPassword' ? (showNewPassword ? "Hide" : "Show") :
                                                        (showConfirmPassword ? "Hide" : "Show")
                                            }</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div className="flex flex-col gap-2 mt-2 px-[15px]">
                            <div className="flex gap-2">
                                {firstRowCriteria.map((criteria) => (
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
                            <div className="flex gap-2">
                                {secondRowCriteria.map((criteria) => (
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
                        </div>
                        <div className="flex px-[15px] py-[20px]">
                            <button className="w-[156px] h-[40px] rounded-[8px] cursor-pointer hover:shadow-sm border-[#D0D5DD] border font-medium text-[14px] px-[16px] py-[10px] text-[#022B23]">
                                Update Password
                            </button>
                        </div>
                    </div>
                    <div
                        className="flex-col flex w-full h-auto rounded-[24px] border-[1px] border-[#EDEDED]"
                    >
                        <div className="flex flex-col h-[92px] w-full px-[37px] py-[14px] border-b border-[#ededed]">
                            <p className="text-[#101828] text-[18px] font-medium">Notifications</p>
                            <p className="text-[#667085] text-[14px]">Notification preference</p>
                        </div>
                        <div className="flex justify-between items-center h-[77px] w-full px-[37px] py-[14px] leading-tight">
                            <div className="flex flex-col">
                                <p className="text-[#6A6C6E] text-[14px] ">Email</p>
                                <p className="text-[#141415] text-[16px] font-medium">torduefrancis@gmail.com</p>
                            </div>
                            <div className="flex w-[72px] justify-end cursor-pointer p-[4px] items-center rounded-[24px] bg-[#C6EB5F] h-[40px]">
                                <div className="w-[32px] bg-white h-[32px] rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
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


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const AddAdminModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        role: "", // add role
    });

    const handleChange = (field: keyof typeof formData) => (value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#808080]/20">
            <div className="bg-white w-[1100px] h-[600px] px-[300px] pt-[90px] shadow-lg relative">
                <div className="flex flex-col gap-[10px] mb-[40px]">
                    <p className="text-[16px] font-semibold text-[#101828]">New admin role</p>
                    <p className="text-[14px] text-[#667085]">Add a new admin role</p>
                </div>

                <div className="flex flex-col gap-[12px]">
                    <InputField
                        id="email"
                        label="Email"
                        value={formData.email}
                        onChange={handleChange("email")}
                        placeholder="Email"
                    />
                    <InputField
                        id="firstName"
                        label="First name"
                        value={formData.firstName}
                        onChange={handleChange("firstName")}
                        placeholder="First name"
                    />
                    <InputField
                        id="lastName"
                        label="Last name"
                        value={formData.lastName}
                        onChange={handleChange("lastName")}
                        placeholder="Last name"
                    />
                    {/* Dropdown for Role */}
                    <select
                        id="role"
                        value={formData.role}
                        onChange={(e) => handleChange("role")(e.target.value)}
                        className="h-[58px] border-[1.5px] border-gray-300 rounded-[14px] px-3 text-[#BDBDBD]  text-[16px] focus:outline-none focus:ring-1 focus:ring-[#022B23] w-full"
                    >
                        <option value="" disabled>Role</option>
                        <option value="support">SUPPORT</option>
                        <option value="customerService">CUSTOMER SERVICE</option>
                        <option value="supervisor">SUPERVISOR</option>
                    </select>
                </div>

                <div
                    onClick={onClose
                    }
                    className="mt-6 w-full bg-[#022B23] gap-[9px] h-[52px] flex items-center justify-center text-[14px] text-[#C6EB5F] font-semibold  font-medium rounded-[14px] hover:bg-[#014f41]">
                    <p>Add new admin</p>
                    <Image src={limeArrow} alt={'image'}/>
                </div>
            </div>
        </div>
    );
};


const RolesTab=()=>{
    const [showModal, setShowModal] = useState(false);

    return(
        <>
            <AddAdminModal isOpen={showModal} onClose={() => setShowModal(false)} />
            <div className="flex gap-[20px]">

                <div className={`w-[25%] flex items-center text-[#022B23] text-[12px] font-medium h-[40px] px-[8px] bg-[#f8f8f8] rounded-[12px] border border-[#eeeeee]`}>
                    <p>Admin roles</p>
                </div>
                <div
                    className="w-[75%] rounded-[24px] border border-[#ededed]"
                >
                    <div className="flex flex-col h-[92px] w-full px-[37px] py-[14px] border-b border-[#ededed]">
                        <p className="text-[#101828] text-[18px] font-medium">Team (24)</p>
                        <p className="text-[#667085] text-[14px]">View and manage your team</p>
                    </div>

                    <div className="flex justify-between mt-[20px] items-center h-[62px] w-full pl-[15px] pr-[30px] py-[14px] leading-tight">
                        <div className="flex gap-[8px] items-center">
                            <Image src={adminImg} alt={'image'} />
                            <div className="flex flex-col">
                                <p className="text-[#101828] font-medium text-[14px] ">Phoenix Baker</p>
                                <p className="text-[#667085] text-[16px]">phoenixbaker@gmail.com</p>
                            </div>
                        </div>
                        <p className="text-[#667085] text-[14px]">You (Super admin)</p>
                    </div>

                    <div className="flex flex-col mb-[28px] mt-[30px] gap-[8px]">
                        <div className="flex justify-between items-center h-[62px] w-full pl-[15px] pr-[30px] py-[14px] leading-tight">
                            <div className="flex gap-[8px] items-center">
                                <Image src={settingUser} alt={'image'} />
                                <div className="flex flex-col">
                                    <p className="text-[#101828] font-medium text-[14px] ">Laura Iye</p>
                                    <p className="text-[#667085] text-[16px]">lauraiye@gmail.com</p>
                                    <span className="w-[51px] text-[#022B23] text-[12px] font-medium py-[2px] px-[8px] bg-[#F9FDE8] rounded-[16px] flex justify-center items-center h-[22px] ">
                                                Driver
                                    </span>
                                </div>
                            </div>
                            <div className="flex cursor-pointer hover:shadow-sm justify-center text-[#023047] text-[14px] items-center rounded-[8px] w-[86px] h-[40px] border-[1px] border-[#D0D5DD]">
                                <p>Remove</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center h-[62px] w-full pl-[15px] pr-[30px] py-[14px] leading-tight">
                            <div className="flex gap-[8px] items-center">
                                <Image src={settingUser} alt={'image'} />
                                <div className="flex flex-col">
                                    <p className="text-[#101828] font-medium text-[14px] ">Laura Iye</p>
                                    <p className="text-[#667085] text-[16px]">lauraiye@gmail.com</p>
                                    <span className="w-[51px] text-[#022B23] text-[12px] font-medium py-[2px] px-[8px] bg-[#F9FDE8] rounded-[16px] flex justify-center items-center h-[22px] ">
                                                Driver
                                            </span>
                                </div>
                            </div>
                            <div className="flex cursor-pointer hover:shadow-sm justify-center text-[#023047] text-[14px] items-center rounded-[8px] w-[86px] h-[40px] border-[1px] border-[#D0D5DD]">
                                <p>Remove</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center h-[62px] w-full pl-[15px] pr-[30px] py-[14px] leading-tight">
                            <div className="flex gap-[8px] items-center">
                                <Image src={settingUser} alt={'image'} />
                                <div className="flex flex-col">
                                    <p className="text-[#101828] font-medium text-[14px] ">Laura Iye</p>
                                    <p className="text-[#667085] text-[16px]">lauraiye@gmail.com</p>
                                    <span className="w-[51px] text-[#022B23] text-[12px] font-medium py-[2px] px-[8px] bg-[#F9FDE8] rounded-[16px] flex justify-center items-center h-[22px] ">
                                                Driver
                                            </span>
                                </div>
                            </div>
                            <div className="flex cursor-pointer hover:shadow-sm justify-center text-[#023047] text-[14px] items-center rounded-[8px] w-[86px] h-[40px] border-[1px] border-[#D0D5DD]">
                                <p>Remove</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center h-[62px] w-full pl-[15px] pr-[30px] py-[14px] leading-tight">
                            <div className="flex gap-[8px] items-center">
                                <Image src={settingUser} alt={'image'} />
                                <div className="flex flex-col">
                                    <p className="text-[#101828] font-medium text-[14px] ">Laura Iye</p>
                                    <p className="text-[#667085] text-[16px]">lauraiye@gmail.com</p>
                                    <span className="w-[51px] text-[#022B23] text-[12px] font-medium py-[2px] px-[8px] bg-[#F9FDE8] rounded-[16px] flex justify-center items-center h-[22px] ">
                                                Driver
                                            </span>
                                </div>
                            </div>
                            <div className="flex cursor-pointer hover:shadow-sm justify-center text-[#023047] text-[14px] items-center rounded-[8px] w-[86px] h-[40px] border-[1px] border-[#D0D5DD]">
                                <p>Remove</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="w-[156px] h-[40px] mb-[15px] rounded-[8px] ml-[15px] cursor-pointer hover:shadow-sm text-[#023047] font-medium text-[14px] px-[16px] py-[10px] border border-[#D0D5DD]">Add team member</button>
                </div>
            </div>
        </>
    )
}

const AdminSettingsClient = ()=>{
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') as 'general' | 'roles' || 'general';
    const [activeTab, setActiveTab] = useState<'general' | 'roles'>(initialTab);
    const router = useRouter();

    const handleTabChange = (tab: 'general' | 'roles') => {
        setActiveTab(tab);
        router.replace(`/admin/dashboard/settings?tab=${tab}`, { scroll: false });
    };

    return (
        <>
            <div className="text-[#022B23] text-[14px] px-[20px] font-medium gap-[8px] flex items-center h-[49px] w-full border-b-[0.5px] border-[#ededed]">
                <p>Settings</p>
            </div>
            <div className="text-[#1E1E1E] text-[14px] px-[20px] font-medium gap-[8px] flex items-center h-[49px] w-full border-b-[0.5px] border-[#ededed]">
                <p>Manage the admin dashboard</p>
            </div>
            <div className="flex flex-col">
                <div className="flex border-b border-[#ededed] mb-6 px-[20px]">
                    <div className="w-[403px] h-[52px] gap-[24px] flex items-end">
                        <p
                            className={`py-2 text-[#11151F] cursor-pointer text-[14px] ${activeTab === 'general' ? 'font-medium  border-b-2 border-[#000000]' : 'text-[#707070]'}`}
                            onClick={() => handleTabChange('general')}
                        >
                            General settings
                        </p>
                        <p
                            className={`py-2 text-[#11151F] cursor-pointer text-[14px] ${activeTab === 'roles' ? 'font-medium  border-b-2 border-[#000000]' : 'text-[#707070]'}`}
                            onClick={() => handleTabChange('roles')}
                        >
                            Roles
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-lg mx-[20px] mb-8">
                    {activeTab === 'general' && <GeneralTab />}
                    {activeTab === 'roles' && <RolesTab />}
                </div>
            </div>
        </>
    );
}
export default AdminSettingsClient;