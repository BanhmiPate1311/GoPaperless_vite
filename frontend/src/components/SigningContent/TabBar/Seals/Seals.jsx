import imageNotFound from "@/assets/images/noSignature.png";
import { ReactComponent as ValidIcon } from "@/assets/images/svg/icon_Chip_White.svg";
import { ReactComponent as SealIcon } from "@/assets/images/svg/seal.svg";
import Error from "@mui/icons-material/Error";
import { Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { SignaturesInfo } from "../Signatures/SignaturesInfo";

export const Seals = ({ signedInfo }) => {
  const { t } = useTranslation();

  const signType = "Signature";

  const valueSign = [
    {
      name: t("validation.sigValidTitle"),
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
          <ValidIcon sx={{ color: "#3B82F6", fontSize: "18px" }} />
        </Stack>
      ),
      title: t("signing.signature_valid"),
    },
    {
      name: t("validation.indeterminateTitle"),
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
      title: t("signing.indeterminate signatures"),
    },
    {
      name: t("validation.invalidSig"),
      value: signedInfo.filter((sig) => {
        // console.log("invalid: ", sig.value.signature.is_valid);

        return sig.value.signature.is_valid === false;
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
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <SealIcon />
          <Typography variant="h6" sx={{ fontWeight: "550" }}>
            {t("0-common.seals")}
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
            {t("validation.sealNotFound")}
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

Seals.propTypes = {
  signedInfo: PropTypes.array,
};

export default Seals;