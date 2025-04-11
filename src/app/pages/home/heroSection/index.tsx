'use client'
import { useState, useEffect } from "react";
import Image from "next/image";

import heroImage1 from "../../../../../public/assets/images/heroImage.png";
import heroImage2 from "../../../../../public/assets/images/hero2.png";
import heroImage3 from "../../../../../public/assets/images/hero3.png";
import heroImage4 from "../../../../../public/assets/images/hero4.png";
import heroImage5 from "../../../../../public/assets/images/hero5.png";
import limeArrow from "../../../../../public/assets/images/green arrow.png";
import {useRouter} from "next/navigation";

const images = [heroImage1, heroImage2, heroImage3, heroImage4, heroImage5];

const HeroSection = () => {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleRegisterClick = ()=>{
        router.push("/register/getStarted");
    }

    return (
        <div className="flex w-full justify-between pt-[81px] md:flex-row flex-col items-center relative">
            <div className="flex flex-col justify-center md:w-1/2 w-full md:pl-25 px-6 md:px-0 text-center md:text-left">
                <div className="w-[265px] h-[36px] border border-[#ffeebe] bg-[#FFFAEB] rounded-lg flex items-center justify-center mx-auto md:mx-0">
                    <p className="text-[#022B23] font-medium">
                        The future of digital trade is here!
                    </p>
                </div>
                <p className="text-[#1E1E1E] font-bold text-[32px] md:text-[40px] leading-tight mt-2">
                    Transforming Local <br className="hidden md:block" />
                    Commerce with a Click
                </p>
                <p className="text-[#1E1E1E] font-normal text-[18px] md:text-[21px] leading-tight mt-2">
                    Onboard your store, explore trusted vendors,<br className="hidden md:block" />
                    and enjoy seamless logistics.
                </p>
                <div onClick={handleRegisterClick} className="flex gap-[14px] mt-6 md:mt-10 justify-center md:justify-start">
                    <div
                            className="bg-green-950 w-[165px] cursor-pointer h-[48px] text-[#c6eb5f] rounded-[12px] font-semibold flex items-center justify-center gap-2 p-2"
                    >
                        <p >Get started</p>
                        <Image src={limeArrow} alt="img" height={18} width={18} />
                    </div>
                    <div className="bg-white border-[2px] cursor-pointer border-[#022B23] text-[#022B23] w-[115px] h-[48px] rounded-[12px] font-semibold flex items-center justify-center gap-2 p-2">
                        <p>Visit Market</p>
                    </div>
                </div>
            </div>

            <div className="relative md:w-1/2 w-full h-[400px] md:h-[550px] overflow-hidden mt-10 md:mt-0">
                <div className="flex transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                    {images.map((img, index) => (
                        <div key={index} className="w-full flex-shrink-0">
                            <Image src={img} alt="image" width={500} height={500} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );


};

export default HeroSection;
