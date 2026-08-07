import React, { useRef, useState, useEffect } from 'react';
import { Camera, Download, RefreshCw } from 'lucide-react';

export default function Photobooth() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasPhoto, setHasPhoto] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: "user" }
        });
        
        if (!isMounted) {
          mediaStream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error accessing camera:", err);
          alert("Tidak dapat mengakses kamera. Pastikan Anda memberikan izin akses.");
        }
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const drawPoliceLine = (ctx: CanvasRenderingContext2D, width: number, height: number, yPos: number, text: string) => {
    const tapeHeight = 60;
    
    // Create a stripe pattern
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 60;
    patternCanvas.height = 60;
    const pctx = patternCanvas.getContext('2d');
    if (pctx) {
      pctx.fillStyle = '#facc15'; // yellow
      pctx.fillRect(0, 0, 60, 60);
      pctx.fillStyle = '#000000'; // black
      pctx.beginPath();
      // Draw 45 degree thick line
      pctx.moveTo(0, 60);
      pctx.lineTo(30, 60);
      pctx.lineTo(60, 30);
      pctx.lineTo(60, 0);
      pctx.lineTo(30, 0);
      pctx.lineTo(0, 30);
      pctx.fill();
    }
    
    const pattern = ctx.createPattern(patternCanvas, 'repeat-x');
    if (pattern) {
      ctx.fillStyle = pattern;
      ctx.fillRect(0, yPos, width, tapeHeight);
    }
    
    // Draw text badges over the tape
    ctx.font = 'bold 20px "Courier New", Courier, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let i = 1; i < 4; i++) {
      const textX = (width / 4) * i;
      const textY = yPos + tapeHeight / 2;
      const textWidth = ctx.measureText(text).width;
      
      // Black background for text
      ctx.fillStyle = '#000';
      ctx.fillRect(textX - textWidth/2 - 10, textY - 14, textWidth + 20, 28);
      
      // Yellow text
      ctx.fillStyle = '#facc15';
      ctx.fillText(text, textX, textY);
    }
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
    ctx.translate(60, 120);
    ctx.rotate(-0.1);
    
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 6;
    ctx.strokeRect(0, 0, 420, 80);
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 8, 404, 64);
    
    ctx.fillStyle = '#dc2626'; // red-600 for stamp
    ctx.font = 'bold 42px "Courier New", Courier, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText("DETEKTIF SAMPAH", 210, 40);
    ctx.restore();

    // 3. User requested text: "KKN Universitas Diponegoro Desa Cibelok 2026"
    // Draw black pill for text
    const bottomText = "KKN Universitas Diponegoro Desa Cibelok 2026";
    ctx.font = 'bold 24px sans-serif';
    const textMetrics = ctx.measureText(bottomText);
    const textWidth = textMetrics.width;
    const paddingX = 30;
    const paddingY = 15;
    
    const pillX = width / 2 - textWidth / 2 - paddingX;
    const pillY = height - 120 - paddingY;
    const pillWidth = textWidth + paddingX * 2;
    const pillHeight = 30 + paddingY * 2;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillWidth, pillHeight, pillHeight / 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#facc15'; // yellow border
    ctx.stroke();

    // Draw text inside pill
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(bottomText, width / 2, pillY + pillHeight / 2);

    setHasPhoto(true);
  };

  const retake = () => {
    setHasPhoto(false);
  };

  const downloadPhoto = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png');

    // Try Web Share API first (best for iOS/iPad)
    if (navigator.share) {
      try {
        const arr = dataUrl.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'image/png';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const file = new File([u8arr], 'photobooth-detektif.png', { type: mime });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Photobooth Detektif',
          });
          return; // Share successful, exit
        }
      } catch (err) {
        console.error('Error sharing via Web Share API:', err);
        // Fall back to normal download on error
      }
    }

    // Fallback for browsers that don't support Web Share API or if it fails
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'photobooth-detektif.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <style>{`
        .photobooth-container {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          background-color: #000;
          max-width: 896px;
          width: 100%;
          aspect-ratio: 16/9;
          border: 4px solid #1e293b;
        }
        .police-tape {
          position: absolute;
          left: 0;
          height: 60px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-around;
          font-family: monospace;
          font-weight: bold;
          color: #facc15;
          font-size: 1.25rem;
          background: repeating-linear-gradient(-45deg, #facc15, #facc15 30px, #000000 30px, #000000 60px);
        }
        .police-text {
          background-color: #000;
          padding: 4px 12px;
        }
        .police-text.hide-mobile {
          display: inline;
        }
        @media (max-width: 640px) {
          .photobooth-container {
            aspect-ratio: 3/4; /* Portrait on mobile */
          }
          .police-tape {
            height: 40px;
            font-size: 0.9rem;
            background: repeating-linear-gradient(-45deg, #facc15, #facc15 20px, #000000 20px, #000000 40px);
          }
          .police-text {
            padding: 2px 8px;
          }
          .police-text.hide-mobile {
            display: none; /* Hide extra text on small screens */
          }
        }
      `}</style>
      
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <Camera size={36} color="var(--primary)" />
          Photobooth Detektif
        </h1>
        <p style={{ color: '#475569' }}>Ambil fotomu dengan bingkai keren bertema Detektif Sampah!</p>
      </div>

      <div className="photobooth-container">
        
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
            <div className="police-tape" style={{ top: 0 }}>
              <span className="police-text hide-mobile">CAUTION - DETEKTIF SAMPAH</span>
              <span className="police-text">CAUTION - DETEKTIF SAMPAH</span>
              <span className="police-text hide-mobile">CAUTION - DETEKTIF SAMPAH</span>
            </div>

            {/* Bottom Police tape preview */}
            <div className="police-tape" style={{ bottom: 0 }}>
              <span className="police-text hide-mobile">CAUTION - DETEKTIF SAMPAH</span>
              <span className="police-text">CAUTION - DETEKTIF SAMPAH</span>
              <span className="police-text hide-mobile">CAUTION - DETEKTIF SAMPAH</span>
            </div>
          </div>
        )}

        {/* Canvas element - hidden when photo is not yet taken */}
        <canvas 
          ref={canvasRef} 
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: hasPhoto ? 'block' : 'none' }}
        ></canvas>

      </div>

      <div style={{ marginTop: '32px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
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
