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
import imageNotFound from "@/assets/images/noSignature.png";

export const Signatures = ({ sigList1, sigList2 }) => {
  const signedInfo = [...sigList1, ...sigList2];
  console.log("signedInfo: ", signedInfo);
  const { t } = useTranslation();

  // const newSignedInfo = signedInfo.map((item) => item.value);
  // console.log("newSignedInfo: ", newSignedInfo);
  const signType = "Signature";

  const valueSign = [
    {
      name: t("validation.sigValidTitle"),
      value: signedInfo.filter((sig) => {
        return sig.warnings === undefined && sig.signature.is_valid === true;
      }),
      icon: (
        <Stack
          padding="7px"
          border="1px solid transparent"
          // bgcolor="rgb(255, 240, 226)"
          borderRadius="50px"
          justifyContent="center"
          direction="row"
        >
          <ValidIcon sx={{ color: "#3B82F6", fontSize: "18px" }} />
        </Stack>
      ),
      title: t("signing.signature_valid"),
    },
    {
      name: t("validation.indeterminateTitle"),
      value: signedInfo.filter((sig) => {
        return sig.warnings && sig.signature.is_valid === true;
      }),
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
      title: t("signing.indeterminate signatures"),
    },
    {
      name: t("validation.invalidSig"),
      value: signedInfo.filter((sig) => {
        // console.log("invalid: ", sig.signature.is_valid);

        return sig.signature.is_valid === false;
      }),
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
      title: t("signing.invalid signatures"),
    },
  ];

  const newSign = valueSign.filter((sig) => sig.value.length > 0);
  console.log("newSign: ", newSign);

  return (
    <Box>
      <Stack direction="row" sx={{ px: "20px", height: "50px" }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <SignatureIcon />
          <Typography variant="h3" sx={{ fontWeight: "550" }}>
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
      </Stack>

      {/* <Divider sx={{ color: "borderColor.main" }} /> */}
      {newSign.length === 0 ? (
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
            {t("validation.signatureNotFound")}
          </Typography>
        </Box>
      ) : (
        newSign.map((val, i) => (
          <SignaturesInfo sign={val} signType={signType} key={i} />
        ))
      )}
    </Box>
  );
};

Signatures.propTypes = {
  sigList1: PropTypes.array,
  sigList2: PropTypes.array,
};

export default Signatures;
