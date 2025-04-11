"use client";
import Image from "next/image";
import cpu_charge from '../../../../../public/assets/images/cpu-charge.png'
import bag from '../../../../../public/assets/images/bag.png'
import carImg from '../../../../../public/assets/images/carr.png'
import chart from '../../../../../public/assets/images/presentation_chart.png'




const OfferSection = () => {

    return (
        <div className="px-6 md:px-25 py-10 w-full">
            <div className="text-center md:text-left mb-8">
                <p className="text-[#461602] text-lg font-bold">WHAT WE OFFER</p>
                <p className="text-[#022b23] text-[22px] font-semibold mt-2" style={{ lineHeight: "1.1" }}>
                    Powering Digital Commerce <br/>& Seamless Logistics
                </p>
            </div>
            <div className="flex flex-col md:flex-row justify-between gap-2.5">
                <div className="group pt-24 pl-6 rounded-3xl bg-[#F9F9F9] w-full md:w-[61%] h-[250px] transition-all duration-300 hover:bg-[#F9FDE8]">
                    <div className="h-[48px] w-[48px] bg-[#EDEDED] rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-[#C6EB5F]">
                        <Image className="h-[24px] w-[24px]" src={cpu_charge} alt="image" />
                    </div>
                    <p className="text-[#022B23] font-semibold mt-2">Digital Marketplace for Buyers</p>
                    <p className="text-[#6D6D6D] text-[16px] mt-1">Shop directly from trusted vendors in your local market, <br/>compare products, and enjoy a seamless shopping experience.</p>
                </div>

                <div className="group pt-18 pl-6 rounded-3xl bg-[#F9F9F9] w-full md:w-[39%] h-[250px] transition-all duration-300 hover:bg-[#F9FDE8]">
                    <div className="h-[48px] w-[48px] bg-[#EDEDED] rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-[#C6EB5F]">
                        <Image className="h-[24px] w-[24px]" src={bag} alt="image" />
                    </div>
                    <p className="text-[#022B23] font-semibold mt-2">Vendor Store Management</p>
                    <p className="text-[#6D6D6D] text-[16px] mt-1">Easily set up your store, showcase your products, <br/>manage orders, and grow your business in a digital-first marketplace.</p>
                </div>
            </div>

            <div className="mt-2.5 flex flex-col md:flex-row justify-between gap-2.5">
                <div className="group pt-18 pl-6 rounded-3xl bg-[#F9F9F9] w-full md:w-[35%] h-[250px] transition-all duration-300 hover:bg-[#F9FDE8]">
                    <div className="h-[48px] w-[48px] bg-[#EDEDED] rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-[#C6EB5F]">
                        <Image className="h-[32px] w-[24px]" src={carImg} alt="image" />
                    </div>
                    <p className="text-[#022B23] font-semibold mt-2">Seamless Logistics & Delivery Support</p>
                    <p className="text-[#6D6D6D] text-[16px] mt-1">Partner with trusted transporters, optimize delivery <br/>routes, and track shipments in real time to ensure <br/>smooth and timely deliveries.</p>
                </div>

                <div className="group pt-24 pl-6 rounded-3xl bg-[#F9F9F9] w-full md:w-[65%] h-[250px] transition-all duration-300 hover:bg-[#F9FDE8]">
                    <div className="h-[48px] w-[48px] bg-[#EDEDED] rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-[#C6EB5F]">
                        <Image className="h-[24px] w-[24px]" src={chart} alt="image" />
                    </div>
                    <p className="text-[#022B23] font-semibold mt-2">Real-Time Order & Sales Tracking</p>
                    <p className="text-[#6D6D6D] text-[16px] mt-1">Stay informed with real-time updates on orders, deliveries, <br/>and sales performance for better business decisions.</p>
                </div>
            </div>


        </div>
    );
};

export default OfferSection;
