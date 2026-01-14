import React, { useState, useEffect, useCallback, useRef } from 'react';
import Cube from './components/Cube';
import WisdomDisplay from './components/WisdomDisplay';
import { Icon } from './components/Icon';
import { WISDOM_DATA } from './constants';
import { FacePosition, Wisdom } from './types';

// Map final angles to faces
// Format: [x, y] degrees relative to 0,0
// These angles represent the rotation needed to bring the face to the front upright
const FACE_ROTATIONS: Record<FacePosition, { x: number; y: number }> = {
  [FacePosition.Front]: { x: 0, y: 0 },
  [FacePosition.Back]: { x: 0, y: 180 },
  [FacePosition.Right]: { x: 0, y: -90 },
  [FacePosition.Left]: { x: 0, y: 90 },
  [FacePosition.Top]: { x: -90, y: 0 },
  [FacePosition.Bottom]: { x: 90, y: 0 },
};

// Map the specific tailwind color classes from constants.ts to clearer background gradients
// Using stronger shades (200/300) to ensure visibility against white/slate backgrounds
const BG_GRADIENTS: Record<string, string> = {
  'bg-blue-600': 'from-blue-300 via-blue-100 to-slate-50',
  'bg-rose-600': 'from-rose-300 via-rose-100 to-slate-50',
  'bg-emerald-600': 'from-emerald-300 via-emerald-100 to-slate-50',
  'bg-purple-600': 'from-purple-300 via-purple-100 to-slate-50',
  'bg-amber-600': 'from-amber-300 via-amber-100 to-slate-50',
  'bg-cyan-600': 'from-cyan-300 via-cyan-100 to-slate-50',
};

const DEFAULT_GRADIENT = 'from-slate-300 via-slate-100 to-slate-50';

