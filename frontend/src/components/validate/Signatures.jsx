import imageNotFound from "@/assets/images/noSignature.png";
import { ReactComponent as IconChipWhite } from "@/assets/images/svg/icon_Chip_White.svg";
import { ReactComponent as ValidWFIcon } from "@/assets/images/svg/valid.svg";
import { ReactComponent as SignatureIcon } from "@/assets/images/svg/signature.svg";
import { ReactComponent as ValidSealIcon } from "@/assets/images/svg/seal_icon.svg";
import { ReactComponent as ValidIcon } from "@/assets/images/svg/icon_Chip_White.svg";
import {
  ReactComponent as InValidIcon,
  ReactComponent as WarningIcon,
} from "@/assets/images/svg/warningErrorwf.svg";
import {
  ReactComponent as InValidWFIcon,
  ReactComponent as WarningWFIcon,
} from "@/assets/images/svg/warningError.svg";
import { Error } from "@mui/icons-material";
import { Box, Divider, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { SignDetail } from ".";
import Avatar from "@mui/material/Avatar";
import SvgIcon from "@mui/material/SvgIcon";
export const Signatures = ({ validFile, signType }) => {
  const { t } = useTranslation();

  const valueSign = [
    {
      name: t("validation.sigValidTitle"),
      value: validFile.filter((sig) => sig.indication === "TOTAL_PASSED"),
      icon: {
        signed: (
          <SvgIcon viewBox={"0 0 40 40"}>
            <ValidSealIcon height={40} width={40} />
          </SvgIcon>
        ),
        notSigned: (
          <SvgIcon viewBox={"0 0 35 35"}>
            <ValidWFIcon height={35} width={35} />
          </SvgIcon>
        ),
      },
      title: t("signing.signature_valid"),
    },
    {
      name: t("validation.indeterminateTitle"),
      value: validFile.filter((sig) => sig.indication === "INDETERMINATE"),
      icon: {
        signed: (
          <SvgIcon viewBox={"0 0 35 35"}>
            <WarningIcon height={35} width={35} color="#EB6A00" />
          </SvgIcon>
        ),
        notSigned: (
          <SvgIcon viewBox={"0 0 40 40"}>
            <WarningWFIcon height={40} width={40} color="#EB6A00" />
          </SvgIcon>
        ),
      },
      title: t("signing.indeterminate signatures"),
    },
    {
      name: t("validation.invalidSig"),
      value: validFile.filter((sig) => sig.indication === "TOTAL_FAILED"),
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
      title: t("signing.invalid signatures"),
    },
  ];
  const newSign = valueSign.filter((sig) => sig.value.length > 0);

  return (
    <>
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
            {newSign.length}
          </Avatar>
        </Stack>
      </Stack>
      {/* <Box p={3} fontWeight={550}>
        {signType === "Signature" ? t("validation.tab2") : t("validation.tab3")}
      </Box> */}
      <Divider />
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
          <Typography textAlign="center" variant="h5" fontWeight="bold">
            {t("validation.signatureNotFound")}
          </Typography>
        </Box>
      ) : (
        newSign.map((val, i) => (
          <SignDetail sign={val} signType={signType} key={i} />
        ))
      )}
    </>
  );
};
Signatures.propTypes = {
  validFile: PropTypes.array,
  signType: PropTypes.string,
};
export default Signatures;
