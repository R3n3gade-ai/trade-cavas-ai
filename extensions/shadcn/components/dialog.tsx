import React from 'react';

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        {children}
        <button 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={() => onOpenChange?.(false)}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export interface DialogContentProps {
  children?: React.ReactNode;
  className?: string;
}

export const DialogContent: React.FC<DialogContentProps> = ({ children, className }) => {
  return (
    <div className={`mt-2 ${className || ''}`}>
      {children}
    </div>
  );
};

export interface DialogHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children, className }) => {
  return (
    <div className={`mb-4 ${className || ''}`}>
      {children}
    </div>
  );
};

export interface DialogTitleProps {
  children?: React.ReactNode;
  className?: string;
}

export const DialogTitle: React.FC<DialogTitleProps> = ({ children, className }) => {
  return (
    <h2 className={`text-xl font-semibold ${className || ''}`}>
      {children}
    </h2>
  );
};

export interface DialogDescriptionProps {
  children?: React.ReactNode;
  className?: string;
}

export const DialogDescription: React.FC<DialogDescriptionProps> = ({ children, className }) => {
  return (
    <p className={`text-sm text-gray-500 ${className || ''}`}>
      {children}
    </p>
  );
};

export interface DialogFooterProps {
  children?: React.ReactNode;
  className?: string;
}

export const DialogFooter: React.FC<DialogFooterProps> = ({ children, className }) => {
  return (
    <div className={`mt-6 flex justify-end space-x-2 ${className || ''}`}>
      {children}
    </div>
  );
};
