import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import Grow from "@mui/material/Grow";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";
import { convertTime } from "@/utils/commonFunction";

const Transition = forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />;
});

export const ModalCertInfor = ({ open, onClose, data, provider }) => {
  const { t } = useTranslation();

  const issuer = () => {
    switch (provider) {
      case "USB_TOKEN_SIGNING":
        return data.issuer.commonName;
      default:
        return data.issuer;
    }
  };

  const subject = () => {
    switch (provider) {
      case "USB_TOKEN_SIGNING":
        return data.subject.commonName;
      default:
        return data.subject;
    }
  };

  const subjectDN = () => {
    switch (provider) {
      case "USB_TOKEN_SIGNING":
        return data.name;
      default:
        return data.subjectDN;
    }
  };

  const certificate = [
    {
      title: t("0-common.issuer"),
      value: issuer(),
    },
    {
      title: t("signing.common_name"),
      value: subject(),
    },
    {
      title: t("0-common.subjectDN"),
      value: subjectDN(),
    },
    {
      title: t("0-common.valid_from"),
      value: data.validFrom ? convertTime(data.validFrom) : null,
    },
    {
      title: t("0-common.valid_to"),
      value: data.validTo ? convertTime(data.validTo) : null,
    },
  ].filter((item) => item.value !== null);

  return (
    <Dialog
      keepMounted={false}
      TransitionComponent={Transition}
      open={!!open}
      onClose={onClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      PaperProps={{
        sx: {
          width: "500px",
          maxWidth: "500px", // Set your width here
          height: "700px",
          borderRadius: "10px",
        },
      }}
    >
      <DialogTitle
        component="div"
        id="scroll-dialog-title"
        sx={{
          backgroundColor: "dialogBackground.main",
          p: "10px 20px",
          height: "51px",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            textTransform: "uppercase",
            display: "inline-block",
            color: "signingtextBlue.main",
            borderBottom: "4px solid",
            borderColor: "signingtextBlue.main",
            borderRadius: "5px",
            paddingBottom: "5px",
          }}
        >
          {t("modal.modal5_title")}
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          backgroundColor: "dialogBackground.main",
          height: "100%",
          // py: "10px",
          borderBottom: "1px solid",
          borderColor: "borderColor.main",
          p: "0 20px 10px",
        }}
      >
        <DialogContentText
          component="div"
          id="scroll-dialog-description"
          tabIndex={-1}
          sx={{
            height: "100%",
          }}
        >
          <Stack sx={{ mt: 0, mb: 1, height: "100%" }}>
            {certificate.map((item, index) => (
              <Box key={index} mb="10px">
                <Typography
                  variant="h6"
                  height="17px"
                  fontWeight={600}
                  mb="10px"
                >
                  {item.title}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  margin="normal"
                  multiline
                  defaultValue={item.value}
                  sx={{
                    my: 0,
                    "& .MuiInputBase-root": {
                      minHeight: "45px",
                      height: "auto !important",
                    },
                  }}
                  InputProps={{
                    readOnly: true,
                    sx: {
                      backgroundColor: "signingWFBackground.main",
                    },
                  }}
                />
              </Box>
            ))}

            {/* {unavail && <Alert severity="error">{unavail}</Alert>} */}
          </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: "15px 20px", height: "70px" }}>
        <Button
          variant="outlined"
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          onClick={onClose}
        >
          {t("0-common.cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalCertInfor.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.object,
  provider: PropTypes.string,
};

export default ModalCertInfor;
