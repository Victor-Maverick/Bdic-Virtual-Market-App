import Image from "next/image";
import arrow from "../../../../../public/assets/images/arrow-right.svg";
import ProductCard from "@/components/productCard";
import pepper from '../../../../../public/assets/images/pepper.jpeg';
import miniFan from '../../../../../public/assets/images/table fan.png';
import carrots from '../../../../../public/assets/images/carrot.png';

const products = [
    { id: 1, image: miniFan, title: "Mini Fan", price: 23000, location: "Makurdi" },
    { id: 2, image: carrots, title: "Carrots", price: 12000, location: "Gboko" },
    { id: 3, image: carrots, title: "Nike air shoe", price: 50000, location: "Wannune" },
    { id: 4, image: pepper, title: "Bags of Oranges", price: 50000, location: "Makurdi" },
    { id: 5, image: pepper, title: "Tuber of Yam", price: 15000, location: "Otukpo" },
    { id: 6, image: miniFan, title: "Standing Fan", price: 28000, location: "Makurdi" },
    { id: 7, image: carrots, title: "Fresh Tomatoes", price: 8000, location: "Gboko" },
    { id: 8, image: pepper, title: "Basket of Peppers", price: 18000, location: "Otukpo" },
];

const MarketPlaceSection = () => {
    return (
        <div className="flex flex-col bg-[#fffcf3] py-10">
            <div className="px-25">
                <p className="text-[#461602] text-[18px]">MARKETPLACE</p>
                <div className="flex items-center justify-between">
                    <p className="text-[#022b23] font-semibold text-[22px] leading-tight">
                        Check out a list of featured products<br />on our marketplace.
                    </p>
                    <div className="flex items-center gap-2 cursor-pointer">
                        <p className="text-[14px] text-[#022b23]">VIEW ALL</p>
                        <Image src={arrow} alt="arrow icon" width={20} height={20} />
                    </div>
                </div>
            </div>

            {/* First row of 4 products */}
            <div className="relative py-6 mt-6 mx-25 overflow-hidden">
                <div className="flex flex-nowrap gap-4">
                    {products.slice(0, 4).map((product) => (
                        <div
                            key={product.id}
                            className="w-[25%] group hover:animate-shake"
                        >
                            <ProductCard
                                image={product.image}
                                title={product.title}
                                price={product.price}
                                location={product.location}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Second row of 4 products */}
            <div className="relative  mx-25 overflow-hidden">
                <div className="flex flex-nowrap gap-4">
                    {products.slice(4, 8).map((product) => (
                        <div
                            key={product.id}
                            className="w-[25%] group hover:animate-shake"
                        >
                            <ProductCard
                                image={product.image}
                                title={product.title}
                                price={product.price}
                                location={product.location}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MarketPlaceSection;