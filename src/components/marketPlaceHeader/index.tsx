'use client'
import Image from "next/image";
import notificationImg from "../../../public/assets/images/notification-bing.png";
import routing from "../../../public/assets/images/routing.png";
import bag from "../../../public/assets/images/bag.png";
import profileImg from '@/../public/assets/images/profile-circle.png'
import wishListImg from '@/../public/assets/images/heart.png'
import farmGoLogo from "../../../public/assets/images/farmGoLogo.png";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {useEffect, useState} from "react";
import axios from "axios";
import {useSession} from "next-auth/react";

const MarketPlaceHeader = () => {
    const pathname = usePathname();
    const { cartItems } = useCart();

    const [userName, setUserName] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (status === 'loading') return;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (status === 'unauthenticated' || !session?.accessToken) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get('https://api.digitalmarke.bdic.ng/api/auth/profile', {
                    headers: {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        Authorization: `Bearer ${session.accessToken}`,
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
        };

        fetchUserProfile();
    }, [status, session]);


    const handleNavigation = (path: string) => {
        // Only navigate if we're not already on that path
        if (pathname !== path) {
            router.push(path);
        }
    };

    const headerItems = [
         { img: wishListImg, text: "Wishlist", path: "/buyer/wishlist" },
         { img: routing, text: "Track order", path: "/buyer/track-order" },
        {
            img: bag,
            text: "Cart",
            path: "/cart",
            showBadge: true,
            badgeCount: cartItems.length // Number of unique items
        },
        { img: notificationImg, text: "Notifications", path: "/notifications" },
    ];

    //Add profile item if user is logged in
    if (!isLoading && userName) {
        headerItems.push({
            img: profileImg,
            text: `Hey, ${userName}`,
            path: "/profile"
        });
    }

    return (
        <div className="flex w-full h-[96px] px-[97px] items-center justify-between">
            <Image
                onClick={() => handleNavigation("/")}
                src={farmGoLogo}
                alt="FarmGo logo"
                className="cursor-pointer"
            />

            <div className="flex justify-evenly gap-8 items-center">
                {headerItems.map(({ img, text, path, showBadge, badgeCount }, index) => (
                    <div
                        key={index}
                        className="flex gap-1 text-[14px] text-[#171719] font-semibold items-center cursor-pointer hover:opacity-80 transition-opacity relative"
                        onClick={() => handleNavigation(path)}
                    >
                        <Image src={img} alt={text} height={20} width={20} />
                        <p>{text}</p>
                        {showBadge && badgeCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {badgeCount}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketPlaceHeader;