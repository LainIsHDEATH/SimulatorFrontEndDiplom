import React from 'react';

export function Progress({ value = 0, className = '' }) {
    return (
        <div className={`w-full bg-gray-200 rounded h-2 overflow-hidden ${className}`}>
            <div className="h-full bg-green-500" style={{ width: `${value}%` }} />
        </div>
    );
}
