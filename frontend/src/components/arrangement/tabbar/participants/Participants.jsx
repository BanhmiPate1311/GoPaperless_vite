import imageNotFound from "@/assets/images/noSignature.png";
import { ReactComponent as ParticipantIcon } from "@/assets/images/svg/participant.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import { ParticipantModal } from "@/components/SigningContent/TabBar/Participant/ParticipantModal";
import { Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ParticipantInfo } from ".";

// eslint-disable-next-line react/prop-types
export const Participants = ({ participantsList }) => {
  const { t } = useTranslation();

  //Begin: Open modal
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  //End: Open modal

  return (
    <Box sx={{ height: "100%" }}>
      <Stack
        sx={{ px: "20px", height: "50px" }}
        direction="row"
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <ParticipantIcon />
          <Typography sx={{ fontWeight: "550" }} variant="h3">
            {t("0-common.participants")}
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
        </Stack>
        {participantsList.length !== 0 && (
          <Stack direction="row" justifyContent={"center"}>
            <IconButton
              onClick={handleOpen}
              sx={{
                height: "34px",
                margin: "auto 0",
              }}
            >
              <SettingIcon />
            </IconButton>
          </Stack>
        )}
      </Stack>
      {participantsList.length === 0 ? (
        <Box>
          <Box width={200} textAlign="center" mx="auto">
            <img
              width="100%"
              // style={{ width: "20px" }}
              src={imageNotFound}
              alt="loading"
            />
          </Box>

          <Typography textAlign="center" variant="h5" fontWeight="bold">
            {t("validation.signatureNotFound")}
          </Typography>
        </Box>
      ) : (
        <ParticipantInfo participantsList={participantsList} />
      )}

      <ParticipantModal
        open={open}
        handleClose={handleClose}
        title={t("0-common.workflow")}
        data={participantsList}
      />
    </Box>
  );
};
Participants.propTypes = {
  participantsList: PropTypes.array,
};
export default Participants;
