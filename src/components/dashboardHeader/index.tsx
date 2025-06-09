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
                const token = localStorage.getItem('authToken');
                if (!token) {
                    setIsLoading(false);
                    return;
                }

                const response = await axios.get('https://api.digitalmarke.bdic.ng/api/auth/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 200 && response.data.firstName) {
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
    }, []);

    return (
        <div className="flex justify-between items-center h-[78px] px-[100px] py-[18px] bg-white shadow-sm">
            <div onClick={()=>{router.push("/")}} className="flex items-center gap-2">
                <Image src={headerImg} alt="FarmGo Logo" width={50} height={50} className="md:w-[50px] md:h-[50px]" />
                <p className="text-[14px] sm:text-[16px] md:text-[18px] font-semibold text-black leading-tight">
                    Farm<span style={{ color: "#c6eb5f" }}>Go</span> <br />
                    <span className="block">Benue</span>
                </p>
            </div>
            {!isLoading && userName && (
                <div
                    className="flex gap-[6px] items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => router.push("/profile")}
                >
                    <Image
                        src={profileImage}
                        alt="User profile"
                        width={28}
                        height={28}
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