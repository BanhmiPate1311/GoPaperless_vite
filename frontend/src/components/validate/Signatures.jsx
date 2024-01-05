import imageNotFound from "@/assets/images/noSignature.png";
import { ReactComponent as IconChipWhite } from "@/assets/images/svg/icon_Chip_White.svg";
import { Error } from "@mui/icons-material";
import { Box, Divider, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { SignDetail } from ".";

export const Signatures = ({ validFile, signType }) => {
  const { t } = useTranslation();

  const valueSign = [
    {
      name: "valid",
      value: validFile.filter((sig) => sig.indication === "TOTAL_PASSED"),
      icon: (
        <Stack
          padding="7px"
          border="1px solid transparent"
          // bgcolor="rgb(255, 240, 226)"
          borderRadius="50px"
          justifyContent="center"
          direction="row"
        >
          <IconChipWhite width={17} height={17} />
        </Stack>
      ),
      title:
        signType === "Signature"
          ? t("validation.sigValidTitle")
          : t("validation.sealValidTitle"),
    },
    {
      name: "indeterminate",
      value: validFile.filter((sig) => sig.indication === "INDETERMINATE"),
      icon: (
        <Stack
          padding="7px"
          border="1px solid transparent"
          bgcolor="rgb(255, 240, 226)"
          borderRadius="50px"
          justifyContent="center"
        >
          <Error sx={{ color: "rgb(235, 106, 0)", fontSize: "18px" }} />
        </Stack>
      ),
      title: t("validation.indeterminateTitle"),
    },
    {
      name: "invalid",
      value: validFile.filter((sig) => sig.indication === "TOTAL_FAILED"),
      icon: (
        <Stack
          padding="7px"
          bgcolor="rgb(255, 233, 235)"
          borderRadius="50px"
          justifyContent="center"
        >
          <Error sx={{ color: "rgb(216, 81, 63)", fontSize: "18px" }} />
        </Stack>
      ),
      title: t("validation.invalidTitle"),
    },
  ];
  const newSign = valueSign.filter((sig) => sig.value.length > 0);

  return (
    <>
      <Box p={3} fontWeight={550}>
        {signType === "Signature" ? t("validation.tab2") : t("validation.tab3")}
      </Box>
      <Divider />
      {validFile.length === 0 ? (
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
            {signType === "Signature"
              ? t("validation.signatureNotFound")
              : t("validation.sealNotFound")}
          </Typography>
        </Box>
      ) : (
        <Box>
          <Box>
            {newSign.length > 0 &&
              newSign.map((val, i) => (
                <SignDetail sign={val} signType={signType} key={i} />
              ))}
          </Box>
        </Box>
      )}
    </>
  );
};
Signatures.propTypes = {
  validFile: PropTypes.array,
  signType: PropTypes.string,
};
export default Signatures;
