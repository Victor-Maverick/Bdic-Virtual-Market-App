'use client';
import { useState, useRef, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from 'axios';
import uploadIcon from "../../../public/assets/images/uploadIcon.png";
import galleryImg from '../../../public/assets/images/galleryImg.svg';
import limeArrow from "../../../public/assets/images/green arrow.png";
import biArrows from "../../../public/assets/images/biArrows.svg";
import arrowUp from "../../../public/assets/images/arrow-up.svg";
import flagImg from '../../../public/assets/images/flag-2.svg';
import dropBoxImg from '../../../public/assets/images/dropbox.svg';
import archiveImg from '../../../public/assets/images/archive.svg';
import profileImg from "../../../public/assets/images/dashuserimg.svg";
import arrowDown from '../../../public/assets/images/arrow-down.svg';
import iPhone from '../../../public/assets/images/blue14.png';
import arrowBack from '../../../public/assets/images/arrow-right.svg';
import arrowRight from '../../../public/assets/images/grey right arrow.png';
import displayImg from '../../../public/assets/images/iphone14Img.svg'
import ProductAddedModal from "@/components/productAddedModal";

type ProductFormData = {
    productName: string;
    price: string;
    description: string;
    quantity: string;
    provider: string;
    position: string;
    categoryId?: string;
    categoryName?: string;
};

type Category = {
    id: string;
    name: string;
};

type InputFieldProps = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    optional?: boolean;
    className?: string;
    type?: string;
};

import { StaticImageData } from 'next/image';

type Product = {
    id: number;
    image: StaticImageData;
    name: string;
    review: number;
    status: string;
    salesQty: number;
    unitPrice: string;
    salesAmount: string;
    totalStock: string;
    remainingStock: string;
};

