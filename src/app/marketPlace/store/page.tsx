'use client'
import MarketPlaceHeader from "@/components/marketPlaceHeader";
import shadow from '@/../public/assets/images/shadow.png';
import React, {Key, useState} from "react";
import Image from "next/image";
import searchImg from "../../../../public/assets/images/search-normal.png";
import marketIcon from "../../../../public/assets/images/market element.png";
import arrowBack from '@/../public/assets/images/arrow-right.svg'
import vendorImg from "../../../../public/assets/images/vendorImg.svg";
import verify from "../../../../public/assets/images/verify.svg";
import locationImg from "../../../../public/assets/images/location.png";
import shopImg from "../../../../public/assets/images/shop.png";
import chatIcon from "../../../../public/assets/images/chatIcon.png";
import { Star} from 'lucide-react';
import tableFan from "../../../../public/assets/images/table fan.png";
import wirelessCharger from "../../../../public/assets/images/wireless charger.png";
import jblSpeaker from "../../../../public/assets/images/jbl.png";
import smartWatch from "../../../../public/assets/images/smartwatch.png";
import hardDrive from "../../../../public/assets/images/samsung.png";
import airForce from "../../../../public/assets/images/airforce.svg";
import nikeDunk from "../../../../public/assets/images/nike dunk low.png";
import yeezy from "../../../../public/assets/images/yeezy.png";
import reebok from "../../../../public/assets/images/reebok.png";
import tomatoes from "../../../../public/assets/images/tomatoes.png";
import cucumber from "../../../../public/assets/images/cucumber.png";
import carrots from "../../../../public/assets/images/carrots.png";
import bellPeppers from "../../../../public/assets/images/bell peppers.png";
import {useRouter} from "next/navigation";


const SearchBar = () => (
    <div className="flex gap-2 items-center bg-[#F9F9F9] border-[0.5px] border-[#ededed] h-[52px] px-[10px] rounded-[8px]">
        <Image src={searchImg} alt="Search Icon" width={20} height={20} className="h-[20px] w-[20px]"/>
        <input placeholder="Search for items here" className="w-[540px] text-[#707070] text-[14px] focus:outline-none"/>
    </div>
);

