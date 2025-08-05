// Audio utility functions for voice calls

export class AudioUtils {
  private static audioContext: AudioContext | null = null;
  private static incomingCallSoundCount = 0;

  // Initialize audio context
  private static getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return this.audioContext;
  }

  // Play incoming call notification sound
  static playIncomingCallSound(): void {
    try {
      // Reset counter and play sound 3 times
      this.incomingCallSoundCount = 0;
      this.playIncomingCallTone();
    } catch (error) {
      console.error('Error playing incoming call sound:', error);
    }
  }

  private static playIncomingCallTone(): void {
    if (this.incomingCallSoundCount >= 3) return;

    try {
      const ctx = this.getAudioContext();
      
      // Create a pleasant incoming call tone
      const oscillator1 = ctx.createOscillator();
      const oscillator2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Create a chord (C major)
      oscillator1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      oscillator2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);

      oscillator1.start(ctx.currentTime);
      oscillator2.start(ctx.currentTime);
      oscillator1.stop(ctx.currentTime + 0.5);
      oscillator2.stop(ctx.currentTime + 0.5);

      this.incomingCallSoundCount++;

      // Repeat the sound if count is less than 3
      if (this.incomingCallSoundCount < 3) {
        setTimeout(() => this.playIncomingCallTone(), 1000);
      }
    } catch (error) {
      console.error('Error playing incoming call tone:', error);
    }
  }

  // Play call end sound
  static playCallEndSound(): void {
    try {
      const ctx = this.getAudioContext();
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Descending tone for call end
      oscillator.frequency.setValueAtTime(400, ctx.currentTime);
      oscillator.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.3);

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (error) {
      console.error('Error playing call end sound:', error);
    }
  }

  // Test if audio is working
  static async testAudio(): Promise<boolean> {
    try {
      const ctx = this.getAudioContext();
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(440, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);

      return true;
    } catch (error) {
      console.error('Audio test failed:', error);
      return false;
    }
  }

  // Request microphone permission and test
  static async testMicrophone(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Stop the stream immediately after testing
      stream.getTracks().forEach(track => track.stop());
      
      return true;
    } catch (error) {
      console.error('Microphone test failed:', error);
      return false;
    }
  }

  // Clean up audio context
  static cleanup(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export default AudioUtils;