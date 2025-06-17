// hooks/useAgora.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import AgoraRTC, {
    IAgoraRTCClient,
    IAgoraRTCRemoteUser,
    MicrophoneAudioTrackInitConfig,
    CameraVideoTrackInitConfig,
    IMicrophoneAudioTrack,
    ICameraVideoTrack,
    ILocalVideoTrack,
    ILocalAudioTrack,
} from 'agora-rtc-sdk-ng';

type UseAgoraReturn = {
    localAudioTrack: ILocalAudioTrack | null;
    localVideoTrack: ILocalVideoTrack | null;
    joined: boolean;
    remoteUsers: IAgoraRTCRemoteUser[];
    joinChannel: (channel: string, uid?: string | number | null) => Promise<boolean>;
    leaveChannel: () => Promise<void>;
};

export default function useAgora(): UseAgoraReturn {
    const [localVideoTrack, setLocalVideoTrack] = useState<ILocalVideoTrack | null>(null);
    const [localAudioTrack, setLocalAudioTrack] = useState<ILocalAudioTrack | null>(null);
    const [joined, setJoined] = useState<boolean>(false);
    const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
    const clientRef = useRef<IAgoraRTCClient | null>(null);

    const createLocalTracks = useCallback(
        async (
            audioConfig?: MicrophoneAudioTrackInitConfig,
            videoConfig?: CameraVideoTrackInitConfig
        ): Promise<[IMicrophoneAudioTrack, ICameraVideoTrack]> => {
            try {
                const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(
                    audioConfig,
                    videoConfig
                );
                setLocalAudioTrack(microphoneTrack);
                setLocalVideoTrack(cameraTrack);
                return [microphoneTrack, cameraTrack];
            } catch (error) {
                console.error('Failed to create local tracks:', error);
                throw new Error('Failed to access microphone/camera');
            }
        },
        []
    );

    const leaveChannel = useCallback(async (): Promise<void> => {
        if (!clientRef.current) return;

        try {
            // Stop and clean up local tracks
            localAudioTrack?.stop();
            localAudioTrack?.close();
            localVideoTrack?.stop();
            localVideoTrack?.close();

            await clientRef.current.leave();

            // Reset state
            setRemoteUsers([]);
            setLocalVideoTrack(null);
            setLocalAudioTrack(null);
            setJoined(false);
        } catch (error) {
            console.error('Failed to leave channel:', error);
            throw error;
        }
    }, [localAudioTrack, localVideoTrack]);

    const joinChannel = useCallback(
        async (channel: string, uid: string | number | null = null): Promise<boolean> => {
            if (!clientRef.current) return false;

            try {
                // 1. First get the token
                const params = new URLSearchParams({ channel });
                if (uid) params.append('uid', uid.toString());

                const response = await fetch(`/api/agora-token?${params.toString()}`);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || 'Failed to get token');
                }

                const { token } = await response.json();

                if (!token) {
                    throw new Error('No token received from server');
                }

                // 2. Create local tracks first
                const [audioTrack, videoTrack] = await createLocalTracks();

                // 3. Join the channel
                await clientRef.current.join(
                    process.env.NEXT_PUBLIC_AGORA_APP_ID!,
                    channel,
                    token,
                    uid || null
                );

                // 4. Verify we're joined before publishing
                if (clientRef.current.connectionState === 'CONNECTED') {
                    await clientRef.current.publish([audioTrack, videoTrack]);
                    setJoined(true);
                    return true;
                } else {
                    throw new Error('Failed to connect to channel');
                }
            } catch (error) {
                console.error('Failed to join channel:', error);
                await leaveChannel(); // Clean up on failure
                throw error;
            }
        },
        [createLocalTracks, leaveChannel]
    );


    useEffect(() => {
        // Initialize Agora client
        clientRef.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

        const handleUserPublished = async (
            user: IAgoraRTCRemoteUser,
            mediaType: 'audio' | 'video'
        ) => {
            try {
                await clientRef.current?.subscribe(user, mediaType);
                setRemoteUsers(prev => [...prev, user]);
            } catch (error) {
                console.error('Failed to subscribe to user:', error);
            }
        };

        const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
            setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
        };

        const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
            setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
        };

        // Setup event listeners
        clientRef.current.on('user-published', handleUserPublished);
        clientRef.current.on('user-unpublished', handleUserUnpublished);
        clientRef.current.on('user-left', handleUserLeft);

        return () => {
            // Cleanup on unmount
            if (clientRef.current) {
                clientRef.current.off('user-published', handleUserPublished);
                clientRef.current.off('user-unpublished', handleUserUnpublished);
                clientRef.current.off('user-left', handleUserLeft);

                // Leave channel if still joined
                if (joined) {
                    leaveChannel().catch(console.error);
                }
            }
        };
    }, [joined, leaveChannel]);

    return {
        localAudioTrack,
        localVideoTrack,
        joined,
        remoteUsers,
        joinChannel,
        leaveChannel,
    };
}