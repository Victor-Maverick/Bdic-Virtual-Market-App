'use client'
import Image from "next/image";
import arrowUp from "../../../../../public/assets/images/green arrow up.png";
import arrowDown from "../../../../../public/assets/images/arrow-down.svg";
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import searchImg from "../../../../../public/assets/images/search-normal.png";

type User = {
    id: number;
    name: string;
    lga: string;
    status: string;
    state: string;
    deliveryAddress: string;
    customerId: string;

};

const users = [
    { id: 1,  name: "Jude Peter", lga: "Makurdi", status: "Active", state: "Benue state",  customerId: "1234",  deliveryAddress: "NO 22. Railway estate, Logo 1,Makurdi" },
    { id: 2,name: "Tersoo Jude",lga: "Makurdi", status: "Inactive", state: "Benue state", customerId: "1234", deliveryAddress: "NO 22. Railway estate, Logo 1,Makurdi"},
    { id: 3, name: "Oche Adoh", lga: "Gboko", status: "Inactive", state: "Benue state",  customerId: "1234",  deliveryAddress: "NO 22. Railway estate, Logo 1,Makurdi" },
    { id: 4,  name: "Tersoo Jude", lga: "Makurdi", status: "Active", state: "Benue state",  customerId: "1234",  deliveryAddress: "NO 22. Railway estate, Logo 1,Makurdi" },
    { id: 5,  name: "Tersoo Jude", lga: "Makurdi", status: "Active", state: "Benue state",  customerId: "1234", deliveryAddress: "NO 22. Railway estate, Logo 1,Makurdi"},
    { id: 6, name: "Tersoo Jude", lga: "Makurdi", status: "Active", state: "Benue state",  customerId: "1234",  deliveryAddress: "NO 22. Railway estate, Logo 1,Makurdi"},
    { id: 7,  name: "Tersoo Jude", lga: "Makurdi", status: "Active", state: "Benue state", customerId: "1234", deliveryAddress: "NO 22. Railway estate, Logo 1,Makurdi"},
    { id: 8,  name: "Tersoo Jude", lga: "Makurdi", status: "Active", state: "Benue state",  customerId: "1234", deliveryAddress: "NO 22. Railway estate, Logo 1,Makurdi"},
    { id: 9,  name: "Tersoo Jude", lga: "Makurdi", status: "Active", state: "Benue state", customerId: "1234",  deliveryAddress: "NO 22. Railway estate, Logo 1,Makurdi"},
    { id: 10,  name: "Tersoo Jude", lga: "Makurdi", status: "Active", state: "Benue state", customerId: "1234",  deliveryAddress: "NO 22. Railway estate, Logo 1,Makurdi"},
];

const UserActionsDropdown = ({

                                    children
                                }: {
    productId: number;
    children: React.ReactNode;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

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
                    <div className="absolute right-0 top-full mt-1 bg-white rounded-md shadow-lg z-50 border border-[#ededed] w-[125px]">
                        <ul className="py-1">
                            <li onClick={()=>{router.push("/admin/dashboard/users/view-user")}} className="px-4 py-2 text-[12px] hover:bg-[#ECFDF6] cursor-pointer">View details</li>
                        </ul>
                    </div>
                )}
            </div>

        </>
    );
};

const UserTableRow = ({
                             user,
                             isLast
                         }: {
    user: User;
    isLast: boolean
}) => {
    return (
        <>
            <div className={`flex h-[72px] ${!isLast ? 'border-b border-[#EAECF0]' : ''}`}>
                <div className="flex items-center w-[30%] pl-[24px] ">
                    <p className="text-[14px] text-[#101828 font-medium">{user.name}</p>
                </div>

                <div className="flex flex-col justify-center w-[20%] px-[15px]">
                    <p className="text-[14px] text-[#101828]">{user.lga}</p>
                    <p className="text-[12px]  text-[#667085]">{user.state}</p>
                </div>


                <div className="flex flex-col justify-center w-[25%] px-[15px]">
                    <p className="text-[14px] text-[#101828]">{user.lga}</p>
                    <p className="text-[12px]  text-[#667085]">{user.deliveryAddress}</p>
                </div>

                <div className="flex items-center w-[12%] justify-center">
                    <p className="text-[14px] font-medium text-[#101828]">
                        {user.customerId}
                    </p>
                </div>

                <div className="flex items-center w-[10%] px-[24px]">
                    <div className={`w-[55px] h-[22px] rounded-[8px] flex items-center justify-center ${
                        user.status === 'Active'
                            ? 'bg-[#ECFDF3] text-[#027A48]'
                            : 'bg-[#FEF3F2] text-[#FF5050]'
                    }`}>
                        <p className="text-[12px] font-medium">{user.status}</p>
                    </div>
                </div>


                <div className="flex items-center justify-center w-[3%]">
                    <UserActionsDropdown productId={user.id}>
                        <>
                            <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                            <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                            <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                        </>
                    </UserActionsDropdown>
                </div>
            </div>

        </>
    );
};




