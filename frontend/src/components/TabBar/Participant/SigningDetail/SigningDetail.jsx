import { ReactComponent as PencilIcon } from "@/assets/images/svg/pencil_icon.svg";
import { ReactComponent as PencilSigningIcon } from "@/assets/images/svg/pencil_signing.svg";
import { ReactComponent as PersonIcon } from "@/assets/images/svg/person_icon.svg";
import { checkSignerStatus, checkSignerWorkFlow } from "@/utils/commonFunction";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Divider } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";

export const SigningDetail = ({ open, participant, handleClose }) => {
  const [search] = useSearchParams();
  const signerToken = search.get("access_token");
  const status = checkSignerStatus(participant, signerToken);
  const check = checkSignerWorkFlow(participant, signerToken);

  const participantInfo = [
    {
      title: "Signing Time",
      subtitle: participant.signedTime ? participant.signedTime : null,
    },
    {
      title: "Certificate Owner",
      subtitle: participant.owner ? participant.owner : null,
    },
    {
      title: "Certificate issuer",
      subtitle: participant.issuer ? participant.issuer : null,
    },
    {
      title: "Certificate validity period",
      subtitle: participant.validFrom
        ? participant.validFrom + " " + participant.validTo
        : null,
    },
    {
      title: "Resolution",
      subtitle: participant.signing_purpose
        ? participant.signing_purpose
        : "Signature",
    },
    {
      title: "Company",
      subtitle: participant.metaInformation.company
        ? participant.metaInformation.company
        : null,
    },
    {
      title: "Position",
      subtitle: participant.metaInformation.position
        ? participant.metaInformation.position
        : null,
    },
    {
      title: "Structural subdivision",
      subtitle: participant.metaInformation.structural_subdivision
        ? participant.metaInformation.structural_subdivision
        : null,
    },
    {
      title: "Location",
      subtitle: participant.metaInformation.country
        ? participant.metaInformation.country
        : null,
    },
    {
      title: "Reason",
      subtitle: participant.customReason ? participant.customReason : null,
    },
  ].filter((item) => item.subtitle !== null);

  return (
    <Drawer
      anchor={"right"}
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDrawer-paper": {
          borderRadius: "10px",
        },
      }}
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
                {participant.firstName} {participant.lastName}
              </Typography>
              <Typography variant="h5" color={"signingtext2.main"}>
                {participant.email}
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Accordion defaultExpanded={true} disableGutters elevation={0}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            sx={{
              backgroundColor: "accordingBackGround.main",
              minHeight: "unset !important",
              "& .MuiAccordionSummary-content": {
                alignItems: "center",
                gap: 1,
              },
            }}
          >
            {status === 2 ? (
              <>
                <PencilSigningIcon />
                <Typography
                  variant="h5"
                  sx={{
                    color: check ? "signingtextBlue.main" : "signingtext1.main",
                  }}
                >
                  Qualified Advance Signature
                </Typography>
              </>
            ) : status === 1 ? (
              <>
                <PencilSigningIcon />
                <Typography
                  variant="h5"
                  sx={{
                    color: check ? "signingtextBlue.main" : "signingtext1.main",
                  }}
                >
                  Waiting for my signature
                </Typography>
              </>
            ) : (
              <>
                <PencilIcon />
                <Typography
                  variant="h5"
                  sx={{
                    color: check ? "signingtextBlue.main" : "signingtext1.main",
                  }}
                >
                  Waiting for signature
                </Typography>
              </>
            )}
          </AccordionSummary>
          <AccordionDetails sx={{ py: 2, px: 0 }}>
            {participantInfo.map((item, index) => (
              <Box key={index} px={2}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "signingtext1.main",
                    fontWeight: 600,
                    // mb: 1,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: "signingtext2.main",
                  }}
                >
                  {item.subtitle}
                </Typography>
                <Divider sx={{ my: 1 }} />
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      </Box>
    </Drawer>
  );
};
SigningDetail.propTypes = {
  open: PropTypes.bool,
  participant: PropTypes.object,
  handleClose: PropTypes.func,
};
export default SigningDetail;
