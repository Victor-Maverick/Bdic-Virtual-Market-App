import React from "react";
import { ChevronDownIcon } from "./../icons";

interface UserProfileProps {
    name: string;
    role: string;
    avatarUrl?: string;
    className?: string;
}

export function UserProfile({
                                name,
                                role,
                                avatarUrl,
                                className,
                            }: UserProfileProps) {
    return (
        <div
            className={`flex items-center gap-3 px-10 py-2.5 border-t-[0.5px] border-t-[#EDEDED] border-solid ${className}`}
        >
            <div className="w-7 h-7 bg-[#F2F2F2] rounded-[50%]">
                {avatarUrl && (
                    <img
                        src={avatarUrl}
                        alt={name}
                        className="w-full h-full rounded-[50%] object-cover"
                    />
                )}
            </div>
            <div className="text-sm font-medium text-[#1E1E1E]">{name}</div>
            <div className="text-[#52A43E] text-[8px] bg-[#D5FFE8] px-1 py-1.5 rounded-[100px]">
                {role}
            </div>
            <ChevronDownIcon className="text-[#707070]" />
        </div>
    );
}
