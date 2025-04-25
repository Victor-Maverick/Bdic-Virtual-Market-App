'use client';
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
import trashImg from "../../../../../public/assets/images/trash-2.svg"
import editImg from '@/../public/assets/images/edit-2.svg'
import addImg from '@/../public/assets/images/add.svg'
import arrowBack from '@/../public/assets/images/arrowBack.svg'
import arrowFoward from '@/../public/assets/images/arrowFoward.svg'
import {useState} from "react";
import {OnboardFleetModal} from "@/components/onboardFleetModal";

const fleet = [
    { id: 1, vehicleId: "01234567", image: bike, name: "TVS Bike", status: "active", engineNumber: "027654-VHS", type: "Bike" },
    { id: 2, vehicleId: "01234567", image: truckIcon, name: "TVS Bike", status: "active", engineNumber: "027654-DNS", type: "Truck" },
    { id: 3, vehicleId: "01234567", image: bike, status: "active", name: "TVS Bike", engineNumber: "027654-VHS", type: "Bike" },
    { id: 4, vehicleId: "01234567", image: truckIcon, status: "inactive", name: "TVS Bike", engineNumber: "027654-DNS", type: "Truck" },
    { id: 5, vehicleId: "01234567", image: bike, name: "TVS Bike", status: "active", engineNumber: "027654-VHS", type: "Bike" },
    { id: 6, vehicleId: "01234567", image: truckIcon, name: "TVS Bike", status: "active", engineNumber: "027654-DNS", type: "Truck" },
    { id: 7, vehicleId: "01234567", image: bike, name: "TVS Bike", status: "active", engineNumber: "027654-VHS", type: "Bike" },
    { id: 8, vehicleId: "01234567", image: truckIcon, name: "TVS Bike", status: "active", engineNumber: "027654-DNS", type: "Truck" },
    { id: 9, vehicleId: "01234567", image: bike, name: "TVS Bike", status: "active", engineNumber: "027654-XYZ", type: "Bike" },
    { id: 10, vehicleId: "01234567", image: truckIcon, name: "TVS Bike", status: "inactive", engineNumber: "027654-ABC", type: "Truck" },
    { id: 11, vehicleId: "01234567", image: bike, name: "TVS Bike", status: "active", engineNumber: "027654-PQR", type: "Bike" },
    { id: 12, vehicleId: "01234567", image: truckIcon, name: "TVS Bike", status: "active", engineNumber: "027654-MNO", type: "Truck" },
];

const SearchBar = () => (
    <div className="flex gap-2 items-center border-[1px] border-[#ededed] h-[44px] text-black px-4 py-1 rounded-[8px]">
        <Image src={searchImg} alt="Search Icon" width={20} height={20} />
        <input placeholder="Search" className="w-[310px] text-[#667085] text-[16px] focus:outline-none" />
    </div>
);

const ProductTableRow = ({ product, isLast }: { product: typeof fleet[0]; isLast: boolean }) => {
    return (
        <div className={`flex h-[72px] ${!isLast ? 'border-b border-[#EAECF0]' : ''}`}>
            <div className="flex items-center w-[600px] px-[24px] gap-[12px]">
                <input
                    type="checkbox"
                    className="w-[20px] h-[20px] rounded-[6px] border border-[#D0D5DD] accent-[#6941C6]"
                />
                <div className="bg-[#ededed] flex justify-center items-center rounded-full h-[40px] w-[40px] overflow-hidden mt-[2px]">
                    <Image
                        src={product.image}
                        alt={'vehicle image'}
                        width={26}
                        height={26}
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <p className="text-[14px] font-medium text-[#101828]">{product.name}</p>
                    <p className="text-[12px] text-[#667085]">ID: #{product.vehicleId}</p>
                </div>
            </div>
            <div className="flex justify-center items-center w-[110px]">
                <div className={`w-[65px] h-[22px] rounded-[8px] flex items-center justify-center ${
                    product.status === 'active' ? 'bg-[#ECFDF3] text-[#027A48]' : 'bg-[#FEF3F2] text-[#FF5050]'
                }`}>
                    <p className="text-[12px] font-medium">{product.status}</p>
                </div>
            </div>
            <div className="flex items-center w-[156px] px-[16px]">
                <p className="text-[14px] font-medium text-[#101828]">{product.engineNumber}</p>
            </div>
            <div className="flex flex-col gap-[4px] justify-center w-[290px] px-[20px]">
                <div className={`
                    ${product.type === 'Bike' ? 'bg-[#F9F5FF] text-[#027A48]' : 'bg-[#FFFAEB] text-[#F99007]'}
                    text-[12px] w-[50px] rounded-[16px] px-[8px] flex justify-center items-center py-[2px] font-medium
                `}>
                    <p>{product.type}</p>
                </div>
            </div>
            <div className="flex w-[116px] gap-[16px] p-[20px]">
                <Image src={trashImg} alt={'image'} />
                <Image src={editImg} alt={'image'} />
            </div>
        </div>
    );
};

