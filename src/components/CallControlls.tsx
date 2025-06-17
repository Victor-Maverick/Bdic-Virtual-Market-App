'use client';
import { Phone, Video } from 'lucide-react';

interface CallControlsProps {
    vendorId: string;
    productId: string;
    vendorName: string;
    onCallStart: (type: 'audio' | 'video') => void;
}

const CallControls = ({vendorName, onCallStart }: CallControlsProps) => {
    return (
        <div className="flex items-center gap-[10px]">
            <button
                onClick={() => onCallStart('audio')}
                className="flex items-center justify-center bg-[#022B23] w-[48px] h-[48px] rounded-[12px]"
                title={`Call ${vendorName}`}
            >
                <Phone className="text-[#C6EB5F]" size={20} />
            </button>
            <button
                onClick={() => onCallStart('video')}
                className="flex items-center justify-center bg-[#022B23] w-[48px] h-[48px] rounded-[12px]"
                title={`Video call ${vendorName}`}
            >
                <Video className="text-[#C6EB5F]" size={20} />
            </button>
        </div>
    );
};

export default CallControls;
