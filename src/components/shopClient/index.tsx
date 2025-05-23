'use client'
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardHeader from "@/components/dashboardHeader";
import DashboardOptions from "@/components/dashboardOptions";
import ShopInformation from '@/components/productsView';
import NewProductView from '@/components/newProductView';
import ReviewsView from '@/components/reviewsView';


const ShopClient = () => {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') as 'shop-information' | 'products' | 'reviews' || 'shop-information';
    const [activeTab, setActiveTab] = useState<'shop-information' | 'products' | 'reviews'>(initialTab);
    const router = useRouter();

    const handleTabChange = (tab: 'shop-information' | 'products' | 'reviews') => {
        setActiveTab(tab);
        router.replace(`/vendor/dashboard/shop?tab=${tab}`, { scroll: false });
    };

    return (
        <>
            <DashboardHeader />
            <DashboardOptions />

            <div className="flex flex-col">
                <div className="flex border-b border-[#ededed] mb-6 px-[100px]">
                    <div className="w-[273px] h-[52px] gap-[24px] flex items-end">
                        <p
                            className={`py-2 text-[#11151F] cursor-pointer text-[14px] ${activeTab === 'shop-information' ? 'font-medium  border-b-2 border-[#C6EB5F]' : 'text-gray-500'}`}
                            onClick={() => handleTabChange('shop-information')}
                        >
                            Shop information
                        </p>
                        <p
                            className={`py-2 text-[#11151F] cursor-pointer text-[14px] ${activeTab === 'products' ? 'font-medium  border-b-2 border-[#C6EB5F]' : 'text-gray-500'}`}
                            onClick={() => handleTabChange('products')}
                        >
                            Products
                        </p>
                        <p
                            className={`py-2 text-[#11151F] cursor-pointer text-[14px] ${activeTab === 'reviews' ? 'font-medium border-b-2 border-[#C6EB5F]' : 'text-gray-500'}`}
                            onClick={() => handleTabChange('reviews')}
                        >
                            Reviews
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-lg mx-[100px] mb-8">
                    {activeTab === 'shop-information' && <ShopInformation />}
                    {activeTab === 'products' && <NewProductView />}
                    {activeTab === 'reviews' && <ReviewsView />}
                </div>
            </div>
        </>
    );
};

export default ShopClient;

