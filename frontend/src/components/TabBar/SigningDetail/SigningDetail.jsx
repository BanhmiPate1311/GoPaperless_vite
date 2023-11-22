import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import { ReactComponent as PersonIcon } from "@/assets/images/svg/person_icon.svg";
import IconButton from "@mui/material/IconButton";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const SigningDetail = ({ open, data, handleClose }) => {
  console.log("data: ", data);
  return (
    <Drawer
      anchor={"right"}
      open={open}
      onClose={handleClose}
      className="choioioi"
    >
      <Box width="350px">
        <Stack
          direction="row"
          alignItems={"center"}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            p: 2,
            backgroundColor: "#fff",
          }}
        >
          <Stack direction={"row"} alignItems={"center"} gap={1} flexGrow={1}>
            <PersonIcon />
            <Box>
              <Typography
                fontWeight="550"
                textTransform="uppercase"
                variant="h6"
              >
                {data.firstName} {data.lastName}
              </Typography>
              <Typography variant="h5" color={"signingtext2.main"}>
                {data.email}
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Accordion disableGutters elevation={0}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            sx={{
              backgroundColor: "accordingBackGround.main",
              minHeight: "unset !important",
              //   "& .MuiAccordionSummary-content": {
              //     justifyContent: "space-between",
              //   },
            }}
          >
            <Typography variant="h6">WorkFlow Name</Typography>
            <Stack
              justifyContent="center"
              alignItems="center"
              sx={{
                height: "18px",
                width: "18px",
                borderRadius: "50%",
                backgroundColor: "signingtextBlue.main",
                color: "white",
                fontSize: "10px",
              }}
            >
              abc
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>abc</AccordionDetails>
        </Accordion>
      </Box>
    </Drawer>
  );
};
SigningDetail.propTypes = {
  open: PropTypes.bool,
  data: PropTypes.object,
  handleClose: PropTypes.func,
};
export default SigningDetail;
