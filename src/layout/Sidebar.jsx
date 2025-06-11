import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="bg-gray-800 text-white w-64 p-4">
      <nav className="space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `block px-3 py-2 rounded ${isActive ? 'bg-gray-700 font-semibold' : 'hover:bg-gray-700'}`
          }
        >
          Dashboard
        </NavLink>
        {/* Можно добавить дополнительные пункты меню при необходимости */}
      </nav>
    </aside>
  );
};

export default Sidebar;
