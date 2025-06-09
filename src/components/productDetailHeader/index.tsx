'use client'
import profileImage from '../../../public/assets/images/profile-circle.png';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import headerImg from "../../../public/assets/images/headerImg.png";

const DashboardHeader = () => {
    const router = useRouter();
    const [userName, setUserName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Safely check for localStorage availability
                let token: string | null = null;
                try {
                    token = typeof window !== 'undefined' && window.localStorage ? localStorage.getItem('authToken') : null;
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (storageError) {
                    // localStorage access failed - continue without token
                    console.log('LocalStorage access failed');
                }

                if (!token) {
                    setIsLoading(false);
                    return;
                }

                const response = await axios.get('https://api.digitalmarke.bdic.ng/api/auth/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    // Add timeout to prevent hanging requests
                    timeout: 10000
                });

                if (response?.status === 200 && response?.data?.firstName) {
                    setUserName(response.data.firstName);
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                // Silently handle all errors - no UI impact
                console.log('Profile fetch failed or user not authenticated');
            } finally {
                // Ensure loading state is always cleared
                try {
                    setIsLoading(false);
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (stateError) {
                    // Even if setState fails, don't throw
                    console.log('State update failed');
                }
            }
        };

        // Wrap the entire function call in try-catch
        try {
            fetchUserProfile();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            console.log('Failed to initiate profile fetch');
            setIsLoading(false);
        }
    }, []);

    // Safe navigation handlers
    const handleLogoClick = () => {
        try {
            router.push("/");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            console.log('Navigation to home failed');
        }
    };

    const handleProfileClick = () => {
        try {
            router.push("/profile");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            console.log('Navigation to profile failed');
        }
    };

    return (
        <div className="flex justify-between items-center h-[78px] px-[100px] py-[18px] bg-white shadow-sm">
            <div onClick={handleLogoClick} className="flex items-center gap-2 cursor-pointer">
                <Image
                    src={headerImg}
                    alt="FarmGo Logo"
                    width={50}
                    height={50}
                    className="md:w-[50px] md:h-[50px]"
                    onError={() => console.log('Header image failed to load')}
                />
                <p className="text-[14px] sm:text-[16px] md:text-[18px] font-semibold text-black leading-tight">
                    Farm<span style={{ color: "#c6eb5f" }}>Go</span> <br />
                    <span className="block">Benue</span>
                </p>
            </div>

            {!isLoading && userName && (
                <div
                    className="flex gap-[6px] items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={handleProfileClick}
                >
                    <Image
                        src={profileImage}
                        alt="User Profile"
                        width={28}
                        height={28}
                        className="rounded-full"
                        onError={() => console.log('Profile image failed to load')}
                    />
                    <p className="text-[14px] text-[#171719] font-medium">
                        Hey, <span className="font-semibold">{userName}</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default DashboardHeader;