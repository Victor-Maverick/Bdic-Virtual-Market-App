import Image from 'next/image'
import phoneImage from '../../../public/assets/images/iphone-image.png'
import ButtonWithGreenArrow from "@/components/buttonWithGreenArrow";

const BannerSection = ()=>{
    return (
        <div className="bg-[#FFFAEB] py-5 h-[350px]">
            <div className="flex flex-wrap items-center  w-full justify-between">
                <div className="pl-25 flex-col items-center ">
                    <h2 className="text-[36px] font-semibold leading-tight">
                        New Devices <br/>at our store
                    </h2>
                    <p className="mb-12 font-normal mt-2">Smartphones, Accessories
                        <br/>and other gadgets available</p>
                    <ButtonWithGreenArrow name="Visit store" size={145}/>
                </div>
                <Image src={phoneImage} alt={''} height={330} />
            </div>
        </div>
    )
}

export default BannerSection;