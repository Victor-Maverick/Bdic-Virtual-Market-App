'use client'
import DashboardHeader from "@/components/dashboardHeader";
import LogisticsDashboardOptions from "@/components/logisticsDashboardOptions";
import Image from "next/image";
import verifiedImg from '@/../public/assets/images/verify.svg'
import blueGradient from '@/../public/assets/images/blueGreenCircle.png'
import locationImg from '@/../public/assets/images/location.png'
import tick from '@/../public/assets/images/tick-circle.svg'
import emptyTick from '@/../public/assets/images/empty-tick.svg'
import clock from '@/../public/assets/images/clock.png'
import rating from '@/../public/assets/images/rating.svg'
import settingUser from '@/../public/assets/images/settingUser.svg'
import adminImg from '@/../public/assets/images/AdminAvatar.svg'
import { useState, useRef, useEffect } from "react";
import emailIcon from "../../../../../public/assets/images/sms.svg";
import eyeOpen from "../../../../../public/assets/images/eye.svg";
import eyeClosed from "../../../../../public/assets/images/eye.svg";
import AddLogMemberModal from "@/components/addLogMemberModal";
import AddLogMemberSuccessModal from "@/components/addLogMemberSuccessModal";

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

const Settings = () => {
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
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const handleAddMemberSuccess = () => {
        setIsAddMemberModalOpen(false);
        setIsSuccessModalOpen(true);
    };

    const handleCloseSuccessModal = () => {
        setIsSuccessModalOpen(false);
    };

    const handleOpenAddMemberModal = () => {
        setIsAddMemberModalOpen(true);
    };

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [activeSection, setActiveSection] = useState<'general' | 'team' | 'security' | 'notifications'>('general');

    // Refs for each section
    const generalSettingsRef = useRef<HTMLDivElement>(null);
    const teamRef = useRef<HTMLDivElement>(null);
    const securityRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);

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

    // Handle navigation clicks
    const handleNavClick = (section: 'general' | 'team' | 'security' | 'notifications') => {
        setActiveSection(section);
        switch (section) {
            case 'general':
                generalSettingsRef.current?.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'team':
                teamRef.current?.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'security':
                securityRef.current?.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'notifications':
                notificationsRef.current?.scrollIntoView({ behavior: 'smooth' });
                break;
        }
    };

    useEffect(() => {
        const generalSettingsNode = generalSettingsRef.current;
        const teamNode = teamRef.current;
        const securityNode = securityRef.current;
        const notificationsNode = notificationsRef.current;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        switch (entry.target.id) {
                            case 'general-settings':
                                setActiveSection('general');
                                break;
                            case 'team-section':
                                setActiveSection('team');
                                break;
                            case 'security-section':
                                setActiveSection('security');
                                break;
                            case 'notifications-section':
                                setActiveSection('notifications');
                                break;
                        }
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (generalSettingsNode) observer.observe(generalSettingsNode);
        if (teamNode) observer.observe(teamNode);
        if (securityNode) observer.observe(securityNode);
        if (notificationsNode) observer.observe(notificationsNode);

        return () => {
            if (generalSettingsNode) observer.unobserve(generalSettingsNode);
            if (teamNode) observer.unobserve(teamNode);
            if (securityNode) observer.unobserve(securityNode);
            if (notificationsNode) observer.unobserve(notificationsNode);
        };
    }, []);

    // Split password criteria into two rows
    const firstRowCriteria = passwordCriteria.slice(0, 2);
    const secondRowCriteria = passwordCriteria.slice(2);

    return (
        <>
            <DashboardHeader />
            <LogisticsDashboardOptions />
            <div className="flex flex-col pl-25 mt-[30px] gap-[40px]">
                <div className="flex flex-col">
                    <p className="text-[18px] font-medium text-[#101828]">Settings</p>
                    <p className="text-[#667085] text-[14px]">Manage your account here</p>
                </div>
                <div className="flex gap-[30px] mt-[-10px]">
                    <div className="flex flex-col gap-[14px]">
                        <div className="flex flex-col w-[380px] h-[201px] rounded-[24px] border-[1px] border-[#EDEDED]">
                            <div className="border-b-[0.5px] items-center py-[8px] px-[20px] h-[58px] border-[#EDEDED] flex justify-between w-full">
                                <div className="flex gap-[4px] items-center">
                                    <Image src={blueGradient} alt={'image'} />
                                    <p>Spiff Logistics</p>
                                </div>
                                <div className="flex rounded-[8px] p-[6px] text-[#461602] text-[12px] font-medium items-center gap-[4px] bg-[#FFEEBE]">
                                    <Image src={verifiedImg} alt={'image'} />
                                    <p>Verified</p>
                                </div>
                            </div>
                            <div className="px-[21px] text-[14px] text-[#707070] mt-[18px] gap-[4px] flex items-center">
                                <Image src={locationImg} width={18} height={18} alt={'image'} />
                                <p>No. 22 Aki Plaza Modern market, Makurdi,<br />
                                    Benue State</p>
                            </div>
                            <div className="flex ml-[40px] mt-[18px] justify-center gap-[4px] p-[6px] items-center text-[#018124] text-[12px] bg-[#EEFFF6] rounded-[100px] w-[72px] h-[32px] ">
                                <Image src={tick} alt={'image'} />
                                <p>Active</p>
                            </div>
                        </div>
                        <div className="flex flex-col w-[380px] h-[160px] rounded-[12px] border-[1px] border-[#EDEDED]">
                            <span
                                className={`text-[#022B23] ${activeSection === 'general' ? 'bg-[#F8F8F8]' : ''} rounded-tr-[12px] rounded-tl-[12px] text-[12px] py-[10px] px-[8px] h-[40px] cursor-pointer`}
                                onClick={() => handleNavClick('general')}
                            >
                                General settings
                            </span>
                            <span
                                className={`text-[#022B23] ${activeSection === 'team' ? 'bg-[#F8F8F8]' : ''} text-[12px] py-[10px] px-[8px] h-[40px] cursor-pointer`}
                                onClick={() => handleNavClick('team')}
                            >
                                Team
                            </span>
                            <span
                                className={`text-[#022B23] ${activeSection === 'security' ? 'bg-[#F8F8F8]' : ''} text-[12px] py-[10px] px-[8px] h-[40px] cursor-pointer`}
                                onClick={() => handleNavClick('security')}
                            >
                                Security
                            </span>
                            <span
                                className={`text-[#022B23] ${activeSection === 'notifications' ? 'bg-[#F8F8F8]' : ''} rounded-br-[12px] rounded-bl-[12px] text-[12px] py-[10px] px-[8px] h-[40px] cursor-pointer`}
                                onClick={() => handleNavClick('notifications')}
                            >
                                Notifications
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-[24px] mb-10 w-[820px]">
                        <div
                            ref={generalSettingsRef}
                            id="general-settings"
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
                                <p className="text-[#6A6C6E] text-[14px] ">Company name</p>
                                <p className="text-[#141415] text-[16px] font-medium">Spiff Logistics</p>
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
                            <div className="flex h-[77px] gap-[50px] w-full px-[37px] py-[14px] leading-tight">
                                <div className="flex-col flex ">
                                    <p className="text-[#6A6C6E] text-[14px]">Company rating (321)</p>
                                    <div className="flex gap-[2px] items-center">
                                        <Image src={rating} alt={'image'} />
                                        <p className="text-[#141415] font-medium text-[16px]">4.8</p>
                                    </div>
                                </div>
                                <div className="flex-col flex ">
                                    <p className="text-[#6A6C6E] text-[14px]">Availability</p>
                                    <div className="flex gap-[2px] items-center">
                                        <Image src={emptyTick} alt={'image'} />
                                        <p className="text-[#141415] font-medium text-[16px]">Yes</p>
                                    </div>
                                </div>
                                <div className="flex-col flex ">
                                    <p className="text-[#6A6C6E] text-[14px]">Work hours</p>
                                    <div className="flex gap-[2px] items-center">
                                        <Image src={clock} alt={'image'} width={18} height={18} />
                                        <p className="text-[#141415] font-medium text-[16px]">7:00am-9:00pm</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col h-[77px] w-full px-[37px] py-[14px] leading-tight">
                                <p className="text-[#6A6C6E] text-[14px] ">Orders delivered</p>
                                <p className="text-[#141415] text-[16px] font-medium">128 successful orders</p>
                            </div>
                        </div>
                        <div
                            ref={teamRef}
                            id="team-section"
                            className="w-full rounded-[24px] border border-[#ededed]"
                        >
                            <div className="flex flex-col h-[92px] w-[800px] px-[37px] py-[14px] border-b border-[#ededed]">
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
                            <button onClick={handleOpenAddMemberModal} className="w-[156px] h-[40px] mb-[15px] rounded-[8px] ml-[15px] cursor-pointer hover:shadow-sm text-[#023047] font-medium text-[14px] px-[16px] py-[10px] border border-[#D0D5DD]">Add team member</button>
                        </div>
                        <div
                            ref={securityRef}
                            id="security-section"
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
                            ref={notificationsRef}
                            id="notifications-section"
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
            </div>
            <AddLogMemberModal
                isAddLogMemberModalOpen={isAddMemberModalOpen}
                onCloseAddLogMemberModal={() => setIsAddMemberModalOpen(false)}
                onRequestSuccess={handleAddMemberSuccess}
            />

            <AddLogMemberSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={handleCloseSuccessModal}
            />
        </>
    )
}

export default Settings;