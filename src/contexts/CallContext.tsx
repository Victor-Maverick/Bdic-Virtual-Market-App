'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface CallState {
  roomName: string;
  callType: 'voice' | 'video';
  status: 'initiating' | 'ringing' | 'active' | 'ended' | 'declined' | 'missed';
  participants: string[];
  endedBy?: string; // Track who ended/declined the call
  message?: string; // Message to show to users
  autoCloseDelay?: number; // Delay in milliseconds before auto-closing modal
}

interface CallContextType {
  activeCall: CallState | null;
  setActiveCall: (call: CallState | null) => void;
  endCall: (roomName: string, reason: 'ended' | 'declined' | 'missed', endedBy?: string) => void;
  isCallActive: (roomName: string) => boolean;
  onCallStatusChange: (callback: (call: CallState | null) => void) => () => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const useCallContext = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCallContext must be used within a CallProvider');
  }
  return context;
};

interface CallProviderProps {
  children: ReactNode;
}

export const CallProvider: React.FC<CallProviderProps> = ({ children }) => {
  const [activeCall, setActiveCallState] = useState<CallState | null>(null);
  const [statusChangeCallbacks, setStatusChangeCallbacks] = useState<Set<(call: CallState | null) => void>>(new Set());

  const setActiveCall = useCallback((call: CallState | null) => {
    console.log('🔄 CallContext: Setting active call:', call);
    setActiveCallState(call);
    
    // Notify all listeners
    statusChangeCallbacks.forEach(callback => {
      try {
        callback(call);
      } catch (error) {
        console.error('Error in call status callback:', error);
      }
    });
  }, [statusChangeCallbacks]);

  const endCall = useCallback((roomName: string, reason: 'ended' | 'declined' | 'missed', endedBy?: string) => {
    console.log(`🔄 CallContext: Ending call ${roomName} - reason: ${reason}, endedBy: ${endedBy}`);
    
    if (activeCall && activeCall.roomName === roomName) {
      let message = '';
      let autoCloseDelay = 0;
      
      // Set appropriate message and delay based on reason and who ended it
      switch (reason) {
        case 'ended':
          if (endedBy && endedBy !== activeCall.participants[0]) {
            message = 'Call ended by other participant';
            autoCloseDelay = 2000; // 2 seconds
          } else {
            message = 'Call ended';
            autoCloseDelay = 0; // Close immediately for self-ended calls
          }
          break;
        case 'declined':
          message = 'Call declined';
          autoCloseDelay = 2000; // 2 seconds
          break;
        case 'missed':
          message = 'Call ended';
          autoCloseDelay = 0; // Close immediately for missed calls
          break;
      }
      
      const updatedCall = { 
        ...activeCall, 
        status: reason as CallState['status'],
        endedBy,
        message,
        autoCloseDelay
      };
      setActiveCall(updatedCall);
      
      // Auto-close after specified delay
      setTimeout(() => {
        setActiveCall(null);
      }, autoCloseDelay || 100);
    }
  }, [activeCall, setActiveCall]);

  const isCallActive = useCallback((roomName: string) => {
    return activeCall?.roomName === roomName && 
           ['initiating', 'ringing', 'active'].includes(activeCall.status);
  }, [activeCall]);

  const onCallStatusChange = useCallback((callback: (call: CallState | null) => void) => {
    setStatusChangeCallbacks(prev => new Set([...prev, callback]));
    
    // Return cleanup function
    return () => {
      setStatusChangeCallbacks(prev => {
        const newSet = new Set(prev);
        newSet.delete(callback);
        return newSet;
      });
    };
  }, []);

  const value: CallContextType = {
    activeCall,
    setActiveCall,
    endCall,
    isCallActive,
    onCallStatusChange
  };

  return (
    <CallContext.Provider value={value}>
      {children}
    </CallContext.Provider>
  );
};