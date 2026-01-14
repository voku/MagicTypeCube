import React, { useMemo } from 'react';
import { Wisdom, FacePosition } from '../types';
import { CUBE_SIZE } from '../constants';
import { Icon } from './Icon';

interface CubeProps {
  rotationX: number;
  rotationY: number;
  wisdoms: Wisdom[];
  isSpinning: boolean;
  transitionDuration?: number; // Duration in seconds
}

const Cube: React.FC<CubeProps> = ({ 
  rotationX, 
  rotationY, 
  wisdoms, 
  isSpinning, 
  transitionDuration = 1.2 
}) => {
  
  const getTransformForFace = (face: FacePosition) => {
    const translate = `translateZ(${CUBE_SIZE / 2}px)`;
    switch (face) {
      case FacePosition.Front: return `${translate}`;
      case FacePosition.Back: return `rotateY(180deg) ${translate}`;
      case FacePosition.Right: return `rotateY(90deg) ${translate}`;
      case FacePosition.Left: return `rotateY(-90deg) ${translate}`;
      case FacePosition.Top: return `rotateX(90deg) ${translate}`;
      case FacePosition.Bottom: return `rotateX(-90deg) ${translate}`;
      default: return translate;
    }
  };

  const cubeStyle: React.CSSProperties = {
    width: CUBE_SIZE,
    height: CUBE_SIZE,
    position: 'relative',
    transformStyle: 'preserve-3d',
    transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
    // Use transition only when spinning. When dragging (isSpinning=false), no transition for instant feedback.
    transition: isSpinning ? `transform ${transitionDuration}s cubic-bezier(0.25, 1, 0.5, 1)` : 'none',
  };

  return (
    <div className="perspective-container" style={{ perspective: '1000px' }}>
      <div style={cubeStyle}>
        {wisdoms.map((wisdom) => (
          <div
            key={wisdom.id}
            className={`absolute flex flex-col items-center justify-center p-4 text-center border-2 border-white/20 shadow-xl ${wisdom.color} text-white backface-visible select-none`}
            style={{
              width: CUBE_SIZE,
              height: CUBE_SIZE,
              transform: getTransformForFace(wisdom.face),
              backfaceVisibility: 'visible',
              opacity: 0.95,
              borderRadius: '12px',
            }}
          >
            <Icon name={wisdom.iconName} size={48} className="mb-2 opacity-90" />
            <h3 className="text-lg font-bold leading-tight pointer-events-none">{wisdom.title}</h3>
            <p className="text-xs mt-1 opacity-90 leading-snug pointer-events-none">{wisdom.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cube;