const Fleet = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const totalPages = Math.ceil(fleet.length / itemsPerPage);

    const handleSubmitVehicles = () => {
        // Handle the submitted vehicles data
        console.log("Submitted vehicles:");
        // You can add your submission logic here
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    // Calculate the items to display on the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = fleet.slice(startIndex, startIndex + itemsPerPage);

    return (
        <>
            <DashboardHeader />
            <LogisticsDashboardOptions />
            <div className="flex flex-col py-[30px] px-25">
                <div className="flex flex-col gap-[12px]">
                    <p className="text-[#022B23] text-[16px] font-medium">Fleet management</p>
                    <div className="flex justify-between items-center">
                        <div className="flex h-[100px] gap-[20px]">
                            <div className="flex border-[0.5px] flex-col gap-[12px] p-[12px] border-[#E4E4E7] rounded-[14px] h-full w-[246px]">
                                <div className="flex items-center text-[#71717A] text-[12px] font-medium gap-[8px]">
                                    <Image src={flag} alt={'image'} />
                                    <p>Total Fleet</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-[#18181B] text-[16px] font-medium">{fleet.length}</p>
                                    <div className="flex gap-[4px] items-center">
                                        <Image src={arrowUp} alt={'image'} />
                                        <p className="text-[#22C55E] text-[12px] font-medium">2%</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex border-[0.5px] flex-col gap-[12px] p-[12px] border-[#E4E4E7] rounded-[14px] h-full w-[246px]">
                                <div className="flex items-center text-[#71717A] text-[12px] font-medium gap-[8px]">
                                    <Image src={formatCircle} alt={'image'} />
                                    <p>Bikes</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-[#18181B] text-[16px] font-medium">{fleet.filter(item => item.type === 'Bike').length}</p>
                                    <div className="flex gap-[4px] items-center">
                                        <Image src={arrowUp} alt={'image'} />
                                        <p className="text-[#22C55E] text-[12px] font-medium">2%</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex border-[0.5px] flex-col gap-[12px] p-[12px] border-[#E4E4E7] rounded-[14px] h-full w-[246px]">
                                <div className="flex items-center text-[#71717A] text-[12px] font-medium gap-[8px]">
                                    <Image src={truck} alt={'image'} />
                                    <p>Trucks</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-[#18181B] text-[16px] font-medium">{fleet.filter(item => item.type === 'Truck').length}</p>
                                    <div className="flex gap-[4px] items-center">
                                        <Image src={arrowUp} alt={'image'} />
                                        <p className="text-[#22C55E] text-[12px] font-medium">2%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div onClick={handleOpenModal} className="flex items-center w-[164px] gap-[9px] cursor-pointer bg-[#022B23] h-[52px] rounded-[12px] text-[#C6EB5F] p-[16px]">
                            <p>Add new fleet</p>
                            <Image src={addImg} alt={'image'} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col mt-[60px] rounded-[24px] border-[1px] border-[#EAECF0]">
                    <div className="my-[20px] mx-[20px] flex justify-between">
                        <div className="flex items-center gap-[8px]">
                            <p className="text-[#101828] text-[18px] font-medium">Company fleet</p>
                            <span className="flex text-[18px] text-[#6941C6] font-medium items-center justify-center h-[22px] w-[32px] rounded-[16px] bg-[#F9F5FF]">{fleet.length}</span>
                        </div>
                        <SearchBar />
                    </div>
                    <div className="flex h-[44px] bg-[#F9FAFB] border-b-[1px] border-[#EAECF0]">
                        <div className="flex items-center px-[24px] w-[600px] py-[12px]">
                            <p className="text-[#667085] font-medium text-[12px]">Vehicle ID</p>
                        </div>
                        <div className="flex items-center px-[20px] w-[110px] py-[12px] gap-[4px]">
                            <p className="text-[#667085] font-medium text-[12px]">Status</p>
                            <Image src={arrowDown} alt={'image'} />
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
                        {currentItems.map((product, index) => (
                            <ProductTableRow
                                key={product.id}
                                product={product}
                                isLast={index === currentItems.length - 1}
                            />
                        ))}
                    </div>
                    <div className="h-[68px] border-t-[1px] justify-between flex items-center border-[#EAECF0] px-[24px] py-[12px]">
                        <div
                            onClick={handlePrevious}
                            className={`flex text-[#344054] text-[14px] font-medium gap-[8px] justify-center items-center border-[#D0D5DD] border-[1px] cursor-pointer hover:shadow-md shadow-sm w-[114px] rounded-[8px] px-[14px] py-[8px] h-[36px] ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Image src={arrowBack} alt={'image'} />
                            <p>Previous</p>
                        </div>
                        <div className="flex gap-[2px]">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <div
                                    key={index + 1}
                                    onClick={() => handlePageClick(index + 1)}
                                    className={`flex justify-center items-center w-[36px] h-[36px] rounded-[8px] text-[14px] font-medium cursor-pointer ${
                                        currentPage === index + 1
                                            ? 'bg-[#ecfdf6] text-[#022B23]'
                                            : 'bg-white text-[#022B23]  hover:shadow-md'
                                    }`}
                                >
                                    {index + 1}
                                </div>
                            ))}
                        </div>
                        <div
                            onClick={handleNext}
                            className={`flex text-[#344054] text-[14px] gap-[8px] font-medium justify-center items-center border-[#D0D5DD] border-[1px] cursor-pointer hover:shadow-md shadow-sm w-[88px] rounded-[8px] px-[14px] py-[8px] h-[36px] ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <p>Next</p>
                            <Image src={arrowFoward} alt={'image'} />
                        </div>
                    </div>
                </div>
            </div>
            <OnboardFleetModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitVehicles}             />
        </>
    );
};

export default Fleet;