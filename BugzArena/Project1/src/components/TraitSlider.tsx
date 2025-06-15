import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface TraitSliderProps {
  label: string;
  icon: LucideIcon;
  value: number;
  onChange: (value: number) => void;
  color: string;
  description: string;
}

const TraitSlider: React.FC<TraitSliderProps> = ({
  label,
  icon: Icon,
  value,
  onChange,
  color,
  description
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon className={`text-${color}`} size={20} />
          <span className="font-medium text-white">{label}</span>
        </div>
        <span className={`text-${color} font-bold`}>{value}</span>
      </div>
      
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, var(--tw-color-${color.replace('-', '-')}) 0%, var(--tw-color-${color.replace('-', '-')}) ${value}%, #374151 ${value}%, #374151 100%)`
        }}
      />
      
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
};

export default TraitSlider;