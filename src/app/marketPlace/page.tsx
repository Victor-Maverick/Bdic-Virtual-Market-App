'use client'
import React from 'react';
import BannerSection from "@/components/bannerSection";
import Image, {StaticImageData} from 'next/image';
import FeaturedCategories from "@/components/featuredCategories";
import MarketProductCard from "@/components/marketProductCard";
import marketIcon from '@/../public/assets/images/market element.png'
import searchImg from '@/../public/assets/images/search-normal.png'
import books from '@/../public/assets/images/books.png'
import eraser from '@/../public/assets/images/eraser.png'
import pencils from '@/../public/assets/images/pencils.png'
import highlightSet from '@/../public/assets/images/highlight set.png'
import fashionIcon from '@/../public/assets/images/fashionIcon.png'
import neckTie from '@/../public/assets/images/men tie.png'
import skirtImg from '@/../public/assets/images/skirt.png'
import { useState, useEffect} from "react";
import axios from 'axios';
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
import {fetchMarkets, fetchStates} from "@/utils/api";
import {ChevronDown} from "lucide-react";

type Category = {
    label: string;
    icon: string;
};

type Market = {
    id: number;
    name: string;
};

type State = {
    id: number;
    name: string;
};

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    mainImageUrl: string;
    sideImage1Url: string;
    sideImage2Url: string;
    sideImage3Url: string;
    sideImage4Url: string;
    shopId: number;
    shopName: string;
    categoryId: number;
    categoryName: string;
}

const ProductCard = ({image, price, name, isApiProduct = false}: {
    image: string | StaticImageData;
    price: number | string;
    name: string;
    isApiProduct?: boolean;
}) => {
    const router = useRouter();
    const handleOpen = () => {
        router.push(`/marketPlace/productDetails`);
    }

    return (
        <div onClick={handleOpen} className="cursor-pointer w-full rounded-[14px] bg-[#FFFFFF] border border-[#ededed]">
            {isApiProduct ? (
                <Image
                    src={`https://api.digitalmarke.bdic.ng${image}`}
                    alt={name}
                    className="w-full h-[200px] object-cover rounded-t-[14px]"
                />
            ) : (
                <Image src={image} alt={'image'} className="w-full object-cover rounded-t-[14px]"/>
            )}
            <div className="mt-4 px-4 flex-col gap-[2px]">
                <p className="font-normal text-[#1E1E1E]">{name}</p>
                <p className="font-semibold text-[20px] text-[#1E1E1E] mb-4 mt-1">₦{price}.00</p>
            </div>
        </div>
    )
}

const categories: Category[] = [
    {label: "Agriculture", icon: agricimg},
    {label: "Electronics", icon: electronicIcon},
    {label: "Healthcare", icon: hospitalIcon},
    {label: "Kids", icon: babyIcon},
    {label: "Skincare", icon: lotionIcon},
    {label: "Cars", icon: carIcon},
    {label: "Smartphones", icon: mobileIcon},
    {label: "Fashion", icon: fashionIcon},
    {label: "Home", icon: homeIcon},
    {label: "Travel", icon: mapIcon},
    {label: "Computing", icon: deviceIcon},
];

const SearchBar = () => (
    <div className="flex gap-2 items-center bg-[#F9F9F9] border-[0.5px] border-[#ededed] h-[52px] px-[10px] rounded-[8px]">
        <Image src={searchImg} alt="Search Icon" width={20} height={20} className="h-[20px] w-[20px]"/>
        <input placeholder="Search for items here" className="w-[540px] text-[#707070] text-[14px] focus:outline-none"/>
    </div>
);

const ProductGrid = ({apiProducts = []}: { apiProducts?: Product[] }) => (
    <div className="grid grid-cols-5 w-full gap-x-3 gap-y-[10px] px-25 py-[10px]">
        {apiProducts.map((product: Product) => (
            <ProductCard
                key={`api-${product.id}`}
                name={product.name}
                image={product.mainImageUrl}
                price={product.price}
                isApiProduct={true}
            />
        ))}
    </div>
);

