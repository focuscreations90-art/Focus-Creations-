import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, Upload } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string, mediaName: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    setCapturedPhoto(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error', err);
      setCameraError('Camera access denied or unavailable. You can upload a photo file below.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleTakeSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedPhoto(dataUrl);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onCapture(event.target.result as string, file.name);
          onClose();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendCaptured = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto, `snapshot_${Date.now()}.jpg`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-yellow-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-yellow-500/10 flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-yellow-600/30 flex items-center justify-between bg-black/40">
          <div className="flex items-center space-x-2 text-yellow-400 font-bold text-sm">
            <Camera className="w-4 h-4 text-yellow-400" />
            <span>FOCUS Camera Capture</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewport / Captured Preview */}
        <div className="relative bg-black min-h-[300px] flex items-center justify-center overflow-hidden">
          {capturedPhoto ? (
            <img src={capturedPhoto} alt="Captured" className="w-full h-auto max-h-[400px] object-contain" />
          ) : cameraError ? (
            <div className="p-6 text-center text-neutral-400 text-xs max-w-xs">
              <p className="text-yellow-400 font-bold mb-2">{cameraError}</p>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-auto max-h-[400px] object-cover rounded-md"
            />
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-yellow-600/30 bg-neutral-950 flex items-center justify-between">
          <label className="cursor-pointer flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-yellow-500 text-xs font-bold transition">
            <Upload className="w-4 h-4 text-yellow-400" />
            <span>Upload File</span>
            <input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
          </label>

          {capturedPhoto ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCapturedPhoto(null)}
                className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-bold flex items-center space-x-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>
              <button
                onClick={handleSendCaptured}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs font-black uppercase tracking-wider flex items-center space-x-1 shadow-lg shadow-yellow-500/20 hover:brightness-110"
              >
                <Check className="w-4 h-4" />
                <span>Send Photo</span>
              </button>
            </div>
          ) : !cameraError ? (
            <button
              onClick={handleTakeSnapshot}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 text-black font-black text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-yellow-500/25 hover:scale-105 active:scale-95 transition"
            >
              <Camera className="w-4 h-4" />
              <span>Capture Photo</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
