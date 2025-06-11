import React from 'react';

const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="border-b flex space-x-4">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`py-2 px-3 -mb-px border-b-2 font-medium ${
            activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
