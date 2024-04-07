import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ toggleSidebar }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleNavbar = () => {
      setIsOpen(!isOpen);
    };
  
    return (
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="md:shown">
            <button
              className={`text-white mr-4 ${isOpen ? 'text-white' : 'text-gray-300'}`}
              onClick={toggleSidebar}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                ></path>
              </svg>
            </button>
          </div>
          <Link to="/" className="text-white text-xl font-bold">Logo</Link>
          <div className={`md:flex md:flex-row md:items-center md:space-x-4 ${isOpen ? 'block' : 'hidden'}`}>
            <Link to="/classroom" className="text-white">Classroom</Link>
            <Link to="/user" className="text-white">User</Link>
            <Link to="/schedule" className="text-white">Schedule</Link>
            <Link to="/contact" className="text-white">Contact</Link>
            <div className="md:flex md:flex-row md:items-center md:space-x-4">
              <Link to="/signup" className="btn btn-primary">Sign up</Link>
              <Link to="/login" className="btn btn-secondary">Log in</Link>
            </div>
          </div>
        </div>
      </nav>
    );
  };
  
  export default NavBar;
