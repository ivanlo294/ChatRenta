import React from 'react';
import { clsx } from 'clsx';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  className,
  ...props
}) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        className={clsx(
          'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded',
          className
        )}
        {...props}
      />
      <label className="ml-2 block text-sm text-gray-900">
        {label}
      </label>
    </div>
  );
};