const Users = ()=>{
    return(
        <>
            <div className="text-[#022B23] text-[14px] px-[20px] font-medium gap-[8px] flex items-center h-[49px] w-full border-b-[0.5px] border-[#ededed]">
                <p>User management</p>
            </div>
            <div className="p-[20px]">
                <div className="flex w-full  gap-[20px] h-[110px] justify-between">
                    <div className="flex flex-col  w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px] ">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#F7F7F7]">
                            <p className="text-[#707070] text-[12px]">Total users</p>
                        </div>
                        <div className="h-[80px] flex justify-center flex-col p-[14px]">
                            <p className="text-[20px] text-[#022B23] font-medium">36,201</p>
                            <div className="flex items-center">
                                <Image src={arrowUp} width={12} height={12} alt={'image'} className="h-[12px] w-[12px]" />
                                <p className="text-[10px] text-[#707070]"><span className="text-[#52A43E]">+1.41</span> from yesterday</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col  w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px] ">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#F7F7F7]">
                            <p className="text-[#707070] text-[12px]">Active users</p>
                        </div>
                        <div className="h-[80px] flex justify-center flex-col p-[14px]">
                            <p className="text-[20px] text-[#022B23] font-medium">26,434</p>
                            <div className="flex items-center">
                                <Image src={arrowUp} width={12} height={12} alt={'image'} className="h-[12px] w-[12px]" />
                                <p className="text-[10px] text-[#707070]"><span className="text-[#52A43E]">+1.41</span> from yesterday</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col  w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px] ">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#022B23]">
                            <p className="text-[#C6EB5F] font-medium text-[12px]">Daily sign up</p>
                        </div>
                        <div className="h-[80px] flex justify-center flex-col p-[14px]">
                            <p className="text-[20px] text-[#022B23] font-medium">10,482</p>
                            <div className="flex items-center">
                                <Image src={arrowUp} width={12} height={12} alt={'image'} className="h-[12px] w-[12px]" />
                                <p className="text-[10px] text-[#707070]"><span className="text-[#52A43E]">+1.41</span> from yesterday</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col  w-[25%] rounded-[14px] h-full border-[#FF2121] border-[0.5px] ">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#FFE8E8]">
                            <p className="text-[#FF5050] font-medium text-[12px]">Inactive users</p>
                        </div>
                        <div className="h-[80px] flex justify-center flex-col p-[14px]">
                            <p className="text-[20px] text-[#022B23] font-medium">20</p>
                            <div className="flex items-center">
                                <Image src={arrowUp} width={12} height={12} alt={'image'} className="h-[12px] w-[12px]" />
                                <p className="text-[10px] text-[#707070]"><span className="text-[#52A43E]">+1.41</span> from yesterday</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col mt-[50px] rounded-[24px] border-[1px] border-[#EAECF0]">
                    <div className="flex items-center justify-between pr-[20px]">
                        <div className="my-[20px] mx-[25px] flex flex-col">
                            <p className="text-[#101828] font-medium">Users (32,601)</p>
                            <p className="text-[#667085] text-[14px]">View and manage users here</p>
                        </div>

                        <div className="flex gap-2 items-center bg-[#FFFFFF] border-[0.5px] border-[#F2F2F2] text-black px-4 py-2 shadow-sm rounded-sm">
                            <Image src={searchImg} alt="Search Icon" width={20} height={20} className="h-[20px] w-[20px]"/>
                            <input placeholder="Search" className="w-[175px] text-[#707070] text-[14px] focus:outline-none"/>
                        </div>
                    </div>


                    <div className="flex h-[44px] bg-[#F9FAFB] border-b-[1px] border-[#EAECF0]">
                        <div className="flex items-center px-[24px] w-[30%] py-[12px] gap-[4px]">
                            <p className="text-[#667085] font-medium text-[12px]">Partner name</p>
                            <Image src={arrowDown} alt="Sort" width={12} height={12} />
                        </div>
                        <div className="flex items-center px-[24px] w-[20%] py-[12px] gap-[4px]">
                            <p className="text-[#667085] font-medium text-[12px]">Location</p>
                            <Image src={arrowDown} alt="Sort" width={12} height={12} />
                        </div>
                        <div className="flex items-center px-[24px] w-[25%] py-[12px] gap-[4px]">
                            <p className="text-[#667085] font-medium text-[12px]">Address</p>
                            <Image src={arrowDown} alt="Sort" width={12} height={12} />
                        </div>

                        <div className="flex items-center justify-center  w-[12%] ">
                            <p className="text-[#667085] font-medium text-[12px]">Customer ID</p>
                        </div>

                        <div className="flex items-center px-[24px] w-[10%] py-[12px]">
                            <p className="text-[#667085] font-medium text-[12px]">Status</p>
                        </div>

                        <div className="flex items-center w-[3%] py-[12px]"></div>
                    </div>

                    <div className="flex flex-col">
                        {users.map((product, index) => (
                            <UserTableRow
                                key={product.id}
                                user={product}
                                isLast={index === users.length - 1}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Users;