'use client'
import profileImage from '../../../public/assets/images/profile-circle.png';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import headerImg from "../../../public/assets/images/headerImg.png";
import { useSession, signOut } from "next-auth/react";

const DashboardHeader = () => {
    const [userName, setUserName] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();

    const userProfile = session?.user ? {
        firstName: session.user.firstName,
        roles: session.user.roles || []
    } : null;

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (status === 'loading') return;
            if (status === 'unauthenticated' || !session?.accessToken) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get('https://digitalmarket.benuestate.gov.ng/api/auth/profile', {
                    headers: {
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

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (isProfileDropdownOpen && !target.closest('.profile-dropdown-container')) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileDropdownOpen]);


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
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const navigateToDashboard = () => {
        if (!userProfile?.roles) return;

        const roles = userProfile.roles;
        if (roles.includes('VENDOR') && roles.includes('BUYER')) {
            router.push('/vendor/dashboard');
        }
        else if (roles.includes('ADMIN')) {
            router.push('/admin/dashboard/main');
        }
        else if (roles.includes('LOGISTICS')) {
            router.push('/logistics/dashboard');
        } else {
            router.push('/buyer/orders');
        }
        setIsProfileDropdownOpen(false);
    };

    const navigateToProfile = () => {
        router.push('/profile');
        setIsProfileDropdownOpen(false);
    };

    const handleLogout = async () => {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }
            );
        } catch (error) {
            console.error('Logout API call failed:', error);
        } finally {
            await signOut({ redirect: false });
            localStorage.removeItem('BDICAuthToken');
            localStorage.removeItem('userEmail');
            router.push('/');
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
                <div className="relative profile-dropdown-container">
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

                    {/* Profile Dropdown Menu */}
                    {isProfileDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                            <button
                                onClick={navigateToDashboard}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={navigateToProfile}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
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