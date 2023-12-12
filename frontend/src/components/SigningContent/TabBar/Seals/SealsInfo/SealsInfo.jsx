import { ReactComponent as ShowDetailIcon } from "@/assets/images/svg/showdetail_icon.svg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useState } from "react";
import { SignatureDetail } from "../SignatureDetail";

export const SealsInfo = ({ sign }) => {
  // console.log("sign: ", sign);
  const [isOpen, setIsOpen] = useState([false]);
  // console.log("isOpen: ", isOpen);
  // let name = sign.name + " " + signType;

  const [expand, setExpand] = useState(true);

  const toggleDrawer = (index) => {
    const newIsOpen = [...isOpen];
    newIsOpen[index] = !newIsOpen[index];
    setIsOpen(newIsOpen);
  };
  return (
    <Accordion disableGutters elevation={0} expanded={expand}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon onClick={() => setExpand(!expand)} />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
        sx={{
          backgroundColor: "accordingBackGround.main",
          minHeight: "unset !important",
          "& .MuiAccordionSummary-content": {
            justifyContent: "space-between",
            alignItems: "center",
          },
          height: "36px",
        }}
      >
        <Typography variant="h6">{sign.title}</Typography>
        <Avatar
          sx={{
            bgcolor: "signingtextBlue.main",
            width: 16,
            height: 16,
            fontSize: "10px",
          }}
        >
          {sign.value.length}
        </Avatar>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        {sign.value.map((signvalue, index) => {
          // console.log("signvalue: ", signvalue);
          // const status = checkSignerStatus(participant, signerToken);
          // const check = checkSignerWorkFlow(participant, signerToken);

          return (
            <Box key={index}>
              <Stack
                direction={"row"}
                spacing={1}
                backgroundColor="signingWFBackground.main"
                // color={check ? "signingtextBlue.main" : ""}
                sx={{
                  px: 2,
                }}
                alignItems={"center"}
                borderTop="1px solid"
                borderBottom={
                  index === sign.value.length - 1 ? "1px solid" : ""
                }
                borderColor="borderColor.main"
              >
                {sign.icon}
                <Box flexGrow={1}>
                  <Typography variant="h6">
                    {signvalue.value.signature.certificate.subject.common_name}
                  </Typography>
                  <Typography variant="h5">{sign.name}</Typography>
                </Box>
                <IconButton onClick={() => toggleDrawer(index)}>
                  <ShowDetailIcon />
                </IconButton>
                {isOpen[index] && (
                  <SignatureDetail
                    open={isOpen[index]}
                    signDetail={signvalue}
                    sign={sign}
                    handleClose={() => toggleDrawer(index)}
                  />
                )}
              </Stack>
            </Box>
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
};

SealsInfo.propTypes = {
  signedInfo: PropTypes.array,
  signType: PropTypes.string,
  sign: PropTypes.object,
};

export default SealsInfo;