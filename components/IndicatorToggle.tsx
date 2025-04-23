import React from 'react';

interface IndicatorToggleProps {
  label: string;
  isEnabled: boolean;
  onChange: (enabled: boolean) => void;
}

const IndicatorToggle: React.FC<IndicatorToggleProps> = ({ label, isEnabled, onChange }) => {
  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium">{label}</span>
      <button
        className={`relative inline-flex h-6 w-11 items-center rounded-full border ${isEnabled ? 'bg-primary border-primary' : 'bg-gray-700 border-gray-600'}`}
        onClick={() => onChange(!isEnabled)}
        aria-pressed={isEnabled}
        aria-label={`Toggle ${label}`}
      >
        <span
          className={`${isEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm`}
        />
      </button>
      <span className="text-xs text-gray-400">{isEnabled ? 'ON' : 'OFF'}</span>
    </div>
  );
};

export default IndicatorToggle;
