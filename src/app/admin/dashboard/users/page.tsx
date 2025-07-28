'use client'
import Image from "next/image";
import arrowUp from "../../../../../public/assets/images/green arrow up.png";
import arrowDown from "../../../../../public/assets/images/arrow-down.svg";
import {useEffect, useRef, useState} from "react";
import searchImg from "../../../../../public/assets/images/search-normal.png";
import BackButton from "@/components/BackButton";

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    roles: string[];
    createdAt: string;
    isActive: boolean;
    isVerified: boolean;
}

// const UserActionsDropdown = ({
//     children
// }: {
//     children: React.ReactNode;
// }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const dropdownRef = useRef<HTMLDivElement>(null);
//     const triggerRef = useRef<HTMLDivElement>(null);
//
//     const handleToggle = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         setIsOpen(!isOpen);
//     };
//     const router = useRouter();
//
//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//                 setIsOpen(false);
//             }
//         };
//
//         document.addEventListener('click', handleClickOutside);
//         return () => document.removeEventListener('click', handleClickOutside);
//     }, []);
//
//     return (
//         <>
//             <div className="relative" ref={dropdownRef}>
//                 <div
//                     ref={triggerRef}
//                     onClick={handleToggle}
//                     className="cursor-pointer flex flex-col gap-[3px] items-center justify-center"
//                 >
//                     {children}
//                 </div>
//
//                 {isOpen && (
//                     <div className="absolute right-0 top-full mt-1 bg-white rounded-md shadow-lg z-50 border border-[#ededed] w-[125px]">
//                         <ul className="py-1">
//                             <li onClick={()=>{router.push("/admin/dashboard/users/view-user")}} className="px-4 py-2 text-[12px] hover:bg-[#ECFDF6] cursor-pointer">View details</li>
//                         </ul>
//                     </div>
//                 )}
//             </div>
//         </>
//     );
// };

