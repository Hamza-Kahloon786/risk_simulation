import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { BarChart3, Menu, X } from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F1A]/95 backdrop-blur-sm border-b border-white/10 shadow-lg">
      {/* Main Header Container */}
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-18 lg:h-20">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2 text-[#3B82F6] font-bold">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex-shrink-0" />
            <span className="text-[#E6E8EE] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl whitespace-nowrap">
              <span className="hidden sm:inline">RiskSim Enterprise</span>
              <span className="sm:hidden">RiskSim</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-8 text-[#9CA3B0]">
            <Link 
              to="/" 
              className="px-3 py-2 rounded-lg text-sm xl:text-base hover:text-[#3B82F6] hover:bg-white/5 transition-all duration-200 whitespace-nowrap"
            >
              Home
            </Link>
            <Link 
              to="/scenarios" 
              className="px-3 py-2 rounded-lg text-sm xl:text-base hover:text-[#3B82F6] hover:bg-white/5 transition-all duration-200 whitespace-nowrap"
            >
              Scenarios
            </Link>
            <Link 
              to="/dashboard" 
              className="px-3 py-2 rounded-lg text-sm xl:text-base hover:text-[#3B82F6] hover:bg-white/5 transition-all duration-200 whitespace-nowrap"
            >
              Dashboard
            </Link>
            <Link 
              to="/register" 
              className="px-3 py-2 rounded-lg text-sm xl:text-base hover:text-[#3B82F6] hover:bg-white/5 transition-all duration-200 whitespace-nowrap"
            >
              Sign Up
            </Link>
            <Link 
              to="/login" 
              className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg text-sm xl:text-base hover:bg-[#2563EB] transition-all duration-200 whitespace-nowrap shadow-lg"
            >
              Login
            </Link>
          </nav>

          {/* Tablet Navigation (768px - 1023px) */}
          <nav className="hidden md:flex lg:hidden items-center gap-3 text-[#9CA3B0] text-sm">
            <Link 
              to="/" 
              className="px-2 py-1.5 rounded hover:text-[#3B82F6] hover:bg-white/5 transition-all duration-200"
            >
              Home
            </Link>
            <Link 
              to="/scenarios" 
              className="px-2 py-1.5 rounded hover:text-[#3B82F6] hover:bg-white/5 transition-all duration-200"
            >
              Scenarios
            </Link>
            <Link 
              to="/dashboard" 
              className="px-2 py-1.5 rounded hover:text-[#3B82F6] hover:bg-white/5 transition-all duration-200"
            >
              Dashboard
            </Link>
            <Link 
              to="/login" 
              className="px-3 py-1.5 bg-[#3B82F6] text-white rounded hover:bg-[#2563EB] transition-all duration-200"
            >
              Login
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-[#9CA3B0] hover:text-[#3B82F6] hover:bg-white/5 transition-all duration-200 touch-manipulation"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Navigation Menu */}
      <div className={`
        md:hidden absolute top-full left-0 right-0 bg-[#0B0F1A]/98 backdrop-blur-md border-b border-white/10 shadow-2xl z-50
        transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}
      `}>
        <nav className="px-4 py-4 space-y-1">
          <Link 
            to="/" 
            onClick={closeMobileMenu}
            className="block px-4 py-3 text-[#9CA3B0] hover:text-[#3B82F6] hover:bg-white/5 rounded-lg transition-all duration-200 touch-manipulation"
          >
            <span className="text-base sm:text-lg">Home</span>
          </Link>
          <Link 
            to="/scenarios" 
            onClick={closeMobileMenu}
            className="block px-4 py-3 text-[#9CA3B0] hover:text-[#3B82F6] hover:bg-white/5 rounded-lg transition-all duration-200 touch-manipulation"
          >
            <span className="text-base sm:text-lg">Scenarios</span>
          </Link>
          <Link 
            to="/dashboard" 
            onClick={closeMobileMenu}
            className="block px-4 py-3 text-[#9CA3B0] hover:text-[#3B82F6] hover:bg-white/5 rounded-lg transition-all duration-200 touch-manipulation"
          >
            <span className="text-base sm:text-lg">Dashboard</span>
          </Link>
          <Link 
            to="/register" 
            onClick={closeMobileMenu}
            className="block px-4 py-3 text-[#9CA3B0] hover:text-[#3B82F6] hover:bg-white/5 rounded-lg transition-all duration-200 touch-manipulation"
          >
            <span className="text-base sm:text-lg">Sign Up</span>
          </Link>
          <Link 
            to="/login" 
            onClick={closeMobileMenu}
            className="block mx-4 mt-4 px-4 py-3 bg-[#3B82F6] text-white text-center rounded-lg hover:bg-[#2563EB] transition-all duration-200 touch-manipulation shadow-lg"
          >
            <span className="text-base sm:text-lg font-medium">Login</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;