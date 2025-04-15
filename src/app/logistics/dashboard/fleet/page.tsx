import DashboardHeader from "@/components/dashboardHeader";
import LogisticsDashboardOptions from "@/components/logisticsDashboardOptions";
import flag from '@/../public/assets/images/flag-2.svg'
import Image from "next/image";
import arrowUp from '@/../public/assets/images/arrow-up.svg'
import truck from '@/../public/assets/images/truck.svg'
import formatCircle from '@/../public/assets/images/format-circle.svg'
import bike from '@/../public/assets/images/bike.svg'
import truckIcon from '@/../public/assets/images/truckIcon.svg'
import arrowDown from "../../../../../public/assets/images/arrow-down.svg";
import searchImg from "../../../../../public/assets/images/search-normal.png";

const fleet = [
    {id:1, vehicleId: "01234567", image: bike, name:"TVS Bike", status: "active", engineNumber: "027654-VHS", type: "Bike"},
    {id:2, vehicleId: "01234567", image: truckIcon, name:"TVS Bike", status: "active", engineNumber: "027654-DNS", type: "Truck"},
    {id:3, vehicleId: "01234567", image: bike, status: "active", name:"TVS Bike", engineNumber: "027654-VHS", type: "Bike"},
    {id:4, vehicleId: "01234567", image: truckIcon, status: "inactive", name:"TVS Bike", engineNumber: "027654-DNS", type: "Truck"},
    {id:5, vehicleId: "01234567", image: bike, name:"TVS Bike", status: "active", engineNumber: "027654-VHS", type: "Bike"},
    {id:6, vehicleId: "01234567", image: truckIcon, name:"TVS Bike", status: "active", engineNumber: "027654-DNS", type: "Truck"},
    {id:7, vehicleId: "01234567", image: bike, name:"TVS Bike", status: "active", engineNumber: "027654-VHS", type: "Bike"},
    {id:8, vehicleId: "01234567", image: truckIcon, name:"TVS Bike", status: "active", engineNumber: "027654-DNS", type: "Truck"},

]
const SearchBar = () => (
    <div className="flex gap-2 items-center border-[1px] border-[#ededed] h-[44px]  text-black px-4 py-1 rounded-[8px]">
        <Image src={searchImg} alt="Search Icon" width={20} height={20}/>
        <input placeholder="Search" className="w-[310px] text-[#667085] text-[16px] focus:outline-none"/>
    </div>
);

const ProductTableRow = ({ product, isLast }: { product: typeof fleet[0]; isLast: boolean }) => {
    return (
        <div className={`flex h-[72px] ${!isLast ? 'border-b border-[#EAECF0]' : ''}`}>
            <div className="flex items-center w-[284px] pr-[24px] gap-3">
                <div className="bg-[#f9f9f9] h-full w-[70px] overflow-hidden mt-[2px]">
                    <Image
                        src={product.image}
                        alt={'vehicle image'}
                        width={70}
                        height={70}
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <p className="text-[14px] font-medium text-[#101828]">{product.name}</p>
                    <p className="text-[12px] text-[#667085]">ID: #{product.vehicleId}</p>
                </div>
            </div>

            <div className="flex items-center w-[109px] px-[16px]">
                <div className={`w-[55px] h-[22px] rounded-[8px] flex items-center justify-center ${
                    product.status === 'active'
                        ? 'bg-[#ECFDF3] text-[#027A48]'
                        : 'bg-[#FEF3F2] text-[#FF5050]'
                }`}>
                    <p className="text-[12px] font-medium">{product.status}</p>
                </div>
            </div>

            <div className="flex items-center w-[144px] px-[16px]">
                <p className="text-[14px] font-medium text-[#101828]">
                    {product.engineNumber}
                </p>
            </div>

            <div className="flex flex-col gap-[4px] justify-center w-[290px] px-[16px]">
                <p className="text-[14px] font-medium text-[#101828]">
                    {product.type}
                </p>
            </div>
        </div>
    )
}

