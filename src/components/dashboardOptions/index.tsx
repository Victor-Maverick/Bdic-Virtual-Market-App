'use client'
import { useState, useEffect, useMemo } from 'react';
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
    notifications?: string;
}

interface DashboardOptionsProps {
    initialSelected?: MenuOption;
}

const DashboardOptions = ({ initialSelected = 'dashboard' }: DashboardOptionsProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const [selectedOption, setSelectedOption] = useState<MenuOption>(initialSelected);
    const [indicatorPosition, setIndicatorPosition] = useState({ left: 0, width: 0 });

    // Memoize routeToOption to prevent recreating on every render
    const routeToOption = useMemo(() => ({
        '/vendor/dashboard': 'dashboard',
        '/vendor/dashboard/shop': 'shop',
        '/vendor/dashboard/order': 'order',
        '/vendor/dashboard/transactions': 'transactions',
        '/vendor/dashboard/chats': 'chats',
        '/vendor/dashboard/reviews': 'reviews',
        '/vendor/dashboard/notifications': 'notifications',
        '/vendor/dashboard/settings': 'settings',
    }), []);

    const optionToRoute = useMemo(() => ({
        dashboard: '/vendor/dashboard',
        shop: '/vendor/dashboard/shop',
        order: '/vendor/dashboard/order',
        transactions: '/vendor/dashboard/transactions',
        chats: '/vendor/dashboard/chats',
        reviews: '/vendor/dashboard/reviews',
        notifications: '/vendor/dashboard/notifications',
        settings: '/vendor/dashboard/settings',
    }), []);

    useEffect(() => {
        const matchedOption = Object.entries(routeToOption).find(([route]) =>
            pathname.startsWith(route)
        )?.[1] || 'dashboard';
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setSelectedOption(matchedOption);
    }, [pathname, routeToOption]);

    const handleOptionClick = (option: MenuOption) => {
        setSelectedOption(option);
        router.push(optionToRoute[option]);
    };

    const menuItems: MenuItem[] = useMemo(() => [
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
    ], []);

    const updateIndicatorPosition = (element: HTMLElement | null) => {
        if (element) {
            setIndicatorPosition({
                left: element.offsetLeft,
                width: element.offsetWidth
            });
        }
    };

    useEffect(() => {
        const selectedElement = document.getElementById(`menu-item-${selectedOption}`);
        updateIndicatorPosition(selectedElement);
    }, [selectedOption]);

    return (
        <div className="relative w-full">
            <div
                className="h-[70px] border-b-[1px] border-[#EDEDED] px-25 py-[10px] w-full flex items-center gap-[14px] relative"
                style={{
                    backgroundImage: `url(${shadow.src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        id={`menu-item-${item.id}`}
                        type="button"
                        className={`
                            text-[#171719] text-[14px] h-[40px] flex items-center gap-[6px] cursor-pointer
                            ${item.widthClass}
                            hover:bg-gray-50 transition-colors duration-200
                            relative
                        `}
                        onClick={(e) => {
                            handleOptionClick(item.id);
                            updateIndicatorPosition(e.currentTarget);
                        }}
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
            <div
                className="absolute bottom-0 h-[2px] bg-[#022B23] transition-all duration-300"
                style={{
                    left: `${indicatorPosition.left}px`,
                    width: `${indicatorPosition.width}px`
                }}
            />
        </div>
    );
};

export default DashboardOptions;