'use client';
import { useState } from "react";
import ProductDetailHeader from "@/components/productDetailHeader";
import ProductDetailHeroBar from "@/components/productDetailHeroBar";
import NavigationBar from "@/components/navigationBar";
import cart from '../../../public/assets/images/black cart.png';
import Image from "next/image";
import arrow from '../../../public/assets/images/blackArrow.png';
import card_tick from '../../../public/assets/images/card-tick.png';
import iphone from "../../../public/assets/images/iphone13.svg";
import trash from '../../../public/assets/images/trash.png';
import fan from "../../../public/assets/images/table fan.png";
import pepper from "../../../public/assets/images/pepper.jpeg";
import grayAddressIcon  from '../../../public/assets/images/greyAddressIcon.svg'
import whiteAddressIcon from "../../../public/assets/images/addressIcon.svg";
import addIcon from '../../../public/assets/images/add-circle.svg'
import limeArrow from '../../../public/assets/images/green arrow.png'
import {useRouter} from 'next/navigation'

const initialProducts = [
    { name: "Sea Blue iPhone 14", description: "6GB ROM / 128GB RAM", image: iphone, price: "850,000", quantity: 1 },
    { name: "Table Fan", description: "Powerful cooling fan", image: fan, price: "950,000", quantity: 1 },
    { name: "Fresh Pepper", description: "Organic farm produce", image: pepper, price: "35,000", quantity: 1 },
    { name: "Sea Blue iPhone 14", description: "6GB ROM / 128GB RAM", image: iphone, price: "40,000", quantity: 1 },
];

