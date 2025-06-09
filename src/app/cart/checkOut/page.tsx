'use client';
import { useState } from "react";
import ProductDetailHeroBar from "@/components/productDetailHeroBar";
import NavigationBar from "@/components/navigationBar";
import Image from "next/image";
import cart from "../../../../public/assets/images/black cart.png";
import arrow from "../../../../public/assets/images/blackArrow.png";
import card_tick from "../../../../public/assets/images/card-tick.png";
import iphone from "../../../../public/assets/images/iphone13.svg";
import fan from "../../../../public/assets/images/table fan.png";
import pepper from "../../../../public/assets/images/pepper.jpeg";
import addressIcon from "../../../../public/assets/images/addressIcon.svg";
import limeArrow from "../../../../public/assets/images/green arrow.png";
import PaymentSuccessModal from "@/components/paymentSuccessModal";

const initialProducts = [
    { name: "Sea Blue iPhone 14", description: "6GB ROM / 128GB RAM", image: iphone, price: "850,000", quantity: 1 },
    { name: "Table Fan", description: "Powerful cooling fan", image: fan, price: "950,000", quantity: 1 },
    { name: "Fresh Pepper", description: "Organic farm produce", image: pepper, price: "35,000", quantity: 1 },
    { name: "Sea Blue iPhone 14", description: "6GB ROM / 128GB RAM", image: iphone, price: "40,000", quantity: 1 },
];

const CheckOut = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            {/*<ProductDetailHeader />*/}
            <ProductDetailHeroBar />
            <NavigationBar page="//smart phone//product name//" name="cart" />

            <div className="px-[100px] py-[10px] border-b border-[#ededed]">
                <div className="w-[182px] h-[46px] flex border-[0.5px] border-[#ededed] rounded-[4px] p-[2px]">
                    <div className="flex justify-center gap-[2px] items-center bg-[#F9F9F9] w-[180px] h-[40px]">
                        <Image src={cart} alt="cart icon" width={20} height={20} />
                        <p className="text-[14px] text-[#1E1E1E]">My cart</p>
                        <p className="font-medium text-[14px] text-[#1E1E1E]">(4 products)</p>
                    </div>
                </div>
            </div>

            <div className="flex px-[100px] items-center mt-[20px] gap-[24px]">
                <div className="flex gap-[6px] items-center">
                    <Image src={cart} alt="cart" width={20} height={20} />
                    <p className="text-[14px] font-medium">Cart / checkout</p>
                </div>
                <Image src={arrow} alt="arrow" className="w-[14px] h-[14px]" />
                <div className="flex gap-[6px] items-center">
                    <Image src={card_tick} alt="card" />
                    <p className="text-[14px] text-[#707070]">Payment</p>
                </div>
            </div>

            <div className="flex flex-col items-center mt-[30px]">
                <div className="flex-col w-[779px] justify-center rounded-[14px] border-[0.5px] border-[#ededed]">
                    {initialProducts.map((product, index) => {
                        const isLastItem = index === initialProducts.length - 1;
                        return (
                            <div key={index} className={`flex items-center ${!isLastItem ? "border-b border-[#ededed]" : "border-none"}`}>
                                <div className="flex border-r border-[#ededed] w-[133px] h-[110px] overflow-hidden">
                                    <Image src={product.image} alt="image" width={133} height={110} className="w-full h-full" />
                                </div>

                                <div className="flex items-center w-full px-[20px] justify-between">
                                    <div className="flex flex-col w-[30%]">
                                        <div className="mb-[13px]">
                                            <p className="text-[14px] text-[#1E1E1E] font-medium mb-[4px]">{product.name}</p>
                                            <p className="text-[10px] font-normal text-[#3D3D3D] uppercase">{product.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-[4px] items-center w-[20%] justify-end">
                                        <p className="font-medium text-[16px]">₦{product.price}.00</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex flex-col items-center mt-[30px] w-[779px] space-y-[10px]">
                    <div className="flex w-full justify-between items-center">
                        <p className="text-[#022B23] font-medium text-[14px]">Delivery method</p>
                        <p className="text-[12px] font-normal text-[#022B23]">Change address</p>
                    </div>
                    <div className="flex w-full rounded-[14px] h-[81px] bg-[#f9f9f9] justify-center items-center">
                        <div className="p-[10px] flex gap-[6px] w-[771px] rounded-[18px] h-[73px] bg-[#022B23] border-[0.5px] border-[#C6EB5F] items-center">
                            <Image src={addressIcon} alt="image" width={20} height={20} />
                            <div className="flex-col">
                                <p className="text-[#FFFFFF] text-[14px] font-medium">Pick-up at the market</p>
                                <p className="text-[#FFFFFF] text-[12px] font-normal">Shop 2C, Abba Technologies, Modern market, Makurdi</p>
                            </div>
                        </div>
                    </div>

                    <div onClick={() => setIsModalOpen(true)} className=" flex h-[54px] rounded-[14px] mb-[20px] gap-[9px] justify-center items-center bg-[#022B23] w-[779px]">
                        <p className="text-[#C6EB5F] font-semibold text-[14px]">Make payment</p>
                        <Image src={limeArrow} alt="arrow" width={18} height={18} className="w-[18px] h-[18px]" />

                    </div>

                </div>
            </div>

            {isModalOpen && (
                <PaymentSuccessModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    deliveryOption={"Pick-up at the market"}
                    location={"Shop 2C, Abba Technologies, Modern Market, Makurdi"}
                />
            )}
        </>
    );
};

export default CheckOut;
