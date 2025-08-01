'use client'
import Image from "next/image";
import arrowUp from "../../../../../public/assets/images/green arrow up.png";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import DeleteConfirmationModal from "@/components/deleteConfirmationModal";
import searchImg from "../../../../../public/assets/images/search-normal.png";
import arrowDown from "../../../../../public/assets/images/arrow-down.svg";
import axios from "axios";

interface ShopResponse {
    id: number;
    name: string;
    address: string;
    logoUrl: string;
    phone: string;
    shopNumber: string;
    homeAddress: string;
    streetName: string;
    cacNumber: string;
    taxIdNumber: string;
    nin: string;
    bankName: string;
    accountNumber: string;
    market: string;
    marketSection: string;
    firstName: string;
    lastName: string;
    status: string;
    totalPayoutAmount: number;
    promotedStatus: string;
    promotedTierId: number;
    featuredNumber: number;
    promotedNumber: number;
    floatedNumber: number;
}

const VendorActionsDropdown = ({
                                   children,
                                   shopId,
                                   status,
                                   onToggleStatus,
                                   onDelete,
                               }: {
    shopId: number;
    children: React.ReactNode;
    status: string;
    onToggleStatus: (shopId: number) => void;
    onDelete: (shopId: number) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleOpenDeleteModal = () => {
        setIsOpen(false);
        console.log(status)
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleCloseRejectModal = () => {
        setIsRejectModalOpen(false);
    };

    const handleDelete = () => {
        onDelete(shopId);
        setIsDeleteModalOpen(false);
    };

    const handleReject = () => {
        setIsRejectModalOpen(false);
    };

    const handleViewVendor = () => {
        router.push("/admin/dashboard/vendors/view-vendor");
        setIsOpen(false);
    };

    const handleDeactivate = () => {
        onToggleStatus(shopId);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const renderActiveOptions = () => (
        <>
            <li
                onClick={handleViewVendor}
                className="px-[8px] py-[4px] h-[38px] text-[12px] hover:bg-[#f9f9f9] text-[#1E1E1E] cursor-pointer"
            >
                View vendor
            </li>
            <li
                onClick={handleDeactivate}
                className="px-[8px] py-[4px] h-[38px] text-[#8C8C8C] hover:border-b-[0.5px] hover:border-t-[0.5px] hover:border-[#F2F2F2] text-[12px] cursor-pointer"
            >
                Deactivate vendor
            </li>
            <li
                onClick={handleOpenDeleteModal}
                className="px-[8px] rounded-bl-[8px] rounded-br-[8px] py-[4px] h-[38px] text-[12px] hover:bg-[#FFFAF9] hover:border-t-[0.5px] hover:border-[#F2F2F2] cursor-pointer text-[#FF5050]"
            >
                Delete
            </li>
        </>
    );

    return (
        <>
            <div className="relative" ref={dropdownRef}>
                <div
                    ref={triggerRef}
                    onClick={handleToggle}
                    className="cursor-pointer flex flex-col gap-[3px] items-center justify-center"
                >
                    {children}
                </div>

                {isOpen && (
                    <div className="absolute right-0 top-full mt-1 h-[114px] bg-white rounded-[8px] shadow-lg z-50 border border-[#ededed] w-[134px]">
                        <ul className="">{renderActiveOptions()}</ul>
                    </div>
                )}
            </div>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onDelete={handleDelete}
                title="Delete Vendor"
                message="Are you sure you want to delete this vendor? This action cannot be undone."
            />

            <DeleteConfirmationModal
                isOpen={isRejectModalOpen}
                onClose={handleCloseRejectModal}
                onDelete={handleReject}
                title="Reject Vendor"
                message="Are you sure you want to reject this vendor? This action cannot be undone."
                confirmText="Reject"
            />
        </>
    );
};

const VendorTableRow = ({ shop, isLast, onToggleStatus, onDelete }: {
    shop: ShopResponse;
    isLast: boolean;
    onToggleStatus: (shopId: number) => void;
    onDelete: (shopId: number) => void;
}) => {
    const getStatusText = (status: string) => {
        switch (status) {
            case 'VERIFIED':
                return 'Active';
            case 'NOT_VERIFIED':
                return 'Inactive';
            default:
                return 'Deactivated';
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'VERIFIED':
                return 'bg-[#ECFDF3] text-[#027A48]';
            case 'NOT_VERIFIED':
                return 'bg-[#FEF3F2] text-[#FF5050]';
            default:
                return 'bg-[#F2F2F2] text-[#667085]';
        }
    };

    return (
        <div className={`flex h-[72px] ${!isLast ? 'border-b border-[#EAECF0]' : ''}`}>
            <div className="flex items-center w-[40%] pl-[24px]">
                <p className="text-[#101828] text-[14px] font-medium">{`${shop.firstName} ${shop.lastName}`}</p>
            </div>

            <div className="flex flex-col justify-center w-[27%] pl-[24px]">
                <p className="text-[#101828] text-[14px] font-medium">{shop.name}</p>
                <p className="text-[#667085] text-[14px]">{shop.address}</p>
            </div>

            <div className="flex items-center w-[15%] pl-[24px]">
                <p className="text-[#101828] text-[14px]">{shop.id}</p>
            </div>

            <div className="flex items-center w-[15%] px-[10px]">
                <div className={`w-[55px] h-[22px] rounded-[8px] flex items-center justify-center ${getStatusStyles(shop.status)}`}>
                    <p className="text-[12px] font-medium">{getStatusText(shop.status)}</p>
                </div>
            </div>

            <div className="flex items-center justify-center w-[3%]">
                <VendorActionsDropdown shopId={shop.id} status={shop.status} onToggleStatus={onToggleStatus} onDelete={onDelete}>
                    <div className="flex flex-col gap-1">
                        <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                        <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                        <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                    </div>
                </VendorActionsDropdown>
            </div>
        </div>
    );
};

const StatsCard = ({ title, value, percentage, isPending = false, isWarning = false }: { title: string; value: string; percentage: string; isPending: boolean; isWarning?: boolean }) => {
    return (
        <div className={`flex flex-col w-[25%] rounded-[14px] h-full ${isWarning ? 'border-[#FF2121]' : 'border-[#EAEAEA]'} border-[0.5px]`}>
            <div className={`w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] ${isWarning ? 'bg-[#FFE8E8]' : isPending ? 'bg-[#FFB320]' : 'bg-[#F7F7F7]'}`}>
                <p className="text-[#707070] text-[12px]">{title}</p>
            </div>
            <div className="h-[80px] flex justify-center flex-col p-[14px]">
                <p className="text-[20px] text-[#022B23] font-medium">{value}</p>
                <div className="flex items-center">
                    <Image src={arrowUp} width={12} height={12} alt={'image'} className="h-[12px] w-[12px]" />
                    <p className="text-[10px] text-[#707070]"><span className="text-[#52A43E]">{percentage}</span> from yesterday</p>
                </div>
            </div>
        </div>
    );
};

const Vendors = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [vendorStats, setVendorStats] = useState({
        totalVendors: 0,
        activeVendors: 0,
        inactiveVendors: 0,
        dailySignups: 0
    });
    const [shops, setShops] = useState<ShopResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVendorData = async () => {
            try {
                setLoading(true);

                // Fetch shops and stats in parallel
                const [shopsRes, totalVendorsRes, activeShopsRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/shops/all`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/getAllVendorsCount`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/shops/allActiveShopsCount`)
                ]);

                setShops(shopsRes.data);

                const totalVendors = totalVendorsRes.data;
                const activeVendors = activeShopsRes.data;

                setVendorStats({
                    totalVendors: totalVendors,
                    activeVendors: activeVendors,
                    inactiveVendors: totalVendors - activeVendors,
                    dailySignups: Math.floor(totalVendors * 0.05)
                });
            } catch (error) {
                console.error('Error fetching vendor data:', error);
                setVendorStats({
                    totalVendors: 0,
                    activeVendors: 0,
                    inactiveVendors: 0,
                    dailySignups: 0
                });
                setShops([]);
            } finally {
                setLoading(false);
            }
        };

        fetchVendorData();
    }, []);

    const filteredShops = shops.filter(shop =>
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${shop.firstName} ${shop.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleStatus = (shopId: number) => {
        console.log('Toggle status for shop:', shopId);
    };

    const handleDeleteShop = (shopId: number) => {
        console.log('Delete shop:', shopId);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <>
            <div className="text-[#022B23] text-[14px] px-[20px] font-medium gap-[8px] flex items-center h-[49px] w-full border-b-[0.5px] border-[#ededed]">
                <p>Vendor management</p>
            </div>

            <div className="px-[20px] mt-[20px]">
                {loading ? (
                    <div className="flex w-full gap-[20px] h-[110px] justify-between">
                        <div className="flex items-center justify-center w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                            <p className="text-[#707070]">Loading...</p>
                        </div>
                        <div className="flex items-center justify-center w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                            <p className="text-[#707070]">Loading...</p>
                        </div>
                        <div className="flex items-center justify-center w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                            <p className="text-[#707070]">Loading...</p>
                        </div>
                        <div className="flex items-center justify-center w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px]">
                            <p className="text-[#707070]">Loading...</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex w-full gap-[20px] h-[110px] justify-between">
                        <StatsCard title="Total vendors" value={vendorStats.totalVendors.toString()} percentage="+15.6%" isPending={false} />
                        <StatsCard title="Active vendors" value={vendorStats.activeVendors.toString()} percentage="+15.6%" isPending={false} />
                        <StatsCard title="Inactive vendors" value={vendorStats.inactiveVendors.toString()} percentage="+15.6%" isWarning isPending={false} />
                        <StatsCard title="Daily signups" value={vendorStats.dailySignups.toString()} percentage="+15.6%" isPending />
                    </div>
                )}

                <div className="mt-[50px]">
                    <div className="w-full flex flex-col h-auto border-[#EAECF0] border rounded-[24px]">
                        <div className="w-full h-[91px] flex items-center justify-between px-[24px] pt-[20px] pb-[19px]">
                            <div className="flex flex-col gap-[4px]">
                                <div className="h-[28px] flex items-center">
                                    <p className="text-[18px] font-medium text-[#101828]">Vendors ({filteredShops.length})</p>
                                </div>
                                <div className="flex h-[20px] items-center">
                                    <p className="text-[14px] text-[#667085]">View and manage vendors here</p>
                                </div>
                            </div>
                            <div className="flex gap-2 items-center bg-[#FFFFFF] border-[0.5px] border-[#F2F2F2] text-black px-4 py-2 shadow-sm rounded-sm">
                                <Image src={searchImg} alt="Search Icon" width={20} height={20} className="h-[20px] w-[20px]" />
                                <input
                                    placeholder="Search vendors..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="w-[175px] text-[#707070] text-[14px] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="w-full h-[44px] flex bg-[#F9FAFB] border-b-[0.5px] border-[#EAECF0]">
                            <div className="h-full w-[40%] gap-[4px] flex px-[24px] items-center font-medium text-[#667085] text-[12px]">
                                <p>Vendor</p>
                                <Image src={arrowDown} alt={'image'} />
                            </div>
                            <div className="h-full w-[27%] gap-[4px] flex px-[24px] items-center font-medium text-[#667085] text-[12px]">
                                <p>Shop Details</p>
                                <Image src={arrowDown} alt={'image'} />
                            </div>
                            <div className="flex w-[15%] items-center px-[24px] font-medium text-[#667085] text-[12px]">
                                Vendor ID
                            </div>
                            <div className="flex w-[15%] items-center px-[24px] font-medium text-[#667085] text-[12px]">
                                Status
                            </div>
                            <div className="w-[3%]"></div>
                        </div>

                        <div className="flex flex-col">
                            {filteredShops.length === 0 ? (
                                <div className="flex items-center justify-center h-[200px]">
                                    <p className="text-[#667085]">No vendors found</p>
                                </div>
                            ) : (
                                filteredShops.map((shop, index) => (
                                    <VendorTableRow
                                        key={shop.id}
                                        shop={shop}
                                        isLast={index === filteredShops.length - 1}
                                        onToggleStatus={handleToggleStatus}
                                        onDelete={handleDeleteShop}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Vendors;