const App: React.FC = () => {
  const [rotation, setRotation] = useState({ x: -15, y: -25 }); // Initial tilt
  const [isSpinning, setIsSpinning] = useState(false);
  // Control animation speed: slow for "Spin" button, fast for manual "Snap"
  const [spinDuration, setSpinDuration] = useState(1.2); 
  const [activeWisdom, setActiveWisdom] = useState<Wisdom | null>(null);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 });

  // Initialize with a random wisdom without spinning
  useEffect(() => {
    setActiveWisdom(WISDOM_DATA[0]);
  }, []);

  // Snap to the nearest face based on current rotation using Vector Math
  const snapToNearestFace = useCallback(() => {
    // Convert current rotation to radians
    const radX = (rotation.x * Math.PI) / 180;
    const radY = (rotation.y * Math.PI) / 180;
    
    // Compute Z-component of the normal vector for each face in view space
    // Maximize Z means the face is pointing towards the camera (out of screen)
    const cx = Math.cos(radX);
    const sx = Math.sin(radX);
    const cy = Math.cos(radY);
    const sy = Math.sin(radY);

    const scores = {
      [FacePosition.Front]:  cx * cy,
      [FacePosition.Back]:   -cx * cy,
      [FacePosition.Right]:  -cx * sy,
      [FacePosition.Left]:   cx * sy,
      [FacePosition.Top]:    -sx,
      [FacePosition.Bottom]: sx,
    };

    // Find face with max score
    let bestFace = FacePosition.Front;
    let maxScore = -Infinity;

    (Object.entries(scores) as [FacePosition, number][]).forEach(([face, score]) => {
      if (score > maxScore) {
        maxScore = score;
        bestFace = face as FacePosition;
      }
    });

    // Determine target rotation base
    const targetBase = FACE_ROTATIONS[bestFace];
    
    // Helper to find the multiple of 360 closest to the current rotation 
    // that matches the target base angle.
    // We want: targetBase + k*360 approx= current
    const snapToClosest = (current: number, target: number) => {
        const diff = current - target;
        const rotations = Math.round(diff / 360);
        return target + (rotations * 360);
    };

    const targetX = snapToClosest(rotation.x, targetBase.x);
    const targetY = snapToClosest(rotation.y, targetBase.y);

    // Update state to animate to the closest face
    setIsSpinning(true);
    setSpinDuration(0.6); // Faster duration for snapping
    setRotation({ x: targetX, y: targetY });

    const newWisdom = WISDOM_DATA.find(w => w.face === bestFace) || null;

    setTimeout(() => {
      setActiveWisdom(newWisdom);
      setIsSpinning(false);
    }, 600); // Match the spinDuration
  }, [rotation]);

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (isSpinning) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    setIsDragging(true);
    lastMousePos.current = { x: clientX, y: clientY };
    dragStartPos.current = { x: clientX, y: clientY };
    // Do NOT hide wisdom here to prevent page jumping
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      
      const deltaX = clientX - lastMousePos.current.x;
      const deltaY = clientY - lastMousePos.current.y;
      
      setRotation(prev => ({
        x: prev.x - deltaY * 0.6, // Sensitivity
        y: prev.y + deltaX * 0.6
      }));
      
      lastMousePos.current = { x: clientX, y: clientY };
    };

    const handleUp = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      setIsDragging(false);

      // Check distance moved
      const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as MouseEvent).clientY;
      const moveDist = Math.hypot(clientX - dragStartPos.current.x, clientY - dragStartPos.current.y);
      
      if (moveDist < 5) {
        // It was a click
        spinCube();
      } else {
        // It was a drag, snap to the side the user left it at
        snapToNearestFace();
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('mouseup', handleUp);
      window.addEventListener('touchend', handleUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging, snapToNearestFace]);

  const spinCube = useCallback(() => {
    if (isSpinning) return;

    // 1. Pick a random wisdom/face
    const randomIndex = Math.floor(Math.random() * WISDOM_DATA.length);
    const selectedWisdom = WISDOM_DATA[randomIndex];
    const baseTarget = FACE_ROTATIONS[selectedWisdom.face];

    // 2. Calculate new rotation
    const currentX = rotation.x;
    const currentY = rotation.y;

    // Tamed Randomness:
    // Reduced extra spins to keep velocity manageable within the same duration.
    // X axis: 0 or 1 extra flip (mostly keeps upright-ish orientation)
    // Y axis: 1 or 2 extra spins (good horizontal variety)
    const extraSpinsX = Math.random() > 0.5 ? 1 : 0; 
    const extraSpinsY = Math.floor(Math.random() * 2) + 1;

    const roundsX = Math.ceil((currentX + (extraSpinsX * 360) - baseTarget.x) / 360);
    const nextTargetX = baseTarget.x + (roundsX * 360);
    
    const roundsY = Math.ceil((currentY + (extraSpinsY * 360) - baseTarget.y) / 360);
    const nextTargetY = baseTarget.y + (roundsY * 360);

    // Removed jitter for a cleaner, more mechanical stop
    const finalX = nextTargetX;
    const finalY = nextTargetY;

    // 3. Calculate Duration dynamically
    // Since we reduced rotations, we can slightly lower the base duration to keep it snappy
    // but the user requested "without making the time span longer" (so keeping it short is good).
    const totalRotationDegrees = Math.abs(finalX - currentX) + Math.abs(finalY - currentY);
    const totalRotations = totalRotationDegrees / 360;

    // Adjusted formula for a smoother, less chaotic feel
    // 0.8s base + 0.25s per rotation
    const dynamicDuration = Math.min(1.5, Math.max(0.8, 0.8 + (totalRotations * 0.25)));

    setIsSpinning(true);
    setSpinDuration(dynamicDuration);
    // Do NOT hide wisdom here to prevent page jumping
    // setActiveWisdom(null); 

    setRotation({ 
      x: finalX, 
      y: finalY 
    });

    // 4. Wait for animation to finish
    setTimeout(() => {
      setActiveWisdom(selectedWisdom);
      setIsSpinning(false);
    }, dynamicDuration * 1000); 
  }, [isSpinning, rotation]);

  // Compute background gradient class
  const backgroundClass = activeWisdom 
    ? BG_GRADIENTS[activeWisdom.color] || DEFAULT_GRADIENT 
    : DEFAULT_GRADIENT;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-12 md:pt-20 pb-12 p-4 overflow-hidden relative selection:bg-purple-200 selection:text-purple-900">
      
      {/* Background Gradient */}
      <div className={`fixed inset-0 -z-30 bg-gradient-to-br ${backgroundClass} transition-colors duration-1000 ease-in-out`} />

      {/* Subtle Blobs for texture */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-white/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-white/30 rounded-full blur-[100px]" />
      </div>

      <header className="relative z-10 text-center mb-12 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900 mb-4 tracking-tight drop-shadow-sm">
          Magic Type Cube
        </h1>
        <p className="text-slate-600 text-lg font-medium">
          Timeless PHP Wisdoms
        </p>
      </header>

      <main className="relative z-10 flex flex-col items-center w-full">
        
        {/* Cube Interaction Zone */}
        {/* Increased margin-bottom to mb-40 (approx 160px) to prevent overlap with the button below */}
        <div 
          className="relative mb-40 group cursor-grab active:cursor-grabbing select-none touch-none"
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
            
            {/* 1. Gyroscopic Background Field (Replacing camera corners) */}
            <div className={`
              absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
              w-[320px] h-[320px] pointer-events-none transition-all duration-700
              ${isDragging ? 'scale-105 opacity-40' : 'scale-100 opacity-20'}
            `}>
                {/* Outer Static Ring */}
                <div className="absolute inset-0 rounded-full border border-slate-300 opacity-50" />
                
                {/* Dashed Spin Ring */}
                <div className="absolute inset-4 rounded-full border border-dashed border-slate-400 animate-[spin_60s_linear_infinite]" />
                
                {/* Counter-rotating Inner Ring */}
                <div className="absolute inset-8 rounded-full border border-dotted border-slate-400/50 animate-[spin_40s_linear_infinite_reverse]" />
                
                {/* Inner Accent Ring */}
                <div className="absolute inset-16 rounded-full border-2 border-slate-100 opacity-30" />
                
                {/* Optic Crosshairs/Ticks */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-3 bg-slate-500" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-3 bg-slate-500" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-[1px] bg-slate-500" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-[1px] bg-slate-500" />
            </div>

            {/* 3. Volumetric Glow */}
            <div className={`
              absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
              w-[240px] h-[240px] rounded-full bg-indigo-500/5 blur-3xl
              transition-opacity duration-500 pointer-events-none
              ${isDragging ? 'opacity-80' : 'opacity-40'}
            `} />

            {/* 3.5 Dynamic Ground Shadow - Realistic Update */}
            <div className={`
                absolute top-1/2 left-1/2 -translate-x-1/2 
                w-48 h-12 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/40 via-slate-900/10 to-transparent
                transition-all duration-500 pointer-events-none mix-blend-multiply
                ${isDragging || isSpinning 
                  ? 'translate-y-[100px] scale-90 opacity-40 blur-md' 
                  : 'translate-y-[100px] scale-100 opacity-60 blur-sm'
                }
            `} />

            {/* 4. The Cube */}
            <div 
              className={`
                relative z-10 transition-transform duration-300 pointer-events-none
                ${isSpinning ? '' : ''}
              `}
            >
              <Cube 
                rotationX={rotation.x} 
                rotationY={rotation.y} 
                wisdoms={WISDOM_DATA}
                isSpinning={isSpinning}
                transitionDuration={spinDuration}
              />
            </div>
            
            {/* 5. Drag Hint with Hand and Curved Arrows - Visible on all screens, scaled */}
            <div className={`
                flex flex-col items-center gap-2
                absolute -bottom-24 left-1/2 -translate-x-1/2 
                transition-all duration-500 pointer-events-none select-none
                scale-90 md:scale-100 origin-top
                ${isDragging ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
            `}>
                <div className="relative flex items-center justify-center">
                        {/* Curved Arrows SVG */}
                        <svg width="100" height="40" viewBox="0 0 100 40" fill="none" stroke="currentColor" className="text-slate-400 opacity-60" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        {/* Left Curve */}
                        <path d="M 35 25 Q 20 25 10 15" />
                        <path d="M 10 15 L 16 12" />
                        <path d="M 10 15 L 14 20" />
                        
                        {/* Right Curve */}
                        <path d="M 65 25 Q 80 25 90 15" />
                        <path d="M 90 15 L 84 12" />
                        <path d="M 90 15 L 86 20" />
                    </svg>
                    
                    {/* Hand Icon */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/40 backdrop-blur-sm p-2 rounded-full border border-white/30 shadow-sm animate-pulse">
                            <Icon name="Hand" size={20} className="text-slate-600" />
                    </div>
                </div>
                
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500/80 bg-white/20 px-3 py-1 rounded-full backdrop-blur-[2px] whitespace-nowrap">
                    Drag the cube
                </span>
            </div>
        </div>

        <button
          onClick={spinCube}
          disabled={isSpinning}
          className={`
            group relative flex items-center gap-3 px-8 py-4 bg-white/80 backdrop-blur-sm
            rounded-full font-bold text-slate-700 shadow-[0_4px_20px_rgba(0,0,0,0.1)] 
            transition-all duration-300 hover:shadow-[0_6px_25px_rgba(0,0,0,0.15)] hover:-translate-y-1
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-white/50
          `}
        >
          <Icon 
            name="Dices" 
            className={`transition-transform duration-700 ${isSpinning ? 'rotate-180' : 'group-hover:rotate-12'}`} 
          />
          {isSpinning ? 'Consulting the Oracle...' : 'Extract Wisdom'}
        </button>

        <WisdomDisplay activeWisdom={activeWisdom} isSpinning={isSpinning || isDragging} />
      </main>
    </div>
  );
};

export default App;