import React, { useState } from "react";
import PropTypes from "prop-types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ReactComponent as ShowDetailIcon } from "@/assets/images/svg/showdetail_icon.svg";

export const SignaturesInfo = ({ signedInfo }) => {
  const [isOpen, setIsOpen] = useState([false]);
  // console.log("isOpen: ", isOpen);

  const toggleDrawer = (index) => {
    const newIsOpen = [...isOpen];
    newIsOpen[index] = !newIsOpen[index];
    setIsOpen(newIsOpen);
  };
  return (
    <Accordion disableGutters elevation={0}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
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
        <Typography variant="h6">WorkFlow Name</Typography>
        <Avatar
          sx={{
            bgcolor: "signingtextBlue.main",
            width: 16,
            height: 16,
            fontSize: "10px",
          }}
        >
          {signedInfo.length}
        </Avatar>
      </AccordionSummary>
      {/* <AccordionDetails sx={{ p: 0 }}>
        {workFlow.participants.map((participant, index) => {
          const status = checkSignerStatus(participant, signerToken);
          const check = checkSignerWorkFlow(participant, signerToken);

          return (
            <Box key={index}>
              <Stack
                direction={"row"}
                spacing={1}
                backgroundColor={check ? "signerBackGround.main" : ""}
                color={check ? "signingtextBlue.main" : ""}
                sx={{
                  px: 2,
                }}
                alignItems={"center"}
                borderTop="1px solid"
                borderBottom={
                  index === workFlow.participants.length - 1 ? "1px solid" : ""
                }
                borderColor="borderColor.main"
              >
                {check ? (
                  <SignerSelected />
                ) : (
                  <WaitingSig width={24} height={24} />
                )}
                <Box flexGrow={1}>
                  <Typography variant="h6">
                    {participant.firstName} {participant.lastName}
                  </Typography>
                  <Typography variant="h5">
                    {status === 2
                      ? "Qualified Advance Signature"
                      : status === 1
                      ? "Waiting for my signature"
                      : "Waiting for signature"}
                  </Typography>
                </Box>
                <IconButton onClick={() => toggleDrawer(index)}>
                  <ShowDetailIcon />
                </IconButton>
                <SigningDetail
                  open={isOpen[index]}
                  participant={participant}
                  handleClose={() => toggleDrawer(index)}
                />
                
              </Stack>
            </Box>
          );
        })}
      </AccordionDetails> */}
    </Accordion>
  );
};

SignaturesInfo.propTypes = { signedInfo: PropTypes.array };

export default SignaturesInfo;
