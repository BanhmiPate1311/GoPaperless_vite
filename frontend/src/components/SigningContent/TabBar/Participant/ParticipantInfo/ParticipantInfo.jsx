import { ReactComponent as EditorIcon } from "@/assets/images/svg/editor.svg";
import { ReactComponent as ReviewerIcon } from "@/assets/images/svg/reviewer.svg";
import { ReactComponent as SendCopyIcon } from "@/assets/images/svg/send_copy.svg";
import { ReactComponent as SignerIcon } from "@/assets/images/svg/signer.svg";
import { useCommonHook } from "@/hook";
import { checkSignerWorkFlow } from "@/utils/commonFunction";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
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
    <Accordion
      disableGutters
      elevation={0}
      expanded={expand}
      sx={{
        height: "calc(100% - 50px)",
        "> .MuiCollapse-vertical": {
          maxHeight: "calc(100% - 25px) !important",
          overflow: "auto",
        },
      }}
    >
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
          height: "25px",
          px: "20px",
        }}
      >
        <Typography variant="h2" color="textBlack.main">
          {signType === "Signature"
            ? t("0-common.participants")
            : t("0-common.seals")}
        </Typography>
        {/* <Avatar
          sx={{
            bgcolor: "signingtextBlue.main",
            width: 16,
            height: 16,
            fontSize: "10px",
          }}
        >
          {participantsList.length}
        </Avatar> */}
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        {participantsList.map((participant, index) => {
          // const status = checkSignerStatus(participant, signerToken);
          const check = checkSignerWorkFlow(participant, signerToken);

          return (
            <Stack
              key={index}
              direction={"row"}
              spacing={1}
              backgroundColor={check ? "signerBackGround.main" : ""}
              color={check ? "signingtextBlue.main" : ""}
              sx={{
                p: "10px 20px",
              }}
              alignItems={"center"}
              borderTop="1px solid"
              borderBottom={
                index === participantsList.length - 1 ? "1px solid" : ""
              }
              borderColor="borderColor.main"
              // height="50px"
            >
              <Box
                onClick={() => toggleDrawer(index)}
                sx={{ cursor: "pointer" }}
              >
                {participant.signerType === 1 && (
                  <SignerIcon width={24} height={24} />
                )}
                {participant.signerType === 2 && (
                  <ReviewerIcon width={24} height={24} />
                )}
                {participant.signerType === 3 && (
                  <EditorIcon width={24} height={24} />
                )}
                {participant.signerType === 5 && (
                  <SendCopyIcon width={24} height={24} />
                )}
              </Box>
              <Box flexGrow={1}>
                <Typography
                  variant="h6"
                  color={check ? "signingtextBlue.main" : "textBlack.main"}
                  fontSize={16}
                  lineHeight="normal"
                >
                  {participant.lastName} {participant.firstName}
                </Typography>
                <Typography
                  variant="h2"
                  color={check ? "signingtextBlue.main" : "signingtext2.main"}
                >
                  {/* {status === 2
                    ? participant.signedType === "NORMAL"
                      ? t("signing.signature_valid")
                      : t("validation.sealValidTitle2")
                    : status === 1
                    ? t("signing.wait_my_signature")
                    : t("signing.wait_signature")} */}
                  {participant.signerType === 1 && "Waiting for signature"}
                  {participant.signerType === 2 && "Waiting for approve"}
                  {participant.signerType === 3 && "Signature is valid"}
                  {participant.signerType === 5 && "Only view"}
                </Typography>
              </Box>
              {/* <IconButton onClick={() => toggleDrawer(index)}>
                <ShowDetailIcon />
              </IconButton> */}
              <SigningDetail
                open={isOpen[index]}
                participant={participant}
                handleClose={() => toggleDrawer(index)}
              />
            </Stack>
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
