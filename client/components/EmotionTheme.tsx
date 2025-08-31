import { useEffect, useRef, useState } from "react";

export default function EmotionTheme() {
  const [enabled, setEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const loopRef = useRef<number | null>(null);

  const loadScripts = async () => {
    const load = (src: string) => new Promise<void>((res, rej) => {
      const s = document.createElement('script'); s.src = src; s.async = true; s.onload = () => res(); s.onerror = () => rej(); document.head.appendChild(s);
    });
    // TF.js + face-landmarks-detection
    await load('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.20.0/dist/tf.min.js');
    await load('https://cdn.jsdelivr.net/npm/@tensorflow-models/face-landmarks-detection@1.0.3/dist/face-landmarks-detection.min.js');
  };

  const start = async () => {
    try {
      await loadScripts();
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream; await videoRef.current.play();
      // @ts-ignore
      const model = await window.faceLandmarksDetection.load(window.faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);

      const loop = async () => {
        // @ts-ignore
        const faces = await model.estimateFaces({ input: videoRef.current });
        if (faces && faces[0]) {
          // landmarks indices for mouth corners and lips
          const k = faces[0].keypoints as any[];
          const left = k[61]; const right = k[291];
          const top = k[13]; const bottom = k[14];
          const mouthWidth = Math.hypot(left.x - right.x, left.y - right.y);
          const mouthHeight = Math.hypot(top.x - bottom.x, top.y - bottom.y);
          const ratio = mouthHeight / mouthWidth; // smiling opens width more than height, but we'll use threshold
          const smiling = ratio > 0.12; // heuristic
          const root = document.documentElement;
          if (smiling) root.classList.remove('dark'); else root.classList.add('dark');
        }
        loopRef.current = requestAnimationFrame(loop);
      };
      loop();
    } catch (e) {
      console.warn('Emotion mode failed to start', e);
      setEnabled(false);
    }
  };

  useEffect(() => {
    if (enabled) start();
    return () => { if (loopRef.current) cancelAnimationFrame(loopRef.current); const v = videoRef.current; if (v && v.srcObject) (v.srcObject as MediaStream).getTracks().forEach(t => t.stop()); };
  }, [enabled]);

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2">
      <button className="btn-neon" onClick={() => setEnabled((v) => !v)}>{enabled ? 'Emotion Mode: On' : 'Emotion Mode'}</button>
      <video ref={videoRef} className="hidden" muted playsInline></video>
    </div>
  );
}
