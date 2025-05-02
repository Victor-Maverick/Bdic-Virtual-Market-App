'use client'
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image, {StaticImageData} from "next/image";
import DashboardHeader from "@/components/dashboardHeader";
import DashboardOptions from "@/components/dashboardOptions";
import arrowDown from "../../../../../public/assets/images/arrow-down.svg";
import arrowBack from "../../../../../public/assets/images/arrowBack.svg";
import arrowFoward from "../../../../../public/assets/images/arrowFoward.svg";
import promoteIcon from '@/../public/assets/images/promoteIcon.svg'
import iPhone from "../../../../../public/assets/images/blue14.png";
import profileIcon from '@/../public/assets/images/dashuserimg.svg'
import arrowUp from '@/../public/assets/images/arrow-up.svg'
import dropBox from '@/../public/assets/images/dropbox.svg'
import flag from '@/../public/assets/images/flag-2.svg'

interface Product {
    id: number;
    productId: string;
    productImage: StaticImageData;
    orderId: string;
    productName: string;
    status: "Good" | "Normal" | "Bad";
    rating: number;
    comment: string;
}

const products: Product[] = [
    { id: 1, productId: "1234567887654", productImage: iPhone, orderId: "21367", productName: "iPhone 14 pro max",  status: "Good", rating: 4.2, comment: "Delivery was fast, great service" },
    { id: 2, productId: "1234567887654", productImage: iPhone, orderId: "21367",productName: "iPhone 14 pro max",  status: "Normal", rating: 4.2, comment: "fair" },
    { id: 3, productId: "1234567887654", productImage: iPhone, orderId: "21367",productName: "iPhone 14 pro max", status: "Bad",  rating: 4.2, comment: "Not well handled, carton had dents" },
    { id: 4, productId: "1234567887654", productImage: iPhone, orderId: "21367",productName: "iPhone 14 pro max", status: "Good", rating: 4.2, comment: "Fast delivery" },
    { id: 5, productId: "1234567887654", productImage: iPhone, orderId: "21367",productName: "iPhone 14 pro max", status: "Normal", rating: 4.2, comment: "Fast delivery, and polite dispatch rider" },
    { id: 6, productId: "1234567887654", productImage: iPhone, orderId: "21367",productName: "iPhone 14 pro max", status: "Good", rating: 4.2, comment: "Fast delivery, and polite dispatch rider" },
    { id: 7, productId: "1234567887654", productImage: iPhone, orderId: "21367",productName: "iPhone 14 pro max", status: "Bad", rating: 4.2, comment: "Fast delivery, and polite dispatch rider"},
    { id: 8, productId: "1234567887654", productImage: iPhone, orderId: "21367",productName: "iPhone 14 pro max", status: "Good", rating: 4.2, comment: "Fast delivery, and polite dispatch rider"},
    { id: 9, productId: "1234567887654", productImage: iPhone, orderId: "21367",productName: "iPhone 14 pro max", status: "Normal", rating: 4.2, comment: "Fast delivery, and polite dispatch rider"},
    { id: 10, productId: "1234567887654", productImage: iPhone, orderId: "21367",productName: "iPhone 14 pro max", status: "Bad", rating: 4.2, comment: "Fast delivery, and polite dispatch rider"},
    { id: 11, productId: "1234567887654", productImage: iPhone, orderId: "21367",productName: "iPhone 14 pro max",status: "Good", rating: 4.2, comment: "Fast delivery, and polite dispatch rider"},
    { id: 12, productId: "1234567887654", productImage: iPhone, orderId: "21367",productName: "iPhone 14 pro max",  status: "Normal", rating: 4.2, comment: "Fast delivery, and polite dispatch rider"},
];

const ProductTableRow = ({ product, isLast }: { product: Product; isLast: boolean }) => {
    return (
        <div className={`flex h-[72px] ${!isLast ? 'border-b border-[#EAECF0]' : ''}`}>
            <div className="flex items-center w-[40%] pr-[24px] gap-3">
                <div className="bg-[#f9f9f9] h-full w-[70px] overflow-hidden mt-[2px]">
                    <Image
                        src={product.productImage}
                        alt={product.productName}
                        width={70}
                        height={70}
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <p className="text-[14px] font-medium text-[#101828]">{product.productName}</p>
                    <p className="text-[12px] text-[#667085]">Review: {product.rating}</p>
                </div>
            </div>

            <div className="flex items-center w-[15%]  px-[10px]">
                <div className={`w-[55px] h-[22px] rounded-[8px] flex items-center justify-center ${
                    product.status === 'Good'
                        ? 'bg-[#ECFDF3] text-[#027A48]'
                        : product.status === 'Normal'
                            ? 'bg-[#FFFAEB] text-[#FFB320]'
                            : 'bg-[#FEF3F2] text-[#FF5050]'
                }`}>
                    <p className="text-[12px] font-medium">{product.status}</p>
                </div>
            </div>

            <div className="flex items-center w-[35%] px-[16px]">
                <p className="text-[12px] w-[176px] leading-tight text-[#667085]">
                    {product.comment}
                </p>
            </div>

            <div className="flex items-center w-[10%] px-[28px]">
                <p className="text-[14px] font-medium  text-[#344054]">{product.rating}</p>
            </div>
        </div>
    )
}

