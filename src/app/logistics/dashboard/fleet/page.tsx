'use client';
import DashboardHeader from "@/components/dashboardHeader";
import LogisticsDashboardOptions from "@/components/logisticsDashboardOptions";
import flag from '@/../public/assets/images/flag-2.svg'
import Image, {StaticImageData} from "next/image";
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
import FleetOnboardSuccessModal from "@/components/fleetOnboardSuccessModal";
import OnboardRiderModal from "@/components/onboardRiderModal";
import axios from "axios";
import { FullVehicle, NewVehicleData } from "@/types/vehicle";


interface Vehicle {
    id: number;
    vehicleId: string;
    image: string | StaticImageData;
    name: string;
    status: "active" | "inactive";
    engineNumber: string;
    type: "Bike" | "Truck";
    plateNumber: string;
}

interface AddVehicleResponse{
    id: string;
    plateNumber: string;
    engineNumber: string;
    type: string;
}

interface UpdateFleetResponse{
    ownerEmail: string;
}

const mockFleet: Vehicle[] = [
    { id: 1, plateNumber: "11111", vehicleId: "01234567", image: bike, name: "TVS Bike", status: "active", engineNumber: "027654-VHS", type: "Bike" },
    { id: 2, plateNumber: "11111", vehicleId: "01234567", image: truckIcon, name: "TVS Truck", status: "active", engineNumber: "027654-DNS", type: "Truck" },
    { id: 3, plateNumber: "11111",vehicleId: "01234567", image: bike, status: "active", name: "TVS Bike", engineNumber: "027654-VHS", type: "Bike" },
    { id: 4, plateNumber: "11111", vehicleId: "01234567", image: truckIcon, status: "inactive", name: "TVS Truck", engineNumber: "027654-DNS", type: "Truck" },
    { id: 5, plateNumber: "11111",vehicleId: "01234567", image: bike, name: "TVS Bike", status: "active", engineNumber: "027654-VHS", type: "Bike" },
    { id: 6, plateNumber: "11111",vehicleId: "01234567", image: truckIcon, name: "TVS Truck", status: "active", engineNumber: "027654-DNS", type: "Truck" },
    { id: 7, plateNumber: "11111",vehicleId: "01234567", image: bike, name: "TVS Bike", status: "active", engineNumber: "027654-VHS", type: "Bike" },
    { id: 8, plateNumber: "11111",vehicleId: "01234567", image: truckIcon, name: "TVS Truck", status: "active", engineNumber: "027654-DNS", type: "Truck" },
];

const SearchBar = () => (
    <div className="flex gap-2 items-center border-[1px] border-[#ededed] h-[44px] text-black px-4 py-1 rounded-[8px]">
        <Image src={searchImg} alt="Search Icon" width={20} height={20} />
        <input placeholder="Search" className="w-[310px] text-[#667085] text-[16px] focus:outline-none" />
    </div>
);

