import React from 'react';
import { 
  Code, 
  Wand2, 
  FileText, 
  ShieldAlert, 
  Bot, 
  BoxSelect, 
  Dices,
  Info,
  Hash,
  Brackets,
  GitBranch,
  ArrowRightLeft,
  Type,
  MoveHorizontal,
  ChevronLeft,
  ChevronRight,
  Hand
} from 'lucide-react';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, className }) => {
  const icons: Record<string, React.ElementType> = {
    Code,
    Wand2,
    FileText,
    ShieldAlert,
    Bot,
    BoxSelect,
    Dices,
    Info,
    Hash,
    Brackets,
    GitBranch,
    ArrowRightLeft,
    Type,
    MoveHorizontal,
    ChevronLeft,
    ChevronRight,
    Hand
  };

  const LucideIcon = icons[name] || Info;

  return <LucideIcon size={size} className={className} />;
};