const Cart = () => {
    const [products, setProducts] = useState(initialProducts);
    const [hover, setHover] = useState(false);
    const router = useRouter();
    const handleClick =()=>{
        router.push("/cart/checkOut");
    }

    const updateQuantity = (index: number, change: number) => {
        setProducts((prevProducts) =>
            prevProducts.map((product, i) =>
                i === index
                    ? { ...product, quantity: Math.max(1, product.quantity + change) }
                    : product
            )
        );
    };

    return (
        <>
            <ProductDetailHeader />
            <ProductDetailHeroBar />
            <NavigationBar page="//smart phone//product name//" name="cart" />

            <div className="px-[100px] py-[10px] border-b border-[#ededed]">
                <div className="w-[182px] h-[46px] flex border-[0.5px] border-[#ededed] rounded-[4px] p-[2px]">
                    <div className="flex justify-center gap-[2px] items-center bg-[#F9F9F9] w-[180px] h-[40px]">
                        <Image src={cart} alt={'cart icon'} width={20} height={20} />
                        <p className="text-[14px] text-[#1E1E1E]">My cart</p>
                        <p className="font-medium text-[14px] text-[#1E1E1E]">({products.length} products)</p>
                    </div>
                </div>
            </div>

            <div className="flex px-[100px] items-center mt-[20px] gap-[24px]">
                <div className="flex gap-[6px] items-center">
                    <Image src={cart} alt={'cart'} width={20} height={20} />
                    <p className="text-[14px] font-medium">Cart / checkout</p>
                </div>
                <Image src={arrow} alt={'arrow'} className="w-[14px] h-[14px]" />
                <div className="flex gap-[6px] items-center">
                    <Image src={card_tick} alt={'card'} />
                    <p className="text-[14px] text-[#707070]">Payment</p>
                </div>
            </div>

            <div className="flex gap-[12px] mt-[20px] px-[100px] py-4">
                <div className="border-[0.5px] border-[#ededed] w-[60%] h-full rounded-[14px]">
                    {products.map((product, index) => {
                        const isLastItem = index === products.length - 1;
                        return (
                            <div
                                key={index}
                                className={`flex items-center ${!isLastItem ? 'border-b border-[#ededed]' : 'border-none'}`}
                            >
                                <div className="flex border-r border-[#ededed] w-[133px] h-[110px] overflow-hidden">
                                    <Image src={product.image} alt="image" width={133} height={110} className="w-full h-full" />
                                </div>

                                <div className="flex items-center w-full px-[20px] justify-between">
                                    <div className="flex flex-col w-[30%]">
                                        <div className="mb-[13px]">
                                            <p className="text-[14px] text-[#1E1E1E] font-medium mb-[4px]">{product.name}</p>
                                            <p className="text-[10px] font-normal text-[#3D3D3D]">{product.description}</p>
                                        </div>
                                        <p className="font-medium text-[16px]">₦{product.price}.00</p>
                                    </div>

                                    <div className="w-[114px] h-[38px] flex justify-center items-center shrink-0">
                                        <button
                                            className="w-[38px] h-[38px] flex justify-center items-center rounded-[8px] bg-[#F9F9F9] border-[0.5px] border-[#ededed]"
                                            onClick={() => updateQuantity(index, -1)}
                                        >
                                            <p className="text-[14px] font-medium">-</p>
                                        </button>
                                        <div className="w-[38px] h-[38px] flex justify-center items-center">
                                            <p className="text-[14px] font-medium">{product.quantity}</p>
                                        </div>
                                        <button
                                            className="w-[38px] h-[38px] flex rounded-[8px] justify-center items-center bg-[#F9F9F9] border-[0.5px] border-[#ededed]"
                                            onClick={() => updateQuantity(index, 1)}
                                        >
                                            <p className="text-[14px] font-medium">+</p>
                                        </button>
                                    </div>

                                    <div className="flex gap-[4px] items-center w-[20%] justify-end">
                                        <Image src={trash} alt={'trash'} width={19} height={19} className="w-[19px] h-[19px]" />
                                        <p className="text-[14px] text-[#707070] font-normal">Remove</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex-col w-[40%] space-y-[10px]">
                    <p className="text-[#022B23] font-weight text-[14px] mb-[10px]">Order summary</p>
                    <div className="h-[215px] bg-[#F9F9F9] p-[24px] space-y-[10px]  rounded-[14px]">
                        <div className="flex justify-between items-center">
                            <p className="text-[#022B23] text-[14px] font-normal">Subtotal</p>
                            <p className="text-[14px] font-semibold text-[#1E1E1E]">₦850,000.00</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-[#022B23] text-[14px] font-normal">Discount</p>
                            <p className="text-[14px] font-semibold text-[#1E1E1E]">₦0.00</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-[#022B23] text-[14px] font-normal">VAT</p>
                            <p className="text-[14px] font-semibold text-[#1E1E1E]">0%</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-[#022B23] text-[14px] font-normal">Delivery</p>
                            <p className="text-[14px] font-semibold text-[#1E1E1E]">₦20,000.00</p>
                        </div>
                        <div className="flex justify-between items-center mt-[20px]">
                            <p className="text-[#022B23] text-[18px] font-normal">Total</p>
                            <p className="text-[18px] font-semibold text-[#1E1E1E]">₦870,000.00</p>
                        </div>
                    </div>
                    <div className="flex gap-[20px]">
                        <div className="w-[380px] flex rounded-[12px] border-[1.5px] border-[#D1D1D1] h-[48px]">
                            <div className="flex justify-center items-center w-[98px] border-r border-[#D1D1D1] rounded-tl-[12px] rounded-bl-[12px] h-full bg-[#F6F6F6]">
                                <p className="text-[14px] font-medium text-[#121212]">COUPON</p>
                            </div>
                            <input className="p-[10px] w-full outline-none bg-transparent text-[14px] font-medium text-[#121212]" placeholder="Enter coupon code" />
                        </div>
                        <div className="w-[116px] bg-[#022B23] h-[48px] flex justify-center items-center rounded-[12px]">
                            <p className="text-[#C6EB5F] font-semibold text-[16px]">Apply</p>
                        </div>
                    </div>
                    <div className="flex-col mt-[30px] space-y-[5px]">
                        <p className="font-medium text-[14px] text-[#022B23]">Delivery option</p>
                        <div className="min-h-[200px] bg-[#f9f9f9] rounded-[14px]  p-[10px] flex-col ">
                            <div className="flex gap-[10px] py-[10px] px-[8px] cursor-pointer hover:bg-[#022B23] hover:text-white hover:rounded-[14px]">
                                <Image
                                    src={hover ? whiteAddressIcon : grayAddressIcon}
                                    alt="icon"
                                    width={20}
                                    height={20}
                                    onMouseEnter={() => setHover(true)}
                                    onMouseLeave={() => setHover(false)}
                                />
                                <div className="flex-col ">
                                    <p className="text-[14px]  font-medium">Pick up at the market</p>
                                    <p className="text-[12px] ">Shop 2C,  Abba Technologies, Modern market, Makurdi</p>
                                </div>
                            </div>
                            <div className="flex gap-[10px] py-[10px] px-[8px] cursor-pointer hover:bg-[#022B23] hover:text-white hover:rounded-[14px]">
                                <Image
                                    src={hover ? whiteAddressIcon : grayAddressIcon}
                                    alt="icon"
                                    width={20}
                                    height={20}
                                    onMouseEnter={() => setHover(true)}
                                    onMouseLeave={() => setHover(false)}
                                />
                                <div className="flex-col ">
                                    <p className="text-[14px]  font-medium">Delivery at my address</p>
                                    <p className="text-[12px] ">No. 4 Vandeikya Street, Hight Level, Makurdi</p>
                                </div>
                            </div>
                            <div className="flex gap-[10px] py-[10px] px-[8px] cursor-pointer hover:bg-[#022B23] hover:text-white hover:rounded-[14px]">
                                <Image
                                    src={hover ? addIcon : addIcon}
                                    alt="icon"
                                    width={20}
                                    height={20}
                                    onMouseEnter={() => setHover(true)}
                                    onMouseLeave={() => setHover(false)}
                                />
                                <div className="flex-col ">
                                    <p className="text-[14px]  font-medium">Add new address</p>
                                    <p className="text-[12px] ">No address set yet? add a new delivery address</p>
                                </div>
                            </div>
                        </div>
                        <div onClick={handleClick} className="bg-[#022B23] cursor-pointer w-full h-[56px] gap-[9px] mt-[10px] rounded-[12px] flex justify-center items-center">
                            <p  className="text-[#C6EB5F] text-[14px] font-semibold">Continue to payment</p>
                            <Image src={limeArrow} alt={'image'} className="w-[18px] h-[18px]"/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;