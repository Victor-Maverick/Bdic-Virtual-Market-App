
const Toast = ({
                   type,
                   message,
                   subMessage,
                   onClose,
               }: {
    type: "success" | "error";
    message: string;
    subMessage: string;
    onClose: () => void;
}) => {
    const errorIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
        >
            <circle cx="12" cy="12" r="12" fill="#F44336" />
            <path
                d="M15.54 8.46a.75.75 0 0 0-1.06 0L12 10.94 9.52 8.46a.75.75 0 1 0-1.06 1.06L10.94 12l-2.48 2.48a.75.75 0 1 0 1.06 1.06L12 13.06l2.48 2.48a.75.75 0 0 0 1.06-1.06L13.06 12l2.48-2.48a.75.75 0 0 0 0-1.06z"
                fill="#fff"
            />
        </svg>
    );

    const successIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
        >
            <circle cx="12" cy="12" r="12" fill="#4CAF50" />
            <path
                d="M10 13.172l7.071-7.071 1.414 1.414L10 16 5.515 11.515l1.414-1.414L10 13.172z"
                fill="#fff"
            />
        </svg>
    );

    return (
        <div
            className={`fixed top-6 right-6 w-[243px] bg-white ${
                type === "success" ? "h-auto" : "h-[138px]"
            } rounded-md shadow-lg z-50 border border-[#ededed]`}
        >
            <div className="flex w-full gap-[16px] px-[16px] py-[12px]">
                <div className="flex items-center justify-center w-6 h-6 rounded-full">
                    {type === "success" ? successIcon : errorIcon}
                </div>
                <div className="flex-1">
                    <p className="text-[#001234] text-[12px] font-medium">{message}</p>
                    <p className="text-[11px] text-[#707070] font-medium">{subMessage}</p>
                    {type === "error" && (
                        <button
                            onClick={onClose}
                            className="mt-[10px] text-[#022B23] text-[12px] font-medium"
                        >
                            Try again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Toast;