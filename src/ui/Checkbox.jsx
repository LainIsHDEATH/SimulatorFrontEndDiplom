import React from 'react';

const Checkbox = ({ label, checked, onChange, className = '' }) => {
  return (
    <label className={`inline-flex items-center ${className}`}>
      <input
        type="checkbox"
        className="form-checkbox h-4 w-4 text-blue-600"
        checked={checked}
        onChange={onChange}
      />
      <span className="ml-2 text-sm">{label}</span>
    </label>
  );
};

export default Checkbox;
