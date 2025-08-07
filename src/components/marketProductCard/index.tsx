'use client'
import Image from "next/image";
import {useRouter} from "next/navigation";

interface MarketProductCardProps {
    image: string;
    name: string;
    price: number;
    id: number;
    height?: string;
    imageHeight?: string;
}

const MarketProductCard = ({ image, name, price, id, height = "280px", imageHeight = "160px" }: MarketProductCardProps) => {
    const router = useRouter();
    
    const handleOpen = () => {
        router.push(`/marketPlace/productDetails/${id}`);
    }

    return (
        <div 
            onClick={handleOpen} 
            className="cursor-pointer w-full rounded-[14px] bg-[#FFFFFF] border border-[#ededed] hover:border-lime-300 hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group"
            style={{ height: height }}
        >
            {/* Image Container - Fixed height for consistency */}
            <div className="relative w-full overflow-hidden rounded-t-[14px]" style={{ height: imageHeight }}>
                <Image 
                    src={image} 
                    width={400} 
                    height={160}
                    alt="product image"  
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            
            {/* Content Container - Fixed height for consistency */}
            <div className="flex-1 p-3 flex flex-col justify-between" style={{ height: '120px' }}>
                <div className="space-y-1">
                    <p className="font-medium text-[#1E1E1E] text-sm line-clamp-2 leading-tight">{name}</p>
                    <p className="font-bold text-[#1E1E1E] text-base">₦{price.toLocaleString()}</p>
                </div>
            </div>
        </div>
    )
}
export default MarketProductCard