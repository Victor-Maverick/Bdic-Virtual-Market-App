
'use client'
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
import airForce from '@/../public/assets/images/air force 1.png'
import reebok from '@/../public/assets/images/reebok.png'
import box from '@/../public/assets/images/box.png'
import routing from '@/../public/assets/images/routing.png'
import bag from '@/../public/assets/images/bag.png'
import profileImage from '@/../public/assets/images/profile-circle.png'
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
import agricImg from '@/../public/assets/images/agricImg.png'
import skirtImg from '@/../public/assets/images/skirt.png'
import { useState, useEffect, Key} from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Dropdown from "@/components/dropDown";




const SearchBar = () => (
    <div className="flex gap-2 items-center bg-[#F9F9F9] text-black px-4 py-2 rounded-sm">
        <Image src={searchImg} alt="Search Icon" width={20} height={20}/>
        <input placeholder="Search for items here" className="w-[320px] focus:outline-none"/>
    </div>
);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const ProductGrid = ({products}) => (
    <div className="grid grid-cols-5 gap-x-3 gap-y-3 px-25 py-6">
        {products.map((product: { name: unknown; image: unknown; price: unknown; }, index: Key | null | undefined) => (
            <MarketProductCard
                key={index}
                height={320}
                name={product.name}
                image={product.image}
                price={product.price} size={undefined} imageHeight={undefined}            />
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
            <div className="bg-[#C6EB5F] h-[80px] rounded-t-3xl flex justify-between px-4 pt-2">
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
                    <button className="bg-white text-[#022B23] w-[91px] h-[47px] rounded-[14px]">View all</button>
                </div>
            </div>
            <div className="flex bg-[#FFFAEB] gap-[6px] justify-center py-3 rounded-b-3xl">
                {featuredProducts.map((product: { name: unknown; image: unknown; price: unknown; }, index: Key | null | undefined) => (
                    <MarketProductCard
                        height={330}
                        key={index}
                        name={product.name}
                        image={product.image}
                        price={product.price} size={200} imageHeight={200}                    />
                ))}
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
            <Header/>
            <div className="flex-col pt-[90px] w-full">
                <div className="flex justify-between py-3 px-25 border-y border-y-[#EDEDED] bg-[linear-gradient(to bottom, rgba(68, 255, 154, 0.9)]">

                    <div className="flex justify-evenly gap-8 items-center">
                        {[
                            { img: box, text: "Become a vendor" },
                            { img: routing, text: "Track order" },
                            { img: bag, text: "Cart" },
                            { img: profileImage, text: "My account" }
                        ].map(({ img, text }, index) => (
                            <div key={index} className="flex gap-1 text-[16px] font-semibold items-center cursor-pointer">
                                <Image src={img} alt="icon" height={20} width={20} />
                                <p>{text}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2 justify-between p-0.5 border border-[#ededed] rounded-sm">
                        <div className="bg-[#F9F9F9] text-black px-2 rounded-sm flex items-center justify-center h-10">
                            <select className="bg-[#F9F9F9] text-black px-2 rounded-sm text-center w-full focus:outline-none">
                                <option>Benue State</option>
                                <option>Enugu State</option>
                                <option>Lagos State</option>
                            </select>
                        </div>

                        <div className="relative">
                            <div className="flex items-center bg-[#F9F9F9] text-black px-4 py-2 rounded-md">
                                <Image src={marketIcon} alt="Market Icon" width={20} height={20} />
                                <select
                                    className="bg-[#F9F9F9] text-black items-center pr-1 focus:outline-none"
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

                <div className="flex justify-between px-25 mt-4">
                    <Dropdown/>
                    <SearchBar />
                </div>
                <BannerSection />
                <FeaturedCategories />

                <div className="flex items-center justify-between h-[66px] px-25 border-y border-[#ededed]">
                    <div className="flex gap-[2px] p-0.5 border border-[#ededed] rounded-[2px]">
                        <div className="flex gap-[4px] h-[42px] w-[159px] bg-[#f9f9f9] rounded-[2px] items-center px-[8px] py-[14px]">
                            <Image width={20} height={20} src={marketIcon} alt="Market Icon" />
                            <p className="text-[#1E1E1E] font-normal text-[14px]">506,092 Products</p>
                        </div>
                        <div className="bg-[#f9f9f9] w-[86px] h-[42px] px-2 items-center justify-center rounded-[2px]">
                            <select className="bg-[#f9f9f9] w-full text-[#1E1E1E] text-[14px] h-[42px] pr-2 px-[8px] focus:outline-none">
                                <option value="" hidden>Filter</option>
                            </select>
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
                                <Image src={agricImg} alt={''}/>
                                <p className="text-center text-[14px]">Farm</p>
                            </div>
                        </div>
                    </div>
                </div>
                <ProductGrid products={products} />
                <div className="flex-col px-25">
                    <FlashSale countdown={countdown} featuredProducts={featuredProducts} />
                </div>
            </div>
            <Footer/>
        </>

);
};

export default MarketPlace;