const FlashSale = ({countdown, featuredProducts}: {
    countdown: number;
    featuredProducts: { name: string; image: StaticImageData; price: string }[]
}) => {
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
                <div className="grid grid-cols-5 gap-[6px]">
                    {featuredProducts.map((product, index) => (
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
        {id: 1, image: store1},
        {id: 2, image: store2},
        {id: 3, image: store1},
        {id: 4, image: store2},
        {id: 5, image: store1},
        {id: 6, image: store2},
        {id: 7, image: store1},
        {id: 8, image: store2},
        {id: 9, image: store1},
        {id: 10, image: store2},
    ], []);

    const PictureCard = ({image}: { image: StaticImageData }) => {
        return (
            <div
                onClick={() => {
                    router.push("/marketPlace/store")
                }}
                className="w-full h-[200px] rounded-[14px] overflow-hidden">
                <Image
                    src={image}
                    alt="store"
                    className="w-full h-full object-cover rounded-[14px]"
                    priority
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
                        <PictureCard key={product.id} image={product.image}/>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Dropdown = <T extends { id: number; name: string }>({
                                                              items,
                                                              selectedItem,
                                                              onSelect,
                                                              placeholder,
                                                          }: {
    items: T[];
    selectedItem: T | null;
    onSelect: (item: T) => void;
    placeholder: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="bg-[#F9F9F9] border border-[#EDEDED] rounded-[8px] h-[52px] flex justify-between px-[18px] items-center cursor-pointer"
            >
                <p className={`${selectedItem ? "text-[#121212]" : "text-[#707070]"} text-[14px] font-normal`}>
                    {selectedItem ? selectedItem.name : placeholder}
                </p>
                <ChevronDown
                    size={16}
                    className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    color="#707070"
                />
            </div>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-full bg-white text-black rounded-md shadow-lg z-10 border border-[#ededed]">
                    <ul className="py-1">
                        {items.map((item) => (
                            <li
                                key={item.id}
                                className="px-4 py-2 text-black hover:bg-[#ECFDF6] cursor-pointer"
                                onClick={() => {
                                    onSelect(item);
                                    setIsOpen(false);
                                }}
                            >
                                {item.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};


const MarketPlace = () => {
    const [countdown, setCountdown] = useState<number>(24 * 60 * 60);
    const [apiProducts, setApiProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [markets, setMarkets] = useState<Market[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
    const [selectedState, setSelectedState] = useState<State | null>(null);

    const featuredProducts = [
        {name: "Pack of pen", image: books, price: "2,000"},
        {name: "Notebook", image: books, price: "1,500"},
        {name: "Eraser", image: eraser, price: "300"},
        {name: "Pencil case", image: pencils, price: "800"},
        {name: "Highlighter set", image: highlightSet, price: "1,200"},
        {name: "Pack of pen", image: books, price: "2,000"},
        {name: "Notebook", image: books, price: "1,500"},
        {name: "Eraser", image: eraser, price: "300"},
        {name: "Pencil case", image: pencils, price: "800"},
        {name: "Highlighter set", image: highlightSet, price: "1,200"}
    ];

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get('https://api.digitalmarke.bdic.ng/api/products/all', {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success && response.data.data) {
                setApiProducts(response.data.data);
            } else {
                throw new Error(response.data.message || 'Failed to fetch products');
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || err.message || 'An error occurred while fetching products');
            } else {
                setError(err instanceof Error ? err.message : 'An error occurred while fetching products');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            const [marketsData, statesData] = await Promise.all([
                fetchMarkets(),
                fetchStates(),
            ]);
            setMarkets(marketsData);
            setStates(statesData);

            // Set default selections if data is available
            if (marketsData.length > 0) {
                setSelectedMarket(marketsData[0]);
            }
            if (statesData.length > 0) {
                setSelectedState(statesData[0]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchData();
    }, []);

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
                <div className="flex justify-between h-[595px] pt-[10px] px-25">
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
                        <div className="flex justify-end mb-[2px] gap-[8px] items-center">
                            <SearchBar/>
                            <div className="flex items-center p-[2px] border-[0.5px] border-[#ededed]">
                                <div className="w-[121px]">
                                    <Dropdown
                                        items={states}
                                        selectedItem={selectedState}
                                        onSelect={setSelectedState}
                                        placeholder="Benue State"
                                    />
                                </div>
                                <div className="w-[171px]">
                                    <Dropdown
                                        items={markets}
                                        selectedItem={selectedMarket}
                                        onSelect={setSelectedMarket}
                                        placeholder="Wurukum market"
                                    />
                                </div>
                            </div>
                        </div>
                        <BannerSection/>
                    </div>
                </div>
                <FeaturedCategories/>

                <div className="flex items-center w-full justify-between h-[66px] px-25 border-y border-[#ededed]">
                    <div className="flex gap-[2px] p-0.5 border border-[#ededed] w-[313px] rounded-[2px]">
                        <div className="flex gap-[4px] h-[42px] w-[159px] bg-[#f9f9f9] rounded-[2px] items-center px-[8px] py-[14px]">
                            <Image width={20} height={20} src={marketIcon} alt="Market Icon"/>
                            <p className="text-[#1E1E1E] font-normal text-[14px]">
                                {loading ? 'Loading...' : `${apiProducts.length} Products`}
                            </p>
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
                                <Image src={neckTie} alt={''}/>
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

                {loading && (
                    <div className="flex justify-center items-center py-10">
                        <p className="text-[#1E1E1E] text-lg">Loading products...</p>
                    </div>
                )}

                {error && (
                    <div className="flex justify-center items-center py-10">
                        <p className="text-red-500 text-lg">Error: {error}</p>
                        <button
                            onClick={fetchProducts}
                            className="ml-4 bg-[#022B23] text-white px-4 py-2 rounded"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <ProductGrid apiProducts={apiProducts}/>
                )}

                <div className="flex-col px-25">
                    <FlashSale countdown={countdown} featuredProducts={featuredProducts}/>
                </div>
                <StoreSection/>

                {!loading && !error && (
                    <ProductGrid apiProducts={[]}/>
                )}
            </div>
            <Footer/>
        </>
    );
};

export default MarketPlace;