'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

import axios from 'axios';
import MarketPlaceHeader from "@/components/marketPlaceHeader";
import shadow from '@/../public/assets/images/shadow.png';
import Image from "next/image";
import searchImg from "../../../../../public/assets/images/search-normal.png";
import marketIcon from "../../../../../public/assets/images/market element.png";
import arrowBack from '@/../public/assets/images/arrow-right.svg'
import vendorImg from "../../../../../public/assets/images/vendorImg.svg";
import verify from "../../../../../public/assets/images/verify.svg";
import locationImg from "../../../../../public/assets/images/location.png";
import shopImg from "../../../../../public/assets/images/shop.png";

import { Star } from 'lucide-react';
import { toast } from 'react-toastify';
import VideoCallButton from '@/components/VideoCallButton';
import ChatButton from '@/components/ChatButton';

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
    vendorEmail: string;
    vendorName: string;
    city: string;
    market: string;
    marketSection: string;
    shopNumber: string;
    shopAddress: string;
}

interface ShopData {
    id: number;
    name: string;
    address: string;
    logoUrl: string;
    phone: string;
    shopNumber: string;
    homeAddress: string;
    streetName: string;
    cacNumber: string;
    taxIdNumber: string;
    nin: number;
    bankName: string;
    accountNumber: string;
    marketId: number;
    marketSectionId: number;
    firstName: string;
    status: string;
    vendorName?: string;
    vendorEmail?: string;
    businessPhone?: string;
    market?: string;
    marketSection?: string;
}

const SearchBar = () => (
    <div className="flex gap-2 items-center bg-[#F9F9F9] border-[0.5px] border-[#ededed] h-[52px] px-[10px] rounded-[8px]">
        <Image src={searchImg} alt="Search Icon" width={20} height={20} className="h-[20px] w-[20px]"/>
        <input placeholder="Search for items here" className="w-[540px] text-[#707070] text-[14px] focus:outline-none"/>
    </div>
);

const ProductCard = ({ product }: { product: Product }) => {
    const router = useRouter();
    const handleOpen = () => {
        router.push(`/marketPlace/productDetails/${product.id}`);
    }

    return (
        <div onClick={handleOpen} className="cursor-pointer w-full rounded-[14px] bg-[#FFFFFF] border border-[#ededed] hover:shadow-lg transition-shadow">
            <Image 
                src={product.mainImageUrl || "/placeholder.svg"} 
                alt={product.name}
                width={200}
                height={200}
                className="w-full h-[200px] object-cover rounded-t-[14px]" 
            />
            <div className="mt-4 px-4 flex-col gap-[2px]">
                <p className="font-normal text-[#1E1E1E] truncate">{product.name}</p>
                <p className="font-semibold text-[20px] text-[#1E1E1E] mb-4 mt-1">₦{product.price.toLocaleString()}</p>
            </div>
        </div>
    )
}

const ProductGrid = ({ products }: { products: Product[] }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-full mt-[10px] gap-x-3 gap-y-[10px] px-4 sm:px-6 lg:px-25 py-[10px]">
        {products.map((product) => (
            <ProductCard
                key={product.id}
                product={product}
            />
        ))}
    </div>
);

