import { ReactComponent as SignatureIcon } from "@/assets/images/svg/signature.svg";
import { Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { SignaturesInfo } from "./SignaturesInfo";

export const Signatures = ({ signedInfo }) => {
  console.log("signedInfo: ", signedInfo);
  const { t } = useTranslation();
  return (
    <Box>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <SignatureIcon />
          <Typography variant="h6" sx={{ fontWeight: "550" }}>
            {t("0-common.signatures")}
          </Typography>
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
        </Stack>
      </Box>

      {/* <Divider sx={{ color: "borderColor.main" }} /> */}
      <SignaturesInfo signedInfo={signedInfo} />
    </Box>
  );
};

Signatures.propTypes = {
  signedInfo: PropTypes.array,
};

export default Signatures;
