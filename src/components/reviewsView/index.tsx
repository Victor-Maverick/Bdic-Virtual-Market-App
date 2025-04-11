import Image, {StaticImageData} from "next/image";
import arrowDown from "../../../public/assets/images/arrowDown.png";
import iPhone from "../../../public/assets/images/blue14.png";

interface Product {
    id: number;
    image: StaticImageData;
    name: string;
    review: number;
    status: string; // Changed to string if you might have other statuses
    comment: string;
}

const ProductTableRow = ({
                             product,
                             isLast
                         }: {
    product: Product;
    isLast: boolean;
}) => {
    return (
        <div className={`flex h-[72px] ${!isLast ? 'border-b border-[#EAECF0]' : ''}`}>
            <div className="flex items-center w-[480px] pr-[24px] gap-3">
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

            <div className="flex items-center w-[120px] px-[24px]">
                <div className={`w-[55px] h-[22px] rounded-[8px] flex items-center justify-center ${
                    product.status === 'Active'
                        ? 'bg-[#ECFDF3] text-[#027A48]'
                        : 'bg-[#FEF3F2] text-[#FF5050]'
                }`}>
                    <p className="text-[12px] font-medium px-[24px]">{product.status}</p>
                </div>
            </div>
            <div className="flex items-center text-[#101828] text-[14px] w-[430px] px-[24px]">
                <p>{product.comment}</p>
            </div>
            <div className="flex items-center text-[#344054] text-[14px] w-[120px] px-[24px]">
                <p>{product.review}</p>
            </div>
        </div>
    );
};

const products = [
    { id: 1, image: iPhone, name: "iPhone 14 pro max", review: 4.2, status: "Active", comment: "I love the product..." },
    { id: 2, image: iPhone, name: "iPhone 14 pro max", review: 4.2, status: "Disabled", comment: "fair"},
    { id: 3, image: iPhone, name: "iPhone 14 pro max", review: 4.2, status: "Active", comment: "Didn’t get the performance i wanted" },
    { id: 4, image: iPhone, name: "iPhone 14 pro max", review: 4.2, status: "Active", comment: "I love the product..."},
    { id: 5, image: iPhone, name: "iPhone 14 pro max", review: 4.2, status: "Active", comment: "I love the product..."}
];

const ReviewsView =()=>{
    return(
        <>
            <div className="flex flex-col gap-[50px]">

                <div className="flex flex-col rounded-[24px] border-[1px] border-[#EAECF0]">
                    <div className="my-[20px] mx-[25px] flex flex-col">
                        <p className="text-[#101828] font-medium">Reviews (24)</p>
                        <p className="text-[#667085] text-[14px]">View reviews on products in your store</p>
                    </div>

                    <div className="flex h-[44px] bg-[#F9FAFB] border-b-[1px] border-[#EAECF0]">
                        <div className="flex items-center px-[24px] w-[480px] py-[12px] gap-[4px]">
                            <p className="text-[#667085] font-medium text-[12px]">Products</p>
                            <Image src={arrowDown} alt="Sort" width={12} height={12} />
                        </div>
                        <div className="flex items-center px-[24px] w-[120px] py-[12px]">
                            <p className="text-[#667085] font-medium text-[12px]">Status</p>
                        </div>
                        <div className="flex items-center px-[15px] w-[430px] py-[12px]">
                            <p className="text-[#667085] font-medium text-[12px]">Comment</p>
                        </div>
                        <div className="flex items-center px-[24px] w-[120px] py-[12px]">
                            <p className="text-[#667085] font-medium text-[12px]">Rating</p>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        {products.map((product, index) => (
                            <ProductTableRow
                                key={product.id}
                                product={product}
                                isLast={index === products.length - 1}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReviewsView;