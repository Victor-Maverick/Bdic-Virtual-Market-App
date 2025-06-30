"use client"
import React, { useCallback, useEffect, useState, useRef } from "react"
import BannerSection from "@/components/bannerSection"
import Image, { type StaticImageData } from "next/image"
import MarketProductCard from "@/components/marketProductCard"
import marketIcon from "@/../public/assets/images/market element.png"
import searchImg from "@/../public/assets/images/search-normal.png"

import axios from "axios"
import Footer from "@/components/footer"
import MarketPlaceHeader from "@/components/marketPlaceHeader"
import categoryImg from "@/../public/assets/images/categoryImg.svg"
import filterImg from "@/../public/assets/images/filter.svg"
import { useRouter } from "next/navigation"
import store1 from "@/../public/assets/images/store1.png"
import store2 from "@/../public/assets/images/store2.png"
import { fetchMarkets } from "@/utils/api"
import { ChevronDown, Menu, X } from "lucide-react"

type Market = {
    id: number
    name: string
}

type CategoryResponse = {
    id: number
    name: string
}

type SubCategoryResponse = {
    id: number
    name: string
}

interface Product {
    id: number
    name: string
    description: string
    price: number
    quantity: number
    mainImageUrl: string
    sideImage1Url: string
    sideImage2Url: string
    sideImage3Url: string
    sideImage4Url: string
    shopId: number
    shopName: string
    categoryId: number
    categoryName: string
}

const ProductCard = ({
                         image,
                         price,
                         name,
                         id,
                         isApiProduct = false,
                     }: {
    image: string | StaticImageData
    price: number | string
    name: string
    id: number
    isApiProduct?: boolean
}) => {
    const router = useRouter()
    const handleOpen = () => {
        router.push(`/marketPlace/productDetails/${id}`)
    }

    return (
        <div
            onClick={handleOpen}
            className="hover:shadow-lg cursor-pointer w-full rounded-[14px] bg-[#FFFFFF] border border-[#ededed]"
        >
            {isApiProduct ? (
                <Image
                    src={image || "/placeholder.svg"}
                    alt={name}
                    width={200}
                    height={200}
                    className="w-full h-[150px] sm:h-[180px] lg:h-[200px] object-cover rounded-t-[14px]"
                />
            ) : (
                <Image
                    src={image || "/placeholder.svg"}
                    alt={"image"}
                    className="w-full h-[150px] sm:h-[180px] lg:h-[200px] object-cover rounded-t-[14px]"
                />
            )}
            <div className="mt-2 sm:mt-4 px-2 sm:px-4 flex-col gap-[2px]">
                <p className="font-normal text-[#1E1E1E] text-sm sm:text-base truncate">{name}</p>
                <p className="font-semibold text-[16px] sm:text-[20px] text-[#1E1E1E] mb-2 sm:mb-4 mt-1">₦{price}.00</p>
            </div>
        </div>
    )
}

const ProductGrid = ({ apiProducts = [] }: { apiProducts?: Product[] }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-full gap-2 sm:gap-x-3 gap-y-[10px] px-4 sm:px-6 lg:px-25 py-[10px]">
        {apiProducts.map((product: Product) => (
            <ProductCard
                key={`api-${product.id}`}
                name={product.name}
                image={product.mainImageUrl}
                price={product.price}
                id={product.id}
                isApiProduct={true}
            />
        ))}
    </div>
)

