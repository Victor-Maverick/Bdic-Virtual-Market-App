'use client'
import MarketPlaceHeader from "@/components/marketPlaceHeader";
import Image from "next/image";
import marketIcon from "../../../../public/assets/images/market element.png";
import React, {useState, useEffect, useCallback} from "react";
import searchImg from "../../../../public/assets/images/search-normal.png";
import arrowRight from '@/../public/assets/images/greyforwardarrow.svg'
import trashImg from "../../../../public/assets/images/trash.png";
import {useRouter} from "next/navigation";
import BackButton from "@/components/BackButton";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

const SearchBar = () => (
    <div className="flex gap-2 items-center bg-[#F9F9F9] border-[0.5px] border-[#ededed] h-[52px] px-[10px] rounded-[8px]">
        <Image src={searchImg} alt="Search Icon" width={20} height={20} className="h-[20px] w-[20px]"/>
        <input placeholder="Search for items here" className="w-[413px] text-[#707070] text-[14px] focus:outline-none"/>
    </div>
);

interface WishlistItem {
    id: number;
    name: string;
    productId: number;
    description: string;
    productImage: string;
    unitPrice: string;
    quantity: number;
}

const Wishlist = () => {
    const [selectedMarket, setSelectedMarket] = useState("Wurukum");
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { data: session } = useSession();
    const { addToCart } = useCart();

    const fetchWishlist = useCallback(async () => {
        if (session?.user?.email) {
            try {
                setLoading(true);
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/get-wishlist?buyerEmail=${session.user.email}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setWishlistItems(data?.wishList || []);
            } catch (error) {
                console.error("Error fetching wishlist:", error);
                setError("Failed to load wishlist. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
    }, [session]);

    useEffect(() => {
        if (session) {
            fetchWishlist();
        }
    }, [session, fetchWishlist]);

    const handleAddToCart = async (product: WishlistItem) => {
        try {
            await addToCart({
                productId: product.productId,
                name: product.name,
                price: parseFloat(product.unitPrice),
                imageUrl: product.productImage,
                description: product.description
            });

            toast.success(`${product.name} added to cart!`, {
                position: "bottom-right",
                duration: 3000,
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Failed to add item to cart", {
                position: "bottom-right",
                duration: 3000,
            });
        }
    };

    const handleRemoveFromWishlist = async (productId: number) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/remove-from-wishlist`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        buyerEmail: session?.user?.email,
                        productId: productId
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await fetchWishlist();
            toast.success("Item removed from wishlist", {
                position: "bottom-right",
                duration: 3000,
            });
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            toast.error("Failed to remove item from wishlist", {
                position: "bottom-right",
                duration: 3000,
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Loading your wishlist...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <>
            <MarketPlaceHeader />
            <div className="h-[114px] w-full border-b-[0.5px] border-[#EDEDED]">
                <div className="h-[66px] w-full flex justify-between items-center px-25 border-t-[0.5px] border-[#ededed]">
                    <div className="flex gap-[20px]">
                        <SearchBar/>
                    </div>

                    <div className="flex ml-[10px] gap-[2px] p-[2px] h-[52px] items-center justify-between border border-[#ededed] rounded-[4px]">
                        <div className="bg-[#F9F9F9] text-black px-[8px] rounded-[4px] flex items-center justify-center h-[48px]">
                            <select className="bg-[#F9F9F9] text-[#1E1E1E] text-[14px] rounded-sm text-center w-full focus:outline-none">
                                <option>Benue State</option>
                                <option>Enugu State</option>
                                <option>Lagos State</option>
                            </select>
                        </div>

                        <div className="relative">
                            <div className="flex items-center bg-[#F9F9F9] px-[8px] h-[48px] rounded-[4px]">
                                <Image src={marketIcon} alt="Market Icon" width={20} height={20} />
                                <select
                                    className="bg-[#F9F9F9] text-[#1E1E1E] text-[14px] items-center pr-1 focus:outline-none"
                                    onChange={(e) => setSelectedMarket(e.target.value)}
                                    value={selectedMarket}
                                >
                                    <option>Wurukum market</option>
                                    <option>Gboko Market</option>
                                    <option>Otukpo Market</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-[48px] px-25 gap-[8px] items-center flex">
                    <BackButton variant="default" text="Go back" />
                    <p className="text-[14px] text-[#3F3E3E]">Home // <span className="font-medium text-[#022B23]">Wishlist</span></p>
                </div>
            </div>
            <div className="px-25 pt-[62px] h-auto w-full">
                <div className="flex gap-[30px]">
                    <div className="flex flex-col">
                        <div className="w-[381px] text-[#022B23] text-[12px] font-medium h-[44px] bg-[#f8f8f8] rounded-[10px] flex items-center px-[8px] justify-between">
                            <p>Go to profile</p>
                            <Image src={arrowRight} alt={'arrow right'}/>
                        </div>
                        <div className="flex flex-col h-auto w-[381px] mt-[6px] rounded-[12px] border border-[#eeeeee]">
                            <div className="w-full text-[#022B23] text-[12px] font-medium h-[40px] bg-[#f8f8f8] rounded-t-[12px] flex items-center px-[8px]">
                                <p>Wishlist</p>
                            </div>
                            <div onClick={() => {router.push("/buyer/orders")}} className="w-full text-[#022B23] text-[12px] h-[40px] rounded-b-[12px] flex items-center px-[8px]">
                                <p>My orders</p>
                            </div>
                            <div onClick={() => {router.push("/buyer/disputes")}} className="w-full text-[#022B23] text-[12px] h-[40px] rounded-b-[12px] flex items-center px-[8px]">
                                <p>Order disputes</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-[779px] gap-[24px]">
                        <p className="text-[#000000] text-[16px] font-medium">Wishlist</p>
                        <p className="text-[#000000] text-[14px] font-medium">
                            My wishlist ({wishlistItems.length})
                        </p>
                        <div className={`border-[0.5px] border-[#ededed] rounded-[12px] mb-[50px] ${wishlistItems.length > 0 ? "h-auto" : "h-[200px] flex justify-center items-center"}`}>
                            {wishlistItems.length > 0 ? (
                                wishlistItems.map((product, index) => {
                                    const isLastItem = index === wishlistItems.length - 1;
                                    return (
                                        <div key={index} className={`flex items-center ${!isLastItem ? "border-b h-[151px] overflow-hidden border-[#ededed]" : "h-[151px] border-none"}`}>
                                            <div className="flex border-r border-[#ededed] w-[169px] h-[151px] overflow-hidden">
                                                <Image
                                                    src={product.productImage}
                                                    alt="product"
                                                    width={133}
                                                    height={100}
                                                    className="w-full h-full overflow-hidden object-cover"
                                                />
                                            </div>

                                            <div className="flex items-center w-full px-[20px] justify-between">
                                                <div className="flex flex-col w-[30%]">
                                                    <div className="mb-[13px]">
                                                        <p className="text-[14px] text-[#1E1E1E] font-medium mb-[4px]">{product.name}</p>
                                                        <p className="text-[10px] font-normal text-[#3D3D3D] uppercase">{product.description}</p>
                                                    </div>
                                                    <p className="font-medium text-[#1E1E1E] text-[16px]">₦ {product.unitPrice}.00</p>
                                                </div>

                                                <div className="flex gap-[30px] items-center">
                                                    <div
                                                        className="flex text-[14px] text-[#707070] gap-[4px] items-center w-[77px] h-[20px] cursor-pointer"
                                                        onClick={() => handleRemoveFromWishlist(product.productId)}
                                                    >
                                                        <Image src={trashImg} alt={'trash'} className="w-[20px] h-[20px]"/>
                                                        <p>Remove</p>
                                                    </div>
                                                    <div
                                                        className="w-[105px] h-[48px] rounded-[12px] bg-[#022B23] flex items-center justify-center text-[#C6EB5F] text-[14px] font-semibold cursor-pointer"
                                                        onClick={() => handleAddToCart(product)}
                                                    >
                                                        <p>Add to cart</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p>Your wishlist is empty</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Wishlist;