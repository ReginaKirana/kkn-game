import React, { useRef, useState, useEffect } from 'react';
import { Camera, Download, RefreshCw } from 'lucide-react';

export default function Photobooth() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "user" }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Tidak dapat mengakses kamera. Pastikan Anda memberikan izin akses.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const drawPoliceLine = (ctx: CanvasRenderingContext2D, width: number, height: number, yPos: number, text: string) => {
    const tapeHeight = 60;

    // Background yellow
    ctx.fillStyle = '#facc15'; // yellow-400
    ctx.fillRect(0, yPos, width, tapeHeight);

    // Black stripes
    ctx.fillStyle = '#000000';
    const stripeWidth = 40;
    const spacing = 80;

    ctx.save();
    // Move to yPos to clip properly if needed, but we can just draw paths
    ctx.beginPath();
    ctx.rect(0, yPos, width, tapeHeight);
    ctx.clip();

    for (let x = -100; x < width + 100; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, yPos);
      ctx.lineTo(x + stripeWidth, yPos);
      ctx.lineTo(x + stripeWidth - 20, yPos + tapeHeight);
      ctx.lineTo(x - 20, yPos + tapeHeight);
      ctx.fill();
    }

    // Text overlay on tape
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 24px "Courier New", Courier, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw text multiple times along the tape
    for (let i = 1; i < 5; i++) {
      ctx.fillText(text, (width / 5) * i, yPos + tapeHeight / 2);
    }

    ctx.restore();
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video frame
    ctx.translate(width, 0); // Mirror horizontally
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, width, height);
    ctx.translate(width, 0); // Reset transform
    ctx.scale(-1, 1);

    // Draw frame overlays
    // 1. Top and Bottom Police Tape
    drawPoliceLine(ctx, width, height, 0, "CAUTION - DETEKTIF SAMPAH");
    drawPoliceLine(ctx, width, height, height - 60, "CAUTION - DETEKTIF SAMPAH");

    // 2. Grunge/Stamp Text: "DETEKTIF SAMPAH"
    ctx.save();
    ctx.translate(40, 100);
    ctx.rotate(-0.1);
    ctx.fillStyle = '#dc2626'; // red-600 for stamp
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 4;
    ctx.font = 'bold 48px "Courier New", Courier, monospace';
    ctx.textAlign = 'left';
    ctx.fillText("DETEKTIF SAMPAH", 20, 50);
    ctx.strokeRect(0, 0, 480, 80);
    // inner rect for stamp effect
    ctx.lineWidth = 2;
    ctx.strokeRect(6, 6, 468, 68);
    ctx.restore();

    // 3. User requested text: "KKN Universitas Diponegoro Desa Cibelok 2026"
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    const bottomText = "KKN Universitas Diponegoro Desa Cibelok 2026";
    // Draw text with stroke for visibility
    ctx.strokeText(bottomText, width / 2, height - 80);
    ctx.fillText(bottomText, width / 2, height - 80);

    setHasPhoto(true);
  };

  const retake = () => {
    setHasPhoto(false);
  };

  const downloadPhoto = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'photobooth-detektif-sampah.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <Camera size={36} color="var(--primary)" />
          Photobooth Detektif Sampah
        </h1>
        <p style={{ color: '#475569' }}>Ambil fotomu dengan bingkai keren bertema Detektif Sampah!</p>
      </div>

      <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', backgroundColor: '#000', maxWidth: '896px', width: '100%', aspectRatio: '16/9', border: '4px solid #1e293b' }}>

        {/* Video element - hidden when photo is taken */}
        <video
          ref={videoRef}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)', display: hasPhoto ? 'none' : 'block' }} // Mirror view for user
          autoPlay
          playsInline
        ></video>

        {/* CSS UI overlays just for preview (simulates what will be drawn on canvas) */}
        {!hasPhoto && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
            {/* Top Police tape preview */}
            <div style={{ position: 'absolute', top: 0, left: 0, height: '60px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-around', fontFamily: 'monospace', fontWeight: 'bold', color: '#000', fontSize: '1.25rem', background: 'repeating-linear-gradient(45deg, #facc15, #facc15 30px, #000000 30px, #000000 60px)' }}>
              <span style={{ backgroundColor: '#facc15', padding: '0 8px', borderRadius: '4px' }}>CAUTION - DETEKTIF SAMPAH</span>
              <span style={{ backgroundColor: '#facc15', padding: '0 8px', borderRadius: '4px' }}>CAUTION - DETEKTIF SAMPAH</span>
              <span style={{ backgroundColor: '#facc15', padding: '0 8px', borderRadius: '4px' }}>CAUTION - DETEKTIF SAMPAH</span>
            </div>

            {/* Stamp Preview */}
            <div style={{ position: 'absolute', top: '100px', left: '40px', transform: 'rotate(-6deg)' }}>
              <div style={{ border: '4px solid #dc2626', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ border: '2px solid #dc2626', padding: '4px 16px', color: '#dc2626', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '2.25rem', whiteSpace: 'nowrap' }}>
                  DETEKTIF SAMPAH
                </div>
              </div>
            </div>

            {/* Bottom Text Preview */}
            <div style={{ position: 'absolute', bottom: '80px', width: '100%', textAlign: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1.5rem', textShadow: '0 2px 4px rgba(0,0,0,1)', padding: '0 16px' }}>
              <span style={{ WebkitTextStroke: '1px black' }}>KKN Universitas Diponegoro Desa Cibelok 2026</span>
            </div>

            {/* Bottom Police tape preview */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, height: '60px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-around', fontFamily: 'monospace', fontWeight: 'bold', color: '#000', fontSize: '1.25rem', background: 'repeating-linear-gradient(45deg, #facc15, #facc15 30px, #000000 30px, #000000 60px)' }}>
              <span style={{ backgroundColor: '#facc15', padding: '0 8px', borderRadius: '4px' }}>CAUTION - DETEKTIF SAMPAH</span>
              <span style={{ backgroundColor: '#facc15', padding: '0 8px', borderRadius: '4px' }}>CAUTION - DETEKTIF SAMPAH</span>
              <span style={{ backgroundColor: '#facc15', padding: '0 8px', borderRadius: '4px' }}>CAUTION - DETEKTIF SAMPAH</span>
            </div>
          </div>
        )}

        {/* Canvas element - hidden when photo is not yet taken */}
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: hasPhoto ? 'block' : 'none' }}
        ></canvas>

      </div>

      <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
        {!hasPhoto ? (
          <button
            onClick={takePhoto}
            className="btn btn-primary"
            style={{ padding: '12px 32px', borderRadius: '9999px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
          >
            <Camera size={24} />
            Ambil Foto
          </button>
        ) : (
          <>
            <button
              onClick={retake}
              className="btn btn-secondary"
              style={{ padding: '12px 24px', borderRadius: '9999px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
            >
              <RefreshCw size={24} />
              Ulangi
            </button>
            <button
              onClick={downloadPhoto}
              className="btn btn-primary"
              style={{ backgroundColor: '#2563eb', padding: '12px 24px', borderRadius: '9999px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
            >
              <Download size={24} />
              Unduh Foto
            </button>
          </>
        )}
      </div>
    </div>
  );
}
