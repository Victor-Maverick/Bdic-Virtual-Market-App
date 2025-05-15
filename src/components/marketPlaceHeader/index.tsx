import Image from "next/image";
import headerIcon from "../../../public/assets/images/headerImg.png";
import notificationImg from "../../../public/assets/images/notification-bing.png";
import routing from "../../../public/assets/images/routing.png";
import bag from "../../../public/assets/images/bag.png";
import profileImage from "../../../public/assets/images/profile-circle.png";
import wishListImg from '@/../public/assets/images/heart.png'

const MarketPlaceHeader = ()=>{
    return(
        <>
            <div className="flex w-full h-[96px] px-[97px] items-center justify-between">
                <div className="flex items-center gap-[4px] w-[95px] h-[47px]">
                    <Image src={headerIcon} alt={'icon'} className="w-[50%] h-full"/>
                    <div className="flex flex-col">
                        <p className="text-[12px] font-semibold text-[#022B23] leading-tight">
                            Market<br/><span className="text-[#C6EB5F]">Go</span>
                        </p>
                    </div>
                </div>
                <div className="flex justify-evenly gap-8 items-center">
                    {[
                        { img: wishListImg, text: "Wishlist" },
                        { img: routing, text: "Track order" },
                        { img: bag, text: "Cart" },
                        { img: notificationImg, text: "Notifications" },
                        { img: profileImage, text: "Hey, Terngu" }
                    ].map(({ img, text }, index) => (
                        <div key={index} className="flex gap-1 text-[14px] text-[#171719] font-semibold items-center cursor-pointer">
                            <Image src={img} alt="icon" height={20} width={20} />
                            <p>{text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
export default MarketPlaceHeader;