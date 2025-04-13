'use client'
import DashboardHeader from "@/components/dashboardHeader";
import DashboardSubHeader from "@/components/dashboardSubHeader";
import archiveImg from '../../../../public/assets/images/archive.svg'
import Image from "next/image";
import biArrows from '../../../../public/assets/images/biArrows.svg'
import awardImg from '../../../../public/assets/images/award.png'
import dropBoxImg from '../../../../public/assets/images/dropbox.svg'
import flag from '../../../../public/assets/images/flag-2.svg'
import dashUser from '../../../../public/assets/images/dashuserimg.svg'
import arrowUp from '../../../../public/assets/images/arrow-up.svg'
import purpleLines from '../../../../public/assets/images/Lines.svg'
import blueLines from '../../../../public/assets/images/Blue.svg'
import yellowLines from '../../../../public/assets/images/Yellow.svg'
import turqoiseLines from '../../../../public/assets/images/Turquoise.svg'
import Stats from '../../../../public/assets/images/Stats.svg'

import {useState} from "react";
import DashboardOptions from "@/components/dashboardOptions";
import dashSlideImg from "../../../../public/assets/images/dashSlideImg.png";


const DashBoard2 = ()=>{
    const [activeView, setActiveView] = useState('orders');

    return(
        <>
            <DashboardHeader />
            <DashboardOptions/>
            <DashboardSubHeader welcomeText={"Hey, welcome"} description={"Get started by setting up your shop"}
                                background={'#ECFDF6'} image={dashSlideImg} textColor={'#05966F'} />            <div className="h-[58px] px-25 border-b-[0.5px] border-[#EDEDED] items-center flex">
                <p className="text-[#022B23] font-medium text-[20px]">Dashboard overview</p>
            </div>
            <div className="flex flex-col gap-[32px] py-[10px]">
                <div className="px-25 w-[919px] flex flex-col gap-[12px]">
                    <p className="font-medium text-[16px] text-[#022B23]">Sales summary</p>
                    <div className="flex items-center gap-[20px] h-[100px]">
                        <div className="w-[246px] h-full border-[0.5px] rounded-[14px] bg-[#ECFDF6] border-[#52A43E]">
                            <div className="flex items-center gap-[8px] text-[12px] text-[#52A43E] font-medium p-[15px]">
                                <Image src={biArrows} alt="total sales" width={18} height={18} className="h-[18px] w-[18px]" />
                                <p>Total sales (741)</p>
                            </div>
                            <div className="flex justify-between px-[15px]">
                                <p className="text-[#18181B] font-medium text-[16px]">N102,426,231.00</p>
                                <div className="flex items-center gap-[4px]">
                                    <Image src={arrowUp} alt={'image'} width={10} height={10}/>
                                    <p className="text-[#22C55E] text-[12px]">2%</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-[246px] h-full border-[0.5px] rounded-[14px] bg-[#FFFFFF] border-[#E4E4E7]">
                            <div className="flex items-center gap-[8px] text-[12px] text-[#707070] font-medium p-[15px]">
                                <Image src={archiveImg} alt="completed transactions" width={18} height={18} className="h-[18px] w-[18px]" />
                                <p>Completed transactions</p>
                            </div>
                            <div className="flex justify-between px-[15px]">
                                <p className="text-[#18181B] font-medium text-[16px]">721</p>
                                <div className="flex items-center gap-[4px]">
                                    <Image src={arrowUp} alt={'image'} width={10} height={10}/>
                                    <p className="text-[#22C55E] text-[12px]">2%</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-[246px] h-full border-[0.5px] rounded-[14px] bg-[#FFFFFF] border-[#FF9500]">
                            <div className="flex items-center gap-[8px] text-[12px] text-[#707070] font-medium p-[15px]">
                                <Image src={awardImg} alt="pending orders" width={18} height={18} className="h-[18px] w-[18px]" />
                                <p>Pending orders</p>
                            </div>
                            <p className="text-[#18181B] ml-[15px] font-medium text-[16px]">21</p>
                        </div>
                    </div>

                    <p className="font-medium text-[16px] text-[#022B23] mt-[20px]">Store performance</p>
                    <div className="flex items-center gap-[20px] h-[100px]">
                        <div className="w-[246px] h-full border-[0.5px] rounded-[14px] bg-[#FFFFFF] border-[#E4E4E7]">
                            <div className="flex items-center gap-[8px] text-[12px] text-[#707070] font-medium p-[15px]">
                                <Image src={dashUser} alt="total visitors" width={18} height={18} className="h-[18px] w-[18px]" />
                                <p>Total visitors</p>
                            </div>
                            <div className="flex justify-between px-[15px]">
                                <p className="text-[#18181B] font-medium text-[16px]">58,460</p>
                                <div className="flex items-center gap-[4px]">
                                    <Image src={arrowUp} alt={'image'} width={10} height={10}/>
                                    <p className="text-[#22C55E] text-[12px]">2%</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-[246px] h-full border-[0.5px] rounded-[14px] bg-[#FFFFFF] border-[#E4E4E7]">
                            <div className="flex items-center gap-[8px] text-[12px] text-[#707070] font-medium p-[15px]">
                                <Image src={dropBoxImg} alt="top product" width={18} height={18} className="h-[18px] w-[18px]" />
                                <p>Top selling product</p>
                            </div>
                            <div className="flex justify-between px-[15px]">
                                <p className="text-[#18181B] font-medium text-[16px]">iPhone 14 pro (82)</p>
                                <div className="flex items-center gap-[4px]">
                                    <Image src={arrowUp} alt={'image'} width={10} height={10}/>
                                    <p className="text-[#22C55E] text-[12px]">2%</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-[246px] h-full border-[0.5px] rounded-[14px] bg-[#FFFFFF] border-[#E4E4E7]">
                            <div className="flex items-center gap-[8px] text-[12px] text-[#707070] font-medium p-[15px]">
                                <Image src={flag} alt="inventory" width={18} height={18} className="h-[18px] w-[18px]" />
                                <p>All products (in stock)</p>
                            </div>
                            <div className="flex justify-between px-[15px]">
                                <p className="text-[#18181B] font-medium text-[16px]">1,232</p>
                                <div className="flex items-center gap-[4px]">
                                    <Image src={arrowUp} alt={'image'} width={10} height={10}/>
                                    <p className="text-[#22C55E] text-[12px]">2%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-[366px] mx-[100px] border-[1px] border-[#ededed] rounded-[24px] p-6">
                    <div className="flex items-center text-[#8C8C8C] text-[10px] w-[91px] h-[26px] border-[0.5px] border-[#ededed] rounded-[8px] relative mb-4">
                        <div
                            className={`flex items-center justify-center w-[42px] h-full z-10 cursor-pointer ${
                                activeView === 'visits' ? 'border-r-[1px] border-[#ededed] w-[49px] rounded-tl-[8px] rounded-bl-[8px] bg-[#F8FAFB] text-[#8C8C8C]' : ''
                            }`}
                            onClick={() => setActiveView('visits')}
                        >
                            <p>Visits</p>
                        </div>
                        <div
                            className={`flex items-center justify-center w-[50%] h-full z-10 cursor-pointer ${
                                activeView === 'orders' ? 'border-l-[1px] border-[#ededed] w-[49px] rounded-tr-[8px] rounded-br-[8px] bg-[#F8FAFB] text-[#8C8C8C]' : ''
                            }`}
                            onClick={() => setActiveView('orders')}
                        >
                            <p>Orders</p>
                        </div>
                        <div
                            className={`absolute top-0 h-full w-[50%] rounded-[6px] transition-all ${
                                activeView === 'visits' ? ' left-0 bg-[#F8FAFB]' : 'left-[50%] bg-[#F8FAFB]'
                            }`}
                        ></div>
                    </div>

                    {activeView === 'visits' ? (
                        <>
                            <div className="flex text-[#7A7A7A] text-[14px] mt-[30px] font-semibold justify-between items-center">
                                <p>VISITS</p>
                                <select className="text-[#707070] text-[12px] border rounded px-2 py-1 bg-white">
                                    <option>Last 7 days</option>
                                    <option>Last 30 days</option>
                                    <option>Last 90 days</option>
                                </select>
                            </div>
                            <div className="flex justify-between items-center my-5">
                                <div className="flex items-center gap-[5px]">
                                    <h3 className="text-[#18181B] font-medium text-[44px]">6.4K</h3>
                                    <div className="flex items-center w-[45px] h-[20px] text-[12px] font-medium rounded-[4px] text-[#377E36] bg-[#E0F0E4] justify-center">
                                        <p>+3.4%</p>
                                    </div>
                                </div>


                            </div>
                            <div className="flex items-center gap-[8px] my-[25px]">
                                <Image src={purpleLines} alt={'image'}/>
                                <Image src={blueLines} alt={'image'}/>
                                <Image src={yellowLines} alt={'image'}/>
                                <Image src={turqoiseLines} alt={'image'}/>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                {/* Total Visits */}
                                <div className="w-[234px] border-[1px] border-[#EDEDED] rounded-lg p-4">
                                    <p className="text-[#707070] text-[12px] mb-1">TOTAL VISITS</p>
                                    <div className="flex justify-between items-end">
                                        <span className="text-[#18181B] font-medium text-[20px]">3.2K</span>
                                        <div className="flex items-center gap-1">
                                            <span className="text-[#22C55E] text-[12px]">+3.4K</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Visits Converted to Sales */}
                                <div className="w-[356px] border-[1px] border-[#EDEDED] rounded-lg p-4">
                                    <p className="text-[#707070] text-[12px] mb-1">VISITS CONVERTED TO SALES</p>
                                    <div className="flex justify-between items-end">
                                        <span className="text-[#18181B] font-medium text-[20px]">2.3K</span>
                                        <div className="flex items-center gap-1">
                                            <Image src={arrowUp} alt="increase" width={10} height={10} />
                                            <span className="text-[#22C55E] text-[12px]">+11.4%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-[309px] border-[1px] border-[#EDEDED] rounded-lg p-4">
                                    <p className="text-[#707070] text-[12px] mb-1">CAMPAIGN CLICKS</p>
                                    <div className="flex justify-between items-end">
                                        <span className="text-[#18181B] font-medium text-[20px]">1.5K</span>
                                        <div className="flex items-center gap-1">
                                            <Image src={arrowUp} alt="increase" width={10} height={10} />
                                            <span className="text-[#22C55E] text-[12px]">+1.4%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-[271px] border-[1px] border-[#EDEDED] rounded-lg p-4">
                                    <p className="text-[#707070] text-[12px] mb-1">CAMPAIGN CLICKS CONVERTED</p>
                                    <div className="flex justify-between items-end">
                                        <span className="text-[#18181B] font-medium text-[20px]">1.6K</span>
                                        <div className="flex items-center gap-1">
                                            <Image src={arrowUp} alt="increase" width={10} height={10} />
                                            <span className="text-[#22C55E] text-[12px]">+7.0%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex text-[#7A7A7A] text-[14px] mt-[30px] font-semibold justify-between items-center">
                                <p>ORDERS</p>
                                <select className="text-[#707070] text-[12px] border-[1px] p-[10px] border-[#F2F2F2] shadow-xs w-[123px] h-[38px] rounded-[8px] bg-white">
                                    <option>Last 7 days</option>
                                    <option>Last 30 days</option>
                                    <option>Last 90 days</option>
                                </select>
                            </div>
                            <div className="flex justify-between items-center my-5">
                                <div className="flex items-center gap-[5px]">
                                    <h3 className="text-[#18181B] font-medium text-[44px]">1.4K</h3>
                                    <div className="flex items-center w-[45px] h-[20px] text-[12px] font-medium rounded-[4px] text-[#377E36] bg-[#E0F0E4] justify-center">
                                        <p>+3.4%</p>
                                    </div>
                                </div>


                            </div>
                            <Image src={Stats} alt={'stats'} className="mb-[20px]"/>
                            <div className="flex items-center justify-between gap-4">
                                <div className="w-[234px] border-[1px] flex flex-col border-[#EDEDED] gap-[9px] rounded-lg p-4">
                                    <div className="flex items-center gap-[9px]">
                                        <span className="rounded-full w-[6px] h-[6px] bg-[#C6EB5F]"></span>
                                        <p className="text-[#707070] text-[12px]">DELIVERED</p>
                                    </div>
                                    <div className="flex w-[108px] h-[28px] items-center gap-[10px]">
                                        <span className="text-[#18181B] font-medium text-[20px]">900</span>
                                        <div className="flex bg-[#E0F0E4] w-[53px] px-[4px] py-[2px] rounded-[100px] items-center justify-center">
                                            <span className="text-[#377E36] font-medium text-[12px]">+44.3%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-[326px] border-[1px] flex flex-col border-[#EDEDED] gap-[9px] rounded-[8px] p-4">
                                    <div className="flex items-center gap-[9px]">
                                        <span className="rounded-full w-[6px] h-[6px] bg-[#1E1E1E]"></span>
                                        <p className="text-[#707070] text-[12px]">EN-ROUTE</p>
                                    </div>
                                    <div className="flex w-[108px] h-[28px] items-center gap-[10px]">
                                        <span className="text-[#18181B] font-medium text-[20px]">82</span>
                                        <div className="flex bg-[#E0F0E4] w-[53px] px-[4px] py-[2px] rounded-[100px] items-center justify-center">
                                            <span className="text-[#377E36] font-medium text-[12px]">+11.4%</span>
                                        </div>
                                    </div>
                                </div>


                                <div className="w-[234px] border-[1px] flex flex-col border-[#EDEDED] gap-[9px] rounded-lg p-4">
                                    <div className="flex items-center gap-[9px]">
                                        <span className="rounded-full w-[6px] h-[6px] bg-[#1E1E1E]"></span>
                                        <p className="text-[#707070] text-[12px]">PENDING</p>
                                    </div>
                                    <div className="flex w-[108px] h-[28px] items-center gap-[10px]">
                                        <span className="text-[#18181B] font-medium text-[20px]">200</span>
                                        <div className="flex bg-[#FEECEB] w-[53px] px-[4px] py-[2px] rounded-[100px] items-center justify-center">
                                            <span className="text-[#B12F30] font-medium text-[12px]">-1.03%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-[234px] border-[1px] flex flex-col border-[#EDEDED] gap-[9px] rounded-lg p-4">
                                    <div className="flex items-center gap-[9px]">
                                        <span className="rounded-full w-[6px] h-[6px] bg-[#1E1E1E]"></span>
                                        <p className="text-[#707070] text-[12px]">FAILED ORDERS</p>
                                    </div>
                                    <div className="flex w-[108px] h-[28px] items-center gap-[10px]">
                                        <span className="text-[#18181B] font-medium text-[20px]">12</span>
                                        <div className="flex bg-[#FEECEB] w-[53px] px-[4px] py-[2px] rounded-[100px] items-center justify-center">
                                            <span className="text-[#B12F30] font-medium text-[12px]">-1.03%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default DashBoard2