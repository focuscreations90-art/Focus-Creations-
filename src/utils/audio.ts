let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let recordingStartTime: number = 0;

export interface RecordingResult {
  audioUrl: string;
  durationSeconds: number;
  blob: Blob;
}

export async function startAudioRecording(): Promise<void> {
  audioChunks = [];
  recordingStartTime = Date.now();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  
  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      audioChunks.push(event.data);
    }
  };

  mediaRecorder.start();
}

export function stopAudioRecording(): Promise<RecordingResult> {
  return new Promise((resolve, reject) => {
    if (!mediaRecorder) {
      reject(new Error('MediaRecorder not initialized'));
      return;
    }

    const durationSeconds = Math.max(1, Math.round((Date.now() - recordingStartTime) / 1000));

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);

      // Stop tracks
      mediaRecorder?.stream.getTracks().forEach(track => track.stop());
      mediaRecorder = null;

      resolve({
        audioUrl,
        durationSeconds,
        blob: audioBlob
      });
    };

    mediaRecorder.stop();
  });
}

export function cancelAudioRecording(): void {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
    mediaRecorder.stop();
  }
  mediaRecorder = null;
  audioChunks = [];
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function generateWaveformHeights(count: number = 24): number[] {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 70) + 30);
}
