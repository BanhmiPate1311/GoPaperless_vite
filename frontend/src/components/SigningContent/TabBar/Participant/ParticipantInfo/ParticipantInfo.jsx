import { ReactComponent as ShowDetailIcon } from "@/assets/images/svg/showdetail_icon.svg";
import { ReactComponent as Signed_Icon } from "@/assets/images/svg/signed_icon2.svg";
import { ReactComponent as SignerSelected } from "@/assets/images/svg/signer_select.svg";
import { ReactComponent as WaitingSig } from "@/assets/images/svg/waiting_sig.svg";
import { useCommonHook } from "@/hook";
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
import { useTranslation } from "react-i18next";
import { SigningDetail } from "../SigningDetail";

export const ParticipantInfo = ({ participantsList, signType }) => {
  const { t } = useTranslation();
  const { signerToken } = useCommonHook();
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
        <Typography variant="h6">
          {signType === "Signature"
            ? t("0-common.participants")
            : t("0-common.seals")}
        </Typography>
        <Avatar
          sx={{
            bgcolor: "signingtextBlue.main",
            width: 16,
            height: 16,
            fontSize: "10px",
          }}
        >
          {participantsList.length}
        </Avatar>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        {participantsList.map((participant, index) => {
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
                  index === participantsList.length - 1 ? "1px solid" : ""
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
                    {participant.lastName} {participant.firstName}
                  </Typography>
                  <Typography variant="h5">
                    {status === 2
                      ? t("signing.signature_valid")
                      : status === 1
                      ? t("signing.wait_my_signature")
                      : t("signing.wait_signature")}
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
  participantsList: PropTypes.array,
  signType: PropTypes.string,
};
export default ParticipantInfo;