const ProductTableRow = ({ product, isLast }: { product: Vehicle; isLast: boolean }) => {
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

const logisticsApi = axios.create({
    baseURL: 'https://api.digitalmarke.bdic.ng/api/logistics',
    headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${yourAuthToken}`
    }
});

type BackendVehicleType = 'BIKE' | 'TRUCK';

const mapToBackendType = (frontendType: "Bike" | "Truck"): BackendVehicleType => {
    return frontendType.toUpperCase() as BackendVehicleType;
};

const Fleet = () => {
    const [isFleetModalOpen, setIsFleetModalOpen] = useState(false);
    const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [fleetData, setFleetData] = useState<FullVehicle[]>(mockFleet);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const totalPages = Math.ceil(fleetData.length / itemsPerPage);
    const [newVehiclesCount, setNewVehiclesCount] = useState(0);

    const handleSubmitVehicles = async (vehicles: NewVehicleData[]) => {
        try {
            const ownerEmail = "awua@gmail.com"; // Get from auth context or props

            // 1. Onboard all vehicles
            const onboardPromises = vehicles.map(vehicle =>
                logisticsApi.post<AddVehicleResponse>('/onboardVehicle', {
                    ownerEmail,
                    engineNumber: vehicle.engineNumber,
                    plateNumber: vehicle.plateNumber,
                    type: mapToBackendType(vehicle.type) // Use the mapped type here
                })
            );

            // Wait for all onboardings to complete
            await Promise.all(onboardPromises);

            // 2. Update fleet number
            await logisticsApi.post<UpdateFleetResponse>('/updateFleetNumber', {
                ownerEmail,
                fleetNumber: newVehiclesCount // Changed from newVehiclesCount to vehicles.length
            });

            // 3. Update local state if all API calls succeeded
            const newVehicles = vehicles.map((v, i) => ({
                id: fleetData.length + i + 1,
                vehicleId: `VH${Math.floor(Math.random() * 100000)}`,
                image: v.type === 'Bike' ? bike : truckIcon,
                name: v.type === 'Bike' ? 'TVS Bike' : 'TVS Truck',
                status: "active" as const,
                engineNumber: v.engineNumber,
                plateNumber: v.plateNumber,
                type: v.type
            }));

            setFleetData(prev => [...prev, ...newVehicles]);
            setNewVehiclesCount(vehicles.length);
            setIsSuccessModalOpen(true);

        } catch (error) {
            console.error("Fleet onboarding failed:", error);

            let errorMessage = "Failed to onboard fleet";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || error.message;
            }

            alert(errorMessage);
        } finally {
            setIsFleetModalOpen(false);
        }
    };

    const handleOpenFleetModal = () => {
        setIsFleetModalOpen(true);
    };

    const handleCloseFleetModal = () => {
        setIsFleetModalOpen(false);
    };

    const handleOpenRiderModal = () => {
        setIsRiderModalOpen(true);
    };

    const handleCloseRiderModal = () => {
        setIsRiderModalOpen(false);
    };

    const handleRiderSuccess = () => {
        // You can add any additional logic here after successful rider onboarding
        console.log("Rider onboarded successfully!");
        // You might want to refresh rider data or show a success message
    };

    const handleSuccessModalClose = () => {
        setIsSuccessModalOpen(false);
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
    const currentItems = fleetData.slice(startIndex, startIndex + itemsPerPage);

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
                                    <p className="text-[#18181B] text-[16px] font-medium">{fleetData.length}</p>
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
                                    <p className="text-[#18181B] text-[16px] font-medium">{fleetData.filter(item => item.type === 'Bike').length}</p>
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
                                    <p className="text-[#18181B] text-[16px] font-medium">{fleetData.filter(item => item.type === 'Truck').length}</p>
                                    <div className="flex gap-[4px] items-center">
                                        <Image src={arrowUp} alt={'image'} />
                                        <p className="text-[#22C55E] text-[12px] font-medium">2%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div onClick={handleOpenFleetModal} className="flex items-center w-[164px] gap-[9px] cursor-pointer bg-[#022B23] h-[52px] rounded-[12px] text-[#C6EB5F] p-[16px]">
                            <p>Add new fleet</p>
                            <Image src={addImg} alt={'image'} />
                        </div>
                    </div>
                    <div className="flex gap-[20px] items-center">
                        <div className="flex h-[100px] gap-[20px]">
                            <div className="flex border-[0.5px] flex-col gap-[12px] p-[12px] border-[#E4E4E7] rounded-[14px] h-full w-[246px]">
                                <div className="flex items-center text-[#71717A] text-[12px] font-medium gap-[8px]">
                                    <Image src={truck} alt={'image'} />
                                    <p>Riders</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-[#18181B] text-[16px] font-medium">{fleetData.filter(item => item.type === 'Truck').length}</p>
                                </div>
                            </div>
                        </div>
                        <div onClick={handleOpenRiderModal} className="flex items-center w-[164px] gap-[9px] cursor-pointer bg-[#022B23] h-[52px] rounded-[12px] text-[#C6EB5F] p-[16px]">
                            <p>Add new Rider</p>
                            <Image src={addImg} alt={'image'} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col mt-[60px] rounded-[24px] border-[1px] border-[#EAECF0]">
                    <div className="my-[20px] mx-[20px] flex justify-between">
                        <div className="flex items-center gap-[8px]">
                            <p className="text-[#101828] text-[18px] font-medium">Company fleet</p>
                            <span className="flex text-[18px] text-[#6941C6] font-medium items-center justify-center h-[22px] w-[32px] rounded-[16px] bg-[#F9F5FF]">{fleetData.length}</span>
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
                isOpen={isFleetModalOpen}
                onClose={handleCloseFleetModal}
                onSubmit={handleSubmitVehicles}
            />

            <OnboardRiderModal
                isOpen={isRiderModalOpen}
                onClose={handleCloseRiderModal}
                onSuccess={handleRiderSuccess}
            />

            <FleetOnboardSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={handleSuccessModalClose}
            />
        </>
    );
};

export default Fleet;