'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { videoCallService } from '@/services/videoCallService';
import { voiceCallService } from '@/services/voiceCallService';

const CallServiceDiagnostic: React.FC = () => {
  const { data: session } = useSession();
  const [diagnostics, setDiagnostics] = useState({
    videoService: false,
    voiceService: false,
    websocketVideo: false,
    websocketVoice: false,
    apiBaseUrl: '',
    userEmail: '',
    loading: true
  });

  useEffect(() => {
    const runDiagnostics = async () => {
      if (!session?.user?.email) return;

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const userEmail = session.user.email;

      console.log('🔍 Running call service diagnostics...');
      console.log('🔍 API Base URL:', apiBaseUrl);
      console.log('🔍 User Email:', userEmail);

      // Test video service
      let videoServiceAvailable = false;
      try {
        const response = await fetch(`${apiBaseUrl}/health/webrtc/video`);
        videoServiceAvailable = response.ok;
      } catch (error) {
        console.error('🔍 Video service test failed:', error);
      }
      console.log('🔍 Video service available:', videoServiceAvailable);

      // Test voice service
      let voiceServiceAvailable = false;
      try {
        const response = await fetch(`${apiBaseUrl}/health/webrtc/voice`);
        voiceServiceAvailable = response.ok;
      } catch (error) {
        console.error('🔍 Voice service test failed:', error);
      }
      console.log('🔍 Voice service available:', voiceServiceAvailable);

      // Test WebSocket connections
      const baseUrl = apiBaseUrl.replace('/api', '');
      const wsUrl = `${baseUrl}/ws`;
      
      console.log('🔍 WebSocket URL:', wsUrl);
      
      // Test WebSocket connection
      let websocketAvailable = false;
      try {
        const socket = new WebSocket(wsUrl.replace('http', 'ws'));
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            socket.close();
            reject(new Error('WebSocket connection timeout'));
          }, 5000);
          
          socket.onopen = () => {
            clearTimeout(timeout);
            websocketAvailable = true;
            socket.close();
            resolve(true);
          };
          
          socket.onerror = (error) => {
            clearTimeout(timeout);
            reject(error);
          };
        });
      } catch (error) {
        console.error('🔍 WebSocket test failed:', error);
      }
      console.log('🔍 WebSocket available:', websocketAvailable);

      setDiagnostics({
        videoService: videoServiceAvailable,
        voiceService: voiceServiceAvailable,
        websocketVideo: websocketAvailable,
        websocketVoice: websocketAvailable,
        apiBaseUrl,
        userEmail,
        loading: false
      });
    };

    runDiagnostics();
  }, [session?.user?.email]);

  if (!session?.user?.email) {
    return (
      <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded shadow-lg max-w-sm">
        <div className="font-bold text-sm">Call Service Diagnostic</div>
        <div className="text-xs">Please log in to run diagnostics</div>
      </div>
    );
  }

  if (diagnostics.loading) {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded shadow-lg max-w-sm">
        <div className="font-bold text-sm">Call Service Diagnostic</div>
        <div className="text-xs">Running diagnostics...</div>
      </div>
    );
  }

  const allServicesWorking = diagnostics.videoService && diagnostics.voiceService && diagnostics.websocketVideo;

  return (
    <div className={`fixed bottom-4 right-4 border px-4 py-3 rounded shadow-lg max-w-sm ${
      allServicesWorking 
        ? 'bg-green-100 border-green-400 text-green-700' 
        : 'bg-red-100 border-red-400 text-red-700'
    }`}>
      <div className="font-bold text-sm mb-2">Call Service Diagnostic</div>
      <div className="text-xs space-y-1">
        <div>API URL: {diagnostics.apiBaseUrl}</div>
        <div>User: {diagnostics.userEmail}</div>
        <div className="flex items-center">
          <span className={`w-2 h-2 rounded-full mr-2 ${diagnostics.videoService ? 'bg-green-500' : 'bg-red-500'}`}></span>
          Video Service: {diagnostics.videoService ? 'Available' : 'Unavailable'}
        </div>
        <div className="flex items-center">
          <span className={`w-2 h-2 rounded-full mr-2 ${diagnostics.voiceService ? 'bg-green-500' : 'bg-red-500'}`}></span>
          Voice Service: {diagnostics.voiceService ? 'Available' : 'Unavailable'}
        </div>
        <div className="flex items-center">
          <span className={`w-2 h-2 rounded-full mr-2 ${diagnostics.websocketVideo ? 'bg-green-500' : 'bg-red-500'}`}></span>
          WebSocket: {diagnostics.websocketVideo ? 'Connected' : 'Failed'}
        </div>
        {!allServicesWorking && (
          <div className="mt-2 text-xs">
            <div className="font-semibold">Possible Issues:</div>
            <ul className="list-disc list-inside">
              <li>Call service not running</li>
              <li>Network connectivity issues</li>
              <li>CORS configuration problems</li>
              <li>Backend service unavailable</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallServiceDiagnostic;