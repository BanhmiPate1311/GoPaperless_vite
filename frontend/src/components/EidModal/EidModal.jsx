import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Grow from "@mui/material/Grow";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";
import { EidStepper } from ".";
import { useTranslation } from "react-i18next";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  // height: 700,
  maxHeight: 648,
  bgcolor: "dialogBackground.main",
  border: "2px solid #000",
  borderRadius: "10px",
  boxShadow: 24,
  padding: "10px 15px 23px",
  overflowY: "auto",
  fontFamily: "Montserrat,Nucleo,Helvetica,sans-serif",
};
export const EidModal = ({ open, onClose, workFlow, signatureData }) => {
  const { t } = useTranslation();
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
            width: "499px",
            transform: "translate(-50%, -50%)",
            transformOrigin: "0 0 0",
            // padding: "16px 0px 59px 16px",
            // paddingTop: "16px",
            // paddingLeft: "30px",
            border: "none",
            outline: "none",
          }}
          {...(open ? { timeout: 1000 } : {})}
        >
          <Box sx={style}>
            <Stack
              direction="row"
              // justifyContent="flex-end"
              alignItems="center"
              height={"31px"}
              marginBottom={"10px"}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  textTransform: "uppercase",
                  display: "inline-block",
                  color: "signingtextBlue.main",
                  borderBottom: "4px solid",
                  borderColor: "signingtextBlue.main",
                  borderRadius: "5px",
                  // paddingBottom: "5px",
                  // marginBottom: "10px",
                  p: 0,
                }}
              >
                {t("electronic.title")}
              </Typography>
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
