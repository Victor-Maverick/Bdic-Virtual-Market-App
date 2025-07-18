'use client';
import { useState, useEffect, useMemo, useCallback, useLayoutEffect } from 'react';
import Image, { StaticImageData } from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import shadow from '../../../public/assets/images/shadow.png';
import dashboardImage from '../../../public/assets/images/dashboardImage.png';
import shopImg from '../../../public/assets/images/shop-image.svg';
import orderImg from '../../../public/assets/images/orderImg.png';
import transactionImg from '../../../public/assets/images/transactionImg.png';
import chatImg from '../../../public/assets/images/chatImg.png';
import notificationImg from '../../../public/assets/images/notification-bing.png';
import settingImg from '../../../public/assets/images/settingImg.png';

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
    isNotification?: boolean;
}

interface DashboardOptionsProps {
    initialSelected?: MenuOption;
}

const DashboardOptions = ({ initialSelected = 'dashboard' }: DashboardOptionsProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession();
    const [selectedOption, setSelectedOption] = useState<MenuOption>(initialSelected);
    const [indicatorPosition, setIndicatorPosition] = useState({ left: 0, width: 0 });
    const [notificationCount, setNotificationCount] = useState(0);

    const fetchNotifications = useCallback(async () => {
        if (session?.user?.email) {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/notification/getUserAllUnRead?email=${session.user.email}`
                );
                if (Array.isArray(response.data)) {
                    setNotificationCount(response.data.length);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        }
    }, [session?.user?.email]);

    const markNotificationsAsRead = useCallback(async () => {
        if (session?.user?.email) {
            try {
                await axios.put(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/notification/readAllNotification?email=${session.user.email}`
                );
                fetchNotifications();
            } catch (error) {
                console.error('Error marking notifications as read:', error);
            }
        }
    }, [session?.user?.email, fetchNotifications]);

    const routeToOption = useMemo(
        () => ({
            '/vendor/dashboard': 'dashboard',
            '/vendor/dashboard/shop': 'shop',
            '/vendor/dashboard/order': 'order',
            '/vendor/dashboard/transactions': 'transactions',
            '/vendor/dashboard/chats': 'chats',
            '/vendor/dashboard/reviews': 'reviews',
            '/vendor/dashboard/notifications': 'notifications',
            '/vendor/dashboard/settings': 'settings',
        }),
        []
    );

    const optionToRoute = useMemo(
        () => ({
            dashboard: '/vendor/dashboard',
            shop: '/vendor/dashboard/shop',
            order: '/vendor/dashboard/order',
            transactions: '/vendor/dashboard/transactions',
            chats: '/vendor/dashboard/chats',
            reviews: '/vendor/dashboard/reviews',
            notifications: '/vendor/dashboard/notifications',
            settings: '/vendor/dashboard/settings',
        }),
        []
    );

    // Update selected option based on pathname
    useEffect(() => {
        const matchedOption = Object.entries(routeToOption)
            .sort(([a], [b]) => b.length - a.length) // Prioritize longer routes for exact matching
            .find(([route]) => pathname.startsWith(route))?.[1] || 'dashboard';
        setSelectedOption(matchedOption as MenuOption);
    }, [pathname, routeToOption]);

    // Fetch notifications periodically
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const handleOptionClick = useCallback(
        (option: MenuOption, isNotification?: boolean) => {
            if (isNotification) {
                markNotificationsAsRead();
            }
            setSelectedOption(option);
            router.push(optionToRoute[option]);
        },
        [markNotificationsAsRead, optionToRoute, router]
    );

    const menuItems: MenuItem[] = useMemo(
        () => [
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
                notifications: notificationCount > 0 ? (notificationCount > 9 ? '9+' : notificationCount.toString()) : undefined,
                isNotification: true,
            },
            { id: 'settings', icon: settingImg, label: 'Settings', widthClass: 'w-[97px]' },
        ],
        [notificationCount]
    );

    const updateIndicatorPosition = useCallback((element: HTMLElement | null) => {
        if (element) {
            setIndicatorPosition({
                left: element.offsetLeft,
                width: element.offsetWidth,
            });
        }
    }, []);

    // Use useLayoutEffect to ensure DOM is ready before updating indicator
    useLayoutEffect(() => {
        const selectedElement = document.getElementById(`menu-item-${selectedOption}`);
        if (selectedElement) {
            updateIndicatorPosition(selectedElement);
        } else {
            // Fallback: Retry after a short delay if element is not found
            const timeout = setTimeout(() => {
                const retryElement = document.getElementById(`menu-item-${selectedOption}`);
                updateIndicatorPosition(retryElement);
            }, 100);
            return () => clearTimeout(timeout);
        }
    }, [selectedOption, menuItems, updateIndicatorPosition]);

    return (
        <div className="relative w-full">
            <div
                className="h-[70px] border-b-[1px] border-[#EDEDED] px-25 py-[10px] w-full flex items-center gap-[14px] relative"
                style={{
                    backgroundImage: `url(${shadow.src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
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
              ${selectedOption === item.id ? 'font-bold' : ''} // Optional: Highlight selected item
            `}
                        onClick={(e) => {
                            handleOptionClick(item.id, item.isNotification);
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
                    width: `${indicatorPosition.width}px`,
                }}
            />
        </div>
    );
};

export default DashboardOptions;