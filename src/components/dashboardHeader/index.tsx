'use client'
import farmGoLogo from '../../../public/assets/images/farmGoLogo.png';
import profileImage from '../../../public/assets/images/profile-circle.png';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const DashboardHeader = () => {
    const router = useRouter();
    const [userName, setUserName] = useState<string | null>(null); // initially null

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) return;

                const response = await axios.get('https://api.digitalmarke.bdic.ng/api/auth/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 200 && response.data.firstName) {
                    setUserName(response.data.firstName);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                // Silently fail – do not update userName
            }
        };

        fetchUserProfile();
    }, []);

    return (
        <div className="flex justify-between items-center h-[78px] px-[100px] py-[18px]">
            <Image
                onClick={() => router.push("/")}
                src={farmGoLogo}
                alt={'logo'}
                className="cursor-pointer"
            />

            {userName && (
                <div className="flex gap-[6px] items-center justify-center text-white">
                    <Image src={profileImage} alt={'photo'} />
                    <p className="text-[14px] text-[#171719] font-medium">
                        Hey, <span className="font-semibold">{userName}</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default DashboardHeader;
