import { ReactComponent as ParticipantIcon } from "@/assets/images/svg/participant.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import { TableField } from "@/components/form";
import DialogField from "@/components/form/Dialog_field";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const Participant = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const workFlow = queryClient.getQueryData(["workflow"]);
  console.log("workFlow: ", workFlow);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Stack sx={{ p: 2 }} direction="row" justifyContent="space-between">
        <Stack
          sx={{ fontWeight: "550" }}
          direction="row"
          spacing={1}
          alignItems="center"
        >
          <ParticipantIcon /> Participant
          <Stack
            justifyContent="center"
            alignItems="center"
            sx={{
              height: "16px",
              width: "16px",
              borderRadius: "50%",
              backgroundColor: "signingtextBlue.main",
              color: "white",
              fontSize: "10px",
            }}
          >
            {workFlow.participants.length}
          </Stack>
        </Stack>
        <Box>
          <IconButton onClick={handleClickOpen}>
            <SettingIcon />
          </IconButton>
        </Box>
      </Stack>

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

export default Participant;
