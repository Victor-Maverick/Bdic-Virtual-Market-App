// components/FloatedProductOverlay.tsx
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    salesPrice: number;
    quantity: number;
    mainImageUrl: string;
    sideImage1Url: string;
    sideImage2Url: string;
    sideImage3Url: string;
    sideImage4Url: string;
    vendorEmail: string;
    shopId: number;
    shopName: string;
    shopNumber: string;
    marketSection: string;
    market: string;
    vendorName: string;
    city: string;
    shopAddress: string;
    category: string;
    subCategory: string;
}

const FloatedProductOverlay = ({
                                   product,
                                   onClose,
                                   duration = 20000,
                                   currentIndex,
                                   totalCount
                               }: {
    product: Product,
    onClose: () => void,
    duration?: number,
    currentIndex: number,
    totalCount: number
}) => {
    const [startX, setStartX] = useState<number | null>(null);
    const [offsetX, setOffsetX] = useState(0);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [remainingTime, setRemainingTime] = useState(duration / 1000);

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        // Countdown timer for UI
        const countdown = setInterval(() => {
            setRemainingTime(prev => Math.max(0, prev - 1));
        }, 1000);

        return () => {
            clearTimeout(timer);
            clearInterval(countdown);
        };
    }, [onClose, duration]);

    // Handle touch events for swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        setStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (startX === null) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        setOffsetX(diff);
    };

    const handleTouchEnd = () => {
        if (startX === null) return;

        // If swiped more than 50px, consider it a dismiss
        if (Math.abs(offsetX) > 50) {
            onClose();
        }
        setStartX(null);
        setOffsetX(0);
    };

    const position = Math.random() > 0.5 ? 'top' : 'bottom';
    const transform = offsetX !== 0 ? `translateX(${offsetX}px)` : '';

    return (
        <div
            className={`fixed ${position}-0 left-0 right-0 z-50 flex justify-center p-4 animate-float-in`}
            ref={overlayRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ transform }}
        >
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full border border-gray-200">
                {/* Counter indicator */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#022B23] text-white text-xs px-2 py-1 rounded-full">
                    {currentIndex + 1}/{totalCount}
                </div>

                <button
                    onClick={onClose}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center z-10"
                >
                    ×
                </button>

                {/* Progress bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
                    <div
                        className="h-full bg-[#C6EB5F]"
                        style={{ width: `${(remainingTime / (duration / 1000)) * 100}%` }}
                    />
                </div>

                <div className="p-4 pt-6">
                    <div className="flex gap-4">
                        <div className="w-1/3">
                            <Image
                                src={product.mainImageUrl || "/placeholder.svg"}
                                alt={product.name}
                                width={200}
                                height={200}
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                        <div className="w-2/3">
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <p className="text-gray-600 line-clamp-2">{product.description}</p>
                            <div className="mt-2">
                                <span className="text-lg font-bold">₦{product.price}</span>
                                {product.salesPrice && (
                                    <span className="ml-2 text-sm text-gray-500 line-through">₦{product.salesPrice}</span>
                                )}
                            </div>
                            <button className="mt-4 bg-[#022B23] text-white px-4 py-2 rounded text-sm">
                                View Product
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FloatedProductOverlay;