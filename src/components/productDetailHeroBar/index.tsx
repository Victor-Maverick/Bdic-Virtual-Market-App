'use client'
import Image from "next/image";
import marketIcon from "../../../public/assets/images/market element.png";
import {useState} from "react";
import searchImg from "../../../public/assets/images/search-normal.png";

const SearchBar = () => (
    <div className="flex gap-2 items-center bg-[#F9F9F9] h-[44px] text-black px-4 py-2 border border-[#EDEDED] rounded-sm">
        <Image src={searchImg} alt="Search Icon" width={20} height={20}/>
        <input placeholder="Search for items here" className="w-[315px] h-[30px] focus:outline-none"/>
    </div>
);

const ProductDetailHeroBar = () => {
    const [selectedMarket, setSelectedMarket] = useState("Wurukum market");
    return (
        <div className="flex justify-between px-[100px] mt-4 py-[10px]">
            <div className="flex items-center gap-[2px]">
                {/*<Dropdown/>*/}
                <div className="flex gap-2 justify-between p-0.5 border border-[#ededed] rounded-sm">
                    <div className="bg-[#F9F9F9] text-black px-2 rounded-sm flex items-center justify-center h-10">
                        <select className="bg-[#F9F9F9] text-black px-2 rounded-sm text-center w-full focus:outline-none">
                            <option>Benue State</option>
                            <option>Enugu State</option>
                            <option>Lagos State</option>
                        </select>
                    </div>

                    <div className="relative">
                        <div className="flex items-center bg-[#F9F9F9] text-black px-4 py-2 rounded-md">
                            <Image src={marketIcon} alt="Market Icon" width={20} height={20} />
                            <select
                                className="bg-[#F9F9F9] text-black items-center pr-1 focus:outline-none"
                                onChange={(e) => setSelectedMarket(e.target.value)}
                                value={selectedMarket}
                            >
                                <option>Wurukum market</option>
                                <option>Gboko Market</option>
                                <option>Otukpo Market</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <SearchBar/>
        </div>
    )
}
export default ProductDetailHeroBar;