'use client'
import React from 'react';
import BannerSection from "@/components/bannerSection";
import Image from 'next/image';
import FeaturedCategories from "@/components/featuredCategories";
import MarketProductCard from "@/components/marketProductCard";
import tableFan from '@/../public/assets/images/table fan.png'
import wirelessCharger from '@/../public/assets/images/wireless charger.png'
import jblSpeaker from '@/../public/assets/images/jbl.png'
import smartWatch from '@/../public/assets/images/smartwatch.png'
import hardDrive from '@/../public/assets/images/samsung.png'
import nikeDunk from '@/../public/assets/images/nike dunk low.png'
import airForce from '@/../public/assets/images/airforce.svg'
import reebok from '@/../public/assets/images/reebok.png'
import marketIcon from '@/../public/assets/images/market element.png'
import searchImg from '@/../public/assets/images/search-normal.png'
import yeezy from '@/../public/assets/images/yeezy.png'
import tomatoes from '@/../public/assets/images/tomatoes.png'
import cucumber from '@/../public/assets/images/cucumber.png'
import carrots from '@/../public/assets/images/carrots.png'
import bellPeppers from '../../../public/assets/images/bell peppers.png'
import onions from '@/../public/assets/images/onions.png'
import books from '@/../public/assets/images/books.png'
import eraser from '@/../public/assets/images/eraser.png'
import pencils from '@/../public/assets/images/pencils.png'
import highlightSet from '@/../public/assets/images/highlight set.png'
import fashionIcon from '@/../public/assets/images/fashionIcon.png'
import neckTie from '@/../public/assets/images/men tie.png'
import skirtImg from '@/../public/assets/images/skirt.png'
import { useState, useEffect, Key} from "react";
import Footer from "@/components/footer";
import MarketPlaceHeader from "@/components/marketPlaceHeader";
import categoryImg from '@/../public/assets/images/categoryImg.svg'
import agricimg from "../../../public/assets/images/mapIcon.png";
import electronicIcon from "../../../public/assets/images/electronicIcon.png";
import hospitalIcon from "../../../public/assets/images/hospitalIcon.svg";
import babyIcon from "../../../public/assets/images/homeIcon.png";
import lotionIcon from "../../../public/assets/images/lotionIcon.svg";
import carIcon from "../../../public/assets/images/carIcon.svg";
import mobileIcon from "../../../public/assets/images/mobileIcon.svg";
import homeIcon from "../../../public/assets/images/homeIcon.png";
import mapIcon from "../../../public/assets/images/mapIcon.png";
import deviceIcon from "../../../public/assets/images/deviceIcon.svg";
import filterImg from '@/../public/assets/images/filter.svg'
import {useRouter} from "next/navigation";
import store1 from '@/../public/assets/images/store1.png'
import store2 from '@/../public/assets/images/store2.png'

type Category = {
    label: string;
    icon: string;
};

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

const categories: Category[] = [
    { label: "Agriculture", icon: agricimg },
    { label: "Electronics", icon: electronicIcon },
    { label: "Healthcare", icon: hospitalIcon },
    { label: "Kids", icon: babyIcon },
    { label: "Skincare", icon: lotionIcon },
    { label: "Cars", icon: carIcon },
    { label: "Smartphones", icon: mobileIcon },
    { label: "Fashion", icon: fashionIcon },
    { label: "Home", icon: homeIcon },
    { label: "Travel", icon: mapIcon },
    { label: "Computing", icon: deviceIcon },
];

