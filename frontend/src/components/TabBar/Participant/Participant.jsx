import { ReactComponent as ParticipantIcon } from "@/assets/images/svg/participant.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import { TableField } from "@/components/form";
import DialogField from "@/components/form/Dialog_field";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ParticipantInfo } from "./ParticipantInfo";
import { Typography } from "@mui/material";
import NestModal from "./NestModal";

// eslint-disable-next-line react/prop-types
export const Participant = ({ workFlow }) => {
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
      <Stack sx={{ p: 2 }} direction="row" justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center">
          <ParticipantIcon />
          <Typography sx={{ fontWeight: "550" }} variant="h6">
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
            {workFlow.participants.length}
          </Avatar>
        </Stack>
        <Box>
          <IconButton onClick={handleOpen}>
            <SettingIcon />
          </IconButton>
        </Box>
      </Stack>
      <ParticipantInfo workFlow={workFlow} />
      {/* <NestModal
        open={open}
        handleClose={handleClose}
        title={t("0-common.workflow")}
        data={workFlow.participants}
      /> */}
      {/* Modal */}
      <DialogField
        open={open}
        title={t("0-common.workflow")}
        data={<TableField data={workFlow.participants} />}
        handleClose={handleClose}
      />
    </Box>
  );
};
Participant.propTypes = {
  workFlow: PropTypes.shape({
    // Define the structure of the object if needed
    // For example:
    // key1: PropTypes.string,
    // key2: PropTypes.number,
    participants: PropTypes.array,
  }),
};
export default Participant;