const UserTableRow = ({
    user,
    isLast
}: {
    user: User;
    isLast: boolean;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
            <div className={`flex h-[72px] ${!isLast ? 'border-b border-[#EAECF0]' : ''}`}>
                <div className="flex items-center w-[25%] pl-[24px]">
                    <div className="flex flex-col">
                        <p className="text-[14px] text-[#101828] font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-[12px] text-[#667085]">{user.email}</p>
                    </div>
                </div>

                <div className="flex flex-col justify-center w-[20%] px-[15px]">
                    <p className="text-[14px] text-[#101828]">{user.phoneNumber || 'N/A'}</p>
                    <p className="text-[12px] text-[#667085]">Phone</p>
                </div>

                <div className="flex flex-col justify-center w-[20%] px-[15px]">
                    <p className="text-[14px] text-[#101828]">{user.roles.join(', ')}</p>
                    <p className="text-[12px] text-[#667085]">Roles</p>
                </div>

                <div className="flex items-center w-[15%] justify-center">
                    <p className="text-[14px] font-medium text-[#101828]">
                        {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <div className="flex items-center w-[10%] px-[24px]">
                    <div className={`px-2 py-1 rounded-[8px] flex items-center justify-center ${
                        user.isActive && user.isVerified
                            ? 'bg-[#ECFDF3] text-[#027A48]'
                            : !user.isActive
                            ? 'bg-[#FEF3F2] text-[#FF5050]'
                            : 'bg-[#FFF4ED] text-[#F79009]'
                    }`}>
                        <p className="text-[12px] font-medium">
                            {user.isActive && user.isVerified ? 'Active' : !user.isActive ? 'Suspended' : 'Pending'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-center w-[10%] relative" ref={dropdownRef}>
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className="cursor-pointer flex flex-col gap-[3px] items-center justify-center p-2"
                    >
                        <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                        <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                        <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                    </div>

                    {isOpen && (
                        <div className="absolute right-0 top-full mt-1 bg-white rounded-md shadow-lg z-50 border border-[#ededed] w-[150px]">
                            <ul className="py-1">
                                <li 
                                    onClick={() => {
                                        setIsOpen(false);
                                        // Navigate to user details
                                    }}
                                    className="px-4 py-2 text-[12px] hover:bg-[#ECFDF6] cursor-pointer"
                                >
                                    View details
                                </li>
                                {!user.isVerified && (
                                    <li 
                                        onClick={() => {
                                            setIsOpen(false);
                                            // Handle verify user
                                        }}
                                        className="px-4 py-2 text-[12px] hover:bg-[#ECFDF6] cursor-pointer text-green-600"
                                    >
                                        Verify user
                                    </li>
                                )}
                                <li 
                                    onClick={() => {
                                        setIsOpen(false);
                                        // Handle toggle suspension
                                    }}
                                    className="px-4 py-2 text-[12px] hover:bg-[#ECFDF6] cursor-pointer"
                                >
                                    {user.isActive ? 'Suspend' : 'Activate'}
                                </li>
                                <li 
                                    onClick={() => {
                                        setIsOpen(false);
                                        // Handle delete user
                                    }}
                                    className="px-4 py-2 text-[12px] hover:bg-[#FEF3F2] cursor-pointer text-red-600"
                                >
                                    Delete user
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

const Users = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data
    const mockUsers: User[] = [
        {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phoneNumber: "+1234567890",
            roles: ["BUYER"],
            createdAt: "2024-01-15T10:30:00Z",
            isActive: true,
            isVerified: true
        },
        {
            id: 2,
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com",
            phoneNumber: "+1234567891",
            roles: ["VENDOR"],
            createdAt: "2024-01-20T14:20:00Z",
            isActive: true,
            isVerified: false
        },
        {
            id: 3,
            firstName: "Mike",
            lastName: "Johnson",
            email: "mike.johnson@example.com",
            phoneNumber: "+1234567892",
            roles: ["BUYER"],
            createdAt: "2024-02-01T09:15:00Z",
            isActive: false,
            isVerified: true
        }
    ];

    const mockStats = {
        totalUsers: 1247,
        activeUsers: 1122,
        dailySignups: 23,
        inactiveUsers: 125
    };

    const filteredUsers = mockUsers.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return(
        <>
            <div className="text-[#022B23] text-[14px] px-[20px] font-medium gap-[8px] flex items-center h-[49px] w-full border-b-[0.5px] border-[#ededed]">
                <BackButton variant="minimal" />
                <p>User management</p>
            </div>
            <div className="p-[20px]">
                <div className="flex w-full  gap-[20px] h-[110px] justify-between">
                    <div className="flex flex-col  w-[25%] rounded-[14px] h-full border-[#EAEAEA] border-[0.5px] ">
                        <div className="w-full px-[14px] flex items-center rounded-tl-[14px] rounded-tr-[14px] h-[30px] bg-[#F7F7F7]">
                            <p className="text-[#707070] text-[12px]">Total users</p>
                        </div>
                        <div className="h-[80px] flex justify-center flex-col p-[14px]">
                            <p className="text-[20px] text-[#022B23] font-medium">{mockStats.totalUsers.toLocaleString()}</p>
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
                            <p className="text-[20px] text-[#022B23] font-medium">{mockStats.activeUsers.toLocaleString()}</p>
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
                            <p className="text-[20px] text-[#022B23] font-medium">{mockStats.dailySignups.toLocaleString()}</p>
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
                            <p className="text-[20px] text-[#022B23] font-medium">{mockStats.inactiveUsers.toLocaleString()}</p>
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
                            <p className="text-[#101828] font-medium">Users ({filteredUsers.length})</p>
                            <p className="text-[#667085] text-[14px]">View and manage users here</p>
                        </div>

                        <div className="flex gap-2 items-center bg-[#FFFFFF] border-[0.5px] border-[#F2F2F2] text-black px-4 py-2 shadow-sm rounded-sm">
                            <Image src={searchImg} alt="Search Icon" width={20} height={20} className="h-[20px] w-[20px]"/>
                            <input 
                                placeholder="Search users..." 
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-[175px] text-[#707070] text-[14px] focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex h-[44px] bg-[#F9FAFB] border-b-[1px] border-[#EAECF0]">
                        <div className="flex items-center px-[24px] w-[25%] py-[12px] gap-[4px]">
                            <p className="text-[#667085] font-medium text-[12px]">User</p>
                            <Image src={arrowDown} alt="Sort" width={12} height={12} />
                        </div>
                        <div className="flex items-center px-[24px] w-[20%] py-[12px] gap-[4px]">
                            <p className="text-[#667085] font-medium text-[12px]">Phone</p>
                            <Image src={arrowDown} alt="Sort" width={12} height={12} />
                        </div>
                        <div className="flex items-center px-[24px] w-[20%] py-[12px] gap-[4px]">
                            <p className="text-[#667085] font-medium text-[12px]">Roles</p>
                            <Image src={arrowDown} alt="Sort" width={12} height={12} />
                        </div>

                        <div className="flex items-center justify-center w-[15%]">
                            <p className="text-[#667085] font-medium text-[12px]">Joined</p>
                        </div>

                        <div className="flex items-center px-[24px] w-[10%] py-[12px]">
                            <p className="text-[#667085] font-medium text-[12px]">Status</p>
                        </div>

                        <div className="flex items-center w-[10%] py-[12px]"></div>
                    </div>

                    <div className="flex flex-col">
                        {filteredUsers.length === 0 ? (
                            <div className="flex items-center justify-center h-[200px]">
                                <p className="text-[#667085]">No users found</p>
                            </div>
                        ) : (
                            filteredUsers.map((user, index) => (
                                <UserTableRow
                                    key={user.id}
                                    user={user}
                                    isLast={index === filteredUsers.length - 1}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Users;