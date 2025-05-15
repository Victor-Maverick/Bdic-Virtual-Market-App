'use client'
import ProductDetailHeader from "@/components/productDetailHeader";
import ProductDetailHeroBar from "@/components/productDetailHeroBar";
import NavigationBar from "@/components/navigationBar";
import Image from "next/image";
import iphoneBigImg from '../../../../public/assets/images/iphone14Img.svg'
import blueIphone from '../../../../public/assets/images/blue iphone.svg'
import iphone13 from '../../../../public/assets/images/iphone13.svg'
import blue14 from '../../../../public/assets/images/blue14.png'
import vendorImg from '../../../../public/assets/images/vendorImg.svg'
import verify from '../../../../public/assets/images/verify.svg'
import locationImg from '../../../../public/assets/images/location.png'
import shopImg from '../../../../public/assets/images/shop.png'
import chatIcon from '../../../../public/assets/images/chatIcon.png'
import bag from '../../../../public/assets/images/market-place-bag.png'
import wishlist from '../../../../public/assets/images/wishHeart.png'
import tableFan from "../../../../public/assets/images/table fan.png";
import wirelessCharger from "../../../../public/assets/images/wireless charger.png";
import jblSpeaker from "../../../../public/assets/images/jbl.png";
import smartWatch from "../../../../public/assets/images/smartwatch.png";
import hardDrive from "../../../../public/assets/images/samsung.png";
import MarketProductCard from "@/components/marketProductCard";
import blueGreenCircle from '../../../../public/assets/images/blueGreenCircle.png'
import redPurpleCircle from '../../../../public/assets/images/purpleRedCircle.png'
import orangeCircle from '../../../../public/assets/images/orangeCirlce.png'
import greenVerify from '../../../../public/assets/images/limeVerify.png'
import {useRouter} from "next/navigation";

import { Star } from "lucide-react";

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
                <Star fill={fillColor} stroke="#E5A000" className="w-[20px] h-[19px]" />
            </svg>
        );
    });
};



const suggestedProducts = [
    { name: "Mini fan", image: tableFan, price: "23,000" },
    { name: "Wireless charger", image: wirelessCharger, price: "15,000" },
    { name: "Bluetooth speaker", image: jblSpeaker, price: "35,000" },
    { name: "Smart watch", image: smartWatch, price: "40,000" },
    { name: "Portable hard drive", image: hardDrive, price: "25,000" },
]
const reviews = [
    {
        name: "John Doe",
        image: blueGreenCircle,
        rating: 5,
        comment: "I’ve been using the iPhone 14 for a few weeks now, and it’s been an absolute game-changer! The Super Retina XDR display is stunning, making everything look crisp and vibrant. The A15 Bionic chip keeps everything super fast, whether I’m gaming, multitasking, or streaming. Battery life is impressive I easily get through a full day with no worries. The camera takes incredible photos, even in low light, and the Cinematic Mode is a fun bonus! If you're looking for a reliable, powerful iPhone without the Pro price tag, this is it! Highly recommend!",
        date: "March 12, 2024"
    },
    {
        name: "Sarah Johnson",
        image: redPurpleCircle,
        rating: 4,
        comment: "Really great device, but I wish the price was a bit lower.",
        date: "March 10, 2024"
    },
    {
        name: "Michael Smith",
        image: orangeCircle,
        rating: 5,
        comment: "Best iPhone yet! Super fast and the display is stunning.",
        date: "March 8, 2024"
    },
    {
        name: "Emily Davis",
        image: blueGreenCircle,
        rating: 3,
        comment: "Good phone, but I had some trouble with Face ID at night.",
        date: "March 6, 2024"
    }
];


