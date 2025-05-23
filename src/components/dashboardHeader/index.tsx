import farmGoLogo from '../../../public/assets/images/farmGoLogo.png'
import profileImage from '../../../public/assets/images/profile-circle.png'

import Image from "next/image";
const DashboardHeader = ()=>{
    return(
        <div className="flex justify-between  items-center h-[78px] px-[100px] py-[18px]">
            <Image src={farmGoLogo} alt={'logo'}/>
            <div className="flex gap-[6px] items-center justify-center text-white">
                <Image src={profileImage} alt={'photo'}/>
                <p className="text-[14px] text-[#171719] font-medium">Hey, <span className="font-semibold">Terngu</span></p>
            </div>
        </div>
    )
}

export default DashboardHeader;