'use client'
import { useState, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import shadow from "../../../public/assets/images/shadow.png";
import dashboardImage from "../../../public/assets/images/dashboardImage.png";
import shopImg from "../../../public/assets/images/shop-image.svg";
import transactionImg from "../../../public/assets/images/transactionImg.png";
import notificationImg from "../../../public/assets/images/notification-bing.png";
import settingImg from "../../../public/assets/images/settingImg.png";

type MenuOption =
    | 'dashboard'
    | 'fleet'
    | 'transaction'
    | 'notifications'
    | 'settings';

interface DashboardOptionsProps {
    initialSelected?: MenuOption;
}

const LogisticsDashboardOptions = ({
                                       initialSelected = 'dashboard',
                                   }: DashboardOptionsProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const [selectedOption, setSelectedOption] = useState<MenuOption>(initialSelected);

    useEffect(() => {
        const routeToOption: Record<string, MenuOption> = {
            '/logistics/dashboard': 'dashboard',
            '/logistics/dashboard/fleet': 'fleet',
            '/dashboard/transactions': 'transaction',
            '/dashboard/notifications': 'notifications',
            '/dashboard/settings': 'settings',
        };

        const matchedOption = Object.entries(routeToOption).find(([route]) =>
            pathname.startsWith(route)
        )?.[1] || 'dashboard';

        setSelectedOption(matchedOption);
    }, [pathname]);

    const getRouteForOption = (option: MenuOption): string => {
        const routeMap: Record<MenuOption, string> = {
            dashboard: '/logistics/dashboard',
            fleet: '/logistics/dashboard/fleet',
            transaction: '/dashboard/transactions',
            notifications: '/dashboard/notifications',
            settings: '/dashboard/settings',
        };
        return routeMap[option];
    };

    const handleOptionClick = (option: MenuOption) => {
        setSelectedOption(option);
        router.push(getRouteForOption(option));
    };

    const menuItems: {
        id: MenuOption;
        icon: StaticImageData;
        label: string;
        widthClass: string;
        notification?: string;
    }[] = [
        { id: 'dashboard', icon: dashboardImage, label: 'Dashboard', widthClass: 'w-[116px]' },
        { id: 'fleet', icon: shopImg, label: 'Fleet', widthClass: 'w-[77px]' },
        { id: 'transaction', icon: transactionImg, label: 'Transactions', widthClass: 'w-[127px]' },
        {
            id: 'notifications',
            icon: notificationImg,
            label: 'Notifications',
            widthClass: 'w-[154px]',
            notification: '30+'
        },
        { id: 'settings', icon: settingImg, label: 'Settings', widthClass: 'w-[97px]' },
    ];

    return (
        <div
            className="h-[70px] border-b-[1px] border-[#EDEDED] px-25 py-[10px] w-full relative flex items-center gap-[14px]"
            style={{
                backgroundImage: `url(${shadow.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
        >
            {menuItems.map((item) => (
                <div
                    key={item.id}
                    className={`
            text-[#171719] text-[14px] h-[40px] flex items-center gap-[6px] cursor-pointer
            ${item.widthClass}
            ${selectedOption === item.id ? 'border-b-[1px] border-[#022B23]' : ''}
            hover:bg-gray-50 transition-colors duration-200
          `}
                    onClick={() => handleOptionClick(item.id)}
                >
                    <Image
                        src={item.icon}
                        alt={`${item.label} icon`}
                        width={16}
                        height={16}
                        className="flex-shrink-0"
                    />
                    <p className="whitespace-nowrap">{item.label}</p>

                    {item.notification && (
                        <div className="text-[#ffffff] p-[3px] bg-[#FF5050] flex justify-center items-center rounded-[10px] w-[22px] h-[18px] text-[14px]">
                            <p className="text-[8px] font-semibold">{item.notification}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default LogisticsDashboardOptions;