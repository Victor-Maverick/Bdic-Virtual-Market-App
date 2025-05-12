import {ChevronDown} from "lucide-react";
import Image from "next/image";
import supportImg from '@/../public/assets/images/supportImg.svg'
import arrowRight from '@/../public/assets/images/green arrow.png'

const Support = ()=>{
    return(
        <>
            <div className="w-full flex border-b-[0.5px] border-[#ededed] text-[#022B23] text-[14px] font-medium h-[49px] px-[20px] items-center">
                <p>Support</p>
            </div>
            <div className="flex border-b-[0.5px] border-[#ededed] justify-between px-[20px] items-center">
                <div className="w-full flex text-[#1e1e1e] text-[14px] font-medium h-[49px]  items-center">
                    <p>View and manage tickets</p>
                </div>
                <div className="flex items-center gap-[2px] border border-[#f2f2f2] rounded-[8px] h-[30px] w-[84px] justify-center text-[#7A7A7A] text-[12px] font-medium">
                    <p>All time</p>
                    <ChevronDown className="w-[18px] h-[18px]"/>
                </div>
            </div>
            <div className="flex items-center mt-[90px] justify-center">
                <div>
                    <Image src={supportImg} alt={'image'} className="h-[231px] w-[270px]"/>
                    <div className="w-[313px] mt-[50px] cursor-pointer h-[52px] gap-[9px] text-[#C6EB5F] text-[14px] font-semibold rounded-[12px] flex items-center justify-center bg-[#022B23]">
                        Go to support dashboard
                        <Image src={arrowRight} alt={'image'}/>
                    </div>
                </div>

            </div>

        </>
    )
}
export default Support