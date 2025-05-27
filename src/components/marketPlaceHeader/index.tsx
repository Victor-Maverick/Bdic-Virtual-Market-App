'use client'
import Image from "next/image";
import notificationImg from "../../../public/assets/images/notification-bing.png";
import routing from "../../../public/assets/images/routing.png";
import bag from "../../../public/assets/images/bag.png";
import profileImage from "../../../public/assets/images/profile-circle.png";
import wishListImg from '@/../public/assets/images/heart.png'
import farmGoLogo from "../../../public/assets/images/farmGoLogo.png";
import {useRouter} from "next/navigation";

const MarketPlaceHeader = ()=>{
    const router = useRouter();
    return(
        <>
            <div className="flex w-full h-[96px] px-[97px] items-center justify-between">
                <Image
                    onClick={()=>router.push("/")}
                    src={farmGoLogo} alt={'logo'}/>
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