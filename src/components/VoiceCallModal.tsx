'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, PhoneOff, Mic, MicOff } from 'lucide-react';
import { VoiceCallResponse, voiceCallService } from '@/services/voiceCallService';
import { useVoiceCallNotifications } from '@/hooks/useVoiceCallNotifications';
import AudioUtils from '@/utils/audioUtils';

// Twilio types
declare global {
  interface Window {
    Twilio: {
      Video: {
        connect: (token: string, options: unknown) => Promise<TwilioRoom>;
      };
    };
  }
}

interface TwilioRoom {
  participants: Map<string, TwilioParticipant>;
  on: (event: string, callback: (participant: TwilioParticipant) => void) => void;
  disconnect: () => void;
}

interface TwilioParticipant {
  identity: string;
  audioTracks: Map<string, TwilioTrackPublication>;
  on: (event: string, callback: (track: TwilioTrack) => void) => void;
}

interface TwilioTrackPublication {
  isSubscribed: boolean;
  track: TwilioTrack | null;
}

interface TwilioTrack {
  kind: 'audio' | 'video';
  attach: () => HTMLAudioElement;
  detach: () => HTMLAudioElement[];
}

interface VoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  call: VoiceCallResponse | null;
  userEmail: string;
  userType: 'buyer' | 'vendor';
}

