'use client'
import { useState, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import shadow from "../../../public/assets/images/shadow.png";
import dashboardImage from "../../../public/assets/images/dashboardImage.png";
import shopImg from "../../../public/assets/images/shop-image.svg";
import orderImg from "../../../public/assets/images/orderImg.png";
import transactionImg from "../../../public/assets/images/transactionImg.png";
import chatImg from "../../../public/assets/images/chatImg.png";
import notificationImg from "../../../public/assets/images/notification-bing.png";
import settingImg from "../../../public/assets/images/settingImg.png";

type MenuOption =
    | 'dashboard'
    | 'shop'
    | 'order'
    | 'transactions'
    | 'chats'
    | 'reviews'
    | 'notifications'
    | 'settings';

interface MenuItem {
    id: MenuOption;
    icon: StaticImageData;
    label: string;
    widthClass: string;
    notifications?: string; // Make notifications optional
}

interface DashboardOptionsProps {
    initialSelected?: MenuOption;
}

const DashboardOptions = ({
                              initialSelected = 'dashboard',
                          }: DashboardOptionsProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const [selectedOption, setSelectedOption] = useState<MenuOption>(initialSelected);

    // Map routes to menu options
    const routeToOption: Record<string, MenuOption> = {
        '/vendor/dashboard': 'dashboard',
        '/vendor/dashboard/shop': 'shop',
        '/vendor/dashboard/order': 'order',
        '/vendor/dashboard/transactions': 'transactions',
        '/vendor/dashboard/chats': 'chats',
        '/vendor/dashboard/reviews': 'reviews',
        '/vendor/dashboard/notifications': 'notifications',
        '/vendor/dashboard/settings': 'settings',
    };

    // Map menu options to routes
    const optionToRoute: Record<MenuOption, string> = {
        dashboard: '/vendor/dashboard',
        shop: '/vendor/dashboard/shop',
        order: '/vendor/dashboard/order',
        transactions: '/vendor/dashboard/transactions',
        chats: '/vendor/dashboard/chats',
        reviews: '/vendor/dashboard/reviews',
        notifications: '/vendor/dashboard/notifications',
        settings: '/vendor/dashboard/settings',
    };

    // Update selected option based on current path
    useEffect(() => {
        const matchedOption = Object.entries(routeToOption).find(([route]) =>
            pathname.startsWith(route)
        )?.[1] || 'dashboard';

        setSelectedOption(matchedOption);
    }, [pathname]);

    const handleOptionClick = (option: MenuOption) => {
        setSelectedOption(option);
        router.push(optionToRoute[option]);
    };

    const menuItems: MenuItem[] = [
        { id: 'dashboard', icon: dashboardImage, label: 'Dashboard', widthClass: 'w-[116px]' },
        { id: 'shop', icon: shopImg, label: 'Shop', widthClass: 'w-[77px]' },
        { id: 'order', icon: orderImg, label: 'Order', widthClass: 'w-[88px]' },
        { id: 'transactions', icon: transactionImg, label: 'Transactions', widthClass: 'w-[127px]' },
        { id: 'chats', icon: chatImg, label: 'Chats', widthClass: 'w-[81px]' },
        { id: 'reviews', icon: chatImg, label: 'Reviews and Campaigns', widthClass: 'w-[188px]' },
        {
            id: 'notifications',
            icon: notificationImg,
            label: 'Notifications',
            widthClass: 'w-[154px]',
            notifications: '30+'
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
                <button
                    key={item.id}
                    type="button"
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
                    <span className="whitespace-nowrap">{item.label}</span>

                    {item.notifications && (
                        <span className="text-[#ffffff] p-[3px] bg-[#FF5050] flex justify-center items-center rounded-[10px] w-[22px] h-[18px] text-[14px]">
                            <span className="text-[8px] font-semibold">{item.notifications}</span>
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};

export default DashboardOptions;