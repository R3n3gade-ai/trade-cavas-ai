import React, { useState, useRef, useEffect } from 'react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
  presetColors?: string[];
}

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  color, 
  onChange, 
  label,
  presetColors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF']
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  
  // Close the picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={pickerRef}>
      {label && <div className="text-sm mb-1">{label}</div>}
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 rounded border border-white/20 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: color }}
          aria-label={`Select ${label || 'color'}`}
        />
        <div className="text-xs text-muted-foreground uppercase">{color}</div>
      </div>
      
      {isOpen && (
        <div className="absolute z-50 mt-2 p-3 bg-card border border-white/10 rounded-md shadow-lg">
          <div className="grid grid-cols-4 gap-2 mb-3">
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                type="button"
                className={`w-6 h-6 rounded-sm ${color === presetColor ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-white/50'}`}
                style={{ backgroundColor: presetColor }}
                onClick={() => {
                  onChange(presetColor);
                  setIsOpen(false);
                }}
                aria-label={`Select color ${presetColor}`}
              />
            ))}
          </div>
          
          <div className="mt-2">
            <input
              type="color"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-8 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
