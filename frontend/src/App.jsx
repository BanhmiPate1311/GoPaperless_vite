import { BrowserRouter } from "react-router-dom";
import Routers from "./routers/Routers";
import { theme } from "./utils/theme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

function App() {
  // const isFetching = useIsFetching();
  // const isMutating = useIsMutating();
  return (
    <>
      {/* {isFetching + isMutationg !== 0 && <Loading />} */}
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
