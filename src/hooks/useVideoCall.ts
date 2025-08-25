import { useWebRTCVideoCall, UseWebRTCVideoCallProps } from './useWebRTCVideoCall';

export interface UseVideoCallProps {
  userEmail: string;
  displayName: string;
  onCallEnd?: () => void;
  onError?: (error: string) => void;
}

export const useVideoCall = (props: UseVideoCallProps) => {
  // Use the new WebRTC implementation
  return useWebRTCVideoCall(props);
};