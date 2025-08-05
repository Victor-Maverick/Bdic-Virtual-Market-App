'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { voiceCallService, VoiceCallResponse } from '@/services/voiceCallService';
import { useVoiceCallContext } from '@/providers/VoiceCallProvider';

const VoiceCallNotifications: React.FC = () => {
  const { data: session } = useSession();
  const { hasIncomingCall, acceptPendingCall } = useVoiceCallContext();
  const [pendingCalls, setPendingCalls] = useState<VoiceCallResponse[]>([]);
  const [showPendingCalls, setShowPendingCalls] = useState(false);
  const [isVendor, setIsVendor] = useState(false);

  const fetchPendingCalls = useCallback(async () => {
    if (!session?.user?.email) return;

    try {
      // Fetch pending calls for the current user (works for both vendors and buyers)
      const calls = await voiceCallService.getPendingCalls(session.user.email);
      console.log('🎤 Fetched pending voice calls:', calls);
      setPendingCalls(calls);
    } catch (error) {
      console.error('❌ Error fetching pending voice calls:', error);
    }
  }, [session?.user?.email]);

  // Check if user is a vendor (adjust this logic based on your user role system)
  useEffect(() => {
    if (session?.user?.email) {
      // For now, showing for all authenticated users - both vendors and buyers can receive calls
      setIsVendor(true);
    }
  }, [session?.user]);

  useEffect(() => {
    if (session?.user?.email && isVendor) {
      fetchPendingCalls();
      // Keep the 5-second polling for real-time updates
      const interval = setInterval(fetchPendingCalls, 5000);
      return () => clearInterval(interval);
    }
  }, [session?.user?.email, isVendor, fetchPendingCalls]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.pending-voice-calls-container')) {
        setShowPendingCalls(false);
      }
    };

    if (showPendingCalls) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPendingCalls]);

  const handleAcceptPendingCall = async (call: VoiceCallResponse) => {
    try {
      console.log('🎯 Accepting pending voice call:', call);

      // Use the VoiceCallProvider to open the voice call modal
      acceptPendingCall(call);

      // Remove from pending calls
      setPendingCalls(prev => prev.filter(c => c.id !== call.id));
      setShowPendingCalls(false);

    } catch (error) {
      console.error('❌ Error accepting voice call:', error);
      alert('Failed to join the voice call. Please try again.');
    }
  };

  const handleDeclinePendingCall = async (call: VoiceCallResponse) => {
    try {
      await voiceCallService.declineCall(call.roomName, session?.user?.email || '');

      // Remove from pending calls
      setPendingCalls(prev => prev.filter(c => c.id !== call.id));

      console.log('Declined voice call:', call.roomName);
    } catch (error) {
      console.error('Error declining voice call:', error);
      alert('Failed to decline the voice call. Please try again.');
    }
  };



  // Only show for vendors
  if (!session?.user?.email || !isVendor) return null;

  return (
      <div className="fixed top-4 right-20 z-50 pending-voice-calls-container">
        {/* Real-time Incoming Call Indicator - Shows immediately when call comes in */}
        {hasIncomingCall && (
            <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg mb-2 animate-pulse border-2 border-green-300">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-sm font-medium">Incoming voice call!</span>
              </div>
            </div>
        )}

        {/* Persistent Pending Voice Calls Count - Always visible when there are pending calls */}
        {pendingCalls.length > 0 && !hasIncomingCall && (
              <div
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg shadow-xl cursor-pointer transition-all duration-300 animate-pulse border-2 border-green-300 transform hover:scale-105"
                  onClick={() => setShowPendingCalls(!showPendingCalls)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-2 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <div>
                      <div className="text-sm font-bold">
                        {pendingCalls.length} Pending Voice Call{pendingCalls.length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs opacity-90">
                        Click to view and respond
                      </div>
                    </div>
                  </div>
                  <svg
                      className={`w-4 h-4 transition-transform ${showPendingCalls ? 'rotate-180' : ''}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
          )}

          {/* Enhanced Pending Voice Calls Dropdown */}
          {showPendingCalls && pendingCalls.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-xl mt-2 max-w-sm min-w-80">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    Pending Voice Calls ({pendingCalls.length})
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">These voice calls are waiting for your response</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {pendingCalls.map((call) => (
                      <div key={call.id} className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {call.buyerEmail}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(call.createdAt).toLocaleTimeString()} - {new Date(call.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="ml-11">
                              {call.productId && (
                                  <div className="flex items-center mb-1">
                                    <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                    </svg>
                                    <span className="text-xs text-green-600 font-medium">Product Voice Call</span>
                                  </div>
                              )}
                              {call.shopId && !call.productId && (
                                  <div className="flex items-center mb-1">
                                    <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                    </svg>
                                    <span className="text-xs text-green-600 font-medium">Shop Voice Call</span>
                                  </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2 ml-3">
                            <button
                                onClick={() => handleAcceptPendingCall(call)}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center"
                            >
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                              </svg>
                              Accept
                            </button>
                            <button
                                onClick={() => handleDeclinePendingCall(call)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center"
                            >
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              Decline
                            </button>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
                <div className="p-3 bg-gray-50 text-center">
                  <p className="text-xs text-gray-500">
                    Voice calls will automatically expire after 45 seconds
                  </p>
                </div>
              </div>
          )}
      </div>
  );
};

export default VoiceCallNotifications;