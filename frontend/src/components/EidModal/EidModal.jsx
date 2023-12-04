import { ReactComponent as ReactLogo } from "@/assets/images/eid/finger.svg";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Grow from "@mui/material/Grow";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";
import { EidStepper } from ".";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 700,
  maxHeight: 760,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflowY: "auto",
  fontFamily: "Montserrat,Nucleo,Helvetica,sans-serif",
};
export const EidModal = ({ open, onClose, workFlow, signatureData }) => {
  return (
    <Box>
      <Modal
        aria-labelledby="transition1-modal-title"
        aria-describedby="transition1-modal-description"
        open={open}
        onClose={onClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Grow
          in={open}
          style={{
            width: "500px",
            transform: "translate(-50%, -50%)",
            transformOrigin: "0 0 0",
            // padding: "16px 0px 59px 16px",
            paddingTop: "16px",
            paddingLeft: "30px",
            border: "none",
            outline: "none",
          }}
          {...(open ? { timeout: 1000 } : {})}
        >
          <Box sx={style}>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
            >
              <Typography
                sx={{
                  color: "rgb(79, 78, 78)",
                  marginRight: "8px",
                  fontWeight: 500,
                  fontSize: "12px",
                  lineHeight: "14px",
                }}
              >
                Powered by
              </Typography>
              <ReactLogo />
            </Stack>
            <EidStepper
              onClose={onClose}
              signatureData={signatureData}
              workFlow={workFlow}
            />
          </Box>
        </Grow>
      </Modal>
    </Box>
  );
};

EidModal.propTypes = {
  workFlow: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  signatureData: PropTypes.object,
};

export default EidModal;
