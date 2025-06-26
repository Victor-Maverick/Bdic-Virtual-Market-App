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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (status === 'unauthenticated' || !session?.accessToken) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get('https://digitalmarket.benuestate.gov.ng/api/auth/profile', {
                    headers: {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                });

                if (response.status === 200) {
                    setUserProfile({
                        firstName: response.data.firstName,
                        roles: response.data.roles || []
                    });
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

    const handleProfileClick = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const navigateToDashboard = () => {
        if (!userProfile?.roles) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const roles = session?.user.roles || []
        console.log("rolesss: ",roles);
        if (roles.includes('VENDOR') && roles.includes('BUYER')) {
            router.push('/vendor/dashboard');
        } else if (roles.includes('LOGISTICS')) {
            router.push('/logistics/dashboard');
        } else {
            router.push('/buyer/orders');
        }
        setIsProfileDropdownOpen(false);
    };

    const handleLogout = async () => {
        try {
            // Call the backend logout endpoint
            await axios.post(
                'https://digitalmarket.benuestate.gov.ng/api/auth/logout',
                {},
                {
                    headers: {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }
            );

            // Clear the NextAuth session
            await signOut({
                redirect: false,
                callbackUrl: '/'
            });
        } catch (error) {
            console.error('Logout failed:', error);
            // Even if backend logout fails, we should still clear the client session
            await signOut({
                redirect: false,
                callbackUrl: '/'
            });
        }
    };

    // Safe navigation handlers
    const handleLogoClick = () => {
        try {
            router.push("/");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            console.log('Navigation to home failed');
        }
    };

    return (
        <div className="flex justify-between items-center h-[78px] px-[100px] py-[18px] bg-white shadow-sm relative">
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

            {!isLoading && userProfile && (
                <div className="relative">
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
                            Hey, <span className="font-semibold">{userProfile.firstName}</span>
                        </p>
                    </div>

                    {isProfileDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                            <button
                                onClick={() => {
                                    router.push('/profile');
                                    setIsProfileDropdownOpen(false);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Profile
                            </button>
                            <button
                                onClick={navigateToDashboard}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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