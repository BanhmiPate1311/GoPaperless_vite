import imageNotFound from "@/assets/images/noSignature.png";
import { ReactComponent as ParticipantIcon } from "@/assets/images/svg/participant.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import { Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ParticipantInfo } from "./ParticipantInfo";
import { ParticipantModal } from "./ParticipantModal";

// eslint-disable-next-line react/prop-types
export const Participant = ({ participantsList, signType }) => {
  // console.log("participantsList: ", participantsList);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Stack
        sx={{ px: "20px", height: "50px" }}
        direction="row"
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {/* {signType === "Signature" ? <ParticipantIcon /> : <SealIcon />} */}
          <ParticipantIcon />
          <Typography sx={{ fontWeight: "550" }} variant="h3">
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
        </Stack>
        {participantsList.length !== 0 && (
          <Stack direction="row" justifyContent={"center"}>
            <IconButton onClick={handleOpen}>
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
          {/* <Box
            component="img"
            sx={{
              width: "200px",
            }}
            alt="The house from the offer."
            src={imageNotFound}
          /> */}
          <Typography textAlign="center" variant="h5" fontWeight="bold">
            {signType === "Signature"
              ? t("validation.signatureNotFound")
              : t("validation.sealNotFound")}
            {/* {t("validation.signatureNotFound")} */}
          </Typography>
        </Box>
      ) : (
        <ParticipantInfo
          participantsList={participantsList}
          signType={signType}
        />
      )}

      {/* Modal */}
      {/* <DialogField
        open={open}
        title={t("0-common.workflow")}
        data={<TableField data={workFlow.participants} />}
        handleClose={handleClose}
      /> */}
      <ParticipantModal
        open={open}
        handleClose={handleClose}
        title={t("0-common.workflow")}
        data={participantsList}
      />
    </Box>
  );
};
Participant.propTypes = {
  participantsList: PropTypes.array,
};
export default Participant;
