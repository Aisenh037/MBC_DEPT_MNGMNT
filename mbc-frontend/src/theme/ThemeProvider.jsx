// src/theme/ThemeProvider.jsx
import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeModeContext = createContext();
export const useThemeMode = () => useContext(ThemeModeContext);

// Define custom theme settings outside the component for better performance
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#1976d2' }, // Blue
          secondary: { main: '#dc004e' }, // Pink
          background: { default: '#f4f6f8', paper: '#ffffff' },
        }
      : {
          primary: { main: '#90caf9' }, // Lighter blue for dark mode
          secondary: { main: '#f48fb1' }, // Lighter pink
          background: { default: '#121212', paper: '#1e1e1e' },
        }),
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 600 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                backgroundImage: 'none', // Remove gradients from Paper in dark mode
            }
        }
    }
  },
});


export default function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() =>
    window.localStorage.getItem("themeMode") || "light"
  );

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const newMode = prev === "light" ? "dark" : "light";
      window.localStorage.setItem("themeMode", newMode);
      return newMode;
    });
  }, []);

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
}