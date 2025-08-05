'use client'
import profileImage from '../../../public/assets/images/profile-circle.png';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import headerImg from "../../../public/assets/images/headerImg.png";
import { useSession, signOut } from "next-auth/react";

interface UserProfile {
    firstName: string;
    roles: string[];
}

const DashboardHeader = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (status === 'loading') return;
            if (status === 'unauthenticated' || !session?.accessToken) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/profile`, {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                });

                if (response.status === 200) {
                    setUserProfile({
                        firstName: response.data.firstName,
                        roles: response.data.roles || []
                    });
                }
            } catch (error) {
                console.log('Profile fetch failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [status, session]);

    const handleProfileClick = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const handleLogout = async () => {
        try {
            // First call the backend logout endpoint
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                    withCredentials: true // Ensure cookies are included if needed
                }
            );
        } catch (error) {
            console.error('Backend logout failed:', error);
        }

        try {
            // Clear client-side authentication
            await signOut({ redirect: false });
            localStorage.removeItem("userEmail");

            // Force a hard redirect to ensure complete logout
            window.location.href = "/";
        } catch (error) {
            console.error('Client logout failed:', error);
            // Fallback to router if window.location fails
            router.push("/");
            router.refresh(); // Ensure page state is cleared
        }
    };

    const handleLogoClick = () => {
        router.push("/");
    };

    return (
        <div className="flex justify-between items-center h-[60px] sm:h-[70px] lg:h-[78px] px-4 sm:px-6 lg:px-[100px] py-3 sm:py-4 lg:py-[18px] bg-white shadow-sm relative">
            <div onClick={handleLogoClick} className="flex items-center gap-1 sm:gap-2 cursor-pointer">
                <Image
                    src={headerImg}
                    alt="FarmGo Logo"
                    width={40}
                    height={40}
                    className="w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] lg:w-[50px] lg:h-[50px]"
                />
                <p className="text-[12px] sm:text-[14px] lg:text-[18px] font-semibold text-black leading-tight">
                    Farm<span style={{ color: "#c6eb5f" }}>Go</span> <br />
                    <span className="block">Benue</span>
                </p>
            </div>

            {!isLoading && userProfile && (
                <div className="relative">
                    <div
                        className="flex gap-1 sm:gap-[6px] items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={handleProfileClick}
                    >
                        <Image
                            src={profileImage}
                            alt="User Profile"
                            width={24}
                            height={24}
                            className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] lg:w-[28px] lg:h-[28px] rounded-full"
                        />
                        <p className="text-[12px] sm:text-[13px] lg:text-[14px] text-[#171719] font-medium hidden sm:block">
                            Hey, <span className="font-semibold">{userProfile.firstName}</span>
                        </p>
                        <p className="text-[12px] text-[#171719] font-medium sm:hidden">
                            <span className="font-semibold">{userProfile.firstName}</span>
                        </p>
                    </div>

                    {isProfileDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-40 sm:w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-3 sm:px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DashboardHeader;