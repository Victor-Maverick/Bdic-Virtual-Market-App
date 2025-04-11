import Image from "next/image";
import vendorImg from "../../../public/assets/images/vendorImg.svg";
import verify from "../../../public/assets/images/verify.svg";
import locationImg from "../../../public/assets/images/location.png";
import shopImg from "../../../public/assets/images/shop.png";
import barCodeImg from "../../../public/assets/images/barcode.png";
import {Key} from "react";
import MarketProductCard from "@/components/marketProductCard";
import tableFan from "../../../public/assets/images/table fan.png";
import wirelessCharger from "../../../public/assets/images/wireless charger.png";
import jblSpeaker from "../../../public/assets/images/jbl.png";
import smartWatch from "../../../public/assets/images/smartwatch.png";
import hardDrive from "../../../public/assets/images/samsung.png";
import airForce from "../../../public/assets/images/airforce.svg";
import arrow from '../../../public/assets/images/grey right arrow.png'


const products = [
    { name: "Mini fan", image: tableFan, price: "23,000" },
    { name: "Wireless charger", image: wirelessCharger, price: "15,000" },
    { name: "Bluetooth speaker", image: jblSpeaker, price: "35,000" },
    { name: "Smart watch", image: smartWatch, price: "40,000" },
    { name: "Portable hard drive", image: hardDrive, price: "25,000" },
    { name: "Air Force 1", image: airForce, price: "32,000" },
];

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const ProductGrid = ({products}) => (
    <div className="grid grid-cols-3 gap-x-[15px] gap-y-[15px] py-6">
        {products.map((product: { name: unknown; image: unknown; price: unknown; }, index: Key | null | undefined) => (
            <MarketProductCard
                key={index}
                height={303}
                name={product.name}
                image={product.image}
                price={product.price} size={201} imageHeight={215}            />
        ))}
    </div>
);

