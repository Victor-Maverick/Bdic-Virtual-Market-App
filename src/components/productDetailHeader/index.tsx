'use client';
import Image from "next/image";
import farmGoLogo from "../../../public/assets/images/farmGoLogo.png";
import box from '../../../public/assets/images/box.png'
import routing from '../../../public/assets/images/routing.png'
import bag from '../../../public/assets/images/bag.png'
import profileImage from '../../../public/assets/images/profile-circle.png'
import heart from '../../../public/assets/images/heart.png'
import notificationImg from '../../../public/assets/images/notification-bing.png'
import { useRouter } from "next/navigation";

const ProductDetailHeader = () => {
    const router = useRouter();

    const handleClick = (to: string) => {
        router.push(to);
    };

    return (
        <div className="flex justify-between items-center px-[100px] py-[18px]">
            <Image
                onClick={()=>router.push("/")}
                src={farmGoLogo} alt={'logo'}/>
            <div className="flex items-center justify-evenly gap-[20px] text-[14px] font-semibold">
                <div className="flex gap-[5px] items-center">
                    <Image src={box} alt={'image'} width={20} height={20}/>
                    <p>Become a vendor</p>
                </div>
                <div className="flex gap-[5px] items-center">
                    <Image src={heart} alt={'image'} width={20} height={20}/>
                    <p>Wish list</p>
                </div>
                <div className="flex items-center gap-[5px]">
                    <Image src={routing} alt={'image'} width={20} height={20}/>
                    <p>Track order</p>
                </div>
                <div className="flex items-center gap-[5px]">
                    <Image src={bag} alt={'image'} width={20} height={20}/>
                    <p className="cursor-pointer" onClick={() => handleClick("/cart")}>Cart</p>
                </div>
                <div className="flex items-center gap-[5px]">
                    <Image src={notificationImg} alt={'image'} width={20} height={20}/>
                    <p>Notifications</p>
                </div>
                <div className="flex items-center gap-[5px]">
                    <Image src={profileImage} alt={'image'} width={20} height={20}/>
                    <p>Hey, Terngu</p>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailHeader;