const Fleet = ()=>{
    return(
        <>
            <DashboardHeader />
            <LogisticsDashboardOptions />
            <div className="flex flex-col py-[30px] px-25">
                <div className="flex flex-col  gap-[12px]">
                    <p className="text-[#022B23] text-[16px] font-medium">Fleet management</p>
                    <div className="flex h-[100px] gap-[20px]">
                        <div className="flex border-[0.5px] flex-col gap-[12px] p-[12px] border-[#E4E4E7] rounded-[14px] h-full w-[246px]">
                            <div className="flex items-center text-[#71717A] text-[12px] font-medium gap-[8px]">
                                <Image src={flag} alt={'image'}/>
                                <p>Total Fleet</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-[#18181B] text-[16px] font-medium">20</p>
                                <div className="flex gap-[4px] items-center">
                                    <Image src={arrowUp} alt={'image'}/>
                                    <p className="text-[#22C55E] text-[12px] font-medium">2%</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex border-[0.5px] flex-col gap-[12px] p-[12px] border-[#E4E4E7] rounded-[14px] h-full w-[246px]">
                            <div className="flex items-center text-[#71717A] text-[12px] font-medium gap-[8px]">
                                <Image src={formatCircle} alt={'image'}/>
                                <p>Bikes</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-[#18181B] text-[16px] font-medium">15</p>
                                <div className="flex gap-[4px] items-center">
                                    <Image src={arrowUp} alt={'image'}/>
                                    <p className="text-[#22C55E] text-[12px] font-medium">2%</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex border-[0.5px] flex-col gap-[12px] p-[12px] border-[#E4E4E7] rounded-[14px] h-full w-[246px]">
                            <div className="flex items-center text-[#71717A] text-[12px] font-medium gap-[8px]">
                                <Image src={truck} alt={'image'}/>
                                <p>Trucks</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-[#18181B] text-[16px] font-medium">5</p>
                                <div className="flex gap-[4px] items-center">
                                    <Image src={arrowUp} alt={'image'}/>
                                    <p className="text-[#22C55E] text-[12px] font-medium">2%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col mt-[60px] rounded-[24px] border-[1px] border-[#EAECF0]">
                    <div className="my-[20px] mx-[20px] flex justify-between">
                        <div className="flex items-center gap-[8px]">
                            <p className="text-[#101828] text-[18] font-medium">Company fleet</p>
                            <span className="flex text-[18px] text-[#6941C6] font-medium items-center justify-center h-[22px] w-[32px] rounded-[16px] bg-[#F9F5FF]">20</span>
                        </div>
                        <SearchBar/>
                    </div>

                    <div className="flex h-[44px] bg-[#F9FAFB] border-b-[1px] border-[#EAECF0]">
                        <div className="flex items-center px-[20px] w-[600px] py-[12px] ">
                            <p className="text-[#667085] font-medium text-[12px]">Vehicle ID</p>
                        </div>
                        <div className="flex items-center px-[20px] w-[110px] py-[12px] gap-[4px]">
                            <p className="text-[#667085] font-medium text-[12px]">Status</p>
                            <Image src={arrowDown} alt={'image'}/>
                        </div>
                        <div className="flex items-center px-[20px] w-[156px] py-[12px]">
                            <p className="text-[#667085] font-medium text-[12px]">Engine number</p>
                        </div>
                        <div className="flex items-center px-[20px] w-[278px] py-[12px]">
                            <p className="text-[#667085] font-medium text-[12px]">Type</p>
                        </div>
                        <div className="flex items-center px-[20px] w-[116px] py-[12px]">
                            <p className="text-[#667085] font-medium text-[12px]">Price</p>
                        </div>

                    </div>

                    <div className="flex flex-col">
                        {fleet.map((product, index) => (
                            <ProductTableRow
                                key={product.id}
                                product={product}
                                isLast={index === fleet.length - 1}
                            />
                        ))}
                    </div>
                </div>
            </div>

        </>
    )
}
export default Fleet