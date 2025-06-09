'use client'
import MarketPlaceHeader from "@/components/marketPlaceHeader";
import Image from "next/image";
import arrowBack from "../../../../public/assets/images/arrow-right.svg";
import arrowRight from "../../../../public/assets/images/greyforwardarrow.svg";
import React from "react";
import iphone from "../../../../public/assets/images/iphone13.svg";
import fan from "../../../../public/assets/images/table fan.png";
import pepper from "../../../../public/assets/images/pepper.jpeg";
import {useRouter} from "next/navigation";



const initialProducts = [
    { name: "Sea Blue iPhone 14", description: "6GB ROM / 128GB RAM", image: iphone, price: "850,000", quantity: 1, date: "04 May, 2025", status: "Pending" },
    { name: "Table Fan", description: "Powerful cooling fan", image: fan, price: "950,000", quantity: 1, date: "04 May, 2025", status: "In-transit" },
    { name: "Fresh Pepper", description: "Organic farm produce", image: pepper, price: "35,000", quantity: 1, date: "04 May, 2025", status: "Returned" },
    { name: "Sea Blue iPhone 14", description: "6GB ROM / 128GB RAM", image: iphone, price: "40,000", quantity: 1, date: "04 May, 2025", status: "Delivered" },
];

const Orders = ()=>{
    const router = useRouter();
    return (
        <>
            <MarketPlaceHeader />
            <div className="h-[48px] w-full  border-y-[0.5px] border-[#EDEDED]">
                <div className="h-[48px] px-25 gap-[8px] items-center flex">
                    <Image src={arrowBack} alt={'imagw'}/>
                    <p className="text-[14px] text-[#3F3E3E]">Home // <span className="font-medium text-[#022B23]">Wishlist</span></p>
                </div>
            </div>
            <div className="px-25 pt-[62px] h-auto w-full">
                <div className="flex gap-[30px]">
                    <div className="flex flex-col">
                        <div className="w-[381px] text-[#022B23] text-[12px] font-medium h-[44px] bg-[#f8f8f8] rounded-[10px] flex items-center px-[8px] justify-between">
                            <p>Go to profile</p>
                            <Image src={arrowRight} alt={'image'}/>
                        </div>
                        <div  className="flex flex-col h-[80px] w-[381px] mt-[6px] rounded-[12px] border border-[#eeeeee]">
                            <div onClick={()=>{router.push("/buyer/wishlist")}} className="w-full text-[#022B23]  text-[12px] font-medium h-[40px]  rounded-t-[12px] flex items-center px-[8px] ">
                                <p>Wishlist</p>
                            </div>
                            <div onClick={()=>{router.push("/buyer/orders")}} className="w-full text-[#022B23]  text-[12px]  h-[40px] rounded-b-[12px] bg-[#f8f8f8] flex items-center px-[8px] ">
                                <p>My orders</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-[779px] gap-[24px]">
                        <p className="text-[#000000] text-[14] font-medium">My orders (24)</p>
                        <div className="h-[604px] border-[0.5px] border-[#ededed] rounded-[12px] mb-[50px]">
                            {initialProducts.map((product, index) => {
                                const isLastItem = index === initialProducts.length - 1;
                                return (
                                    <div key={index} className={`flex items-center ${!isLastItem ? "border-b h-[151px] overflow-hidden border-[#ededed]" : "border-none"}`}>
                                        <div className="flex border-r border-[#ededed] w-[169px] h-[151px] overflow-hidden">
                                            <Image src={product.image} alt="image" width={133} height={100} className="w-full h-full overflow-hidden" />
                                        </div>

                                        <div className="flex items-center w-full px-[20px] justify-between">
                                            <div className="flex flex-col w-[30%]">
                                                <div className="mb-[13px]">
                                                    <p className="text-[14px] text-[#1E1E1E] font-medium mb-[4px]">{product.name}</p>
                                                    <p className="text-[10px] font-normal text-[#3D3D3D] uppercase">{product.description}</p>
                                                </div>

                                                <div className="flex flex-col">
                                                    <p className="font-medium text-[#1E1E1E] text-[16px]">₦{product.price}.00</p>
                                                    <p className="text-[#3D3D3D] text-[10px]">{product.date}</p>
                                                </div>

                                            </div>

                                            <div className={`flex h-[42px] w-[80px] items-center text-[14px] font-medium justify-center rounded-[100px]
                                             ${product.status==="Delivered"?'bg-[#F9FDE8] text-[#0C4F24]'
                                                :product.status==='In-transit'?'bg-[#FFFAEB] text-[#F99007]':'bg-[#E7E7E7] text-[#1E1E1E]'}`}>
                                                <p>{product.status}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Orders;