'use client';
import { Star } from 'lucide-react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductDetailHeader from '@/components/productDetailHeader';
import ProductDetailHeroBar from '@/components/productDetailHeroBar';
import NavigationBar from '@/components/navigationBar';
import MarketProductCard from '@/components/marketProductCard';
import { useCart } from '@/context/CartContext';
import vendorImg from '../../../../../public/assets/images/vendorImg.svg';
import verify from '../../../../../public/assets/images/verify.svg';
import locationImg from '../../../../../public/assets/images/location.png';
import shopImg from '../../../../../public/assets/images/shop.png';
import chatIcon from '../../../../../public/assets/images/chatIcon.png';
import bag from '../../../../../public/assets/images/market-place-bag.png';
import wishlist from '../../../../../public/assets/images/wishHeart.png';
import orangeCircle from '../../../../../public/assets/images/orangeCirlce.png';
import greenVerify from '../../../../../public/assets/images/limeVerify.png';
import { useSession } from 'next-auth/react';

interface Review {
    id: number;
    rating: number;
    comment: string;
    reviewerProfileUrl: string;
    reviewerFirstName: string;
    reviewerLastName: string;
    reviewedAt: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
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
    reviews: Review[];
}
const DELIVERY_FEE = 0;

const formatReviewDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    // Add ordinal suffix to day
    const getOrdinalSuffix = (day: number) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    return `${day}${getOrdinalSuffix(day)} ${month}. ${year}`;
};

interface RatingData {
    stars: number;
    count: number;
}

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const storeTotalAmount = (amount: number) => {
    const paymentData = {
        amount,
        timestamp: new Date().getTime()
    };
    localStorage.setItem('expectedPayment', JSON.stringify(paymentData));
};


