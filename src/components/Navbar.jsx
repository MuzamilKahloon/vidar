// src/components/Navbar.jsx
import React from "react";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  // Map routes to display names
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Meta Trader";
      case "/ia":
        return "IA (charge)";
      default:
        return "VIDAR";
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
      <div className="flex items-center justify-between w-full relative">
        {/* Logo */}
        <div className="flex-shrink-0 z-10">
          <img 
            src="/logo.png" 
            alt="VIDAR" 
            className="h-4 sm:h-4 lg:h-5 w-auto" 
          />
        </div>

        {/* Dynamic Center Text - Hidden on mobile, visible on sm and up */}
        <div className="absolute left-1/2 transform -translate-x-1/2 z-0 hidden sm:block">
          <span className="text-white text-sm lg:text-base font-normal tracking-wide whitespace-nowrap">
            {getPageTitle()}
          </span>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 z-10">
          {/* IA Active Button */}
          <button
            className="flex items-center gap-1.5 px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg text-white border border-white hover:opacity-90 transition-all duration-200 whitespace-nowrap min-w-0"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white flex-shrink-0 hidden xs:block"
            >
              <path
                d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            <span className="text-[10px] xs:text-xs sm:text-sm font-normal truncate">
              IA active
            </span>
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#0073B6] animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)] flex-shrink-0"></span>
          </button>

          {/* Notifications */}
          {/* <button className="relative p-1.5 sm:p-2 rounded-lg transition-all hover:opacity-90 flex-shrink-0">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
            >
              <path
                d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5S10.5 3.17 10.5 4v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
                fill="currentColor"
              />
            </svg>
            <span
              className="absolute top-0 right-0 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0"
              style={{
                background: "linear-gradient(45deg, rgba(0, 26, 40, 1) 0%, rgba(0, 115, 182, 1) 100%)",
              }}
            ></span>
          </button> */}

          {/* Settings */}
          {/* <button className="p-1.5 sm:p-2 rounded-full transition-all hover:opacity-90 flex-shrink-0">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
            >
              <path
                d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
                fill="currentColor"
              />
            </svg>
          </button> */}

          {/* User Profile */}
          {/* <button
            className="p-1.5 sm:p-2 rounded-full transition-all hover:scale-105 shadow-md flex-shrink-0"
            style={{
              background: "linear-gradient(90deg, rgba(0, 26, 40, 1) 0%, rgba(0, 115, 182, 1) 100%)",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
            >
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                fill="currentColor"
              />
            </svg>
          </button> */}
        </div>
      </div>

      {/* Bottom Border */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-[1px] bg-white/30 transition-all duration-300"
        style={{
          width: "clamp(120px, 60%, 300px)",
        }}
      ></div>
    </nav>
  );
};

export default Navbar;