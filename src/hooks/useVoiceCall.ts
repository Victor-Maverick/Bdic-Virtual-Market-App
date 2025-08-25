import { useWebRTCVoiceCall, UseWebRTCVoiceCallProps } from './useWebRTCVoiceCall';

export interface UseVoiceCallProps {
  userEmail: string;
  displayName: string;
  onCallEnd?: () => void;
  onError?: (error: string) => void;
}

export const useVoiceCall = (props: UseVoiceCallProps) => {
  // Use the new WebRTC implementation
  return useWebRTCVoiceCall(props);
};