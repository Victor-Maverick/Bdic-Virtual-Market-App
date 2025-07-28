'use client';
import { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from 'lucide-react';

// Note: You'll need to install agora-rtc-react and agora-rtc-sdk-ng
// npm install agora-rtc-react agora-rtc-sdk-ng

interface VideoCallProps {
    channelName: string;
    userEmail: string;
    otherUserEmail: string;
    onEndCall: () => void;
    isIncoming?: boolean;
}

const VideoCall: React.FC<VideoCallProps> = ({
    otherUserEmail,
    onEndCall,
    isIncoming = false
}) => {
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isCallActive, setIsCallActive] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    
    const localVideoRef = useRef<HTMLDivElement>(null);
    const remoteVideoRef = useRef<HTMLDivElement>(null);
    const callStartTime = useRef<number>(0);

    // This is a placeholder implementation
    // In a real app, you'd integrate with Agora.io, Twilio, or similar service
    
    useEffect(() => {
        if (isCallActive) {
            callStartTime.current = Date.now();
            const interval = setInterval(() => {
                setCallDuration(Math.floor((Date.now() - callStartTime.current) / 1000));
            }, 1000);
            
            return () => clearInterval(interval);
        }
    }, [isCallActive]);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerCall = () => {
        setIsCallActive(true);
        // Initialize video call here
        initializeCall();
    };

    const handleEndCall = () => {
        setIsCallActive(false);
        // Clean up video call resources
        cleanupCall();
        onEndCall();
    };

    const initializeCall = async () => {
        try {
            // This is where you'd initialize Agora.io or your chosen video service
            console.log('Initializing video call...');
            
            // Example Agora.io initialization (you'd need to implement this):
            /*
            const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
            await client.join(APP_ID, channelName, TOKEN, UID);
            
            const localVideoTrack = await AgoraRTC.createCameraVideoTrack();
            const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            
            await client.publish([localVideoTrack, localAudioTrack]);
            localVideoTrack.play(localVideoRef.current);
            */
            
        } catch (error) {
            console.error('Failed to initialize call:', error);
        }
    };

    const cleanupCall = () => {
        // Clean up video call resources
        console.log('Cleaning up video call...');
    };

    const toggleVideo = () => {
        setIsVideoEnabled(!isVideoEnabled);
        // Toggle video track
    };

    const toggleAudio = () => {
        setIsAudioEnabled(!isAudioEnabled);
        // Toggle audio track
    };

    if (isIncoming && !isCallActive) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 text-center max-w-sm w-full mx-4">
                    <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-600">
                            {otherUserEmail.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2">Incoming Video Call</h3>
                    <p className="text-gray-600 mb-6">{otherUserEmail}</p>
                    
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleEndCall}
                            className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full"
                        >
                            <PhoneOff size={24} />
                        </button>
                        <button
                            onClick={handleAnswerCall}
                            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full"
                        >
                            <Phone size={24} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* Call Header */}
            <div className="bg-black bg-opacity-50 text-white p-4 flex justify-between items-center">
                <div>
                    <h3 className="font-semibold">{otherUserEmail}</h3>
                    <p className="text-sm opacity-75">
                        {isCallActive ? formatDuration(callDuration) : 'Connecting...'}
                    </p>
                </div>
            </div>

            {/* Video Area */}
            <div className="flex-1 relative">
                {/* Remote Video */}
                <div 
                    ref={remoteVideoRef}
                    className="w-full h-full bg-gray-900 flex items-center justify-center"
                >
                    <div className="text-white text-center">
                        <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-4xl font-bold">
                                {otherUserEmail.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <p>Waiting for {otherUserEmail} to join...</p>
                    </div>
                </div>

                {/* Local Video (Picture-in-Picture) */}
                <div 
                    ref={localVideoRef}
                    className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden"
                >
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white text-sm">
                        You
                    </div>
                </div>
            </div>

            {/* Call Controls */}
            <div className="bg-black bg-opacity-75 p-6 flex justify-center gap-4">
                <button
                    onClick={toggleAudio}
                    className={`p-4 rounded-full ${
                        isAudioEnabled 
                            ? 'bg-gray-600 hover:bg-gray-700' 
                            : 'bg-red-500 hover:bg-red-600'
                    } text-white`}
                >
                    {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
                </button>

                <button
                    onClick={toggleVideo}
                    className={`p-4 rounded-full ${
                        isVideoEnabled 
                            ? 'bg-gray-600 hover:bg-gray-700' 
                            : 'bg-red-500 hover:bg-red-600'
                    } text-white`}
                >
                    {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
                </button>

                <button
                    onClick={handleEndCall}
                    className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full"
                >
                    <PhoneOff size={24} />
                </button>
            </div>
        </div>
    );
};

export default VideoCall;