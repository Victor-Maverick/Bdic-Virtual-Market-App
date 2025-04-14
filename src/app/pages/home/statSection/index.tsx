'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import arrowImg from '../../../../../public/assets/images/cartImg.png';

const stats = [
    { label: "Vendors", value: 300000 },
    { label: "Stores", value: 82000 },
    { label: "Buyers", value: 500000 },
];

const formatNumber = (num: number) => {
    if (num >= 1000) {
        return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + "K";
    }
    return num.toString();
};

const StatSection = () => {
    const [counts, setCounts] = useState(stats.map(() => 0));
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            setCounts(stats.map(stat => stat.value));
            return;
        }

        if (!hovered) return;

        const duration = 1000;
        const steps = 50;
        const intervals = stats.map((stat, index) => {
            const increment = stat.value / steps;
            let count = 0;
            return setInterval(() => {
                count += increment;
                setCounts((prev) => {
                    const newCounts = [...prev];
                    newCounts[index] = Math.min(count, stat.value);
                    return newCounts;
                });
            }, duration / steps);
        });

        return () => intervals.forEach(clearInterval);
    }, [hovered]);

    return (
        <div
            className="bg-[#f9fbe9] px-4 md:px-[6vw] py-4 w-full"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="flex items-center justify-between flex-wrap md:flex-nowrap w-full">
                <div className="flex w-full justify-between md:justify-start md:gap-[5vw] text-sm md:text-base">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center md:items-start">
                            <p className="text-[#022b23] uppercase text-xs md:text-sm">{stat.label}</p>
                            <p className="text-[#022b23] text-lg md:text-[2.25rem] font-semibold">
                                {formatNumber(Math.floor(counts[index]))}+
                            </p>
                        </div>
                    ))}
                </div>

                {/* Image - Hidden on small screens */}
                <div className="hidden md:block md:ml-12">
                    <Image src={arrowImg} alt="Arrow Image" width={80} height={80} />
                </div>
            </div>
        </div>
    );
};

export default StatSection;
