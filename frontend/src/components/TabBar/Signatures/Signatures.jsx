import { ReactComponent as ValidIcon } from "@/assets/images/svg/icon_Chip_White.svg";
import { ReactComponent as SignatureIcon } from "@/assets/images/svg/signature.svg";
import Error from "@mui/icons-material/Error";
import { Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { SignaturesInfo } from "./SignaturesInfo";

export const Signatures = ({ signedInfo }) => {
  // console.log("signedInfo: ", signedInfo);
  const { t } = useTranslation();

  const signType = "Signature";

  const valueSign = [
    {
      name: "valid",
      value: signedInfo.filter(
        (sig) =>
          sig.value.warnings?.length === 0 &&
          sig.value.signature.is_valid === true
      ),
      icon: (
        <Stack
          padding="7px"
          border="1px solid transparent"
          // bgcolor="rgb(255, 240, 226)"
          borderRadius="50px"
          justifyContent="center"
          direction="row"
        >
          <ValidIcon sx={{ color: "rgb(235, 106, 0)", fontSize: "18px" }} />
        </Stack>
      ),
      title:
        signType === "Signature" ? "Signature Valid" : "Sealed Signature Valid",
    },
    {
      name: "indeterminate",
      value: signedInfo.filter(
        (sig) =>
          sig.value.warnings?.length > 0 &&
          sig.value.signature.is_valid === true
      ),
      icon: (
        <Stack
          padding="7px"
          border="1px solid transparent"
          bgcolor="rgb(255, 240, 226)"
          borderRadius="50px"
          justifyContent="center"
        >
          {/* <Error sx={{ color: "rgb(235, 106, 0)", fontSize: "18px" }} /> */}
          <Error sx={{ color: "rgb(235, 106, 0)", fontSize: "18px" }} />
        </Stack>
      ),
      title: "indeterminate signatures",
    },
    {
      name: "invalid",
      value: signedInfo.filter((sig) => sig.value.signature.is_valid === false),
      icon: (
        <Stack
          padding="7px"
          bgcolor="rgb(255, 233, 235)"
          borderRadius="50px"
          justifyContent="center"
        >
          {/* <Error sx={{ color: "rgb(216, 81, 63)", fontSize: "18px" }} /> */}
          <Error sx={{ color: "rgb(216, 81, 63)", fontSize: "18px" }} />
        </Stack>
      ),
      title: "invalid signatures",
    },
  ];

  const newSign = valueSign.filter((sig) => sig.value.length > 0);
  // console.log("newSign: ", newSign);

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
      {newSign.length > 0 &&
        newSign.map((val, i) => (
          <SignaturesInfo sign={val} signType={signType} key={i} />
        ))}
    </Box>
  );
};

Signatures.propTypes = {
  signedInfo: PropTypes.array,
};

export default Signatures;
