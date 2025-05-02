'use client'
import React from "react";
import Link from "next/link";
import Image from 'next/image'
import { UserProfile } from "./../userProfile";
import {
    OverviewIcon,
    MarketsIcon,
    VendorsIcon,
    LogisticsIcon,
    UsersIcon,
    TransactionsIcon,
    AdsIcon,
    DisputeIcon,
    SupportIcon,
    NotificationsIcon,
    SettingsIcon,
} from "./../icons";

interface SidebarProps {
    className?: string;
}

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    badge?: string;
    href: string; // Changed from 'to' to 'href'
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, badge, href }) => {
    return (
        <Link
            href={href}
            className="flex items-center text-[#171719] text-sm cursor-pointer px-2 py-2.5 border-b-white border-b border-solid"
        >
            <div className="mr-1.5">{icon}</div>
            <span className="grow">{label}</span>
            {badge && (
                <div className="text-white text-[8px] font-bold bg-[#FF5050] px-1.5 py-[3px] rounded-[10px]">
                    {badge}
                </div>
            )}
        </Link>
    );
};

export function Sidebar({ className }: SidebarProps) {
    return (
        <div
            className={`w-[298px] border-r-neutral-200 flex flex-col justify-between bg-[#F7F7F7] px-0 py-5 border-r-[0.5px] border-solid ${className}`}
        >
            <div className="px-10 py-0">
                <Image src={"https://cdn.builder.io/api/v1/image/assets/TEMP/8a1d52a441c246cc253647be8372fe502da99296?placeholderIfAbsent=true"} alt={"Logo"} className="w-full" />
            </div>
            <div className="grow px-10 py-0">
                <NavItem icon={<OverviewIcon />} label="Overview" href="/" />
                <NavItem icon={<MarketsIcon />} label="Markets" href="/markets" />
                <NavItem icon={<VendorsIcon />} label="Vendors" href="/vendors" />
                <NavItem
                    icon={<LogisticsIcon />}
                    label="Logistics partners"
                    href="/logistics"
                />
                <NavItem icon={<UsersIcon />} label="Users (customers)" href="/users" />
                <NavItem
                    icon={<TransactionsIcon />}
                    label="Transactions"
                    href="/transactions"
                />
                <NavItem icon={<AdsIcon />} label="Ads and promotions" href="/ads" />
                <NavItem
                    icon={<DisputeIcon />}
                    label="Dispute support"
                    href="/disputes"
                />
                <NavItem icon={<SupportIcon />} label="Support" href="/support" />
                <NavItem
                    icon={<NotificationsIcon />}
                    label="Notifications"
                    badge="30+"
                    href="/notifications"
                />
                <NavItem icon={<SettingsIcon />} label="Settings" href="/settings" />
            </div>
            <UserProfile name="Joseph Tersoo" role="Super admin" />
        </div>
    );
}