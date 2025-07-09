// RangeFilter.jsx
import React from 'react';

const RangeFilter = ({ range, onChange }) => (
  <div className="flex items-center space-x-1">
    <label className="text-sm">Page</label>
    <input
      type="number"
      value={range.page ?? ''}
      onChange={e => onChange({ ...range, page: Number(e.target.value) })}
      className="border rounded w-20 px-1 py-0.5 text-sm"
    />
    <label className="text-sm">Size</label>
    <input
      type="number"
      value={range.size ?? ''}
      onChange={e => onChange({ ...range, size: Number(e.target.value) })}
      className="border rounded w-20 px-1 py-0.5 text-sm"
    />
  </div>
);

export default RangeFilter;