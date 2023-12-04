// import Backdrop from "@mui/material/Backdrop";
// import CircularProgress from "@mui/material/CircularProgress";
// import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import Routers from "./routers/Routers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  // const isFetching = useIsFetching();
  // const isMutating = useIsMutating();
  return (
    <>
      {/* <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isFetching + isMutating > 0}
      >
        <CircularProgress color="inherit" />
      </Backdrop> */}
      <ToastContainer position="bottom-right" />
      <BrowserRouter>
        <Routers />
      </BrowserRouter>
    </>
  );
}

export default App;
