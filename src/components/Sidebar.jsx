// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, TrendingUp, ChevronLeft, ChevronRight, X } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'IA (chat)', path: '/ia', icon: MessageSquare },
    { name: 'Meta Trader', path: '/', icon: TrendingUp }
  ];

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (window.innerWidth < 1024) { // lg breakpoint
      setIsOpen(false);
    }
  };

  return (
    <>
      <div 
        className={`lg:w-48 w-64 fixed inset-y-0 left-0 z-40 bg-black flex flex-col transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="lg:hidden flex justify-end p-2">
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 pt-20 lg:pt-20">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-3 mx-3 mb-2 rounded-lg transition-all ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
                style={isActive ? {
                  background: 'linear-gradient(343deg, rgba(0, 26, 40, 1) 0%, rgba(0, 115, 182, 1) 100%)'
                } : {}}
              >
                <Icon size={18} />
                <span className="text-sm whitespace-nowrap">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 mx-3 mb-4 border border-white/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium"
              style={{ background: 'linear-gradient(343deg, rgba(0, 26, 40, 1) 0%, rgba(0, 115, 182, 1) 100%)' }}
            >
              PV
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">Pizzulo Valentin</p>
              <p className="text-gray-300 text-xs truncate">comment@gyt.r</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
        </div>
      </div>

      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="lg:hidden fixed left-0 top-20 p-2 bg-black/80 text-white rounded-r-lg shadow-lg"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </>
  );
};

export default Sidebar;