import Image from "next/image";
import displayImg from "../../../public/assets/images/iphone14Img.svg";
import productTick from '../../../public/assets/images/addproducttick.svg'
import limeArrow from "../../../public/assets/images/green arrow.png";
import {useRouter} from "next/navigation";

interface ProductAddedModalProps {
    isOpen: boolean;
}

const ProductAddedModal = ({ isOpen }: ProductAddedModalProps) => {
    const router = useRouter();
    if (!isOpen) return null;
    const handleDashboardClick = ()=>{
        router.push("/vendor/dashboard");
    }

    return (
        <div style={{ backdropFilter: "blur(3px)" }}
             className="fixed inset-0 z-50 flex items-center h-[635px] justify-center bg-opacity-10">
            <div className="bg-white max-w-[900px] items-center gap-[25px] w-full h-[420px] p-[24px] border-[0.5px] rounded-[24px] border-[#ededed] flex relative">
                <div className="flex justify-center items-end bg-[#F9F9F9] rounded-[20px] w-[47%] h-[380px]">
                    <Image src={displayImg} alt={"image"} width={300} height={300} />
                </div>
                <div className="flex-col flex justify-center gap-[36px]  items-center w-[53%]">
                    <div className="flex justify-center items-center">
                        <Image src={productTick} alt={'Tick'} width={55} height={55} />
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-[#000B38] font-medium">Product has been published to your shop successfully</p>
                        <p className="#6B718C text-[14px]">Your product has been listed in your shop and ready for sales</p>
                    </div>
                    <div className="flex gap-[19px]">
                        <div
                            onClick={handleDashboardClick}
                            className="flex gap-[9px] p-[4px] justify-center items-center w-[207px] bg-[#022B23] rounded-[12px] h-[46px] cursor-pointer hover:bg-[#033a30] transition-colors"
                        >
                            <p className="text-[#C6EB5F] font-semibold text-[14px]">Go to dashboard</p>
                            <Image src={limeArrow} alt="Continue arrow" width={18} height={18} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductAddedModal;