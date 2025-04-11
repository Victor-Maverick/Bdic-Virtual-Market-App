


import Image from "next/image";
import addressImg from '@/../public/assets/images/deliverySuccessImg.svg'
import limeArrow from '../../../public/assets/images/green arrow.png'
import greenTick from '../../../public/assets/images/green tick.png'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const PaymentSuccessModal = ({ isOpen, onClose, deliveryOption, location }) => {
    if (!isOpen) return null;

    return (
        <div style={{ backdropFilter: "blur(3px)" }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-10" >
            <div className="bg-white max-w-[900px] w-full h-auto p-8  border-[0.5px] rounded-[24px] border-[#ededed] flex  items-center relative">
                <Image src={addressImg} alt={"image"} width={500} height={500} />
                <div className="flex-col">
                    <h2 className="text-[16px] font-medium text-[#000B38]">Your order has been placed successfully</h2>
                    <p className="text-[#6B718C] text-[14px]">You can pick up at the shop address selected:</p>

                    <div className="bg-[#ECFDF6] border-[0.5px] border-[#C6EB5F] text-[#022B23] p-[10px]  rounded-[18px] mt-2">
                        <div className="flex items-start gap-[8px]">
                            <Image src={greenTick} alt={'tick'}/>
                            <div>
                                <p className="text-[#022B23] font-medium text-[14px]">{deliveryOption}</p>
                                <p className="w-[190px] font-normal text-[12px]">{location}</p>
                            </div>
                        </div>
                    </div>

                    <p className="font-semibold text-[#022B23] text-[20px] mt-4">Order No: #01234567</p>

                    <div
                        onClick={onClose}
                        className="flex justify-center items-center gap-[9px] mt-6 w-[251px] h-[54px] bg-[#033228] text-white rounded-[12px] ">
                        <p className="text-[#C6EB5F] text-[14px] font-bold">Continue to payment</p>
                        <Image src={limeArrow} alt={'arrow'} width={18} height={18} className="h-[16px] w-[16px]"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessModal;