const ProductDetails = ({ params }: PageProps) => {
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [productId, setProductId] = useState<string | null>(null);
    const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
    const [productReviews, setProductReviews] = useState<Review[]>([]);
    const router = useRouter();
    const { data: session } = useSession();
    const ratingDistribution = calculateRatingDistribution(productReviews);
    const averageRating = calculateAverageRating(productReviews);
    const totalReviewsCount = productReviews.length;

    const fetchSuggestedProducts = async (subCategoryName: string) => {
        try {
            if (!subCategoryName) {
                setSuggestedProducts([]);
                return;
            }
            const response = await axios.get<Product[]>(
                `https://digitalmarket.benuestate.gov.ng/api/products/by-subcategoryName?subCategoryName=${encodeURIComponent(subCategoryName)}`,
                { headers: { 'Content-Type': 'application/json' } }
            );
            if (response.data && Array.isArray(response.data)) {
                const filtered = response.data.slice(0, 5);
                setSuggestedProducts(filtered);
            }
        } catch (error) {
            console.error('Error fetching suggested products:', error);
            setSuggestedProducts([]);
        }
    };

    useEffect(() => {
        if (product?.subCategory) {
            fetchSuggestedProducts(product.subCategory);
        }
    }, [product?.subCategory]);

    const handleTextVendor = () => {
        if (!session?.user?.email) {
            toast.error('Please log in to chat with the vendor');
            router.push('/login');
            return;
        }
        if (session.user.email === product?.vendorEmail) {
            toast.error('You cannot chat with yourself');
            return;
        }
        router.push(`/chat?vendorEmail=${encodeURIComponent(product?.vendorEmail || '')}&buyerEmail=${encodeURIComponent(session.user.email)}`);
    };

    const handleAddToCart = async () => {
        if (!product) return;
        if (session?.user?.email && product.vendorEmail === session.user.email) {
            toast.error('You cannot add your own product to cart');
            return;
        }
        try {
            await addToCart({
                productId: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.mainImageUrl,
                description: product.description,
            });
            toast.success(`${product.name} added to cart!`);
            router.push('/cart');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error('Failed to add item to cart');
        }
    };

    const handleAddToWishlist = async () => {
        if (!product) {
            toast.error('Product not found');
            return;
        }
        if (!session?.user?.email) {
            toast.error('You need to be logged in to add items to your wishlist');
            return;
        }
        if (product.vendorEmail === session.user.email) {
            toast.error('You cannot add your own product to wishlist');
            return;
        }
        try {
            const response = await axios.post('https://digitalmarket.benuestate.gov.ng/api/orders/add-to-wishlist', {
                buyerEmail: session.user.email,
                productId: product.id,
            });
            toast.success(response.data.message || 'Added to wishlist successfully');
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            toast.error(axios.isAxiosError(error) ? error.response?.data?.message || 'Already added to wishlist' : 'Failed to add to wishlist');
        }
    };

    useEffect(() => {
        const extractParams = async () => {
            const resolvedParams = await params;
            setProductId(resolvedParams.id);
        };
        extractParams();
    }, [params]);

    useEffect(() => {
        if (!productId) return;
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`https://digitalmarket.benuestate.gov.ng/api/products/${productId}`);
                if (response.data) {
                    setProduct(response.data);
                    setProductReviews(response.data.reviews);
                    console.log("ProducT: ",response.data);
                } else {
                    throw new Error(response.data.message || 'Failed to fetch product');
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const handleBuyNow = async () => {
        if (!product) return;
        if (session?.user?.email && product.vendorEmail === session.user.email) {
            toast.error('You cannot buy your own product to cart');
            return;
        }

        setIsLoading(true);
        try {
            const totalAmount = product.price + DELIVERY_FEE;
            storeTotalAmount(totalAmount);

            const requestData = {
                email: session?.user?.email,
                amount: totalAmount * 100,
                currency: 'NGN',
                callbackUrl: `${window.location.origin}/productsuccess`,
                metadata: {
                    productId: product.id,
                    productName: product.name,
                    price: product.price,
                    isBuyNow: true
                }
            };
            localStorage.setItem("productId", String(product.id))

            const response = await axios.post(
                'https://digitalmarket.benuestate.gov.ng/api/payments/initialize',
                requestData
            );

            if (response.data.data?.authorizationUrl) {
                window.location.href = response.data.data.authorizationUrl;
            } else {
                throw new Error('Payment initialization failed');
            }
        } catch (error) {
            console.error('Buy Now error:', error);
            toast.error(error instanceof Error ? error.message : 'Payment failed');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, i) => {
            const fillColor = i < Math.floor(rating) ? '#E5A000' : 'none';
            return <Star key={i} fill={fillColor} stroke='#E5A000' className='w-[20px] h-[19px]' />;
        });
    };

    if (loading || !productId) {
        return <div className='flex justify-center items-center h-screen'>Loading product details...</div>;
    }
    if (error) {
        return <div className='flex justify-center items-center h-screen'>Error: {error}</div>;
    }
    if (!product) {
        return <div className='flex justify-center items-center h-screen'>Product not found</div>;
    }

    const productImages = [
        product.mainImageUrl,
        product.sideImage1Url,
        product.sideImage2Url,
        product.sideImage3Url,
        product.sideImage4Url,
    ].filter(Boolean);


    return (
        <>
            <ProductDetailHeader />
            <ProductDetailHeroBar />
            <NavigationBar page={` // ${product.subCategory} //`} name={product.name} />
            <div className='flex flex-col lg:flex-row gap-4 lg:gap-[10px] px-4 sm:px-6 md:px-8 lg:px-[100px]'>
                <div className='flex-col items-center w-full lg:w-auto'>
                    <div className='w-full lg:w-[719px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[749px] bg-[#F9F9F9] mb-[10px] overflow-hidden rounded-lg'>
                        {productImages.length > 0 && (
                            <Image
                                src={productImages[0] || '/placeholder.svg'}
                                alt={product.name}
                                width={719}
                                height={749}
                                className='w-full h-full object-cover'
                                style={{ objectPosition: 'center' }}
                            />
                        )}
                    </div>
                    <div className='flex items-center gap-2 lg:gap-[8px] mb-2 overflow-x-auto'>
                        {productImages.slice(1, 4).map((image, index) => (
                            <div
                                key={index}
                                className='flex-shrink-0 w-[100px] sm:w-[150px] lg:w-[235px] h-[100px] sm:h-[150px] lg:h-[235px] bg-[#F9F9F9] overflow-hidden rounded-lg'
                            >
                                <Image
                                    src={image || '/placeholder.svg'}
                                    alt={product.name}
                                    width={235}
                                    height={235}
                                    className='w-full h-full object-cover'
                                    style={{ objectPosition: 'center' }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className='flex-col justify-start pt-4 lg:pt-[40px] w-full lg:w-auto'>
                    <h1 className='text-2xl sm:text-3xl lg:text-[36px] font-medium mb-2'>{product.name}</h1>
                    <p className='font-semibold text-xl sm:text-2xl lg:text-[26px] mb-4'>₦{product.price.toLocaleString()}</p>
                    <div className='border-y border-[#ededed] py-[8px] px-[8px] mt-4 lg:mt-[30px]'>
                        <p className='font-medium'>Description</p>
                    </div>
                    <p className='text-sm lg:text-[14px] text-gray-700 mt-2 mb-4'>{product.description}</p>
                    <div className='mb-6'>
                        {product.quantity < 5 ? (
                            <p className='text-red-600 font-medium text-sm'>Few units left</p>
                        ) : (
                            <p className='text-green-600 font-medium text-sm'>In stock</p>
                        )}
                    </div>
                    <div className='border border-[#ededed] rounded-3xl p-4 lg:p-0 lg:h-[260px] mt-6 lg:mt-[40px]'>
                        <div className='flex items-center border-b border-[#ededed] px-0 lg:px-[20px] pt-0 lg:pt-[10px] justify-between pb-4 lg:pb-[8px]'>
                            <div className='flex gap-[8px]'>
                                <Image src={vendorImg || '/placeholder.svg'} alt='vendor' width={40} height={40} />
                                <div className='flex-col'>
                                    <p className='text-[12px] text-[#707070]'>Vendor</p>
                                    <p className='text-[16px] font-normal mt-[-4px]'>{product.vendorName}</p>
                                </div>
                            </div>
                            <div className='w-[74px] p-[6px] gap-[4px] h-[30px] bg-[#C6EB5F] rounded-[8px] flex items-center'>
                                <Image src={verify || '/placeholder.svg'} alt='verified' />
                                <p className='text-[12px]'>verified</p>
                            </div>
                        </div>
                        <div className='px-0 lg:px-[20px] flex items-center gap-[4px] mt-4 lg:mt-[20px]'>
                            <Image src={locationImg || '/placeholder.svg'} alt='location' width={18} height={18} />
                            <p className='text-[14px] font-light'>{product.market}, {product.city}</p>
                        </div>
                        <div className='flex flex-col sm:flex-row px-0 lg:px-[20px] mt-3 lg:mt-[15px] gap-2 lg:gap-[18px]'>
                            <div className='flex items-center gap-[4px]'>
                                <Image src={shopImg || '/placeholder.svg'} alt='shop' width={18} height={18} />
                                <p className='text-[14px] font-light'>{product.shopName} Shop {product.shopNumber}</p>
                            </div>
                            <div className='flex items-center gap-[4px]'>
                                <Image src={shopImg || '/placeholder.svg'} alt='shop' width={18} height={18} />
                                <p className='text-[14px] font-light'>{product.marketSection}</p>
                            </div>
                        </div>
                        <div className='px-0 lg:px-[20px] w-full lg:w-[300px] gap-3 lg:gap-[14px] mt-6 lg:mt-[50px] flex flex-col sm:flex-row items-center'>
                            <div
                                onClick={handleTextVendor}
                                className='flex items-center gap-[10px] justify-center bg-[#ffeebe] rounded-[14px] w-full sm:w-[165px] h-[48px] cursor-pointer'
                            >
                                <p className='text-[#461602] font-semibold text-[14px]'>Text vendor</p>
                                <Image src={chatIcon || '/placeholder.svg'} alt='chat' />
                            </div>
                            <div className='w-full sm:w-[121px] h-[48px] rounded-[12px] flex border-[2px] border-[#461602] justify-center items-center'>
                                <p className='text-[#461602] font-semibold text-[14px]'>Call vendor</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col sm:flex-row items-center gap-4 lg:gap-[30px] mt-6 lg:mt-[25px]'>
                        <div
                            onClick={handleBuyNow}
                            className='flex items-center bg-[#022B23] w-full sm:w-[209px] h-[48px] justify-center rounded-[12px] cursor-pointer'
                        >
                            <p className='text-[#C6EB5F] text-[14px] font-semibold'>
                                {isLoading ? 'Processing...' : 'Buy now'}
                            </p>
                        </div>
                        <div className='flex items-center gap-4'>
                            <div
                                onClick={handleAddToCart}
                                className='w-full sm:w-[127px] cursor-pointer flex items-center justify-center h-[48px] gap-[10px] rounded-[12px] border-[2px] border-[#022B23]'
                            >
                                <p className='text-#022B23] text-[15px] font-bold'>Add to cart</p>
                                <Image src={bag || '/placeholder.svg'} alt='cart' width={18} height={18} />
                            </div>
                            <div
                                onClick={handleAddToWishlist}
                                className='h-[48px] w-[48px] border-[2px] border-[#022B23] rounded-[12px] flex items-center justify-center cursor-pointer'
                            >
                                <Image src={wishlist || '/placeholder.svg'} alt='wishlist' width={26} height={26} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {suggestedProducts.length > 0 && (
                <div className='px-4 sm:px-6 md:px-8 lg:px-[100px] mt-8 lg:mt-[40px]'>
                    <p className='font-medium text-[16px] mb-[18px]'>Suggested products</p>
                    <div className='flex gap-[15px] py-3 rounded-b-3xl overflow-x-auto'>
                        {suggestedProducts.map((suggestedProduct) => (
                            <div key={suggestedProduct.id} className='flex-shrink-0'>
                                <MarketProductCard
                                    id={suggestedProduct.id}
                                    name={suggestedProduct.name}
                                    image={suggestedProduct.mainImageUrl}
                                    price={suggestedProduct.price.toLocaleString()}
                                    imageHeight={200}
                                    height={330}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className='flex-col px-4 sm:px-6 md:px-8 lg:px-[100px] mt-8 lg:mt-[40px]'>
                <p className='font-medium text-[18px] mb-[20px]'>
                    Product reviews<span className='text-[#707070]'> ({productReviews.length})</span>
                </p>
                {productReviews.length > 0 ? (
                    <div className='flex flex-col lg:flex-row gap-4 lg:gap-[15px]'>
                        <div className='flex-col border-[0.5px] border-[#ededed] rounded-[14px] p-[10px] mb-4 w-full lg:w-auto'>
                        {productReviews.map((review, index) => (
                            <div
                                key={index}
                                className={`w-full lg:w-[655px] p-4 ${index !== productReviews.length - 1 ? 'border-b border-[#ededed]' : ''}`}
                            >
                                <div className='flex items-center justify-between'>
                                    <p className='text-gray-500 text-sm'>{formatReviewDate(review.reviewedAt)}</p>
                                    <div className='flex mt-1 gap-[7px]'>
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}
                                                fill={i < review.rating ? '#e7b66b' : 'none'}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className='flex items-center gap-[6px] mt-[10px]'>
                                    <Image src={review.reviewerProfileUrl || orangeCircle} alt='reviewer' width={31} height={31} />
                                    <p>{review.reviewerFirstName} {review.reviewerLastName}</p>
                                </div>
                                <p className='text-[#303030] text-[14px] mt-2'>{review.comment}</p>
                                <div className='w-[143px] mt-[10px] h-[30px] flex items-center justify-center gap-[4px] rounded-[8px]'>
                                    <Image src={greenVerify || '/placeholder.svg'} alt='verified' />
                                    <p className='text-[#52A43E] text-sm'>verified purchase</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='bg-white rounded-[14px] h-auto lg:h-[265px] w-full lg:w-[500px] border-[0.5px] border-[#ededed] p-[20px]'>
                        <p className='font-medium text-[#0D0C22] text-[14px]'>Product reviews</p>
                        <div className='flex items-center mt-0.5'>
                            <span className='text-[32px] font-bold'>{averageRating.toFixed(1)}</span>
                            <div className='flex ml-2 gap-[4px]'>{renderStars(averageRating)}</div>
                        </div>
                        <p className='text-[#858585] text-[12px] mb-4 mt-1'>({totalReviewsCount} Reviews)</p>
                        <div className='mt-2 space-y-1'>
                            {ratingDistribution.map(({ stars, count }) => (
                                <div key={stars} className='flex items-center'>
                                    <span className='text-[12px] w-[50px]'>{stars} stars</span>
                                    <div className='w-full bg-gray-200 rounded-full h-[6px] mx-2'>
                                        <div
                                            className='bg-[#E5A000] h-[6px] rounded-full'
                                            style={{
                                                width: `${totalReviewsCount > 0 ? (count / totalReviewsCount) * 100 : 0}%`
                                            }}
                                        />
                                    </div>
                                    <span className='text-[12px]'>{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                ) : (
                    <div className='border-[0.5px] border-[#ededed] rounded-[14px] p-6 text-center'>
                        <p className='text-gray-500'>No reviews yet</p>
                    </div>
                )}
            </div>
            <ToastContainer
                position='top-right'
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='light'
            />
        </>
    );
};

const calculateRatingDistribution = (reviews: Review[]): RatingData[] => {
    const ratingCounts = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
    };

    reviews.forEach((review) => {
        if (review.rating >= 1 && review.rating <= 5) {
            ratingCounts[review.rating as keyof typeof ratingCounts]++;
        }
    });

    return [
        { stars: 5, count: ratingCounts[5] },
        { stars: 4, count: ratingCounts[4] },
        { stars: 3, count: ratingCounts[3] },
        { stars: 2, count: ratingCounts[2] },
        { stars: 1, count: ratingCounts[1] },
    ];
};

const calculateAverageRating = (reviews: Review[]): number => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return sum / reviews.length;
};


export default ProductDetails;