import Image from "next/image";
import arrow from "../../../../../public/assets/images/grey right arrow.png";
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
        <div className="flex flex-col bg-[#fffcf3] py-6 sm:py-8 lg:py-10">
            {/* Header Section */}
            <div className="px-4 sm:px-6 lg:px-25">
                <p className="text-[#461602] text-sm sm:text-base lg:text-[18px] mb-2">MARKETPLACE</p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <p className="text-[#022b23] font-semibold text-lg sm:text-xl lg:text-[22px] leading-tight">
                        Check out a list of featured products<br className="hidden sm:block" />
                        <span className="sm:hidden"> </span>on our marketplace.
                    </p>
                    <div className="flex items-center gap-2 cursor-pointer self-start sm:self-auto">
                        <p className="text-xs sm:text-sm lg:text-[14px] text-[#022b23]">VIEW ALL</p>
                        <Image src={arrow} alt="arrow icon" width={16} height={16} className="sm:w-5 sm:h-5" />
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="mt-6 px-4 sm:px-6 lg:px-25">
                {/* Mobile: Single column scrollable */}
                <div className="block sm:hidden">
                    <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="flex-shrink-0 w-[280px] group hover:animate-shake"
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

                {/* Tablet: 2 columns, 4 rows */}
                <div className="hidden sm:block md:hidden">
                    <div className="grid grid-cols-2 gap-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="group hover:animate-shake"
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

                {/* Small Desktop: 3 columns */}
                <div className="hidden md:block lg:hidden">
                    <div className="grid grid-cols-3 gap-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="group hover:animate-shake"
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

                {/* Large Desktop: 4 columns, 2 rows (original layout) */}
                <div className="hidden lg:block">
                    {/* First row of 4 products */}
                    <div className="relative py-6 mt-6 overflow-hidden">
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
                    <div className="relative overflow-hidden">
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
            </div>
        </div>
    );
};

export default MarketPlaceSection;