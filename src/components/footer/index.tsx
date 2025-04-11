import Image from "next/image";
import footerImg from "../../../public/assets/images/footerImg.png";
import marketPlaceIcon from '../../../public/assets/images/footerFire.png'

const Footer = () => {
    return (
        <div className="flex-col bg-green-950 py-12">
            <div className="flex justify-between px-25 bg-green-950  ">
                <div className="h-[181px] flex justify-between items-start gap-20">
                    <div className="w-[128px] flex items-start gap-2">
                        <Image src={footerImg} alt="FarmGo Logo" />
                        <p className="text-[16px] font-semibold text-white leading-tight">
                            Farm
                            <span style={{ color: "#c6eb5f" }}>Go</span> <br />
                            <span className="block">Benue</span>
                        </p>
                    </div>

                    <div className="flex flex-col items-start">
                        <p style={{ color: "#667874" }} className="font-normal mb-3">NAVIGATION</p>

                        <div className="flex items-center w-full">
                            <p className="cursor-pointer text-gray-100 text-[14px] mb-1.5 w-[100px]">Home</p>
                        </div>

                        <div className="flex items-center w-full">
                            <p className="cursor-pointer text-[14px] flex items-center gap-x-2 mb-1.5 w-[100px]">
                                <Image src={marketPlaceIcon} alt="Marketplace Icon" width={12} height={14} className="flex-shrink-0" />
                                <span style={{ color: "#ffeebe" }}>MarketPlace</span>
                            </p>
                        </div>

                        <div className="flex items-center w-full">
                            <p className="cursor-pointer text-gray-100 text-[14px] mb-1.5 w-[100px]">Logistics</p>
                        </div>

                        <div className="flex items-center w-full">
                            <p className="cursor-pointer text-gray-100 text-[14px] w-[100px]">About us</p>
                        </div>

                    </div>
                </div>
                <div className="flex justify-between gap-20">
                    <div className="flex-col gap-[40px]">
                        <p style={{ color: "#667874" }} className="font-normal mb-3">CONTACT US</p>
                        <p className="cursor-pointer text-[14px] text-white flex items-center gap-x-2 mb-1.5">+234 912 3456 789</p>
                        <p className="cursor-pointer text-[14px] text-white flex items-center gap-x-2">hello@farmgobenue.com</p>
                    </div>

                    <div className="flex-col">
                        <p style={{ color: "#667874" }} className="font-normal mb-3">FIND US</p>
                        <p className="cursor-pointer text-[14px] text-white flex items-center gap-x-2 mb-1.5">No.1 BDIC Ave. Opp.<br/>
                            Railway Market, Makurdi,<br/>
                            Benue State<br/>
                            Nigeria.</p>
                        <p style={{ color: "#667874" }} className="cursor-pointer text-[12px] flex items-center gap-x-2">Everyday from 8 AM - 8:00 PM</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-between px-40 text-white text-[14px] pb-3.5 ">
                <p>© 2025 — Copyright</p>
                <div className="flex items-center justify-between gap-8">
                    <p>Privacy</p>
                    <p>Terms of use</p>
                    <p>Legal</p>
                </div>
            </div>
            <div className="px-40">
                <div className="w-full border-t border-gray-500"></div>
                <p className="text-[14px] font-normal pt-8 text-[#C6EB5F]">Powered by: BDIC PLC</p>
            </div>

        </div>

    );

}
export default Footer
