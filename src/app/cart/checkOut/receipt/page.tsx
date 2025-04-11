'use client';
import { useState } from "react";
import Image from "next/image";
import limeArrow from "../../../../../public/assets/images/green arrow.png";

const Receipt = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex flex-col items-center">
            {/* Make Payment Button */}
            <div
                onClick={() => setIsModalOpen(true)}
                className="cursor-pointer flex h-[54px] rounded-[12px] mb-[20px] gap-[9px] justify-center items-center bg-[#022B23] w-[300px]"
            >
                <p className="text-[#C6EB5F] font-semibold text-[14px]">Make payment</p>
                <Image src={limeArrow} alt="arrow" width={18} height={18} />
            </div>

            {/* Success Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full text-center">
                        <h2 className="text-lg font-semibold text-green-600">Payment Successful!</h2>
                        <p className="text-gray-600 text-sm mt-2">Your payment has been processed successfully.</p>

                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Receipt;
