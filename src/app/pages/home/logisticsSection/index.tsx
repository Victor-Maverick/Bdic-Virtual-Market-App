'use client';
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import sideLine from '@/../public/assets/images/greyline.svg';
import riderImg from '@/../public/assets/images/rider image.png';
import arrow from "@/../public/assets/images/blackArrow.png";
import shortFrame from '@/../public/assets/images/shortFrame.png';
import limeArrow from '@/../public/assets/images/green arrow.png';
import sellerImg from '@/../public/assets/images/sellerImg.png';

const LogisticsSection = () => {
    const [showAlternate, setShowAlternate] = useState(false);
    const intervalRef = useRef(null);
    const isPausedRef = useRef(false);

    useEffect(() => {
        startInterval();

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return () => clearInterval(intervalRef.current);
    }, []);

    const startInterval = () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        clearInterval(intervalRef.current);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        intervalRef.current = setInterval(() => {
            setShowAlternate((prev) => !prev);
        }, 5000);
    };

    const handleMouseEnter = () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        clearInterval(intervalRef.current);
        isPausedRef.current = true;
    };

    const handleMouseLeave = () => {
        if (isPausedRef.current) {
            isPausedRef.current = false;
            startInterval();
        }
    };

    return (
        <div className="relative w-full h-[520px]">
            <div className={`absolute inset-0 transition-opacity duration-700 ${showAlternate ? "opacity-0" : "opacity-100"}`}>
                <LogisticsSectionDefault onHover={handleMouseEnter} onLeave={handleMouseLeave} />
            </div>
            <div className={`absolute inset-0 transition-opacity duration-700 ${showAlternate ? "opacity-100" : "opacity-0"}`}>
                <LogisticsSectionAlternate onHover={handleMouseEnter} onLeave={handleMouseLeave} />
            </div>
        </div>
    );
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const LogisticsSectionDefault = ({ onHover, onLeave }) => (
    <div className="flex pl-25 justify-between h-[520px] bg-[#022B23]">
        <div className="flex-col py-14">
            <p className="text-[#ffeebe]">LOGISTICS</p>
            <p className="font-medium text-[#C6EB5F] text-[22px] mt-2">
                Seamless Transportation for <br /> Your Farm Produce.
            </p>

            <div className="flex gap-[24px] h-[87px] mt-[38px]">
                <Image src={sideLine} alt="photo" height={80} width={3} className="h-[80px]" />
                <p className="text-[#FFEEBE] font-normal text-[19px]">
                    Get your products to the right buyers, <br/> at the right time, with our smart <br />
                    logistics support.
                </p>
            </div>

            <div className="flex gap-[24px] h-[87px] mt-[24px]">
                <Image src={sideLine} alt="photo" height={80} width={3} className="h-[80px]" />
                <p className="text-[#FFEEBE] font-normal text-[19px]">
                    We connect farmers and traders with reliable <br/>transporters, ensuring fast and cost-effective <br />
                    deliveries.
                </p>
            </div>

            <button
                onMouseEnter={onHover}
                onMouseLeave={onLeave}
                style={{ background: "#C6EB5F", color: "#022B23" }}
                className="w-[155px] cursor-pointer h-[40px] text-white rounded-xl font-semibold flex items-center justify-center gap-2 mt-[38px] p-2 mb-[30px]"
            >
                Create account
                <Image src={arrow} alt="img" height={18} width={18} className="cursor-pointer" />
            </button>
        </div>

        <Image src={riderImg} alt="image" className="w-[649px] h-[520px] pl-10" />
    </div>
);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const LogisticsSectionAlternate = ({ onHover, onLeave }) => (
    <div className="flex pl-25 justify-between h-[520px] bg-[#FFFAEB]">
        <div className="flex-col py-14">
            <p className="text-[#1E1E1E]">SELLER</p>
            <p className="font-medium text-[#022B23] text-[22px] mt-2">
                Sell Your Farm Produce<br/>
                & Reach More Buyers
            </p>

            <div className="flex gap-[24px] h-[87px] mt-[38px]">
                <Image src={shortFrame} alt="photo" height={80} width={3} className="h-[58px]" />
                <p className="text-[#1E1E1E] font-normal text-[19px]">
                    Take your agribusiness to the next level <br/>by listing your produce on our platform.
                </p>
            </div>

            <div className="flex gap-[24px] h-[87px] mt-[24px]">
                <Image src={shortFrame} alt="photo" height={80} width={3} className="h-[75px]" />
                <p className="text-[#1E1E1E] font-normal text-[19px]">
                    Connect with buyers, set your prices,<br/> and manage sales effortlessly<br/>
                    — all in one place.</p>
            </div>

            <button
                onMouseEnter={onHover}
                onMouseLeave={onLeave}
                className=" bg-green-950 text-[#C6EB5F] w-[155px] h-[40px] cursor-pointer rounded-xl font-semibold flex items-center justify-center gap-2 mt-[38px] p-2 mb-[30px]"
            >
                Start selling
                <Image src={limeArrow} alt="img" height={18} width={18} className="cursor-pointer" />
            </button>
        </div>

        <Image src={sellerImg} alt="image" className="w-[649px] h-[520px] pl-14" />
    </div>
);

export default LogisticsSection;