export default function ShopInformation() {
    return (
        <div className="flex gap-[15px] pt-[40px]">
            <div className="flex flex-col">
                <div className="border border-[#ededed] w-[513px] rounded-[24px] h-[180px] ">
                    <div className="flex items-center border-b border-[#ededed] px-[20px] pt-[10px] justify-between">
                        <div className="flex gap-[8px] pb-[10px] items-center">
                            <Image src={vendorImg} alt={'image'} width={40} height={40}/>
                            <p className="text-[16px] font-normal mt-[-4px]">Abba Technologies</p>
                        </div>
                        <div className="w-[74px] p-[6px] gap-[4px] h-[30px] bg-[#C6EB5F] rounded-[8px] flex items-center">
                            <Image src={verify} alt={'image'}/>
                            <p className="text-[12px]">verified</p>
                        </div>
                    </div>
                    <div className="px-[20px] flex items-center gap-[4px] mt-[20px]">
                        <Image src={locationImg} alt={'image'} width={18} height={18}/>
                        <p className="text-[14px] font-light">Modern market, Makurdi, Benue State</p>
                    </div>
                    <div className="flex px-[20px] mt-[15px] gap-[18px]">
                        <div className="flex items-center gap-[4px]">
                            <Image src={shopImg} alt={'image'} width={18} height={18}/>
                            <p className="text-[14px] font-light">Abba Technologies Shop 2C</p>
                        </div>
                        <div className="flex items-center gap-[4px]">
                            <Image src={barCodeImg} alt={'image'} width={18} height={18}/>
                            <p className="text-[14px] font-light">Lagos line</p>
                        </div>
                    </div>

                </div>
                <div className="flex flex-col gap-[20px] mt-[30px]">
                    <div className="flex flex-col gap-[4px]">
                        <div className="flex px-[18px] gap-[4px] justify-center  w-[513px] border-[0.5px] border-[#E4E4E4] rounded-[14px] h-[56px] bg-[#F7F7F7] flex-col ">
                            <p className="text-[12px] text-[#6D6D6D] font-medium">Vendor name</p>
                            <p className="text-[#121212] text-[14px] font-medium">Terngu Paul</p>
                        </div>
                        <div className="flex px-[18px] gap-[4px] justify-center  w-[513px] border-[0.5px] border-[#E4E4E4] rounded-[14px] h-[56px] bg-[#F7F7F7] flex-col ">
                            <p className="text-[12px]  text-[#6D6D6D] font-medium">Shop name</p>
                            <p className="text-[#121212] text-[14px] font-medium">Abba technologies</p>
                        </div>
                        <div className="flex px-[18px] gap-[4px] justify-center  w-[513px] border-[0.5px] border-[#E4E4E4] rounded-[14px] h-[56px] bg-[#F7F7F7] flex-col ">
                            <p className="text-[12px] text-[#6D6D6D] font-medium">Business phone number</p>
                            <p className="text-[#121212] text-[14px] font-medium">+234 801 2345 678</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-[4px]">
                        <div className="flex px-[18px] gap-[4px] justify-center  w-[513px] border-[0.5px] border-[#E4E4E4] rounded-[14px] h-[56px] bg-[#F7F7F7] flex-col ">
                            <p className="text-[12px] text-[#6D6D6D] font-medium">Location</p>
                            <p className="text-[#121212] text-[14px] font-medium">Makurdi</p>
                        </div>
                        <div className="flex px-[18px] gap-[4px] justify-center  w-[513px] border-[0.5px] border-[#E4E4E4] rounded-[14px] h-[56px] bg-[#F7F7F7] flex-col ">
                            <p className="text-[12px]  text-[#6D6D6D] font-medium">Market</p>
                            <p className="text-[#121212] text-[14px] font-medium">Modern market</p>
                        </div>
                        <div className="flex px-[18px] gap-[4px] justify-center  w-[513px] border-[0.5px] border-[#E4E4E4] rounded-[14px] h-[56px] bg-[#F7F7F7] flex-col ">
                            <p className="text-[12px] text-[#6D6D6D] font-medium">Shop line</p>
                            <p className="text-[#121212] text-[14px] font-medium">Lagos line</p>
                        </div>
                        <div className="flex px-[18px] gap-[4px] justify-center  w-[513px] border-[0.5px] border-[#E4E4E4] rounded-[14px] h-[56px] bg-[#F7F7F7] flex-col ">
                            <p className="text-[12px] text-[#6D6D6D] font-medium">Shop number</p>
                            <p className="text-[#121212] text-[14px] font-medium">2C</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-[4px]">
                        <div className="flex px-[18px] gap-[4px] justify-center  w-[513px] border-[0.5px] border-[#E4E4E4] rounded-[14px] h-[56px] bg-[#F7F7F7] flex-col ">
                            <p className="text-[12px] text-[#6D6D6D] font-medium">CAC number</p>
                            <p className="text-[#121212] text-[14px] font-medium">1-234-567-890</p>
                        </div>
                        <div className="flex px-[18px] gap-[4px] justify-center  w-[513px] border-[0.5px] border-[#E4E4E4] rounded-[14px] h-[56px] bg-[#F7F7F7] flex-col ">
                            <p className="text-[12px]  text-[#6D6D6D] font-medium">TIN</p>
                            <p className="text-[#121212] text-[14px] font-medium">245675432345</p>
                        </div>
                    </div>
                </div>

            </div>
            <div className="flex flex-col">
                <div className="flex flex-col gap-[8px] h-[44px]">
                    <p className="text-[#022B23] text-[16px] font-medium">Products(300)</p>
                    <p className="font-medium text-[14px] text-[#707070]">Get a preview of products listed on your shop</p>
                </div>
                <ProductGrid products={products} />
                <div className="flex w-[143px] h-[24px] justify-between items-center">
                    <p className="text-[#3F3E3E] text-[14px] font-medium">View all products</p>
                    <Image src={arrow} height={20} width={20} alt={'arrow'}/>
                </div>
            </div>
        </div>
    );
}