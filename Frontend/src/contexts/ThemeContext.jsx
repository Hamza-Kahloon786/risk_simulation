// src/contexts/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to dark
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true; // default to dark
  });

  // Update localStorage and document class when theme changes
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Update document class for global styles
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Theme-aware class generator
  const getThemeClasses = (darkClasses, lightClasses) => {
    return isDarkMode ? darkClasses : lightClasses;
  };

  // Common theme classes for easy use
  const themeClasses = {
    // Backgrounds
    bg: {
      primary: isDarkMode ? 'bg-gray-800' : 'bg-white',
      secondary: isDarkMode ? 'bg-gray-700' : 'bg-gray-100',
      tertiary: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
      card: isDarkMode ? 'bg-[#1A2332]' : 'bg-white',
      dashboard: isDarkMode ? 'bg-[#0B0F1A]' : 'bg-gray-50',
      sidebar: isDarkMode ? 'bg-gray-800' : 'bg-white',
    },
    // Text colors
    text: {
      primary: isDarkMode ? 'text-white' : 'text-gray-900',
      secondary: isDarkMode ? 'text-gray-300' : 'text-gray-700',
      muted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
      accent: isDarkMode ? 'text-blue-400' : 'text-blue-600',
    },
    // Borders
    border: {
      primary: isDarkMode ? 'border-gray-700' : 'border-gray-200',
      secondary: isDarkMode ? 'border-gray-600' : 'border-gray-300',
    },
    // Hover states
    hover: {
      bg: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
      text: isDarkMode ? 'hover:text-white' : 'hover:text-gray-900',
    },
    // Active states
    active: {
      bg: isDarkMode ? 'bg-blue-600' : 'bg-blue-500',
      text: 'text-white',
    },
    // Button styles
    button: {
      primary: isDarkMode
        ? 'bg-blue-600 hover:bg-blue-700 text-white'
        : 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: isDarkMode
        ? 'bg-white hover:bg-gray-100 text-gray-900 border-gray-300'
        : 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600'
    }
  };

  const value = {
    isDarkMode,
    toggleTheme,
    getThemeClasses,
    themeClasses,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
