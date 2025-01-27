import ThemeSettings from "./layouts/theme-settings/ThemeSettings"
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router";
import Router from "./routes/Router"
function App() {
  const theme = ThemeSettings();
  const router = createBrowserRouter(Router)
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider >
  )
}

export default App