const ProductDetails =()=>{
    const rating = 3.5;
    const totalReviews = 578;
    const router = useRouter();
    const handleAddToCart =()=>{
        router.push("/cart");
    }

    const ratingsData = [
        { stars: 5, count: 488 },
        { stars: 4, count: 74 },
        { stars: 3, count: 14 },
        { stars: 2, count: 0 },
        { stars: 1, count: 0 },
    ];

    return(
        <>
            <ProductDetailHeader/>
            <ProductDetailHeroBar/>
            <NavigationBar page="//smart phone//" name="product name"/>
            <div className="flex  gap-[10px] px-[100px]">
                <div className="flex-col items-center">
                    <div className="w-[719px] h-[749px] bg-[#F9F9F9] items-end flex justify-center mb-[10px]">
                        <Image src={iphoneBigImg} alt={'image'} height={698} width={698} />
                    </div>
                    <div className="flex items-center gap-[8px] mb-2">
                        <div className="flex  w-[235px] h-[235px] bg-[#F9F9F9] justify-center items-end">
                            <Image src={blue14} alt={'image'} width={225} height={235}/>
                        </div>
                        <div className="flex w-[235px] h-[235px] bg-[#F9F9F9] justify-center items-end">
                            <Image src={iphone13} alt={'image'} width={225} height={238}/>
                        </div>
                        <div className="flex items-center w-[235px] h-[235px] bg-[#F9F9F9] justify-end">
                            <Image src={blueIphone} alt={'image'} width={185} height={235}/>
                        </div>
                    </div>
                </div>
                <div className="flex-col justify-start pt-[40px]">
                    <p className="text-[36px]">Sea Blue iphone 14</p>
                    <p className="font-semibold text-[26px]">₦850,000</p>
                        <div className="p-0.5 border  border-[#f9f9f9] w-[94px]">
                            <div className="w-[90px] h-[37px] bg-[#ededed] flex items-center justify-center">
                                <p className="text-[14px]">Brand new</p>
                            </div>
                        </div>
                    <div className="border-y border-[#ededed] py-[8px] px-[8px] mt-[30px]">
                        <p>Description</p>
                    </div>
                    <p className="text-[14px] ">Experience the iPhone 14, designed for speed, clarity, and durability.
                            With its 6.1-inch Super Retina XDR display, A15 Bionic chip, and advanced
                            dual-camera system, every moment comes to life with stunning detail.
                            Enjoy all-day battery life, iOS 16’s smart features, and seamless 5G connectivity. Built with Ceramic  Shield and water resistance, it&apos;s as tough as it is beautiful.
                    </p>
                    <div className="border border-[#ededed] rounded-3xl h-[260px] mt-[40px]">
                        <div className="flex items-center border-b border-[#ededed] px-[20px] pt-[10px] justify-between">
                            <div className="flex gap-[8px] pb-[8px]">
                                <Image src={vendorImg} alt={'image'} width={40} height={40}/>
                                <div className="flex-col">
                                    <p className="text-[12px] text-[#707070]">Vendor</p>
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
                        <div className="px-[20px] w-[300px] w-[48px] gap-[14px] mt-[50px] flex items-center">
                            <div className="flex items-center gap-[10px] justify-center bg-[#ffeebe] rounded-[14px] w-[165px] h-[48px]">
                                <p className="text-[#461602] font-semibold text-[14px]">Text vendor</p>
                                <Image src={chatIcon} alt={'image'}/>
                            </div>
                            <div className="w-[121px] h-[48px] rounded-[12px] flex border-[2px] border-[#461602] justify-center items-center">
                                <p className="text-[#461602] font-semibold text-[14px]">Call vendor</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-[30px]">
                        <div className="h-[48px] gap-[8px] mt-[25px] flex items-center">
                            <div className="flex items-center bg-[#022B23] w-[209px] h-[48px] justify-center rounded-[12px]">
                                <p className="text-[#C6EB5F] text-[14px] font-semibold">Buy now</p>
                            </div>
                            <div onClick={handleAddToCart} className="w-[127px] cursor-pointer flex items-center justify-center h-[48px] gap-[10px] rounded-[12px] border-[2px] border-[#022B23]">
                                <p className="text-[#022B23] text-[15px] font-bold ">Add to cart</p>
                                <Image src={bag} alt={'image'} width={18} height={18}/>
                            </div>
                            <div className="h-[48px] w-[48px] border-[2px] border-[#022B23] rounded-[12px] flex ml-[20px] items-center justify-center">
                                <Image src={wishlist} alt={'image'} width={26} height={26}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-[100px] mt-[40px]">
                <p className="font-medium text-[16px] mb-[18px]">Suggested products</p>
                <div className="flex gap-[15px] py-3 rounded-b-3xl">
                    {suggestedProducts.map((product, index) => (
                        <MarketProductCard
                            height={330}
                            key={index}
                            name={product.name}
                            image={product.image}
                            price={product.price}  imageHeight={undefined}
                        />
                    ))}
                </div>

            </div>
            <div className="flex-col px-[100px] mt-[40px]">
                <p className="font-medium text-[18px] mb-[20px]" >Store and product reviews<span className="text-[#707070]"> (200+)</span></p>
                <div className="flex gap-[15px]">
                    <div className="flex-col border-[0.5px] border-[#ededed] rounded-[14px] p-[10px] mb-4">
                        {reviews.map((review, index) => {
                            const isLastItem = index === reviews.length - 1;
                            return (
                                <div
                                    key={index}
                                    className={`w-[655px] p-4 ${!isLastItem ? 'border-b border-[#ededed]' : ''}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-gray-500 text-sm">{review.date}</p>
                                        <div className="flex mt-1 gap-[7px]">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    className={i < review.rating ? "text-yellow-500" : "text-gray-300"}
                                                    fill={i < review.rating ? "#e7b66b" : "none"}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-[6px] mt-[10px]">
                                        <Image src={review.image} alt={'image'} width={31} height={31} />
                                        <p>{review.name}</p>
                                    </div>
                                    <p className="text-[#303030] text-[14px] mt-2">{review.comment}</p>
                                    <div className="w-[143px] mt-[10px] h-[30px] flex items-center justify-center gap-[4px] rounded-[8px]">
                                        <Image src={greenVerify} alt={'image'} />
                                        <p className=" text-[#52A43E]">verified purchase</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="bg-white rounded-[14px] h-[265px] w-[500px] border-[0.5px] border-[#ededed] p-[20px]">
                        <p className="font-medium text-[#0D0C22] text-[14px]">Store and product reviews</p>

                        <div className="flex items-center mt-0.5">
                            <span className="text-[32px] font-bold">{rating.toFixed(1)}</span>
                            <div className="flex ml-2 gap-[4px]">{renderStars(rating)}</div>
                        </div>
                        <p className="text-[#858585] text-[12px] mb-4 mt-1">({totalReviews} Reviews)</p>

                        <div className="mt-2 space-y-1">
                            {ratingsData.map(({ stars, count }) => (
                                <div key={stars} className="flex items-center">
                                    <span className="text-[12px] w-[50px]">{stars} stars</span>
                                    <div className="w-full bg-gray-200 rounded-full h-[6px] mx-2">
                                        <div
                                            className="bg-[#E5A000] h-[6px] rounded-full"
                                            style={{ width: `${(count / totalReviews) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-[12px]">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductDetails