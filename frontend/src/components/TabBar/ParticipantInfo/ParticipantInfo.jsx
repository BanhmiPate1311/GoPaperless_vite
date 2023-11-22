import { ReactComponent as ShowDetailIcon } from "@/assets/images/svg/showdetail_icon.svg";
import { ReactComponent as SignerSelected } from "@/assets/images/svg/signer_select.svg";
import { ReactComponent as WaitingSig } from "@/assets/images/svg/waiting_sig.svg";
import { checkSignerStatus, checkSignerWorkFlow } from "@/utils/commonFunction";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SigningDetail } from "../SigningDetail";

export const ParticipantInfo = ({ workFlow }) => {
  const [search] = useSearchParams();
  const signerToken = search.get("access_token");
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  // const handleClose = () => {
  //   setIsOpen(false);
  // };
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
          },
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
          {workFlow.participants.length}
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        {workFlow.participants.map((participant, i) => {
          const status = checkSignerStatus(participant, signerToken);
          const check = checkSignerWorkFlow(participant, signerToken);

          return (
            <>
              <Stack
                key={i}
                direction={"row"}
                spacing={1}
                backgroundColor={check ? "signerBackGround.main" : ""}
                sx={{
                  px: 2,
                }}
                alignItems={"center"}
                borderTop="1px solid"
                borderBottom={
                  i === workFlow.participants.length - 1 ? "1px solid" : ""
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
                      ? "Waiting for my signature"
                      : status === 1
                      ? "Waiting for my signature"
                      : "Waiting for signature"}
                  </Typography>
                </Box>
                <IconButton onClick={toggleDrawer}>
                  <ShowDetailIcon />
                </IconButton>
              </Stack>
              <SigningDetail
                open={isOpen}
                data={participant}
                handleClose={toggleDrawer}
              />
            </>
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
};
ParticipantInfo.propTypes = {
  workFlow: PropTypes.shape({
    // Define the structure of the object if needed
    // For example:
    // key1: PropTypes.string,
    // key2: PropTypes.number,
    participants: PropTypes.array,
  }),
};
export default ParticipantInfo;
