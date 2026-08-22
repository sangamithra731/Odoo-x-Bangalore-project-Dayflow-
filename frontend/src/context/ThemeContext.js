import React, { createContext, useContext } from 'react';

export const ThemeContext = createContext({
  themeMode: 'light',
  toggleTheme: () => {},
  sidebarOpen: true,
  toggleSidebar: () => {},
});

export const useTheme = () => useContext(ThemeContext);