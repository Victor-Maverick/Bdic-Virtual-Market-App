// components/header.tsx
import Image from "next/image";
import headerIcon from "@/../public/assets/images/headerImg.png";
import searchImg from "@/../public/assets/images/search-normal.png";

export function Header() {
    return (
        <div className="flex justify-between h-[82px] pr-[20px] w-full pl-10 items-center border-b-[0.5px] border-[#E7E7E7]">
            <div className="flex items-center">
                <Image src={headerIcon} alt={'icon'} className="w-[42px] h-[42px]"/>
                <div className="flex justify-center items-center gap-[6px] ml-[20px] border-[#EDEDED] w-[154px] h-[48px] border-[0.5px] shadow-sm rounded-[8px]">
                    <span className="bg-[#F2F2F2] rounded-full h-[28px] w-[28px]"></span>
                    <p className="text-[#022B23] text-[14px] font-medium">SuperGo admin</p>
                </div>
            </div>
            <div className="flex gap-2 items-center bg-[#FFFFFF] border-[0.5px] border-[#F2F2F2] text-black px-4 py-2 shadow-sm rounded-sm">
                <Image src={searchImg} alt="Search Icon" width={20} height={20} className="h-[20px] w-[20px]"/>
                <input placeholder="Search" className="w-[272px] text-[#707070] text-[14px] focus:outline-none"/>
            </div>
        </div>
    );
}