import ThemeSettings from "./layouts/theme-settings/ThemeSettings"
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router";
import Router from "./routes/Router"
import { SnackbarProvider } from 'notistack'
import SnackbarCloseButton from "./components/notistack/SnackbarCloseButton";

function App() {
  const theme = ThemeSettings();
  const router = createBrowserRouter(Router)
  return (
    <SnackbarProvider anchorOrigin={{ vertical: "top", horizontal: "right" }} action={snackbarKey => <SnackbarCloseButton snackbarKey={snackbarKey} />}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider >
    </SnackbarProvider >
  )
}

export default App
