import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={`sidebar bg-gray-800 text-white h-screen w-64 fixed top-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition duration-300 ease-in-out`}>
      <div className="p-4">
        <h3 className="text-2xl font-bold mb-4">Sidebar</h3>
        <ul>
          <li className="mb-2">
            <Link to="/" className="text-white hover:text-gray-400">Home</Link>
          </li>
          <li className="mb-2">
            <Link to="/classroom" className="text-white hover:text-gray-400">Classroom</Link>
          </li>
          <li className="mb-2">
            <Link to="/schedule" className="text-white hover:text-gray-400">Schedule</Link>
          </li>
          <li className="mb-2">
            <Link to="/user" className="text-white hover:text-gray-400">User</Link>
          </li>
        </ul>
      </div>
      <button className="fixed bottom-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={toggleSidebar}>
        Close Sidebar
      </button>
    </aside>
  );
};

export default Sidebar;