const VoiceCallModal: React.FC<VoiceCallModalProps> = ({
                                                         isOpen,
                                                         onClose,
                                                         call,
                                                         userEmail,
                                                         userType,
                                                       }) => {
  const [localCallStatus, setLocalCallStatus] = useState<string>('Connecting...');
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioTrack, setAudioTrack] = useState<MediaStreamTrack | null>(null);
  const [otherPartyJoined, setOtherPartyJoined] = useState(false);
  const [, setCallStartTime] = useState<number | null>(null);
  const [twilioRoom, setTwilioRoom] = useState<TwilioRoom | null>(null);
  const [isInitiator, setIsInitiator] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { callStatus: notificationCallStatus, clearCallStatus } = useVoiceCallNotifications();

  // Define cleanup function first
  const cleanup = useCallback(() => {
    console.log('Cleaning up voice call resources');

    // Disconnect Twilio room
    if (twilioRoom) {
      twilioRoom.disconnect();
      setTwilioRoom(null);
    }

    // Stop local audio track
    if (audioTrack) {
      audioTrack.stop();
      setAudioTrack(null);
    }

    // Clear timeouts and intervals
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }

    // Remove all voice call audio elements from DOM
    const audioElements = document.querySelectorAll('audio[data-voice-call-audio="true"]');
    audioElements.forEach((element) => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });

    // Reset state
    setIsConnected(false);
    setOtherPartyJoined(false);
    setIsMuted(false);
    setCallStartTime(null);
    setCallDuration(0);
    setIsInitiator(false);
  }, [twilioRoom, audioTrack]);

  // Define handleEndCall function
  const handleEndCall = useCallback(async () => {
    if (!call) return;

    try {
      // Play call end sound
      AudioUtils.playCallEndSound();

      // Close modal immediately for better UX
      cleanup();
      onClose();

      // Then handle the backend cleanup
      await voiceCallService.endCall(call.roomName, userEmail);
    } catch (error) {
      console.error('Error ending call:', error);
      // Ensure modal is closed even if there's an error
      cleanup();
      onClose();
    }
  }, [call, userEmail, cleanup, onClose]);

  const attachAudioTrack = useCallback((track: TwilioTrack) => {
    try {
      const audioElement = track.attach();
      audioElement.volume = 1.0;
      audioElement.autoplay = true;
      audioElement.controls = false;
      audioElement.style.display = 'none';

      // Add unique identifier for cleanup
      audioElement.setAttribute('data-voice-call-audio', 'true');

      // Ensure audio plays
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise
            .then(() => {
              console.log('Audio playback started successfully');
            })
            .catch((error: unknown) => {
              console.error('Error starting audio playback:', error);
              // Try to play again after user interaction
              document.addEventListener(
                  'click',
                  () => {
                    audioElement.play().catch(console.error);
                  },
                  { once: true }
              );
            });
      }

      document.body.appendChild(audioElement);
    } catch (error) {
      console.error('Error attaching audio track:', error);
    }
  }, []);

  const detachAudioTrack = useCallback((track: TwilioTrack) => {
    try {
      const attachedElements = track.detach();
      attachedElements.forEach((element: HTMLAudioElement) => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    } catch (error) {
      console.error('Error detaching audio track:', error);
    }
  }, []);


  // Define handleParticipantAudio function
  const handleParticipantAudio = useCallback(
      (participant: TwilioParticipant) => {
        console.log('Setting up audio for participant:', participant.identity);

        // Handle existing audio tracks
        participant.audioTracks.forEach((publication: TwilioTrackPublication) => {
          if (publication.isSubscribed && publication.track) {
            attachAudioTrack(publication.track);
          }
        });

        // Handle new track subscriptions
        participant.on('trackSubscribed', (track: TwilioTrack) => {
          console.log('Track subscribed:', track.kind);
          if (track.kind === 'audio') {
            attachAudioTrack(track);
          }
        });

        // Handle track unsubscriptions
        participant.on('trackUnsubscribed', (track: TwilioTrack) => {
          console.log('Track unsubscribed:', track.kind);
          if (track.kind === 'audio') {
            detachAudioTrack(track);
          }
        });
      },
      [attachAudioTrack, detachAudioTrack]
  );

  // Define handleMissedCall function
  const handleMissedCall = useCallback(async () => {
    if (!call) return;

    try {
      // Close modal immediately for better UX
      cleanup();
      onClose();

      // Then mark as missed call in backend
      await voiceCallService.endCall(call.roomName, userEmail);
      console.log('Call marked as missed after 30 seconds');
    } catch (error) {
      console.error('Error marking call as missed:', error);
      // Ensure modal is closed even if there's an error
      cleanup();
      onClose();
    }
  }, [call, userEmail, cleanup, onClose]);


  const initializeCall = useCallback(async () => {
    if (!call) return;

    try {
      setLocalCallStatus('Connecting...');

      // Get user media for audio with enhanced settings
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1,
        },
      });
      const track = stream.getAudioTracks()[0];

      // Set audio track constraints for better quality
      track.applyConstraints({
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      });

      setAudioTrack(track);

      // Join the call and get Twilio token
      const tokenResponse = await voiceCallService.joinCall(call.roomName, userEmail);

      // Initialize Twilio Voice SDK
      if (typeof window !== 'undefined' && window.Twilio && window.Twilio.Video) {
        try {
          const room = await window.Twilio.Video.connect(tokenResponse.token, {
            name: call.roomName,
            audio: {
              track: track,
            },
            video: false, // Voice only
            dominantSpeaker: true,
            maxAudioBitrate: 16000,
            preferredAudioCodecs: ['opus', 'PCMU'],
          });

          setTwilioRoom(room);

          // Handle existing participants
          room.participants.forEach((participant: TwilioParticipant) => {
            console.log('Existing participant found:', participant.identity);
            setOtherPartyJoined(true);
            handleParticipantAudio(participant);
          });

          // Handle new participants joining
          room.on('participantConnected', (participant: TwilioParticipant) => {
            console.log('Participant connected:', participant.identity);
            setOtherPartyJoined(true);
            handleParticipantAudio(participant);
          });

          // Handle participants leaving
          room.on('participantDisconnected', (participant: TwilioParticipant) => {
            console.log('Participant disconnected:', participant.identity);
            const wasInCall = otherPartyJoined;
            setOtherPartyJoined(false);

            // If other party left after joining, end call immediately
            if (wasInCall) {
              console.log('🎤 Other party left, ending call immediately');
              setLocalCallStatus('Call ended');
              handleEndCall();
            }
          });

          setIsConnected(true);

          // Set status based on existing participants
          if (room.participants.size > 0) {
            setOtherPartyJoined(true);
            setLocalCallStatus('In call');
          } else {
            if (isInitiator) {
              setLocalCallStatus('Calling...');
            } else {
              setLocalCallStatus('Connected - waiting for caller');
            }
          }
        } catch (twilioError) {
          console.error('Twilio connection error:', twilioError);
          setLocalCallStatus('Audio connection failed - trying fallback');

          // Fall back to basic connection without Twilio
          setIsConnected(true);
          if (isInitiator) {
            setLocalCallStatus('Calling... (limited audio)');
          } else {
            setLocalCallStatus('Connected (limited audio)');
          }
        }
      } else {
        console.warn('Twilio SDK not loaded, using fallback mode');
        setIsConnected(true);
        if (isInitiator) {
          setLocalCallStatus('Calling... (no audio)');
        } else {
          setLocalCallStatus('Connected (no audio)');
        }
      }
    } catch (error: unknown) {
      console.error('Error initializing voice call:', error);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (error.name === 'NotAllowedError') {
        setLocalCallStatus('Microphone access denied');
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
      } else if (error.name === 'NotFoundError') {
        setLocalCallStatus('No microphone found');
      } else {
        setLocalCallStatus('Connection failed');
      }

      setTimeout(() => {
        handleEndCall();
      }, 3000);
    }
  }, [call, userEmail, handleEndCall, handleParticipantAudio, isInitiator, otherPartyJoined]);

  useEffect(() => {
    if (isOpen && call) {
      setCallStartTime(Date.now());

      // Determine if this user is the initiator
      const initiator = userType === 'buyer';
      setIsInitiator(initiator);

      // Set initial status based on role
      if (initiator) {
        setLocalCallStatus('Calling...');
      } else {
        setLocalCallStatus('Incoming call');
      }

      // Load Twilio SDK if not already loaded
      if (typeof window !== 'undefined' && !window.Twilio) {
        const script = document.createElement('script');
        script.src = 'https://sdk.twilio.com/js/video/releases/2.28.1/twilio-video.min.js';
        script.onload = () => {
          console.log('Twilio SDK loaded');
          initializeCall();
        };
        script.onerror = () => {
          console.error('Failed to load Twilio SDK');
          initializeCall(); // Try to initialize anyway
        };
        document.head.appendChild(script);
      } else {
        initializeCall();
      }

      // Set 30-second timeout for missed call (only for initiator)
      if (initiator) {
        timeoutRef.current = setTimeout(() => {
          if (!otherPartyJoined) {
            console.log('30 seconds passed without other party joining - marking as missed');
            handleMissedCall();
          }
        }, 30000);
      }
    }

    return () => {
      cleanup();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      // Clean up audio utils
      AudioUtils.cleanup();
    };
  }, [isOpen, call, cleanup, handleMissedCall, initializeCall, otherPartyJoined, userType]);

  // Monitor other party joining to clear timeout and start call duration
  useEffect(() => {
    if (otherPartyJoined) {
      // Clear the missed call timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Start call duration counter
      setCallDuration(0);
      durationIntervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      setLocalCallStatus('In call');
    } else {
      // Stop duration counter when other party leaves
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
    }
  }, [otherPartyJoined]);

  // Handle call status changes from backend
  useEffect(() => {
    if (notificationCallStatus && isOpen && call) {
      console.log('🎤 VoiceCallModal: Received call status:', notificationCallStatus);

      // Check if this status update is for our current call
      const isForCurrentCall = notificationCallStatus.roomName === call.roomName;

      if (isForCurrentCall) {
        if (notificationCallStatus.type === 'CALL_ENDED') {
          clearCallStatus();
          cleanup();
          onClose();
        } else if (notificationCallStatus.type === 'CALL_DECLINED') {
          console.log('🎤 VoiceCallModal: Call declined, closing modal immediately');
          clearCallStatus();
          cleanup();
          onClose();
        } else if (notificationCallStatus.type === 'CALL_MISSED') {
          console.log('🎤 VoiceCallModal: Call missed, closing modal immediately');
          clearCallStatus();
          cleanup();
          onClose();
        }
      }
    }
  }, [notificationCallStatus, isOpen, call, onClose, clearCallStatus, cleanup]);

  // Periodic status revalidation every 5 seconds as fallback
  useEffect(() => {
    if (!isOpen || !call) return;

    const statusCheckInterval = setInterval(async () => {
      try {
        console.log('🎤 VoiceCallModal: Performing periodic status check for room:', call.roomName);

        // Get current call status from backend
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/voice-calls/status/${call.roomName}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
        );

        if (response.ok) {
          const callData = await response.json();
          console.log('🎤 VoiceCallModal: Periodic status check result:', callData.status);

          // Check if call has ended, been declined, or missed
          if (callData.status === 'ENDED' || callData.status === 'DECLINED' || callData.status === 'MISSED') {
            console.log('🎤 VoiceCallModal: Call status changed to', callData.status, '- closing modal');
            cleanup();
            onClose();
          }
        }
      } catch (error) {
        console.error('🎤 VoiceCallModal: Error during periodic status check:', error);
      }
    }, 5000); // Check every 5 seconds

    return () => {
      clearInterval(statusCheckInterval);
    };
  }, [isOpen, call, onClose, cleanup]);

  const handleDeclineCall = async () => {
    if (!call) return;

    try {
      // Play call end sound
      AudioUtils.playCallEndSound();

      // Close modal immediately for better UX
      cleanup();
      onClose();

      // Then handle the backend cleanup
      await voiceCallService.declineCall(call.roomName, userEmail);
    } catch (error) {
      console.error('Error declining call:', error);
      // Ensure modal is closed even if there's an error
      cleanup();
      onClose();
    }
  };

  const toggleMute = () => {
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
      console.log('Microphone', audioTrack.enabled ? 'unmuted' : 'muted');
    }
  };

  const formatCallDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getOtherPartyName = () => {
    if (userType === 'buyer') {
      return call?.vendorEmail?.split('@')[0] || 'Vendor';
    } else {
      return call?.buyerEmail?.split('@')[0] || 'Customer';
    }
  };

  if (!isOpen || !call) return null;

  return (
      <div className="bg-[#808080]/40 fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 text-center">
          {/* Call Status */}
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <Phone size={40} className="text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{getOtherPartyName()}</h2>
            <p className="text-gray-600 mb-2">{localCallStatus}</p>
            {otherPartyJoined && (
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center mb-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    <p className="text-sm text-green-600 font-medium">Connected</p>
                  </div>
                  <p className="text-lg font-mono text-gray-800">{formatCallDuration(callDuration)}</p>
                </div>
            )}
            {!otherPartyJoined && isInitiator && isConnected && (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                  <p className="text-sm text-blue-600">Waiting for answer...</p>
                </div>
            )}
          </div>

          {/* Product/Shop Info */}
          {(call.productName || call.shopName) && (
              <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  {call.productName ? `About: ${call.productName}` : `Shop: ${call.shopName}`}
                </p>
              </div>
          )}

          {/* Call Controls */}
          <div className="flex justify-center gap-4">
            {/* Mute Button */}
            {isConnected && (
                <button
                    onClick={toggleMute}
                    className={`p-4 rounded-full ${
                        isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                    } hover:bg-opacity-80 transition-colors`}
                    title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </button>
            )}

            {/* End Call Button */}
            <button
                onClick={handleEndCall}
                className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                title="End Call"
            >
              <PhoneOff size={24} />
            </button>

            {/* Decline Button (for incoming calls) */}
            {userType === 'vendor' && !isConnected && (
                <button
                    onClick={handleDeclineCall}
                    className="p-4 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
                    title="Decline Call"
                >
                  <PhoneOff size={24} />
                </button>
            )}
          </div>

          {/* Connection Status */}
          {!isConnected && localCallStatus === 'Connecting...' && (
              <div className="mt-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
              </div>
          )}
        </div>
      </div>
  );
};

export default VoiceCallModal;