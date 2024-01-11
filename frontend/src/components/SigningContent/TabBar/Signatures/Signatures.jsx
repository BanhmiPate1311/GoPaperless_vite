import imageNotFound from "@/assets/images/noSignature.png";
import { ReactComponent as ValidIcon } from "@/assets/images/svg/valid.svg";
import { ReactComponent as ValidWFIcon } from "@/assets/images/svg/icon_Chip_White.svg";
import { ReactComponent as SignatureIcon } from "@/assets/images/svg/signature.svg";
import { ReactComponent as InValidIcon } from "@/assets/images/svg/warningError.svg";
import { ReactComponent as InValidWFIcon } from "@/assets/images/svg/warningErrorwf.svg";
import { ReactComponent as WarningIcon } from "@/assets/images/svg/warningError.svg";
import { ReactComponent as WarningWFIcon } from "@/assets/images/svg/warningErrorwf.svg";
import Error from "@mui/icons-material/Error";
import { Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { SignaturesInfo } from "./SignaturesInfo";
import SvgIcon from "@mui/material/SvgIcon";

export const Signatures = ({ sigList1, sigList2 }) => {
  const signedInfo = [...sigList1, ...sigList2];
  // const signedInfo = [...sigList1];
  // console.log("signedInfo: ", signedInfo);
  const { t } = useTranslation();

  // const newSignedInfo = signedInfo.map((item) => item.value);
  // console.log("newSignedInfo: ", newSignedInfo);
  const signType = "Signature";

  const valueSign = [
    {
      name: t("validation.sigValidTitle"),
      value: signedInfo.filter((sig) => {
        return sig.indication === "TOTAL_PASSED" && sig.is_valid === true;
      }),
      icon: {
        signed: (
          <SvgIcon viewBox={"0 0 40 40"}>
            <ValidIcon height={40} width={40} />
          </SvgIcon>

          // <SvgIcon
          //   viewport="0 0 16 16"
          //   width={16}
          //   height={16}
          //   component={ValidIcon}
          //   sx={{ color: "#34A853" }}
          //   inheritViewBox
          // />
        ),
        notSigned: (
          <SvgIcon viewBox={"0 0 35 35"}>
            <ValidWFIcon height={35} width={35} />
          </SvgIcon>
          // <SvgIcon color="inherit">
          //   <ValidWFIcon />
          // </SvgIcon>
          // <SvgIcon
          //   viewport="0 0 16 16"
          //   width={16}
          //   height={16}
          //   component={ValidWFIcon}
          //   inheritViewBox
          // />
        ),
      },
      title: t("signing.signature_valid"),
    },
    {
      name: t("validation.indeterminateTitle"),
      value: signedInfo.filter((sig) => {
        return sig.indication === "INDETERMINATE";
      }),
      icon: {
        signed: (
          <SvgIcon viewBox={"0 0 35 35"}>
            <WarningWFIcon height={35} width={35} color="#EB6A00" />
          </SvgIcon>
        ),
        notSigned: (
          <SvgIcon viewBox={"0 0 40 40"}>
            <WarningIcon height={40} width={40} color="#EB6A00" />
          </SvgIcon>
        ),
      },
      // icon: (
      //   <Stack
      //     padding="7px"
      //     border="1px solid transparent"
      //     bgcolor="rgb(255, 240, 226)"
      //     borderRadius="50px"
      //     justifyContent="center"
      //   >
      //     {/* <Error sx={{ color: "rgb(235, 106, 0)", fontSize: "18px" }} /> */}
      //     <Error sx={{ color: "rgb(235, 106, 0)", fontSize: "18px" }} />
      //   </Stack>
      // ),
      title: t("signing.indeterminate signatures"),
    },
    {
      name: t("validation.invalidSig"),
      value: signedInfo.filter((sig) => {
        // console.log("invalid: ", sig.signature.is_valid);

        return (
          sig.indication !== "INDETERMINATE" &&
          sig.indication !== "TOTAL_PASSED"
        );
      }),
      icon: {
        signed: (
          <SvgIcon viewBox={"0 0 40 40"}>
            <InValidIcon height={40} width={40} />
          </SvgIcon>
        ),
        notSigned: (
          <SvgIcon viewBox={"0 0 35 35"}>
            <InValidWFIcon height={35} width={35} />
          </SvgIcon>
        ),
      },
      // icon: (
      //   <Stack
      //     padding="7px"
      //     bgcolor="rgb(255, 233, 235)"
      //     borderRadius="50px"
      //     justifyContent="center"
      //   >
      //     {/* <Error sx={{ color: "rgb(216, 81, 63)", fontSize: "18px" }} /> */}
      //     <Error sx={{ color: "rgb(216, 81, 63)", fontSize: "18px" }} />
      //   </Stack>
      // ),
      title: t("signing.invalid signatures"),
    },
  ];

  const newSign = valueSign.filter((sig) => sig.value.length > 0);
  // console.log("newSign: ", newSign);

  return (
    <Box sx={{ height: "100%" }}>
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