const FlashSale = ({
                       countdown,
                       apiProducts,
                   }: {
    countdown: number
    apiProducts: Product[]
}) => {
    const formatTime = (timeInSeconds: number) => {
        const hours = Math.floor(timeInSeconds / 3600)
        const minutes = Math.floor((timeInSeconds % 3600) / 60)
        const seconds = timeInSeconds % 60
        return `${hours}Hr : ${minutes.toString().padStart(2, "0")}M : ${seconds.toString().padStart(2, "0")}Sec`
    }

    // Filter products with quantity less than 5
    const lowQuantityProducts = apiProducts.filter(product => product.quantity < 5)

    return (
        <div className="flex-col rounded-3xl">
            <div className="bg-[#C6EB5F] h-[60px] sm:h-[80px] flex justify-between px-2 sm:px-4 pt-2">
                <div>
                    <div className="flex gap-[4px] items-center">
                        <p className="font-normal text-[18px] sm:text-[22px]">Flash sale</p>
                        <div className="bg-white items-center justify-center text-black w-[40px] sm:w-[50px] h-[20px] sm:h-[26px] rounded-full text-center">
                            <p className="font-bold text-xs sm:text-sm">{lowQuantityProducts.length}+</p>
                        </div>
                    </div>
                    <p className="font-lighter text-[10px] sm:text-[12px] hidden sm:block">
                        Limited stock items - hurry before they&#39re gone!
                    </p>
                </div>
                <div className="flex justify-between items-center gap-4 sm:gap-[70px]">
                    <div className="flex-col font-semibold text-xs sm:text-sm">
                        <p>Time Left:</p>
                        <p className="text-[10px] sm:text-sm">{formatTime(countdown)}</p>
                    </div>
                    <button className="bg-white text-[#022B23] w-[70px] sm:w-[91px] h-[35px] sm:h-[47px] rounded-[2px] text-xs sm:text-sm">
                        View all
                    </button>
                </div>
            </div>
            <div className="bg-[#FFFAEB] p-[6px] sm:p-[10px] rounded-b-3xl">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[4px] sm:gap-[6px]">
                    {lowQuantityProducts.slice(0, 10).map((product) => (
                        <MarketProductCard
                            id={product.id}
                            height={280}
                            key={product.id}
                            name={product.name}
                            image={product.mainImageUrl}
                            price={product.price.toString()}
                            imageHeight={160}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

const StoreSection = () => {
    const router = useRouter()
    const stores = React.useMemo(
        () => [
            { id: 1, image: store1 },
            { id: 2, image: store2 },
            { id: 3, image: store1 },
            { id: 4, image: store2 },
            { id: 5, image: store1 },
            { id: 6, image: store2 },
            { id: 7, image: store1 },
            { id: 8, image: store2 },
            { id: 9, image: store1 },
            { id: 10, image: store2 },
        ],
        [],
    )

    const PictureCard = ({ image }: { image: StaticImageData }) => {
        return (
            <div
                onClick={() => {
                    router.push("/marketPlace/store")
                }}
                className="w-full h-[120px] sm:h-[160px] lg:h-[200px] rounded-[14px] overflow-hidden cursor-pointer"
            >
                <Image
                    src={image || "/placeholder.svg"}
                    alt="store"
                    className="w-full h-full object-cover rounded-[14px]"
                    priority
                />
            </div>
        )
    }

    return (
        <div className="flex-col rounded-3xl mt-[20px] mx-4 sm:mx-6 lg:mx-25">
            <div className="bg-[#022B23] h-[60px] sm:h-[80px] flex justify-between px-2 sm:px-4 pt-2">
                <div>
                    <p className="font-medium text-[#C6EB5F] text-[18px] sm:text-[22px]">Stores</p>
                    <p className="text-[#C6EB5F] text-[12px] sm:text-[14px]">Check out top verified stores</p>
                </div>
            </div>
            <div className="bg-[#F9FDE8] mt-[6px] min-h-[300px] sm:min-h-[400px] lg:h-[440px] border border-[#C6EB5F] p-[6px] sm:p-[10px]">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[4px] sm:gap-[6px]">
                    {stores.map((product) => (
                        <PictureCard key={product.id} image={product.image} />
                    ))}
                </div>
            </div>
        </div>
    )
}

const Dropdown = <T extends { id: number; name: string }>({
                                                              items,
                                                              selectedItem,
                                                              onSelect,
                                                              placeholder,
                                                          }: {
    items: T[]
    selectedItem: T | null
    onSelect: (item: T) => void
    placeholder: string
}) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="bg-[#F9F9F9] border border-[#EDEDED] rounded-[8px] h-[40px] sm:h-[52px] flex justify-between px-[12px] sm:px-[18px] items-center cursor-pointer"
            >
                <p
                    className={`${selectedItem ? "text-[#121212]" : "text-[#707070]"} text-[12px] sm:text-[14px] font-normal truncate`}
                >
                    {selectedItem ? selectedItem.name : placeholder}
                </p>
                <ChevronDown
                    size={14}
                    className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""} sm:w-4 sm:h-4`}
                    color="#707070"
                />
            </div>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-full bg-white text-black rounded-md shadow-lg z-10 border border-[#ededed] max-h-[200px] overflow-y-auto">
                    <ul className="py-1">
                        {items.map((item) => (
                            <li
                                key={item.id}
                                className="px-4 py-2 text-black hover:bg-[#ECFDF6] cursor-pointer text-sm"
                                onClick={() => {
                                    onSelect(item)
                                    setIsOpen(false)
                                }}
                            >
                                {item.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

const MobileCategoryModal = ({
                                 isOpen,
                                 onClose,
                                 categories,
                                 selectedCategory,
                                 onCategorySelect,
                                 onAllCategoriesSelect,
                             }: {
    isOpen: boolean
    onClose: () => void
    categories: CategoryResponse[]
    selectedCategory: CategoryResponse | null
    onCategorySelect: (category: CategoryResponse) => void
    onAllCategoriesSelect: () => void
}) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
            <div className="bg-white h-full w-full max-w-sm">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">Categories</h2>
                    <button onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>
                <div className="overflow-y-auto h-full pb-20">
                    <ul>
                        <li
                            className={`flex items-center px-4 py-3 text-[#1E1E1E] border-b cursor-pointer ${
                                !selectedCategory ? "bg-[#ECFDF6]" : ""
                            }`}
                            onClick={() => {
                                onAllCategoriesSelect()
                                onClose()
                            }}
                        >
                            All Categories
                        </li>
                        {categories.map((category) => (
                            <li
                                key={category.id}
                                className={`flex items-center px-4 py-3 text-[#1E1E1E] border-b cursor-pointer ${
                                    selectedCategory?.id === category.id ? "bg-[#ECFDF6]" : ""
                                }`}
                                onClick={() => {
                                    onCategorySelect(category)
                                    onClose()
                                }}
                            >
                                {category.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

const MarketPlace = () => {
    const [countdown, setCountdown] = useState<number>(24 * 60 * 60)
    const [apiProducts, setApiProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [markets, setMarkets] = useState<Market[]>([])
    const [selectedMarket, setSelectedMarket] = useState<Market | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [isSearching, setIsSearching] = useState<boolean>(false)
    const [categories, setCategories] = useState<CategoryResponse[]>([])
    const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | null>(null)
    const [subCategories, setSubCategories] = useState<SubCategoryResponse[]>([])
    const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryResponse | null>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)
    const [hoveredCategory, setHoveredCategory] = useState<CategoryResponse | null>(null)
    const [showSubcategories, setShowSubcategories] = useState<boolean>(false)
    const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState<boolean>(false)

    const fetchProductsByCategory = async (categoryId: number) => {
        try {
            setLoading(true)
            const response = await axios.get(
                `https://digitalmarket.benuestate.gov.ng/api/products/by-category?categoryId=${categoryId}`,
            )
            if (response.data) {
                setApiProducts(response.data)
            }
        } catch (err) {
            console.error("Error fetching products by category:", err)
            setError("Failed to fetch products by category")
        } finally {
            setLoading(false)
        }
    }

    const handleMarketSelect = (market: Market) => {
        setSelectedMarket(market)
        fetchProductsByMarket(market.id)
    }

    const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const handleCategoryHover = (category: CategoryResponse) => {
        // Clear any pending leave timeout
        if (leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current)
            leaveTimeoutRef.current = null
        }

        setHoveredCategory(category)
        setShowSubcategories(true)
        fetchSubCategories(category.name)
    }

    const handleCategoryLeave = () => {
        // Set a timeout before hiding subcategories
        leaveTimeoutRef.current = setTimeout(() => {
            setShowSubcategories(false)
            setHoveredCategory(null)
        }, 300) // 300ms delay
    }

    const handleSubcategoryLeave = () => {
        // Same as category leave
        leaveTimeoutRef.current = setTimeout(() => {
            setShowSubcategories(false)
            setHoveredCategory(null)
        }, 300)
    }

    const cancelLeave = () => {
        if (leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current)
            leaveTimeoutRef.current = null
        }
    }

    const fetchProductsBySubCategory = async (subCategoryId: number) => {
        try {
            setLoading(true)
            const response = await axios.get(
                `https://digitalmarket.benuestate.gov.ng/api/products/by-subcategory?subCategoryId=${subCategoryId}`,
            )
            if (response.data) {
                setApiProducts(response.data)
            }
        } catch (err) {
            console.error("Error fetching products by subcategory:", err)
            setError("Failed to fetch products by subcategory")
        } finally {
            setLoading(false)
        }
    }

    const fetchProductsByMarket = async (marketId: number) => {
        try {
            setLoading(true)
            const response = await axios.get(
                `https://digitalmarket.benuestate.gov.ng/api/products/getByMarket?marketId=${marketId}`,
            )
            if (response.data) {
                setApiProducts(response.data)
            }
        } catch (err) {
            console.error("Error fetching products by market:", err)
            setError("Failed to fetch products by market")
        } finally {
            setLoading(false)
        }
    }


    const fetchData = async () => {
        try {
            const [marketsData] = await Promise.all([fetchMarkets()])
            setMarkets(marketsData)

            if (marketsData.length > 0) {
                setSelectedMarket(marketsData[0])
            }

        } catch (error) {
            console.error("Error fetching data:", error)
        }
    }

    useEffect(() => {
        fetchProducts()
        const intervalId = setInterval(fetchProducts, 300000)
        return () => clearInterval(intervalId)
    }, [])

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 0) {
                    clearInterval(countdownInterval)
                    return 0
                }
                return prevCountdown - 1
            })
        }, 1000)

        return () => clearInterval(countdownInterval)
    }, [])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            setError(null)

            let response
            try {
                response = await axios.get(`https://digitalmarket.benuestate.gov.ng/api/products/all`, {
                    headers: { "Content-Type": "application/json" },
                })
                if (response.data.success && response.data.data) {
                    setApiProducts(response.data.data)
                } else {
                    throw new Error(response.data.message || "Failed to fetch products")
                }
            } catch (primaryError) {
                console.warn("Primary API failed, trying fallback...", primaryError)
            }
        } catch (err) {
            console.error("Error fetching products:", err)
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || err.message || "An error occurred while fetching products")
            } else {
                setError(err instanceof Error ? err.message : "An error occurred while fetching products")
            }
        } finally {
            setLoading(false)
        }
    }

    const fetchSearchResults = useCallback(async (query: string) => {
        if (!query.trim()) {
            setIsSearching(false)
            await fetchProducts()
            return
        }

        try {
            setLoading(true)
            setError(null)
            setIsSearching(true)

            const FALLBACK_API = "https://digitalmarket.benuestate.gov.ng/api"
            const response = await axios.get(`${FALLBACK_API}/products/search-product?keyword=${encodeURIComponent(query)}`, {
                headers: { "Content-Type": "application/json" },
            })

            if (response.data) {
                setApiProducts(response.data)
            } else {
                setApiProducts([])
            }
        } catch (err) {
            console.error("Error searching products:", err)
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || err.message || "An error occurred while searching products")
            } else {
                setError(err instanceof Error ? err.message : "An error occurred while searching products")
            }
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchCategories = async () => {
        try {
            const PRIMARY_API = "https://digitalmarket.benuestate.gov.ng/api"
            const FALLBACK_API = "https://digitalmarket.benuestate.gov.ng/api"

            let response
            try {
                response = await axios.get(`${PRIMARY_API}/categories/all`)
            } catch (primaryError) {
                console.warn("Primary API failed, trying fallback...", primaryError)
                response = await axios.get(`${FALLBACK_API}/categories/all`)
            }

            if (response.data) {
                setCategories(response.data)
            }
        } catch (err) {
            console.error("Error fetching categories:", err)
        }
    }

    const fetchSubCategories = async (categoryName: string) => {
        try {
            let response
            try {
                response = await axios.get(
                    `https://digitalmarket.benuestate.gov.ng/api/categories/getAllCategorySub?categoryName=${encodeURIComponent(categoryName)}`,
                )
            } catch (primaryError) {
                console.warn("Primary API failed, trying fallback...", primaryError)
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (response.data) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                setSubCategories(response.data)
            } else {
                setSubCategories([])
            }
        } catch (err) {
            console.error("Error fetching subcategories:", err)
            setSubCategories([])
        }
    }

    const handleCategoryClick = (category: CategoryResponse) => {
        cancelLeave()
        setSelectedCategory(category)
        setSelectedSubCategory(null)
        setSearchQuery("")
        setIsSearching(false)
        fetchProductsByCategory(category.id)
        setShowSubcategories(false)
    }

    const handleSubCategoryClick = (subCategory: SubCategoryResponse) => {
        cancelLeave()
        // Find the parent category of this subcategory
        const parentCategory = categories.find((cat) => cat.name === hoveredCategory?.name)

        if (parentCategory) {
            setSelectedCategory(parentCategory)
        }
        setSelectedSubCategory(subCategory)
        fetchProductsBySubCategory(subCategory.id)
        setShowSubcategories(false)
    }

    const handleAllCategoriesSelect = () => {
        setSelectedCategory(null)
        setSelectedSubCategory(null)
        fetchProducts()
    }

    useEffect(() => {
        fetchData()
        fetchCategories()
    }, [])

    useEffect(() => {
        if (searchQuery.trim()) {
            fetchSearchResults(searchQuery)
        } else {
            setIsSearching(false)
            fetchProducts()
        }
    }, [searchQuery, fetchSearchResults])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
            setSearchQuery("")
            searchInputRef.current?.blur()
        }
    }

    return (
        <>
            <MarketPlaceHeader />
            <div className="flex-col w-full border-t-[0.5px] border-[#ededed]">
                <div className="flex justify-between min-h-[400px] lg:h-[595px] pt-[10px] px-4 sm:px-6 lg:px-25">
                    {/* Desktop Sidebar */}
                    {!isSearching && (
                        <div className="hidden lg:flex w-[20%] flex-col drop-shadow-sm h-full">
                            <div className="rounded-t-[8px] gap-[8px] h-[52px] px-[10px] font-medium text-[16px] flex items-center bg-[#022B23]">
                                <Image src={categoryImg || "/placeholder.svg"} alt={"image"} />
                                <p className="text-[#FFEEBE]">Categories</p>
                            </div>
                            <div className="shadow-sm relative">
                                <ul>
                                    <li
                                        className={`flex items-center px-[14px] gap-[10px] h-[48px] text-[#1E1E1E] hover:bg-[#ECFDF6] cursor-pointer ${
                                            !selectedCategory ? "bg-[#ECFDF6]" : ""
                                        }`}
                                        onClick={handleAllCategoriesSelect}
                                    >
                                        All Categories
                                    </li>
                                    {categories.map((category) => (
                                        <li
                                            key={category.id}
                                            className={`flex items-center px-[14px] gap-[10px] h-[48px] text-[#1E1E1E] hover:bg-[#ECFDF6] cursor-pointer ${
                                                selectedCategory?.id === category.id ? "bg-[#ECFDF6]" : ""
                                            }`}
                                            onMouseEnter={() => handleCategoryHover(category)}
                                            onMouseLeave={handleCategoryLeave}
                                            onClick={() => handleCategoryClick(category)}
                                        >
                                            {category.name}
                                        </li>
                                    ))}
                                </ul>

                                {showSubcategories && hoveredCategory && (
                                    <div
                                        className="absolute left-full top-0 ml-1 bg-white shadow-lg rounded-md z-50 min-w-[200px]"
                                        onMouseEnter={cancelLeave}
                                        onMouseLeave={handleSubcategoryLeave}
                                        style={{
                                            top: `${categories.findIndex((c) => c.id === hoveredCategory.id) * 48 + 48}px`,
                                            border: "1px solid #EDEDED",
                                            maxHeight: "400px",
                                            overflowY: "auto",
                                        }}
                                    >
                                        <div className="px-[14px] py-2 font-medium bg-gray-100">{hoveredCategory.name}</div>
                                        <ul>
                                            {subCategories.map((subCategory) => (
                                                <li
                                                    key={subCategory.id}
                                                    className={`flex items-center px-[14px] gap-[10px] h-[48px] text-[#1E1E1E] hover:bg-[#ECFDF6] cursor-pointer ${
                                                        selectedSubCategory?.id === subCategory.id ? "bg-[#ECFDF6]" : ""
                                                    }`}
                                                    onClick={() => {
                                                        cancelLeave()
                                                        handleSubCategoryClick(subCategory)
                                                    }}
                                                >
                                                    {subCategory.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className={`flex flex-col h-full ${isSearching ? "w-full" : "w-full lg:w-[80%]"}`}>
                        {/* Mobile Category Button */}
                        {!isSearching && (
                            <div className="lg:hidden mb-4">
                                <button
                                    onClick={() => setIsMobileCategoryOpen(true)}
                                    className="flex items-center gap-2 bg-[#022B23] text-white px-4 py-2 rounded-lg"
                                >
                                    <Menu size={20} />
                                    <span>Categories</span>
                                </button>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row justify-between mb-[2px] items-stretch sm:items-center gap-2 sm:gap-4">
                            <div className="flex gap-2 items-center bg-[#F9F9F9] border-[0.5px] border-[#ededed] h-[40px] sm:h-[52px] px-[10px] rounded-[8px] flex-1 max-w-full sm:max-w-[540px]">
                                <Image
                                    src={searchImg || "/placeholder.svg"}
                                    alt="Search Icon"
                                    width={20}
                                    height={20}
                                    className="h-[16px] w-[16px] sm:h-[20px] sm:w-[20px]"
                                />
                                <input
                                    ref={searchInputRef}
                                    placeholder="Search for items here"
                                    className="w-full text-[#707070] text-[12px] sm:text-[14px] focus:outline-none"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                            {!isSearching && (
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center rounded-[2px] gap-[2px] p-[2px] border-[0.5px] border-[#ededed]">
                                    <div className="w-full sm:w-[171px]">
                                        <Dropdown
                                            items={markets}
                                            selectedItem={selectedMarket}
                                            onSelect={handleMarketSelect}
                                            placeholder="Wurukum market"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {isSearching && (
                            <div className="mt-4">
                                <div className="flex items-center w-full justify-between h-[50px] sm:h-[66px] px-2 sm:px-4 border-y border-[#ededed]">
                                    <div className="flex gap-[2px] p-0.5 border border-[#ededed] w-full max-w-[313px] rounded-[2px]">
                                        <div className="flex gap-[4px] h-[36px] sm:h-[42px] w-full bg-[#f9f9f9] rounded-[2px] items-center px-[8px] py-[14px]">
                                            <Image
                                                width={16}
                                                height={16}
                                                src={marketIcon || "/placeholder.svg"}
                                                alt="Market Icon"
                                                className="sm:w-5 sm:h-5"
                                            />
                                            <p className="text-[#1E1E1E] font-normal text-[12px] sm:text-[14px]">
                                                {loading ? "Loading..." : `${apiProducts.length} Products found`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <ProductGrid apiProducts={apiProducts} />
                                </div>
                            </div>
                        )}

                        {!isSearching && (
                            <div className="hidden sm:block">
                                <BannerSection />
                            </div>
                        )}
                    </div>
                </div>

                {!isSearching && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center w-full justify-between min-h-[50px] sm:h-[66px] px-4 sm:px-6 lg:px-25 py-2 sm:py-0 border-y border-[#ededed] gap-2 sm:gap-4">
                        <div className="flex flex-col sm:flex-row gap-[2px] p-0.5 border border-[#ededed] w-full sm:w-[313px] rounded-[2px]">
                            <div className="flex gap-[4px] h-[36px] sm:h-[42px] w-full sm:w-[159px] bg-[#f9f9f9] rounded-[2px] items-center px-[8px] py-[14px]">
                                <Image
                                    width={16}
                                    height={16}
                                    src={marketIcon || "/placeholder.svg"}
                                    alt="Market Icon"
                                    className="sm:w-5 sm:h-5"
                                />
                                <p className="text-[#1E1E1E] font-normal text-[12px] sm:text-[14px]">
                                    {loading ? "Loading..." : `${apiProducts.length} Products`}
                                </p>
                            </div>
                            <div className="bg-[#f9f9f9] gap-[4px] text-[#1E1E1E] flex text-[12px] sm:text-[14px] w-full sm:w-[148px] h-[36px] sm:h-[42px] px-1 items-center justify-center rounded-[2px]">
                                <Image
                                    src={filterImg || "/placeholder.svg"}
                                    alt={"image"}
                                    width={16}
                                    height={16}
                                    className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px]"
                                />
                                <p>
                                    Sort by: <span className="text-[#022B23] font-medium">Popular</span>
                                </p>
                            </div>
                        </div>

                        {/* Show active filters */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {selectedCategory && (
                                <div className="bg-[#ECFDF6] px-2 sm:px-3 py-1 rounded-full flex items-center gap-1">
                                    <span className="text-[#022B23] text-xs sm:text-sm">{selectedCategory.name}</span>
                                    {selectedSubCategory && (
                                        <>
                                            <span className="text-gray-400">/</span>
                                            <span className="text-[#022B23] text-xs sm:text-sm">{selectedSubCategory.name}</span>
                                        </>
                                    )}
                                    <button
                                        onClick={() => {
                                            setSelectedCategory(null)
                                            setSelectedSubCategory(null)
                                            fetchProducts()
                                        }}
                                        className="text-gray-500 hover:text-gray-700 ml-1"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="flex justify-center items-center py-10">
                        <p className="text-[#1E1E1E] text-base sm:text-lg">Loading products...</p>
                    </div>
                )}

                {error && (
                    <div className="flex flex-col sm:flex-row justify-center items-center py-10 gap-2 sm:gap-4 px-4">
                        <p className="text-red-500 text-sm sm:text-lg text-center">Error: {error}</p>
                        <button
                            onClick={isSearching ? () => fetchSearchResults(searchQuery) : fetchProducts}
                            className="bg-[#022B23] text-white px-4 py-2 rounded text-sm sm:text-base"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && !isSearching && (
                    <>
                        <ProductGrid apiProducts={apiProducts} />
                        <div className="flex-col px-4 sm:px-6 lg:px-25">
                            <FlashSale countdown={countdown} apiProducts={apiProducts} />
                        </div>
                        <StoreSection />
                    </>
                )}
            </div>

            {/* Mobile Category Modal */}
            <MobileCategoryModal
                isOpen={isMobileCategoryOpen}
                onClose={() => setIsMobileCategoryOpen(false)}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategoryClick}
                onAllCategoriesSelect={handleAllCategoriesSelect}
            />

            <Footer />
        </>
    )
}

export default MarketPlace
