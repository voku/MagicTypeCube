export enum FacePosition {
  Front = 'front',
  Back = 'back',
  Right = 'right',
  Left = 'left',
  Top = 'top',
  Bottom = 'bottom',
}

export interface Wisdom {
  id: number;
  face: FacePosition;
  title: string;
  summary: string;
  detail: string;
  codeSnippet: string;
  color: string;
  iconName: string;
}

export interface RotationState {
  x: number;
  y: number;
}