import { ReactComponent as ShowDetailIcon } from "@/assets/images/svg/showdetail_icon.svg";
import { ReactComponent as SignerSelected } from "@/assets/images/svg/signer_select.svg";
import { ReactComponent as WaitingSig } from "@/assets/images/svg/waiting_sig.svg";
import { ReactComponent as Signed_Icon } from "@/assets/images/svg/signed_icon2.svg";
import { checkSignerStatus, checkSignerWorkFlow } from "@/utils/commonFunction";
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
import { useSearchParams } from "react-router-dom";
import { SigningDetail } from "../SigningDetail";

export const ParticipantInfo = ({ workFlow }) => {
  const [search] = useSearchParams();
  const signerToken = search.get("access_token");
  const [isOpen, setIsOpen] = useState([false]);
  // console.log("isOpen: ", isOpen);

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
        <Typography variant="h6">Participants</Typography>
        <Avatar
          sx={{
            bgcolor: "signingtextBlue.main",
            width: 16,
            height: 16,
            fontSize: "10px",
          }}
        >
          {workFlow.participants.length}
        </Avatar>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        {workFlow.participants.map((participant, index) => {
          const status = checkSignerStatus(participant, signerToken);
          // console.log("status: ", status);
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
                {/* {check ? (
                  <SignerSelected />
                ) : (
                  <WaitingSig width={24} height={24} />
                )} */}
                {status === 2 ? (
                  <Signed_Icon />
                ) : check ? (
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
