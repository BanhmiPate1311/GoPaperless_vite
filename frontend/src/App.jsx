import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import Routers from "./routers/Routers";
import { theme } from "./utils/theme";

function App() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isFetching + isMutating > 0}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routers />
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
