import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { useController } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";

export const DialogDraw = ({
  open,
  handleClose,
  name,
  control,
  setErrorDraw,
}) => {
  const {
    field: { onChange },
    fieldState: { error },
  } = useController({ name, control });
  const sigCanvasRef = useRef(null);

  useEffect(() => {
    if (error) {
      setErrorDraw(error?.message);
    }
  }, [error, setErrorDraw]);
  //   setErrorDraw(error?.message);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      {/* <DialogTitle id="scroll-dialog-title">Subscribe</DialogTitle> */}
      <DialogContent dividers={scroll === "paper"}>
        <DialogContentText
          id="scroll-dialog-description"
          tabIndex={-1}
          sx={{ border: "1px solid #ccc" }}
        >
          <SignatureCanvas
            name={name}
            canvasProps={{
              //   height: "96",
              style: {
                backgroundColor: "white",
                marginLeft: "auto",
                marginRight: "auto",
                width: "100%",
              },
            }}
            ref={sigCanvasRef}
          />
        </DialogContentText>
        {/* {trimmedDataURL ? (
          <Box
            component="img"
            sx={{
              height: 53,
            }}
            alt="The house from the offer."
            src={trimmedDataURL}
          />
        ) : null} */}
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          //   style={{
          //     marginBottom: "0.5rem",
          //     marginTop: "1rem",
          //     fontWeight: "medium",
          //   }}
          onClick={() => sigCanvasRef.current.clear()}
        >
          Clear
        </Button>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onChange(sigCanvasRef.current.getTrimmedCanvas().toDataURL());
            handleClose();
          }}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogDraw.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  name: PropTypes.string,
  control: PropTypes.object,
  onClick: PropTypes.func,
  setErrorDraw: PropTypes.func,
};

export default DialogDraw;
