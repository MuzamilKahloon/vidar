import React, { useEffect, useState } from 'react';

const Loader = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out after 2 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    // Complete and unmount after fade out
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 2600); // 2000ms display + 600ms fade

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-600 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Subtle background glow */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 115, 182, 0.15) 0%, transparent 70%)',
        }}
      />

      {/* Main content */}
      <div className="relative flex flex-col items-center gap-8">
        
        {/* Logo with elegant animation */}
        <div className="relative">
          {/* Outer glow ring */}
          <div 
            className="absolute inset-0 -m-6 rounded-full animate-pulse-slow"
            style={{
              background: 'radial-gradient(circle, rgba(0, 184, 230, 0.1) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />
          
          {/* Logo text */}
          <h1 
            className="text-5xl sm:text-6xl font-bold text-white tracking-[0.3em] animate-fade-in"
            style={{
              textShadow: '0 0 30px rgba(0, 184, 230, 0.5), 0 0 60px rgba(0, 115, 182, 0.3)',
            }}
          >
            VIDAR
          </h1>
        </div>

        {/* Elegant loading bar */}
        <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full animate-loading-bar"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(0, 184, 230, 0.8) 50%, transparent 100%)',
              boxShadow: '0 0 10px rgba(0, 184, 230, 0.6)',
            }}
          />
        </div>

      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-loading-bar {
          animation: loading-bar 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;
