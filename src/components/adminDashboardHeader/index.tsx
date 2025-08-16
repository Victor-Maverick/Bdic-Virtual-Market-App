// components/header.tsx
import Image from "next/image";
import headerIcon from "@/../public/assets/images/headerImg.png";


export function Header() {
    return (
        <div className="flex justify-between h-[82px] pr-[20px] w-full pl-10 items-center border-b-[0.5px] border-[#E7E7E7]">
            <div className="flex items-center">
                <Image src={headerIcon} alt={'icon'} className="w-[42px] h-[42px]"/>
                <div className="flex justify-center items-center gap-[6px] ml-[20px] border-[#EDEDED] w-[154px] h-[48px] border-[0.5px] shadow-sm rounded-[8px]">
                    <span className="bg-[#F2F2F2] rounded-full h-[28px] w-[28px]"></span>
                    <p className="text-[#022B23] text-[14px] font-medium">Admin</p>
                </div>
            </div>

        </div>
    );
}