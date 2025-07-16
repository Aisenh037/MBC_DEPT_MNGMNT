// src/theme/ThemeProvider.jsx
import React, { createContext, useContext, useMemo, useState } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeModeContext = createContext();
export const useThemeMode = () => useContext(ThemeModeContext);

export default function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() =>
    window.localStorage.getItem("themeMode") || "light"
  );

  const toggleTheme = () => {
    setMode((prev) => {
      const newMode = prev === "light" ? "dark" : "light";
      window.localStorage.setItem("themeMode", newMode);
      return newMode;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode },
        components: {
          MuiAppBar: { styleOverrides: { root: { boxShadow: "none" } } },
        },
      }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
}
