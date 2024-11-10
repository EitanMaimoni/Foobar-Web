import React, { createContext, useState, useEffect } from "react";

// Creating a context for theme. This will be used to allow any component in the app to access or change the theme.
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

  // useState hook to manage the theme state. Default is set to 'light'.
  const [theme, setTheme] = useState('light');

  // useEffect hook to handle the theme initialization when the component mounts.
  useEffect(() => {

    // It checks if there is a theme stored in localStorage. If not, it defaults to 'light'.
    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);

  }, []);

  // Function to toggle the theme between 'light' and 'dark'.
  const toggleTheme = () => {

    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // Storing the new theme in localStorage for persistence.
    localStorage.setItem('theme', newTheme);

  };

  // ThemeContext.Provider wraps the children components and provides them access to the theme context.
  // It passes the current theme and the toggleTheme function as the context value.
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
