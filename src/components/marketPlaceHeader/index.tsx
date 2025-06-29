'use client'
import Image, { StaticImageData } from "next/image";
import notificationImg from "../../../public/assets/images/notification-bing.png";
import routing from "../../../public/assets/images/routing.png";
import bag from "../../../public/assets/images/bag.png";
import profileImg from '@/../public/assets/images/profile-circle.png'
import wishListImg from '@/../public/assets/images/heart.png'
import farmGoLogo from "../../../public/assets/images/farmGoLogo.png";
import { useRouter, usePathname } from "next/navigation";
import {useEffect, useState, useCallback} from "react";
import axios from "axios";
import {useSession} from "next-auth/react";
import { FiMenu, FiX } from "react-icons/fi";

interface HeaderItem {
    img: StaticImageData;
    text: string;
    path: string;
    showBadge?: boolean;
    badgeCount?: number;
    isNotification?: boolean;
}

const MarketPlaceHeader = () => {
    const pathname = usePathname();
    const [userName, setUserName] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [notificationCount, setNotificationCount] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();

    const fetchUserProfile = useCallback(async () => {
        if (status === 'loading') return;
        if (status === 'unauthenticated') {
            setIsLoading(false);
            return;
        }

        let token;
        if(session?.accessToken){
            token = session?.accessToken
        }

        try {
            const response = await axios.get('https://digitalmarket.benuestate.gov.ng/api/auth/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setUserName(response.data.firstName);
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            console.log('Profile fetch failed or user not authenticated');
        } finally {
            setIsLoading(false);
        }
    }, [session?.accessToken, status]);

    const fetchNotifications = useCallback(async () => {
        if (session?.user?.email) {
            try {
                const response = await axios.get(
                    `https://digitalmarket.benuestate.gov.ng/api/notification/getUserAllUnRead?email=${session.user.email}`
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
                    `https://digitalmarket.benuestate.gov.ng/api/notification/readAllNotification?email=${session.user.email}`
                );
                fetchNotifications();
            } catch (error) {
                console.error('Error marking notifications as read:', error);
            }
        }
    }, [session?.user?.email, fetchNotifications]);

    useEffect(() => {
        fetchUserProfile();
        fetchNotifications();

        const notificationInterval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(notificationInterval);
    }, [fetchNotifications, fetchUserProfile, status]);

    const handleNavigation = useCallback((path: string, isNotification?: boolean) => {
        if (isNotification) {
            markNotificationsAsRead();
        }
        setIsMobileMenuOpen(false);
        if (pathname !== path) {
            router.push(path);
        }
    }, [markNotificationsAsRead, pathname, router]);

    const headerItems: HeaderItem[] = [
        { img: wishListImg, text: "Wishlist", path: "/buyer/wishlist" },
        { img: routing, text: "Order", path: "/buyer/orders" },
        { img: bag, text: "Cart", path: "/cart" },
        {
            img: notificationImg,
            text: "Notifications",
            path: "/buyer/notifications",
            showBadge: true,
            badgeCount: notificationCount,
            isNotification: true
        },
    ];

    if (!isLoading && userName) {
        headerItems.push({
            img: profileImg,
            text: `Hey, ${userName}`,
            path: "/profile",
            showBadge: false,
            badgeCount: 0
        });
    }

    return (
        <header className="w-full bg-white shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-24">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Image
                            onClick={() => handleNavigation("/")}
                            src={farmGoLogo}
                            alt="FarmGo logo"
                            className="cursor-pointer h-8 w-auto md:h-10"
                            priority
                        />
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
                        {headerItems.map(({ img, text, path, showBadge, badgeCount, isNotification }, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-1 cursor-pointer hover:opacity-80 transition-opacity relative group"
                                onClick={() => handleNavigation(path, isNotification)}
                            >
                                <div className="relative">
                                    <Image
                                        src={img}
                                        alt={text}
                                        height={20}
                                        width={20}
                                        className="w-5 h-5"
                                    />
                                    {showBadge && badgeCount && badgeCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-[#FF5050] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {badgeCount > 9 ? '9+' : badgeCount}
                                        </span>
                                    )}
                                </div>
                                <span className="text-sm font-medium text-gray-900 group-hover:text-primary">
                                    {text}
                                </span>
                            </div>
                        ))}
                    </nav>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none"
                        >
                            {isMobileMenuOpen ? (
                                <FiX className="h-6 w-6" />
                            ) : (
                                <FiMenu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {headerItems.map(({ img, text, path, showBadge, badgeCount, isNotification }, index) => (
                            <div
                                key={index}
                                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleNavigation(path, isNotification)}
                            >
                                <div className="relative mr-3">
                                    <Image
                                        src={img}
                                        alt={text}
                                        height={20}
                                        width={20}
                                        className="w-5 h-5"
                                    />
                                    {showBadge && badgeCount && badgeCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-[#FF5050] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {badgeCount > 9 ? '9+' : badgeCount}
                                        </span>
                                    )}
                                </div>
                                {text}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};

export default MarketPlaceHeader;