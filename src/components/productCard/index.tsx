import Image from "next/image";
import buyIcon from "../../../public/assets/images/bag-2.png";
import locationImg from "../../../public/assets/images/location.png";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const ProductCard = ({ image, title, price, location }) => {
    return (
        <div className="w-full cursor-pointer h-[400px] rounded-[14px] bg-[#FFFFFF] border border-transparent group transition-all duration-300 hover:border-lime-300 relative">

            <Image className="h-[278px] w-full object-cover rounded-t-2xl" src={image} alt="image" width={240} height={281} />

            <div className="absolute mt-2 mr-2 top-2 right-2 bg-white/50 backdrop-blur-md px-3 py-1 rounded-2xl text-sm font-medium shadow-md flex items-center gap-2">
                <Image src={locationImg} alt="location icon" width={16} height={16} />
                <span className="text-[#1E1E1E]">{location}</span>
            </div>

            <div className="mt-3 px-4">
                <p className="font-semibold text-[#1E1E1E]">{title}</p>

                <div className="flex items-center justify-between mt-2">
                    <p className="font-medium text-[#1E1E1E]">₦{price}</p>

                    {/* Conditional rendering of Buy button on hover */}
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white bg-[#022B23] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                        Buy
                        <Image src={buyIcon} alt="buy icon" className="h-[18px] w-[18px]" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
