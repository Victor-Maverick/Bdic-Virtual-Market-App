'use client';
import { X } from 'lucide-react';

interface CallDisplayProps {
    callType: 'audio' | 'video';
    localVideoRef: React.RefObject<HTMLVideoElement>;
    remoteVideoRef: React.RefObject<HTMLVideoElement>;
    onEndCall: () => void;
}

const CallDisplay = ({ callType, localVideoRef, remoteVideoRef, onEndCall }: CallDisplayProps) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-white rounded-[14px] p-[20px] w-[800px] h-[600px] relative">
                <button
                    onClick={onEndCall}
                    className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2"
                >
                    <X size={20} />
                </button>
                <div className="flex gap-[10px] h-full">
                    {callType === 'video' && (
                        <>
                            <video
                                ref={localVideoRef}
                                autoPlay
                                muted
                                className="w-[50%] h-full object-cover rounded-[8px]"
                            />
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                className="w-[50%] h-full object-cover rounded-[8px]"
                            />
                        </>
                    )}
                    {callType === 'audio' && (
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-[20px] font-semibold">Audio Call Active</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CallDisplay;