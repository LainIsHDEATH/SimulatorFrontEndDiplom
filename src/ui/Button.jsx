import React from 'react';

const Button = ({ children, onClick, type = 'button', disabled = false, size = 'md', className = '' }) => {
  const baseStyle = 'inline-block text-white font-medium rounded focus:outline-none focus:ring';
  const colorStyle = disabled ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700';
  const sizeStyle = size === 'sm' ? 'px-2 py-1 text-sm' : 'px-4 py-2';
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${colorStyle} ${sizeStyle} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
