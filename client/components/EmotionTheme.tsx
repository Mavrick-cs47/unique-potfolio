import { useEffect, useRef, useState } from "react";

type Mood = 'cheerful' | 'professional' | 'surprised' | 'happy' | 'angry' | 'sad' | 'idle';

export default function EmotionTheme() {
  const [enabled, setEnabled] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [mood, setMood] = useState<Mood>('idle');
  const [manual, setManual] = useState<Mood | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const loopRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const dispatchMood = (m: Mood) => {
    setMood(m);
    const root = document.documentElement;
    root.classList.remove('mood-cheerful','mood-professional','mood-surprised','mood-happy','mood-angry','mood-sad');
    if (m === 'cheerful' || m === 'happy') root.classList.add('mood-happy','mood-cheerful');
    if (m === 'professional') root.classList.add('mood-professional');
    if (m === 'surprised') root.classList.add('mood-surprised');
    if (m === 'angry') root.classList.add('mood-angry');
    if (m === 'sad') root.classList.add('mood-sad');
    const tagline = m === 'happy' || m === 'cheerful' ? 'Your smile just lit up my universe 🌟.' : m === 'professional' ? 'Focus mode: Let me show you what I’ve built 🚀.' : m === 'surprised' ? 'Whoa! You just discovered surprise mode ✨.' : m === 'angry' ? 'Taking a strong stance. Let’s build boldly 🔥.' : m === 'sad' ? 'Calm mode engaged. Here’s what I’ve crafted 🤎.' : undefined;
    window.dispatchEvent(new CustomEvent('mood-change', { detail: { mood: m, tagline } }));
    // audio mood
    if (!audioRef.current) return;
    if (m === 'happy' || m === 'cheerful') { audioRef.current.src = 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_3a7e2a662a.mp3?filename=happy-day-112194.mp3'; audioRef.current.play().catch(()=>{}); }
    else if (m === 'professional' || m === 'sad') { audioRef.current.src = 'https://cdn.pixabay.com/download/audio/2021/09/01/audio_81e0d90b76.mp3?filename=ambient-piano-110241.mp3'; audioRef.current.play().catch(()=>{}); }
    else if (m === 'surprised' || m === 'angry') { audioRef.current.src = 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_3fc7b0df56.mp3?filename=cinematic-whoosh-hit-14596.mp3'; audioRef.current.play().catch(()=>{}); }
  };

  const loadScripts = async () => {
    const load = (src: string) => new Promise<void>((res, rej) => { const s = document.createElement('script'); s.src = src; s.async = true; s.onload = () => res(); s.onerror = () => rej(); document.head.appendChild(s); });
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
        if (manual) { dispatchMood(manual); loopRef.current = requestAnimationFrame(loop); return; }
        // @ts-ignore
        const faces = await model.estimateFaces({ input: videoRef.current });
        if (faces && faces[0]) {
          const k = faces[0].keypoints as any[];
          const left = k[61]; const right = k[291];
          const top = k[13]; const bottom = k[14];
          const mouthWidth = Math.hypot(left.x - right.x, left.y - right.y);
          const mouthHeight = Math.hypot(top.x - bottom.x, top.y - bottom.y);
          const ratio = mouthHeight / mouthWidth;
          // heuristics
          if (ratio > 0.22) dispatchMood('surprised');
          else if (ratio > 0.15) dispatchMood('happy');
          else if (ratio < 0.08) dispatchMood('angry');
          else dispatchMood('sad');
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
  }, [enabled, manual]);

  const requestConsent = () => {
    setShowConsent(true);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2">
      <button className="btn-neon" onClick={() => setEnabled((v)=>!v)}>{enabled ? 'Emotion: On' : 'Emotion Mode'}</button>
      <div className="glass p-2 rounded-xl flex items-center gap-2">
        <span className="text-xs opacity-80">Manual</span>
        <button className="px-2 py-1 rounded bg-white/10 border border-white/20 text-xs" onClick={() => setManual('happy')}>Happy</button>
        <button className="px-2 py-1 rounded bg-white/10 border border-white/20 text-xs" onClick={() => setManual('angry')}>Angry</button>
        <button className="px-2 py-1 rounded bg-white/10 border border-white/20 text-xs" onClick={() => setManual('sad')}>Sad</button>
      </div>
      <audio ref={audioRef} loop volume={0.2 as any} />
      <video ref={videoRef} className="hidden" muted playsInline></video>

      {showConsent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center" onClick={() => setShowConsent(false)}>
          <div className="glass neon-border p-6 rounded-2xl max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-lg mb-2">Try Emotion Mode?</h3>
            <p className="text-sm text-foreground/80">Allow webcam to see how the portfolio adapts to your mood. No data is stored.</p>
            <div className="mt-4 flex gap-3">
              <button className="btn-neon" onClick={() => { setShowConsent(false); setEnabled(true); }}>Allow</button>
              <button className="btn-neon" onClick={() => setShowConsent(false)}>Not now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