const products = [
    { name: "Mini fan", image: tableFan, price: "23,000" },
    { name: "Wireless charger", image: wirelessCharger, price: "15,000" },
    { name: "Bluetooth speaker", image: jblSpeaker, price: "35,000" },
    { name: "Smart watch", image: smartWatch, price: "40,000" },
    { name: "Portable hard drive", image: hardDrive, price: "25,000" },
    { name: "Air Force 1", image: airForce, price: "32,000" },
    { name: "Nike dunk low", image: nikeDunk, price: "28,000" },
    { name: "Adidas superstar", image: nikeDunk, price: "25,000" },
    { name: "Yeezy", image: yeezy, price: "20,000" },
    { name: "Reebok classic leather", image: reebok, price: "20,000" },
    { name: "Tomatoes", image: tomatoes, price: "2,000" },
    { name: "Cucumbers", image: cucumber, price: "1,500" },
    { name: "Carrots", image: carrots, price: "1,200" },
    { name: "Bell pepper", image: bellPeppers, price: "2,500" }
]

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const ProductCard = ({image,price,name})=>{
    const router = useRouter();
    const handleOpen = ()=>{
        router.push(`/marketPlace/productDetails`);
    }

    return (
        <div onClick={handleOpen}  className="cursor-pointer w-full rounded-[14px] bg-[#FFFFFF] border border-[#ededed]">
            <Image src={image} alt={'image'}  className="w-full object-cover rounded-t-[14px]" />
            <div className="mt-4 px-4 flex-col gap-[2px]">
                <p className="font-normal  text-[#1E1E1E]">{name}</p>
                <p className="font-semibold text-[20px]text-[#1E1E1E] mb-4 mt-1">₦{price}.00</p>
            </div>
        </div>
    )
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const ProductGrid = ({products}) => (
    <div className="grid grid-cols-5 w-full mt-[10px] gap-x-3 gap-y-[10px] px-25 py-[10px]">
        {products.map((product: { name: unknown; image: unknown; price: unknown; }, index: Key | null | undefined) => (
            <ProductCard
                key={index}
                name={product.name}
                image={product.image}
                price={product.price}
            />
        ))}
    </div>
);

const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => {
        let fillColor = "none";
        let percentageFill = 0;

        if (i < Math.floor(rating)) {
            fillColor = "#E5A000"; // Fully filled star
            percentageFill = 100;
        } else if (i < Math.ceil(rating)) {
            percentageFill = Math.round((rating - i) * 100);
            fillColor = `url(#grad${i})`;
        }

        return (
            <svg key={i} width="22" height="22" viewBox="0 0 24 24">
                <defs>
                    <linearGradient id={`grad${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset={`${percentageFill}%`} stopColor="#E5A000" />
                        <stop offset={`${percentageFill}%`} stopColor="white" />
                    </linearGradient>
                </defs>
                <Star fill={fillColor} stroke="#E5A000" className="w-[17px] h-[16px]" />
            </svg>
        );
    });
};



const Store = () => {
    const [selectedMarket, setSelectedMarket] = useState("Wurukum");
    const rating = 4.5;
    return (
        <>
            <MarketPlaceHeader />
            <div className="h-[114px] w-full  border-b-[0.5px] border-[#EDEDED]">
                {/* Div with shadow background */}
                <div
                    className="h-[66px] bg-cover w-full flex justify-between items-center px-25 bg-no-repeat bg-center relative"
                    style={{ backgroundImage: `url(${shadow.src})` }} // Using Next.js Image optimization
                >
                    {/*<Dropdown/>*/}
                    <SearchBar/>
                    <div className="flex ml-[10px] gap-[2px] p-[2px] h-[52px] items-center justify-between  border border-[#ededed] rounded-[4px]">
                        <div className="bg-[#F9F9F9] text-black px-[8px] rounded-[4px] flex items-center justify-center h-[48px]">
                            <select className="bg-[#F9F9F9] text-[#1E1E1E] text-[14px] rounded-sm text-center w-full focus:outline-none">
                                <option>Benue State</option>
                                <option>Enugu State</option>
                                <option>Lagos State</option>
                            </select>
                        </div>

                        <div className="relative">
                            <div className="flex items-center bg-[#F9F9F9] px-[8px] h-[48px] rounded-[4px]">
                                <Image src={marketIcon} alt="Market Icon" width={20} height={20} />
                                <select
                                    className="bg-[#F9F9F9] text-[#1E1E1E] text-[14px] items-center pr-1 focus:outline-none"
                                    onChange={(e) => setSelectedMarket(e.target.value)}
                                    value={selectedMarket}
                                >
                                    <option>Wurukum market</option>
                                    <option>Gboko Market</option>
                                    <option>Otukpo Market</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-[48px] px-25 gap-[8px] items-center flex">
                    <Image src={arrowBack} alt={'imagw'}/>
                    <p className="text-[14px] text-[#3F3E3E]">Go back // stores // <span className="font-medium text-[#022B23]">Abba Technologies</span></p>
                </div>
            </div>
            <div className=" py-[20px] gap-y-[20px]">
                <div className="pb-[20px] border-b border-[#ededed]">
                    <div className="flex mx-25 justify-between">
                        {/*Left side*/}
                        <div className="flex flex-col gap-[20px]">
                            <div className="border border-[#ededed] rounded-3xl h-[157px] ">
                                <div className="flex items-center border-b border-[#ededed] px-[20px] pt-[10px] justify-between">
                                    <div className="flex gap-[8px] pb-[8px]">
                                        <Image src={vendorImg} alt={'image'} width={40} height={40}/>
                                        <div className="flex-col">
                                            <p className="text-[12px] text-[#707070]">Shop</p>
                                            <p className="text-[16px] font-normal mt-[-4px]">Abba Technologies</p>
                                        </div>
                                    </div>
                                    <div className="w-[74px] p-[6px] gap-[4px] h-[30px] bg-[#C6EB5F] rounded-[8px] flex items-center">
                                        <Image src={verify} alt={'image'}/>
                                        <p className="text-[12px]">verified</p>
                                    </div>
                                </div>
                                <div className="px-[20px] flex items-center gap-[4px] mt-[20px]">
                                    <Image src={locationImg} alt={'image'} width={18} height={18}/>
                                    <p className="text-[14px] font-light">Modern market, Makurdi, Benue State</p>
                                </div>
                                <div className="flex px-[20px] mt-[15px] gap-[18px]">
                                    <div className="flex items-center gap-[4px]">
                                        <Image src={shopImg} alt={'image'} width={18} height={18}/>
                                        <p className="text-[14px] font-light">Abba Technologies Shop 2C</p>
                                    </div>
                                    <div className="flex items-center gap-[4px]">
                                        <Image src={shopImg} alt={'image'} width={18} height={18}/>
                                        <p className="text-[14px] font-light">Lagos line</p>
                                    </div>
                                </div>
                            </div>
                            <div className="w-[300px] w-[48px] gap-[14px] flex items-center">
                                <div className="flex items-center gap-[10px] justify-center bg-[#ffeebe] rounded-[14px] w-[165px] h-[48px]">
                                    <p className="text-[#461602] font-semibold text-[14px]">Text vendor</p>
                                    <Image src={chatIcon} alt={'image'}/>
                                </div>
                                <div className="w-[121px] h-[48px] rounded-[12px] flex border-[2px] border-[#461602] justify-center items-center">
                                    <p className="text-[#461602] font-semibold text-[14px]">Call vendor</p>
                                </div>
                            </div>
                        </div>
                        {/*Right side*/}
                        <div className="w-[442px] flex flex-col h-[163px] gap-[24px]">
                            {/* Rating Box */}
                            <div className="flex justify-end">
                                <div className="bg-[#f9f9f9] border border-[#ededed] rounded-[14px] p-[20px] w-[215px] h-[83px] ">
                                    <p className="text-[14px] text-[#0D0C22] font-medium">Shop rating</p>
                                    <div className="flex items-center gap-[16px]">
                                        <span className="text-xl font-bold text-gray-800">{rating}</span>
                                        <div className="flex gap-[4px]">{renderStars(rating)}</div>                            </div>
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="flex h-[56px] flex items-center p-[4px] gap-[4px] w-full rounded-[100px] border border-[#ededed]">
                                <span className="w-[57px] h-[48px] rounded-[100px] text-[14px] font-medium text-[#022B23] flex items-center justify-center border border-[#ededed]">All</span>
                                <span className="w-[113px] h-[48px] rounded-[100px] text-[14px] font-semibold text-[#022B23] bg-[#ECFDF6] flex items-center justify-center ">
                                Shirts (32)
                            </span>
                                <span className="w-[92px] h-[48px] rounded-[100px] text-[14px] font-semibold text-[#022B23] border border-[#ededed] flex items-center justify-center ">
                                Trouser
                            </span>
                                <span className="w-[82px] h-[48px] rounded-[100px] text-[14px] font-semibold text-[#022B23] border border-[#ededed] flex items-center justify-center ">
                                Shoes
                            </span>
                                <span className="w-[74px] h-[48px] rounded-[100px] text-[14px] font-semibold text-[#022B23] border border-[#ededed] flex items-center justify-center ">
                                Caps
                            </span>
                            </div>
                        </div>
                    </div>
                </div>

                <ProductGrid products={products}/>

            </div>
        </>
    );
};

export default Store;