const ProductActionsDropdown = ({
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
                        <li className="px-4 py-2 text-[12px] hover:bg-[#ECFDF6] cursor-pointer">Edit</li>
                        <li className="px-4 py-2 text-[12px] hover:bg-[#ECFDF6] cursor-pointer">Promote</li>
                        <li className="px-4 py-2 text-[12px] hover:bg-[##FFFAF9] cursor-pointer text-[#FF5050]">
                            Remove product
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

const ProductTableRow = ({
                             product,
                             isLast
                         }: {
    product: Product;
    isLast: boolean
}) => {
    return (
        <div className={`flex h-[72px] ${!isLast ? 'border-b border-[#EAECF0]' : ''}`}>
            <div className="flex items-center w-[284px] pr-[24px] gap-3">
                <div className="bg-[#f9f9f9] h-full w-[70px] overflow-hidden mt-[2px]">
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={70}
                        height={70}
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <p className="text-[14px] font-medium text-[#101828]">{product.name}</p>
                    <p className="text-[12px] text-[#667085]">Review: {product.review}</p>
                </div>
            </div>

            <div className="flex items-center w-[90px] px-[24px]">
                <div className={`w-[55px] h-[22px] rounded-[8px] flex items-center justify-center ${
                    product.status === 'Active'
                        ? 'bg-[#ECFDF3] text-[#027A48]'
                        : 'bg-[#FEF3F2] text-[#FF5050]'
                }`}>
                    <p className="text-[12px] font-medium">{product.status}</p>
                </div>
            </div>

            <div className="flex flex-col justify-center w-[149px] px-[15px]">
                <p className="text-[14px] text-[#101828]">Sales</p>
                <p className="text-[14px] font-medium text-[#101828]">{product.salesQty}</p>
            </div>

            <div className="flex items-center w-[170px] px-[24px]">
                <p className="text-[14px] font-medium text-[#101828]">
                    NGN{Number(product.unitPrice).toLocaleString()}.00
                </p>
            </div>

            <div className="flex flex-col justify-center w-[173px] px-[24px]">
                <p className="text-[14px] text-[#101828]">Sales</p>
                <p className="text-[14px] font-medium text-[#101828]">
                    NGN{Number(product.salesAmount).toLocaleString()}.00
                </p>
            </div>

            <div className="flex items-center w-[115px] px-[24px]">
                <p className="text-[14px] font-medium text-[#101828]">{product.totalStock}</p>
            </div>

            <div className="flex items-center w-[200px] px-[24px] gap-2">
                <div className="flex-1 h-[6px] bg-[#EAECF0] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#C6EB5F] rounded-full"
                        style={{
                            width: `${(Number(product.remainingStock) / Number(product.totalStock)) * 100}%`
                        }}
                    />
                </div>
                <p className="text-[14px] font-medium text-[#101828] min-w-[40px]">
                    {product.remainingStock}
                </p>
            </div>

            <div className="flex items-center justify-center w-[40px]">
                <ProductActionsDropdown productId={product.id}>
                    <>
                        <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                        <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                        <div className="w-[3px] h-[3px] bg-[#98A2B3] rounded-full"></div>
                    </>
                </ProductActionsDropdown>
            </div>
        </div>
    );
};

const CategoryDropDown = ({
                              categories,
                              selected,
                              onSelect,
                              className = "",
                              loading = false
                          }: {
    categories: Category[];
    selected: string;
    onSelect: (categoryId: string, categoryName: string) => void;
    className?: string;
    loading?: boolean;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`relative ${className}`}>
            <div
                onClick={() => !loading && setIsOpen(!isOpen)}
                className={`border-[1.5px] rounded-[14px] h-[44px] flex justify-between px-[18px] border-[#D1D1D1] items-center ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
                <p className="text-[#BDBDBD] text-[16px] font-medium">
                    {loading ? 'Loading categories...' : selected}
                </p>
                <ChevronDown
                    size={18}
                    className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    color="#D1D1D1"
                />
            </div>

            {isOpen && !loading && (
                <div className="absolute left-0 mt-2 w-full bg-white rounded-md shadow-lg z-10 border border-[#ededed] max-h-60 overflow-y-auto">
                    <ul className="py-1">
                        {categories.map((category) => (
                            <li
                                key={category.id}
                                className="px-4 py-2 text-[12px] hover:bg-[#ECFDF6] cursor-pointer"
                                onClick={() => {
                                    onSelect(category.id, category.name);
                                    setIsOpen(false);
                                }}
                            >
                                {category.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const DropDown = ({
                      options,
                      selected,
                      onSelect,
                      className = ""
                  }: {
    options: string[];
    selected: string;
    onSelect: (option: string) => void;
    className?: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`relative ${className}`}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="border-[1.5px] rounded-[14px] h-[44px] flex justify-between px-[18px] border-[#D1D1D1] items-center cursor-pointer"
            >
                <p className="text-[#BDBDBD] text-[16px] font-medium">{selected}</p>
                <ChevronDown
                    size={18}
                    className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    color="#D1D1D1"
                />
            </div>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-full bg-white rounded-md shadow-lg z-10 border border-[#ededed]">
                    <ul className="py-1">
                        {options.map((option, index) => (
                            <li
                                key={index}
                                className="px-4 py-2 text-[12px] hover:bg-[#ECFDF6] cursor-pointer"
                                onClick={() => {
                                    onSelect(option);
                                    setIsOpen(false);
                                }}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const InputField = ({
                        id,
                        label,
                        value,
                        onChange,
                        placeholder,
                        optional = false,
                        className = "",
                        type = "text",
                    }: InputFieldProps) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className={`relative w-full flex flex-col ${className}`}>
            <label
                htmlFor={id}
                className={`absolute left-4 transition-all ${
                    isFocused || value
                        ? "text-[#6D6D6D] text-[12px] font-medium top-[6px]"
                        : "hidden"
                }`}
            >
                {label} {optional && <span className="text-[#B0B0B0">(optional)</span>}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={!isFocused && !value ? placeholder : ""}
                className={`px-4 h-[58px] w-full border-[1.5px] border-[#D1D1D1] rounded-[14px] outline-none focus:border-[2px] focus:border-[#022B23] ${
                    isFocused || value
                        ? "pt-[14px] pb-[4px] text-[#121212] text-[14px]"
                        : "text-[#BDBDBD] text-[16px] font-medium"
                }`}
            />
        </div>
    );
};

const PreviewView = ({
                         formData,
                         onBack,
                         onPublish,
                         isPublishing
                     }: {
    formData: ProductFormData;
    onBack: () => void;
    onPublish: () => void;
    isPublishing: boolean;
}) => {
    const otherImages = [
        {id: 1, image: iPhone},
        {id: 2, image: iPhone},
        {id: 3, image: iPhone},
        {id: 4, image: iPhone}
    ];
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePublish = () => {
        onPublish();
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="flex justify-between">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={onBack}>
                        <Image src={arrowBack} alt="Back" width={20} height={20} />
                        <p className="text-[#022B23] text-[14px] font-medium">Back to edit</p>
                    </div>

                    <div className="flex flex-col gap-[2px] h-[44px]">
                        <p className="text-[16px] font-medium text-[#022B23]">Preview and publish to shop</p>
                        <p className="text-[#707070] font-medium text-[14px]">View product detail before you publish</p>
                    </div>
                    <div className="w-[500px] flex flex-col h-[393px] gap-[24px]">
                        <div className="flex flex-col gap-[8px]">
                            <div className="w-full bg-[#F7F7F7] py-[8px] flex flex-col gap-[2px] h-[58px] rounded-[14px] border-[0.5px] border-[#E4E4E4] pl-[18px]">
                                <p className="text-[#6D6D6D] text-[12px] font-medium">Product name</p>
                                <p className="text-[#121212] text-[14px] font-medium">{formData.productName}</p>
                            </div>
                            <div className="w-full bg-[#F7F7F7] p-[18px] flex flex-col gap-[2px] h-[179px] rounded-[14px] border-[0.5px] border-[#E4E4E4] pl-[18px]">
                                <p className="text-[#6D6D6D] text-[12px] font-medium">Description</p>
                                <p className="text-[#121212] text-[14px] font-medium">{formData.description}</p>
                            </div>
                            <div className="w-full bg-[#F7F7F7] py-[8px] flex flex-col gap-[2px] h-[58px] rounded-[14px] border-[0.5px] border-[#E4E4E4] pl-[18px]">
                                <p className="text-[#6D6D6D] text-[12px] font-medium">Price</p>
                                <p className="text-[#121212] text-[14px] font-medium">NGN {Number(formData.price).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="w-full bg-[#F7F7F7] py-[8px] flex flex-col gap-[2px] h-[58px] rounded-[14px] border-[0.5px] border-[#E4E4E4] pl-[18px]">
                            <p className="text-[#6D6D6D] text-[12px] font-medium">Quantity</p>
                            <p className="text-[#121212] text-[14px] font-medium">{formData.quantity}</p>
                        </div>
                        <div className="w-full bg-[#F7F7F7] py-[8px] flex flex-col gap-[2px] h-[58px] rounded-[14px] border-[0.5px] border-[#E4E4E4] pl-[18px]">
                            <p className="text-[#6D6D6D] text-[12px] font-medium">Category</p>
                            <p className="text-[#121212] text-[14px] font-medium">{formData.categoryName || 'No category selected'}</p>
                        </div>
                    </div>

                    <div
                        className={`flex mt-[100px] mb-[20px] gap-[9px] justify-center items-center bg-[#022B23] rounded-[12px] h-[52px] cursor-pointer hover:bg-[#033a30] transition-colors ${isPublishing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handlePublish}
                    >
                        <p className="text-[#C6EB5F] font-semibold text-[14px]">
                            {isPublishing ? 'Publishing...' : 'Publish product to store'}
                        </p>
                        {!isPublishing && <Image src={limeArrow} alt="Continue arrow" width={18} height={18} />}
                    </div>
                </div>
                <div className="flex w-[500px] text-[#022B23] gap-[24px] text-[14px] font-medium flex-col pt-[109px]">
                    <div className="flex flex-col gap-[2px]">
                        <p>Display image</p>
                        <div className="w-full rounded-[24px] flex justify-center items-end bg-[#F9F9F9] h-[404px] mt-[5px]">
                            <Image src={displayImg} alt="Default product" width={360} height={360} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-[2px]">
                        <p>Other images</p>
                        <div className="w-full flex justify-between items-end h-[113px]">
                            {otherImages.map((img) => (
                                <div key={img.id} className="w-[113px] h-full bg-[#F9F9F9] rounded-[8px] overflow-hidden">
                                    <Image
                                        src={img.image}
                                        alt={`Product image ${img.id}`}
                                        width={100}
                                        height={100}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <ProductAddedModal
                    isOpen={isModalOpen}
                />
            )}
        </>
    );
};

const TextAreaField = ({
                           id,
                           label,
                           value,
                           onChange,
                       }: Omit<InputFieldProps, "optional" | "type">) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative w-full flex flex-col">
            <label
                htmlFor={id}
                className={`absolute left-4 transition-all ${
                    isFocused || value
                        ? "text-[#6D6D6D] text-[12px] font-medium top-[6px]"
                        : "hidden"
                }`}
            >
                {label}
            </label>
            <div className="relative">
                <textarea
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`px-4 h-[120px] w-full border-[1.5px] border-[#D1D1D1] rounded-[14px] outline-none focus:border-[2px] focus:border-[#022B23] resize-none ${
                        isFocused || value
                            ? "pt-[24px] pb-[4px] text-[#121212] text-[14px] font-medium"
                            : "text-[#BDBDBD] text-[16px] font-medium"
                    }`}
                />
                {!isFocused && !value && (
                    <div className="absolute top-[14px] left-4 right-4 pointer-events-none">
                        <p className="text-[#BDBDBD] text-[16px] font-medium leading-tight">Product description</p>
                        <p className="text-[#BDBDBD] text-[12px] font-normal leading-tight">(2000 words)</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const NewProductView = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeView, setActiveView] = useState<'New-item' | 'Products-management'>(
        searchParams.get('tab') === 'product' ? 'Products-management' : 'New-item'
    );
    const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
    const [selectedFilter, setSelectedFilter] = useState("Last 24 Hrs");
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [formData, setFormData] = useState<ProductFormData>({
        productName: "",
        price: "",
        description: "",
        quantity: "",
        provider: "",
        position: "",
        categoryId: "",
        categoryName: ""
    });
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
    const [sideImages, setSideImages] = useState<File[]>([]);
    const [sideImagePreviews, setSideImagePreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const sideImageInputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;

    const timeFilters = ["Last 24 Hrs", "Last 7 days", "Last 30 days", "Last 90 days"];
    const products = [
        { id: 1, image: iPhone, name: "iPhone 14 pro max", review: 4.2, status: "Active", salesQty: 72, unitPrice: "840000", salesAmount: "302013000", totalStock: "200", remainingStock: "128" },
        { id: 2, image: iPhone, name: "iPhone 14 pro max", review: 4.2, status: "Disabled", salesQty: 72, unitPrice: "840000", salesAmount: "302013000", totalStock: "200", remainingStock: "128" },
        { id: 3, image: iPhone, name: "iPhone 14 pro max", review: 4.2, status: "Active", salesQty: 72, unitPrice: "840000", salesAmount: "302013000", totalStock: "200", remainingStock: "128" },
        { id: 4, image: iPhone, name: "iPhone 14 pro max", review: 4.2, status: "Active", salesQty: 72, unitPrice: "840000", salesAmount: "302013000", totalStock: "200", remainingStock: "128" },
        { id: 5, image: iPhone, name: "iPhone 14 pro max", review: 4.2, status: "Active", salesQty: 72, unitPrice: "840000", salesAmount: "302013000", totalStock: "200", remainingStock: "128" },
        { id: 6, image: iPhone, name: "iPhone 14 pro max", review: 4.2, status: "Active", salesQty: 72, unitPrice: "840000", salesAmount: "302013000", totalStock: "200", remainingStock: "128" },
        { id: 7, image: iPhone, name: "iPhone 14 pro max", review: 4.2, status: "Active", salesQty: 72, unitPrice: "840000", salesAmount: "302013000", totalStock: "200", remainingStock: "128" },
        { id: 8, image: iPhone, name: "iPhone 14 pro max", review: 4.2, status: "Active", salesQty: 72, unitPrice: "840000", salesAmount: "302013000", totalStock: "200", remainingStock: "128" },
        { id: 9, image: iPhone, name: "iPhone 14 pro max", review: 4.2, status: "Active", salesQty: 72, unitPrice: "840000", salesAmount: "302013000", totalStock: "200", remainingStock: "128" },
        { id: 10, image: iPhone, name: "iPhone 14 pro max", review: 4.2, status: "Active", salesQty: 72, unitPrice: "840000", salesAmount: "302013000", totalStock: "200", remainingStock: "128" }
    ];

    const totalPages = Math.ceil(products.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            try {
                const response = await axios.get('https://api.digitalmarke.bdic.ng/api/categories/all');
                if (response.data && Array.isArray(response.data)) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                // You might want to show a toast notification or error message here
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToPage = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleChange = (field: keyof ProductFormData) => (value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCategorySelect = (categoryId: string, categoryName: string) => {
        setFormData(prev => ({
            ...prev,
            categoryId,
            categoryName
        }));
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedImage(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setUploadedImagePreview(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSideImageUpload = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const newSideImages = [...sideImages];
            const newPreviews = [...sideImagePreviews];

            newSideImages[index] = file;

            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    newPreviews[index] = event.target.result as string;
                    setSideImagePreviews(newPreviews);
                }
            };
            reader.readAsDataURL(file);

            setSideImages(newSideImages);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const triggerSideImageInput = (index: number) => {
        sideImageInputRefs.current[index]?.click();
    };

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setUploadedImage(null);
        setUploadedImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeSideImage = (index: number) => (e: React.MouseEvent) => {
        e.stopPropagation();
        const newSideImages = [...sideImages];
        const newPreviews = [...sideImagePreviews];

        // Remove the item at the specified index
        newSideImages.splice(index, 1);
        newPreviews.splice(index, 1);

        setSideImages(newSideImages);
        setSideImagePreviews(newPreviews);

        if (sideImageInputRefs.current[index]) {
            sideImageInputRefs.current[index]!.value = "";
        }
    };

    const handlePreview = () => {
        // Validate required fields
        if (!formData.productName || !formData.price || !formData.description || !formData.quantity || !formData.categoryId) {
            alert('Please fill in all required fields');
            return;
        }

        if (!uploadedImage) {
            alert('Please upload a main product image');
            return;
        }

        setViewMode('preview');
    };

    const handleBackToEdit = () => {
        setViewMode('edit');
    };

    const handlePublish = async () => {
        setIsPublishing(true);

        try {
            const formDataToSend = new FormData();

            // Add form fields
            formDataToSend.append('name', formData.productName);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('quantity', formData.quantity);
            formDataToSend.append('categoryId', formData.categoryId || '');
            formDataToSend.append('shopId', '1'); // You might want to make this dynamic

            // Add main image
            if (uploadedImage) {
                formDataToSend.append('mainImageUrl', uploadedImage);
            }

            // Add side images
            sideImages.forEach((image, index) => {
                if (image) {
                    formDataToSend.append(`sideImage${index + 1}Url`, image);
                }
            });

            const response = await axios.post(
                'https://api.digitalmarke.bdic.ng/api/products/add',
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            console.log('Product published successfully:', response.data);

            // Reset form after successful publish
            setFormData({
                productName: "",
                price: "",
                description: "",
                quantity: "",
                provider: "",
                position: "",
                categoryId: "",
                categoryName: ""
            });
            setUploadedImage(null);
            setUploadedImagePreview(null);
            setSideImages([]);
            setSideImagePreviews([]);
            setViewMode('edit');

        } catch (error) {
            console.error('Error publishing product:', error);
            alert('Failed to publish product. Please try again.');
        } finally {
            setIsPublishing(false);
        }
    };

    const renderNewItemView = () => {
        if (viewMode === 'preview') {
            return (
                <PreviewView
                    formData={formData}
                    onBack={handleBackToEdit}
                    onPublish={handlePublish}
                    isPublishing={isPublishing}
                />
            );
        }

        return (
            <div className="flex justify-between px-55">
                <div className="flex flex-col">
                    <p className="text-[#022B23] text-[14px] font-medium">New product</p>
                    <p className="text-[#707070] text-[14px] font-medium">List a new product on your shop now</p>
                </div>
                <div className="flex w-[400px] flex-col">
                    <div className="flex flex-col gap-[12px]">
                        <InputField
                            id="productName"
                            label="Product name"
                            value={formData.productName}
                            onChange={handleChange('productName')}
                            placeholder="Product name"
                        />
                        <CategoryDropDown
                            categories={categories}
                            selected={formData.categoryName || "Category"}
                            onSelect={handleCategorySelect}
                            loading={loadingCategories}
                        />
                        <InputField
                            id="price"
                            label="Price (NGN 0.00)"
                            value={formData.price}
                            onChange={handleChange('price')}
                            placeholder="Price (NGN 0.00)"
                            type="number"
                        />
                        <TextAreaField
                            id="description"
                            label="Product description (2000 words)"
                            value={formData.description}
                            onChange={handleChange('description')}
                        />
                        <div className="mt-[38px]">
                            <p className="mb-[5px] text-[12px] font-medium text-[#6D6D6D]">
                                Product image display<span className="text-[#B0B0B0]"> (Mandatory) <span className="text-[#FF5050] font-medium text-[12px]">*</span></span>
                            </p>
                            <div
                                className="flex flex-col gap-[8px] text-center items-center w-full h-[102px] rounded-[14px] bg-[#ECFDF6] justify-center border border-dashed border-[#022B23] cursor-pointer relative overflow-hidden"
                                onClick={triggerFileInput}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                                {uploadedImagePreview ? (
                                    <>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Image
                                                src={uploadedImagePreview}
                                                alt="Uploaded logo"
                                                width={96}
                                                height={96}
                                                className="rounded-lg object-cover w-[96px] h-[96px]"
                                            />
                                        </div>
                                        <button
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Image src={uploadIcon} alt="Upload icon" width={24} height={24} />
                                        <p className="text-[12px] font-medium text-[#022B23]">
                                            <span className="underline">Upload</span> your product image
                                            <br />(1MB max)
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-[10px]">
                            <label className="text-[#6D6D6D] text-[12px] font-medium">
                                Other images: <span className="text-[#B0B0B0]">(Max 4) <span className="text-[#FF5050] font-medium text-[12px]">*</span></span>
                            </label>
                            <div className="flex gap-2">
                                {[0, 1, 2, 3].map((index) => (
                                    <div key={index} className="relative">
                                        <input
                                            type="file"
                                            ref={(el) => {
                                                sideImageInputRefs.current[index] = el;
                                            }}
                                            onChange={handleSideImageUpload(index)}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        <div
                                            className="border-[1.5px] border-[#1E1E1E] bg-[#F6F6F6] border-dashed rounded-[14px] h-[80px] w-[97px] flex flex-col items-center justify-center cursor-pointer relative overflow-hidden"
                                            onClick={() => triggerSideImageInput(index)}
                                        >
                                            {sideImagePreviews[index] ? (
                                                <>
                                                    <Image
                                                        src={sideImagePreviews[index]}
                                                        alt={`Side image ${index + 1}`}
                                                        width={97}
                                                        height={80}
                                                        className="object-cover w-full h-full"
                                                    />
                                                    <button
                                                        onClick={removeSideImage(index)}
                                                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <Image src={galleryImg} alt={'image'} width={20} height={20} />
                                                    <span className="text-[#1E1E1E] text-[12px] font-medium underline">Add</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <InputField
                                id="quantity"
                                label="Quantity"
                                value={formData.quantity}
                                onChange={handleChange('quantity')}
                                placeholder="Quantity (0)"
                                type="number"
                            />
                        </div>
                        <div
                            className="flex mt-[30px] mb-[20px] gap-[9px] justify-center items-center bg-[#022B23] rounded-[12px] h-[52px] cursor-pointer hover:bg-[#033a30] transition-colors"
                            onClick={handlePreview}
                        >
                            <p className="text-[#C6EB5F] font-semibold text-[14px]">Preview and publish</p>
                            <Image src={limeArrow} alt="Continue arrow" width={18} height={18} />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderProductsManagementView = () => (
        <div className="flex flex-col gap-[50px]">
            <div className="flex flex-col gap-[12px]">
                <p className="text-[#022B23] text-[16px] font-medium">Product metrics</p>
                <div className="flex items-center gap-[20px] h-[100px]">
                    <div className="w-[246px] h-full border-[0.5px] rounded-[14px] bg-[#ECFDF6] border-[#52A43E]">
                        <div className="flex items-center gap-[8px] text-[12px] text-[#52A43E] font-medium p-[15px]">
                            <Image src={biArrows} alt="total sales" width={18} height={18} className="h-[18px] w-[18px]" />
                            <p>Total sales (741)</p>
                        </div>
                        <div className="flex justify-between px-[15px]">
                            <p className="text-[#18181B] font-medium text-[16px]">N102,426,231.00</p>
                            <div className="flex items-center gap-[4px]">
                                <Image src={arrowUp} alt={'image'} width={10} height={10}/>
                                <p className="text-[#22C55E] text-[12px]">2%</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-[246px] h-full border-[0.5px] rounded-[14px] bg-[#FFFFFF] border-[#ededed]">
                        <div className="flex items-center gap-[8px] text-[12px] text-[#707070] font-medium p-[15px]">
                            <Image src={flagImg} alt="completed transactions" width={18} height={18} className="h-[18px] w-[18px]" />
                            <p>All products (in stock)</p>
                        </div>
                        <div className="flex justify-between px-[15px]">
                            <p className="text-[#18181B] font-medium text-[16px]">1,232</p>
                            <div className="flex items-center gap-[4px]">
                                <Image src={arrowUp} alt={'image'} width={10} height={10}/>
                                <p className="text-[#22C55E] text-[12px]">2%</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-[246px] h-full border-[0.5px] rounded-[14px] bg-[#FFFFFF] border-[#ededed]">
                        <div className="flex items-center gap-[8px] text-[12px] text-[#707070] font-medium p-[15px]">
                            <Image src={dropBoxImg} alt="pending orders" width={18} height={18} className="h-[18px] w-[18px]" />
                            <p>Top selling product</p>
                        </div>
                        <div className="flex justify-between px-[15px]">
                            <p className="text-[#18181B] font-medium text-[16px]">Iphone 14 pro (82)</p>
                            <div className="flex items-center gap-[4px]">
                                <Image src={arrowUp} alt={'image'} width={10} height={10}/>
                                <p className="text-[#22C55E] text-[12px]">2%</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-[246px] h-full border-[0.5px] rounded-[14px] bg-[#FFFFFF] border-[#ededed]">
                        <div className="flex items-center gap-[8px] text-[12px] text-[#707070] font-medium p-[15px]">
                            <Image src={archiveImg} alt="pending orders" width={18} height={18} className="h-[18px] w-[18px]" />
                            <p>Products sold</p>
                        </div>
                        <div className="flex justify-between px-[15px]">
                            <p className="text-[#18181B] font-medium text-[16px]">782</p>
                            <div className="flex items-center gap-[4px]">
                                <Image src={arrowUp} alt={'image'} width={10} height={10}/>
                                <p className="text-[#22C55E] text-[12px]">2%</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-[246px] h-full border-[0.5px] rounded-[14px] bg-[#FFFFFF] border-[#ededed]">
                        <div className="flex items-center gap-[8px] text-[12px] text-[#707070] font-medium p-[15px]">
                            <Image src={profileImg} alt="pending orders" width={18} height={18} className="h-[18px] w-[18px]" />
                            <p>Returns</p>
                        </div>
                        <div className="flex justify-between px-[15px]">
                            <p className="text-[#18181B] font-medium text-[16px]">2</p>
                            <div className="flex items-center gap-[4px]">
                                <Image src={arrowUp} alt={'image'} width={10} height={10}/>
                                <p className="text-[#22C55E] text-[12px]">2%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col rounded-[24px] border-[1px] border-[#EAECF0]">
                <div className="my-[20px] mx-[25px] flex flex-col">
                    <p className="text-[#101828] font-medium">Inventory (500)</p>
                    <p className="text-[#667085] text-[14px]">View and manage your products</p>
                </div>

                <div className="flex h-[44px] bg-[#F9FAFB] border-b-[1px] border-[#EAECF0]">
                    <div className="flex items-center px-[24px] w-[284px] py-[12px] gap-[4px]">
                        <p className="text-[#667085] font-medium text-[12px]">Products</p>
                        <Image src={arrowDown} alt="Sort" width={12} height={12} />
                    </div>
                    <div className="flex items-center px-[24px] w-[90px] py-[12px]">
                        <p className="text-[#667085] font-medium text-[12px]">Status</p>
                    </div>
                    <div className="flex items-center px-[15px] w-[149px] py-[12px]">
                        <p className="text-[#667085] font-medium text-[12px]">Performance (Qty)</p>
                    </div>
                    <div className="flex items-center px-[24px] w-[170px] py-[12px]">
                        <p className="text-[#667085] font-medium text-[12px]">Unit price (NGN)</p>
                    </div>
                    <div className="flex items-center px-[24px] w-[173px] py-[12px]">
                        <p className="text-[#667085] font-medium text-[12px]">Sales amount (NGN)</p>
                    </div>
                    <div className="flex items-center px-[24px] w-[115px] py-[12px]">
                        <p className="text-[#667085] font-medium text-[12px]">Total stock</p>
                    </div>
                    <div className="flex items-center px-[24px] w-[200px] py-[12px]">
                        <p className="text-[#667085] font-medium text-[12px]">Remaining stock</p>
                    </div>
                    <div className="flex items-center w-[40px] py-[12px]"></div>
                </div>

                <div className="flex flex-col">
                    {currentProducts.map((product, index) => (
                        <ProductTableRow
                            key={product.id}
                            product={product}
                            isLast={index === currentProducts.length - 1}
                        />
                    ))}
                </div>
            </div>
            <div className="flex justify-between items-center">
                <div
                    className={`flex items-center gap-[8px] h-[20px] cursor-pointer ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={goToPrevPage}
                >
                    <Image src={arrowBack} alt={'image'} width={18} height={18}/>
                    <p className="text-[14px] text-[#667085] font-medium">Previous</p>
                </div>

                <div className="flex items-center gap-[8px]">
                    {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                        if (currentPage <= 3) {
                            return i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            return totalPages - 2 + i;
                        } else {
                            return currentPage - 1 + i;
                        }
                    }).map((pageNumber) => (
                        <div
                            key={pageNumber}
                            className={`flex items-center justify-center w-[24px] h-[24px] rounded-[4px] cursor-pointer ${
                                pageNumber === currentPage
                                    ? 'bg-[#ECFDF6] text-[022B23]'
                                    : 'text-[#667085] hover:bg-gray-100'
                            }`}
                            onClick={() => goToPage(pageNumber)}
                        >
                            <p className="text-[12px] font-medium">{pageNumber}</p>
                        </div>
                    ))}

                    {totalPages > 3 && currentPage < totalPages - 2 && (
                        <span className="text-[#667085]">...</span>
                    )}

                    {totalPages > 3 && currentPage < totalPages - 2 && (
                        <div
                            className={`flex items-center justify-center w-[24px] h-[24px] rounded-[4px] cursor-pointer ${
                                totalPages === currentPage
                                    ? 'bg-[#ECFDF6] text-[#022B23]'
                                    : 'text-[#667085] hover:bg-gray-100'
                            }`}
                            onClick={() => goToPage(totalPages)}
                        >
                            <p className="text-[12px] font-medium">{totalPages}</p>
                        </div>
                    )}
                </div>

                <div
                    className={`flex items-center gap-[8px] h-[20px] cursor-pointer ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={goToNextPage}
                >
                    <p className="text-[14px] text-[#667085] font-medium">Next</p>
                    <Image src={arrowRight} alt={'image'} width={18} height={18}/>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-[32px] py-[10px]">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-[#8C8C8C] text-[10px] h-[38px] border-[0.5px] border-[#ededed] rounded-[8px]">
                    <div
                        className={`flex items-center justify-center w-[98px] h-full cursor-pointer ${
                            activeView === 'New-item'
                                ? 'border-r-[1px] border-[#ededed] rounded-tl-[8px] rounded-bl-[8px] bg-[#F8FAFB] text-[#8C8C8C]'
                                : ''
                        }`}
                        onClick={() => {
                            setActiveView('New-item');
                            setViewMode('edit');
                            router.push('/vendor/dashboard/shop');
                        }}
                    >
                        <p>New Item</p>
                    </div>
                    <div
                        className={`flex items-center justify-center w-[147px] h-full cursor-pointer ${
                            activeView === 'Products-management'
                                ? 'border-l-[1px] border-[#ededed] rounded-tr-[8px] rounded-br-[8px] bg-[#F8FAFB] text-[#8C8C8C]'
                                : ''
                        }`}
                        onClick={() => {
                            setActiveView('Products-management');
                            router.push('/vendor/dashboard/shop?tab=product');
                        }}
                    >
                        <p>Products management</p>
                    </div>
                </div>

                {activeView === 'Products-management' && (
                    <DropDown
                        options={timeFilters}
                        selected={selectedFilter}
                        onSelect={setSelectedFilter}
                        className="w-[150px]"
                    />
                )}
            </div>

            <div className="">
                {activeView === 'New-item' ? renderNewItemView() : renderProductsManagementView()}
            </div>
        </div>
    );
};

export default NewProductView;