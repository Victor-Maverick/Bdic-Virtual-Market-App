"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import headerImg from "../../../public/assets/images/headerImg.png";
import profileImage from '../../../public/assets/images/profile-circle.png';
import axios from "axios";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

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

                if (response.status === 200) {
                    setUserName(response.data.firstName);
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                // Silently handle errors without showing them to the user
                console.log("Profile fetch failed or user not authenticated");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    return (
        <div className="fixed w-full h-[70px] md:h-[80px] lg:h-[90px] bg-white z-50 flex items-center border-b border-gray-300 shadow-md px-4 sm:px-6 md:px-10 lg:px-20 justify-between max-w-screen">
            <div onClick={()=>{router.push("/")}} className="flex items-center gap-2">
                <Image src={headerImg} alt="FarmGo Logo" width={50} height={50} className="md:w-[50px] md:h-[50px]" />
                <p className="text-[14px] sm:text-[16px] md:text-[18px] font-semibold text-black leading-tight">
                    Farm<span style={{ color: "#c6eb5f" }}>Go</span> <br />
                    <span className="block">Benue</span>
                </p>
            </div>

            <div className="hidden md:flex items-center gap-6 lg:gap-[65px] text-[14px] md:text-[16px] lg:text-[18px] font-normal">
                <p className="cursor-pointer hover:text-[#c6eb5f]" onClick={() => router.push("/")}>Home</p>
                <p className="cursor-pointer hover:text-[#c6eb5f]" onClick={() => router.push("/marketPlace")}>MarketPlace</p>
                <p className="cursor-pointer hover:text-[#c6eb5f]" onClick={() => router.push("/aboutUs")}>About us</p>
            </div>

            {!isLoading && (
                <>
                    {userName ? (
                        <p className="hidden md:block text-sm font-medium text-black">
                            Hey, <span className="font-semibold">{userName}</span>
                        </p>
                    ) : (
                        <button onClick={() => router.push("/login")} className="hidden md:block w-[90px] md:w-[100px] lg:w-[110px] h-[35px] md:h-[40px] border border-black rounded-lg cursor-pointer hover:bg-gray-200">
                            Login
                        </button>
                    )}
                </>
            )}

            <button
                className="md:hidden text-black flex items-center justify-center p-3"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>

            {isOpen && (
                <div className="absolute top-[70px] md:top-[80px] lg:top-[90px] left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-6 sm:py-8 md:hidden">
                    <p className="cursor-pointer hover:text-[#c6eb5f]" onClick={() => { setIsOpen(false); router.push("/"); }}>Home</p>
                    <p className="cursor-pointer hover:text-[#c6eb5f]" onClick={() => { setIsOpen(false); router.push("/marketPlace"); }}>MarketPlace</p>
                    <p className="cursor-pointer hover:text-[#c6eb5f]" onClick={() => { setIsOpen(false); router.push("/logistics"); }}>Logistics</p>
                    <p className="cursor-pointer hover:text-[#c6eb5f]" onClick={() => { setIsOpen(false); router.push("/about"); }}>About us</p>
                    {!isLoading && (
                        <>
                            {userName ? (
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={profileImage}
                                        alt="Profile"
                                        width={28}
                                        height={28}
                                        className="rounded-full"
                                    />
                                    <p className="text-sm font-medium text-black">
                                        <span className="font-semibold">{userName}</span>
                                    </p>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.push("/login");
                                    }}
                                    className="w-[90px] h-[35px] border border-black rounded-lg cursor-pointer hover:bg-gray-200"
                                >
                                    Login
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Header;