const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => {
        let fillColor = "none";
        let percentageFill = 0;

        if (i < Math.floor(rating)) {
            fillColor = "#E5A000";
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

const StorePage = () => {
    const params = useParams();
    const router = useRouter();

    const [selectedMarket, setSelectedMarket] = useState("Wurukum");
    const [products, setProducts] = useState<Product[]>([]);
    const [shopData, setShopData] = useState<ShopData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const shopId = params.id as string;
    const rating = 4.5; // You can make this dynamic later

    const fetchStoreData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Convert shopId to number for backend
            const shopIdNumber = parseInt(shopId);
            
            if (isNaN(shopIdNumber)) {
                throw new Error('Invalid shop ID');
            }

            // Fetch shop details and products using the shop ID
            const [shopResponse, productsResponse] = await Promise.all([
                // Fetch shop details
                axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/shops/${shopIdNumber}`, {
                    headers: { 'Content-Type': 'application/json' }
                }),
                // Fetch products for this shop using your new endpoint
                axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/getByShop`, {
                    params: { shopId: shopIdNumber },
                    headers: { 'Content-Type': 'application/json' }
                })
            ]);

            if (shopResponse.data) {
                setShopData(shopResponse.data);
                console.log("Shop: ", shopResponse.data);
            }

            if (productsResponse.data) {
                setProducts(productsResponse.data);
                console.log("Products: ", productsResponse.data);
            }

        } catch (err) {
            console.error('Error fetching store data:', err);
            setError('Failed to load store data');
            toast.error('Failed to load store data');
        } finally {
            setLoading(false);
        }
    }, [shopId]);

    useEffect(() => {
        if (shopId) {
            fetchStoreData();
        }
    }, [shopId, fetchStoreData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-lg">Loading store...</div>
            </div>
        );
    }

    if (error || !shopData) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="text-lg text-red-600 mb-4">{error || 'Store not found'}</div>
                <button 
                    onClick={() => router.back()}
                    className="bg-[#022B23] text-white px-4 py-2 rounded-lg"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <>
            <MarketPlaceHeader />
            <div className="h-[114px] w-full border-b-[0.5px] border-[#EDEDED]">
                <div
                    className="h-[66px] bg-cover w-full flex justify-between items-center px-4 sm:px-6 lg:px-25 bg-no-repeat bg-center relative"
                    style={{ backgroundImage: `url(${shadow.src})` }}
                >
                    <SearchBar/>
                    <div className="flex ml-[10px] gap-[2px] p-[2px] h-[52px] items-center justify-between border border-[#ededed] rounded-[4px]">
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
                <div className="h-[48px] px-4 sm:px-6 lg:px-25 gap-[8px] items-center flex">
                    <button onClick={() => router.back()}>
                        <Image src={arrowBack} alt={'back'} className="cursor-pointer"/>
                    </button>
                    <p className="text-[14px] text-[#3F3E3E]">
                        Go back // stores // <span className="font-medium text-[#022B23]">{shopData.name}</span>
                    </p>
                </div>
            </div>
            
            <div className="py-[20px] gap-y-[20px]">
                <div className="pb-[20px] border-b border-[#ededed]">
                    <div className="flex mx-4 sm:mx-6 lg:mx-25 justify-between flex-col lg:flex-row gap-6">
                        {/* Left side */}
                        <div className="flex flex-col gap-[20px]">
                            <div className="border border-[#ededed] rounded-3xl h-auto lg:h-[157px] p-4 lg:p-0">
                                <div className="flex items-center border-b border-[#ededed] px-0 lg:px-[20px] pt-0 lg:pt-[10px] justify-between pb-4 lg:pb-[8px]">
                                    <div className="flex gap-[8px]">
                                        <Image src={vendorImg} alt={'vendor'} width={40} height={40}/>
                                        <div className="flex-col">
                                            <p className="text-[12px] text-[#707070]">Shop</p>
                                            <p className="text-[16px] font-normal mt-[-4px]">{shopData.name}</p>
                                        </div>
                                    </div>
                                    {shopData.status === 'ACTIVE' && (
                                        <div className="w-[74px] p-[6px] gap-[4px] h-[30px] bg-[#C6EB5F] rounded-[8px] flex items-center">
                                            <Image src={verify} alt={'verified'}/>
                                            <p className="text-[12px]">verified</p>
                                        </div>
                                    )}
                                </div>
                                <div className="px-0 lg:px-[20px] flex items-center gap-[4px] mt-4 lg:mt-[20px]">
                                    <Image src={locationImg} alt={'location'} width={18} height={18}/>
                                    <p className="text-[14px] font-light">{shopData.market || 'Market'}, {shopData.address}</p>
                                </div>
                                <div className="flex flex-col sm:flex-row px-0 lg:px-[20px] mt-3 lg:mt-[15px] gap-2 lg:gap-[18px]">
                                    <div className="flex items-center gap-[4px]">
                                        <Image src={shopImg} alt={'shop'} width={18} height={18}/>
                                        <p className="text-[14px] font-light">{shopData.name} Shop {shopData.shopNumber}</p>
                                    </div>
                                    <div className="flex items-center gap-[4px]">
                                        <Image src={shopImg} alt={'section'} width={18} height={18}/>
                                        <p className="text-[14px] font-light">{shopData.marketSection || 'Section'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full lg:w-[300px] gap-[14px] flex flex-col sm:flex-row items-center">
                                <ChatButton
                                    vendorEmail={shopData.vendorEmail || (products.length > 0 ? products[0].vendorEmail : 'vendor@example.com')}
                                    vendorName={shopData.vendorName || shopData.name}
                                    className="bg-[#ffeebe] text-[#461602] hover:bg-[#ffd700] w-full sm:w-[165px] h-[48px] rounded-[14px]"
                                />
                                <VideoCallButton
                                    vendorEmail={shopData.vendorEmail || (products.length > 0 ? products[0].vendorEmail : 'vendor@example.com')}
                                    shopId={shopData.id}
                                    shopName={shopData.name}
                                    variant="secondary"
                                    className="w-full sm:w-[121px] h-[48px] text-[#461602] border-[2px] border-[#461602] hover:bg-[#461602] hover:text-white"
                                />
                            </div>
                        </div>
                        
                        {/* Right side */}
                        <div className="w-full lg:w-[442px] flex flex-col gap-[24px]">
                            {/* Rating Box */}
                            <div className="flex justify-start lg:justify-end">
                                <div className="bg-[#f9f9f9] border border-[#ededed] rounded-[14px] p-[20px] w-[215px] h-[83px]">
                                    <p className="text-[14px] text-[#0D0C22] font-medium">Shop rating</p>
                                    <div className="flex items-center gap-[16px]">
                                        <span className="text-xl font-bold text-gray-800">{rating}</span>
                                        <div className="flex gap-[4px]">{renderStars(rating)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Categories - You might want to make this dynamic based on store products */}
                            <div className="flex h-[56px] items-center p-[4px] gap-[4px] w-full rounded-[100px] border border-[#ededed] overflow-x-auto">
                                <span className="w-[57px] h-[48px] rounded-[100px] text-[14px] font-medium text-[#022B23] flex items-center justify-center border border-[#ededed] flex-shrink-0">All</span>
                                <span className="px-4 h-[48px] rounded-[100px] text-[14px] font-semibold text-[#022B23] bg-[#ECFDF6] flex items-center justify-center whitespace-nowrap flex-shrink-0">
                                    Products ({products.length})
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {products.length > 0 ? (
                    <ProductGrid products={products}/>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No products available in this store</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default StorePage;