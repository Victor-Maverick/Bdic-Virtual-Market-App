import  Image from 'next/image'
import arrowBack from '@/../public/assets/images/arrow-right.svg'
import gradientImg from '@/../public/assets/images/orangeCirlce.png'
import shadow from "../../../../public/assets/images/shadow.png";
const Chat =()=>{
    return(
        <>
            <div className="flex justify-between items-center h-[78px] w-full pl-[88px] pr-[120px] ">
                <div className={`flex gap-[278px] items-center`}>
                    <div className={`flex text-[#1E1E1E] text-[14px] font-medium gap-[8px]`}>
                        <Image src={arrowBack} alt="arrowBack" />
                        <p>Go back</p>
                    </div>
                    <div className="flex gap-[8px] w-[125px] h-[56px]">
                        <Image src={gradientImg} alt={'image'} className="h-[50px] w-[50px]"/>
                        <div className="flex text-[#515151] leading-tight flex-col ">
                            <p className="text-[20px] font-medium">Doose</p>
                            <p className="text-[14px]">Active</p>
                        </div>
                    </div>
                </div>
                <div className="w-[28px] h-[28px] gap-[3px] flex items-center justify-center rounded-full border-[2px] border-[#545454]">
                    <span className="w-[2.3px] h-[2.3px] rounded-full bg-[#545454] "></span>
                    <span className="w-[2.3px] h-[2.3px] rounded-full bg-[#545454] "></span>
                    <span className="w-[2.3px] h-[2.3px] rounded-full bg-[#545454] "></span>
                </div>
            </div>
            <div
                className="h-[45px] w-full"
                style={{
                    backgroundImage: `url(${shadow.src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            ></div>
        </>
    )
}
export default Chat