const SearchBar = () => (
    <div className="flex gap-2 items-center bg-[#F9F9F9] border-[0.5px] border-[#ededed] h-[52px] px-[10px] rounded-[8px]">
        <Image src={searchImg} alt="Search Icon" width={20} height={20} className="h-[20px] w-[20px]"/>
        <input placeholder="Search for items here" className="w-[540px] text-[#707070] text-[14px] focus:outline-none"/>
    </div>
);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const ProductGrid = ({products}) => (
    <div className="grid grid-cols-5 w-full gap-x-3 gap-y-[10px] px-25 py-[10px]">
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const FlashSale = ({ countdown, featuredProducts }) => {
    const formatTime = (timeInSeconds: number) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;
        return `${hours}Hr : ${minutes.toString().padStart(2, '0')}M : ${seconds.toString().padStart(2, '0')}Sec`;
    };

    return (
        <div className="flex-col rounded-3xl">
            <div className="bg-[#C6EB5F] h-[80px] flex justify-between px-4 pt-2">
                <div>
                    <div className="flex gap-[4px] items-center">
                        <p className="font-normal text-[22px]">Flash sale</p>
                        <div className="bg-white items-center justify-center text-black w-[50px] h-[26px] rounded-full text-center">
                            <p className="font-bold">300+</p>
                        </div>
                    </div>
                    <p className="font-lighter text-[12px]">Check out great products from this store</p>
                </div>
                <div className="flex justify-between items-center gap-[70px]">
                    <div className="flex-col font-semibold">
                        <p>Time Left:</p>
                        <p>{formatTime(countdown)}</p>
                    </div>
                    <button className="bg-white text-[#022B23] w-[91px] h-[47px] rounded-[2px]">View all</button>
                </div>
            </div>
            <div className="bg-[#FFFAEB] p-[10px] rounded-b-3xl">
                {/* Grid container with 5 columns */}
                <div className="grid grid-cols-5 gap-[6px]">
                    {featuredProducts.map((product: { name: unknown; image: unknown; price: unknown; }, index: Key | null | undefined) => (
                        <MarketProductCard
                            height={330}
                            key={index}
                            name={product.name}
                            image={product.image}
                            price={product.price}
                            imageHeight={200}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const StoreSection = () => {
    const router = useRouter();
    const stores = React.useMemo(() => [
        { id: 1, image: store1 },
        { id: 2, image: store2 },
        { id: 3, image: store1 },
        { id: 4, image: store2 },
        { id: 5, image: store1 },
        { id: 6, image: store2 },
        { id: 7, image: store1 },
        { id: 8, image: store2 },
        { id: 9, image: store1 },
        { id: 10, image: store2 },
    ], []);

    const PictureCard = ({ image }: { image: string }) => {
        return (
            <div
                onClick={()=>{router.push("/marketPlace/store")}}
                className="w-full h-[200px] rounded-[14px] overflow-hidden">
                <Image
                    src={image}
                    alt="store"
                    className="w-full h-full object-cover rounded-[14px]"
                    priority // Disables lazy loading (if using Next.js)
                />
            </div>
        );
    };

    return (
        <div className="flex-col rounded-3xl mt-[20px] mx-25">
            <div className="bg-[#022B23] h-[80px] flex justify-between px-4 pt-2">
                <div>
                    <p className="font-medium text-[#C6EB5F] text-[22px]">Stores</p>
                    <p className="text-[#C6EB5F] text-[14px]">Check out top verified stores</p>
                </div>
            </div>
            <div className="bg-[#F9FDE8] mt-[6px] h-[440px] border border-[#C6EB5F] p-[10px]">
                <div className="grid grid-cols-5 gap-[6px]">
                    {stores.map((product) => (
                        <PictureCard key={product.id} image={product.image} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const MarketPlace = () => {
    const [selectedMarket, setSelectedMarket] = useState("Wurukum");
    const [countdown, setCountdown] = useState(24 * 60 * 60); // 24 hours in seconds

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
        { name: "Bell pepper", image: bellPeppers, price: "2,500" },
        { name: "Onions", image: onions, price: "800" },
        { name: "Pack of pen", image: books, price: "2,000" },
        { name: "Notebook", image: books, price: "1,500" },
        { name: "Eraser", image: eraser, price: "300" },
        { name: "Pencil case", image: pencils, price: "800" },
        { name: "Highlighter set", image: highlightSet, price: "1,200" }
    ];

    const featuredProducts = [
        { name: "Pack of pen", image: books, price: "2,000" },
        { name: "Notebook", image: books, price: "1,500" },
        { name: "Eraser", image: eraser, price: "300" },
        { name: "Pencil case", image: pencils, price: "800" },
        { name: "Highlighter set", image: highlightSet, price: "1,200" },
        { name: "Pack of pen", image: books, price: "2,000" },
        { name: "Notebook", image: books, price: "1,500" },
        { name: "Eraser", image: eraser, price: "300" },
        { name: "Pencil case", image: pencils, price: "800" },
        { name: "Highlighter set", image: highlightSet, price: "1,200" }
    ];

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 0) {
                    clearInterval(countdownInterval);
                    return 0;
                }
                return prevCountdown - 1;
            });
        }, 1000);

        return () => clearInterval(countdownInterval);
    }, []);

    return (
        <>
            <MarketPlaceHeader/>
            <div className="flex-col w-full border-t-[0.5px] border-[#ededed]">
                <div className="flex h-[595px] pt-[10px] px-25">
                    <div className="w-[20%] flex flex-col drop-shadow-sm h-full">
                        <div className="rounded-t-[8px] gap-[8px] h-[52px] px-[10px] font-medium text-[16px] flex  items-center bg-[#022B23]">
                            <Image src={categoryImg} alt={'image'}/>
                            <p className="text-[#FFEEBE]">Categories</p>
                        </div>
                        <div className="shadow-sm">
                            <ul className=" ">
                                {categories.map((option, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center px-[14px] gap-[10px] h-[48px] text-[#1E1E1E] hover:bg-[#ECFDF6] cursor-pointer"
                                    >
                                        <Image
                                            src={option.icon}
                                            alt={option.label}
                                            width={20}
                                            height={20}
                                        />
                                        {option.label}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col h-full w-[80%]">
                        <div className="flex justify-end mb-[2px]">
                            <SearchBar />
                            <div className="flex ml-[20px] gap-[2px] p-[2px] h-[52px] items-center justify-between  border border-[#ededed] rounded-[4px]">
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
                        <BannerSection />
                    </div>
                </div>
                <FeaturedCategories />

                <div className="flex items-center w-full justify-between h-[66px] px-25 border-y border-[#ededed]">
                    <div className="flex gap-[2px] p-0.5 border border-[#ededed] w-[313px] rounded-[2px]">
                        <div className="flex gap-[4px] h-[42px] w-[159px] bg-[#f9f9f9] rounded-[2px] items-center px-[8px] py-[14px]">
                            <Image width={20} height={20} src={marketIcon} alt="Market Icon" />
                            <p className="text-[#1E1E1E] font-normal text-[14px]">506,092 Products</p>
                        </div>
                        <div className="bg-[#f9f9f9] gap-[4px] text-[#1E1E1E] flex text-[14px] w-[148px] h-[42px] px-1 items-center justify-center rounded-[2px]">
                            <Image src={filterImg} alt={'image'} width={20} height={20} className="w-[20px] h-[20px]"/>
                            <p>Sort by: <span className="text-[#022B23] font-medium">Popular</span></p>
                        </div>
                    </div>
                    <div className="flex justify-between gap-[10px]">
                        <div className="border border-[#EDEDED] rounded-[4px]  p-0.5">
                            <div className="bg-[#EDEDED] justify-center items-center gap-[4px] p-[2px] flex rounded-[4px] h-[44px] w-[100px]  text-center ">
                                <Image src={marketIcon} alt={''}/>
                                <p className="text-center text-[14px]">Below 5k</p>
                            </div>
                        </div>
                        <div className="border border-[#EDEDED] rounded-[4px]  p-0.5">
                            <div className="bg-[#EDEDED] justify-center items-center gap-[4px] p-[2px] flex rounded-[4px] h-[46px] w-[100px]  text-center ">
                                <Image src={marketIcon} alt={''}/>
                                <p className="text-center text-[14px]">Below 50k</p>
                            </div>
                        </div>
                        <div className="border border-[#EDEDED] rounded-[4px]  p-0.5">
                            <div className="bg-[#EDEDED] justify-center items-center gap-[4px] p-[2px] flex rounded-[4px] h-[46px] w-[100px]  text-center ">
                                <Image src={fashionIcon} alt={''} height={20} width={20}/>
                                <p className="text-center text-[14px]">Fashion</p>
                            </div>
                        </div>
                        <div className="border border-[#EDEDED] rounded-[4px]  p-0.5">
                            <div className="bg-[#EDEDED] justify-center items-center gap-[4px] p-[2px] flex rounded-[4px] h-[46px] w-[100px]  text-center ">
                                <Image src={neckTie} alt={''} />
                                <p className="text-center text-[14px]">Men</p>
                            </div>
                        </div>
                        <div className="border border-[#EDEDED] rounded-[4px]  p-0.5">
                            <div className="bg-[#EDEDED] justify-center items-center gap-[4px] p-[2px] flex rounded-[4px] h-[46px] w-[100px]  text-center ">
                                <Image src={skirtImg} alt={''}/>
                                <p className="text-center text-[14px]">Women</p>
                            </div>
                        </div>
                        <div className="border border-[#EDEDED] rounded-[4px]  p-0.5">
                            <div className="bg-[#EDEDED] justify-center items-center gap-[4px] p-[2px] flex rounded-[4px] h-[46px] w-[100px]  text-center ">
                                <Image src={skirtImg} alt={''}/>
                                <p className="text-center text-[14px]">Farm</p>
                            </div>
                        </div>
                    </div>
                </div>
                <ProductGrid products={products} />
                <div className="flex-col px-25">
                    <FlashSale countdown={countdown} featuredProducts={featuredProducts} />
                </div>
                <StoreSection/>
                <ProductGrid products={products} />
            </div>
            <Footer/>
        </>

);
};

export default MarketPlace;