const ReviewTab = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const router = useRouter();

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    const handlePromoteShop = () => {
        router.push("/vendor/dashboard/reviews/promote-shop");
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = products.slice(startIndex, startIndex + itemsPerPage);

    return (
        <>
            <div className="flex w-full h-[131px] mb-[30px] justify-between items-center">
                <div className="h-full gap-[12px] w-full flex flex-col">
                    <p className="text-[#022B23] text-[16px] font-medium">Campaign performance</p>
                    <div className="gap-[15px] w-[85%] flex">
                        <div className="flex flex-col pt-[18px] px-[10px] pb-[10px]  gap-[14px] w-[25%] h-[100px] rounded-[14px] border-[0.5px] border-[#E4E4E7]">
                            <div className="flex items-center gap-[8px]">
                                <Image src={profileIcon} alt={'image'}/>
                                <p className="text-[12px] text-[#71717A] font-medium">Total visits from campaign</p>
                            </div>
                            <div className="flex justify-between items-center ">
                                <p className="text-[#18181B] text-[16px] font-medium">1203</p>
                                <div className="flex items-center gap-[4px]">
                                    <Image src={arrowUp} alt={'image'}/>
                                    <p className="text-[12px] text-[#22C55E] font-medium">6%</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col pt-[18px] px-[10px] pb-[10px]  gap-[14px] w-[25%] h-[100px] rounded-[14px] border-[0.5px] border-[#E4E4E7]">
                            <div className="flex items-center gap-[8px]">
                                <Image src={dropBox} alt={'image'}/>
                                <p className="text-[12px] text-[#71717A] font-medium">Bestseller</p>
                            </div>
                            <div className="flex justify-between items-center ">
                                <p className="text-[#18181B] text-[16px] font-medium">Iphone 14 pro (82)</p>
                                <div className="flex items-center gap-[4px]">
                                    <Image src={arrowUp} alt={'image'}/>
                                    <p className="text-[12px] text-[#22C55E] font-medium">6%</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col pt-[18px] px-[10px] pb-[10px]  gap-[14px] w-[25%] h-[100px] rounded-[14px] border-[0.5px] border-[#E4E4E7]">
                            <div className="flex items-center gap-[8px]">
                                <Image src={flag} alt={'image'}/>
                                <p className="text-[12px] text-[#71717A] font-medium">Shop discovery</p>
                            </div>
                            <div className="flex justify-between items-center ">
                                <p className="text-[#18181B] text-[16px] font-medium">1203</p>
                                <div className="flex items-center gap-[4px]">
                                    <Image src={arrowUp} alt={'image'}/>
                                    <p className="text-[12px] text-[#22C55E] font-medium">2%</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col pt-[18px] px-[10px] pb-[10px]  gap-[14px] w-[25%] h-[100px] rounded-[14px] border-[0.5px] border-[#E4E4E7]">
                            <div className="flex items-center gap-[8px]">
                                <Image src={flag} alt={'image'}/>
                                <p className="text-[12px] text-[#71717A] font-medium">Campaign tier</p>
                            </div>
                            <div className="flex justify-between items-center ">
                                <span className="rounded-[100px] cursor-pointer text-[#022B23] text-[14px] font-medium flex items-center justify-center bg-[#C6EB5F] w-[68px] h-[32px]">Basic</span>
                                <p className="text-[12px] text-[#022B23] font-medium">NGN 7,000.00</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div onClick={handlePromoteShop} className="w-[15%] cursor-pointer flex items-center gap-[9px] text-[14px] text-[#C6EB5F] font-medium justify-center rounded-[12px] h-[52px] border bg-[#033228]">
                    <p>Promote shop</p>
                    <Image src={promoteIcon} alt={'image'}/>
                </div>
            </div>
            <div className="flex flex-col w-full mt-[10px] rounded-[24px] border-[1px] border-[#EAECF0]">
                <div className="flex flex-col py-[20px] px-[24px]">
                    <p className="text-[#101828] text-[18px] font-medium">Reviews (34)</p>
                    <p className="text-[#667085] text-[14px]">View reviews on products in your store</p>
                </div>
                <div className="flex h-[44px] bg-[#F9FAFB] border-b-[1px] border-[#EAECF0]">
                    <div className="flex items-center px-[24px] w-[40%] py-[12px] gap-[4px]">
                        <p className="text-[#667085] font-medium text-[12px]">Products</p>
                        <Image src={arrowDown} alt="Sort" width={12} height={12} />
                    </div>
                    <div className="flex items-center px-[24px] w-[15%] py-[12px]">
                        <p className="text-[#667085] font-medium text-[12px]">Status</p>
                    </div>
                    <div className="flex items-center px-[24px] w-[35%] py-[12px]">
                        <p className="text-[#667085] font-medium text-[12px]">Comment</p>
                    </div>
                    <div className="flex items-center px-[24px] w-[10%] py-[12px]">
                        <p className="text-[#667085] font-medium text-[12px]">Rating</p>
                    </div>
                </div>
                <div className="flex flex-col">
                    {currentItems.map((product, index) => (
                        <ProductTableRow
                            key={product.id}
                            product={product}
                            isLast={index === currentItems.length - 1}
                        />
                    ))}
                </div>
                <div className="h-[68px] border-t-[1px] justify-between flex items-center border-[#EAECF0] px-[24px] py-[12px]">
                    <div
                        onClick={handlePrevious}
                        className={`flex text-[#344054] text-[14px] font-medium gap-[8px] justify-center items-center border-[#D0D5DD] border-[1px] cursor-pointer hover:shadow-md shadow-sm w-[114px] rounded-[8px] px-[14px] py-[8px] h-[36px] ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Image src={arrowBack} alt={'image'} />
                        <p>Previous</p>
                    </div>
                    <div className="flex gap-[2px]">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <div
                                key={index + 1}
                                onClick={() => handlePageClick(index + 1)}
                                className={`flex justify-center items-center w-[36px] h-[36px] rounded-[8px] text-[14px] font-medium cursor-pointer ${
                                    currentPage === index + 1
                                        ? 'bg-[#ecfdf6] text-[#022B23]'
                                        : 'bg-white text-[#022B23] hover:shadow-md'
                                }`}
                            >
                                {index + 1}
                            </div>
                        ))}
                    </div>
                    <div
                        onClick={handleNext}
                        className={`flex text-[#344054] text-[14px] gap-[8px] font-medium justify-center items-center border-[#D0D5DD] border-[1px] cursor-pointer hover:shadow-md shadow-sm w-[88px] rounded-[8px] px-[14px] py-[8px] h-[36px] ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <p>Next</p>
                        <Image src={arrowFoward} alt={'image'} />
                    </div>
                </div>
            </div>
        </>
    )
}

const Coupons = () => {
    return <></>;
}

const ReviewsContent = () => {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') as 'reviews' | 'coupons' || 'reviews';
    const [activeTab, setActiveTab] = useState<'reviews' | 'coupons'>(initialTab);
    const router = useRouter();

    const handleTabChange = (tab: 'reviews' | 'coupons') => {
        setActiveTab(tab);
        router.replace(`/vendor/dashboard/reviews?tab=${tab}`, { scroll: false });
    };

    return (
        <>
            <DashboardHeader />
            <DashboardOptions />
            <div className="flex flex-col py-[30px] px-25">
                <div className="w-[359px] h-[52px] gap-[24px] flex items-end">
                    <button
                        onClick={() => handleTabChange('reviews')}
                        className={`py-2 text-[#11151F] cursor-pointer text-[14px] ${
                            activeTab === 'reviews'
                                ? 'font-medium border-b-2 border-[#C6EB5F]'
                                : 'text-gray-500'
                        }`}
                    >
                        Reviews & campaigns
                    </button>
                    <button
                        onClick={() => handleTabChange('coupons')}
                        className={`py-2 text-[#11151F] cursor-pointer text-[14px] ${
                            activeTab === 'coupons'
                                ? 'font-medium border-b-2 border-[#C6EB5F]'
                                : 'text-gray-500'
                        }`}
                    >
                        Coupons
                    </button>
                </div>
                <div className="bg-white rounded-lg mt-[20px] mb-8">
                    {activeTab === 'reviews' && <ReviewTab />}
                    {activeTab === 'coupons' && <Coupons />}
                </div>
            </div>
        </>
    );
}

const Reviews = () => {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C6EB5F]"></div>
            </div>
        }>
            <ReviewsContent />
        </Suspense>
    );
}

export default Reviews;