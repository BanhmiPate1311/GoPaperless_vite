import { ReactComponent as CardReader } from "@/assets/images/eid/cardreader.svg";
import { ReactComponent as CCard } from "@/assets/images/eid/ccard.svg";
import { ReactComponent as Connectdevice } from "@/assets/images/eid/connectdevice.svg";
import { ReactComponent as Light } from "@/assets/images/eid/light.svg";
import { ReactComponent as Wifi } from "@/assets/images/eid/wifi.svg";
import { SvgIcon } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const Step1 = ({ isIdentifyRegistered }) => {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: "textBold.main" }}>
        {/* Get a Qualified Electronic Signature in minutes. */}
        {t("electronic.step11")}
      </Typography>

      <Typography variant="h6" my="16px">
        {/* Make sure you have the following before starting: */}
        {t("electronic.step12")}
      </Typography>

      <Stack direction="row" alignItems="center" mb="12px">
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          minWidth={40}
          width={40}
          height={40}
          borderRadius="50%"
          mr="12px"
          bgcolor="rgb(243, 245, 248)"
        >
          <SvgIcon
            viewport="0 0 16 16"
            width={16}
            height={16}
            component={Light}
            inheritViewBox
          />
          {/* <Light /> */}
        </Stack>
        <Typography variant="h6">
          {/* A well-lit place */}
          {t("electronic.step13")}
        </Typography>
      </Stack>

      {!isIdentifyRegistered && (
        <Stack direction="row" alignItems="center" mb="12px">
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            width={40}
            height={40}
            borderRadius="50%"
            mr="12px"
            bgcolor="rgb(243, 245, 248)"
            minWidth={40}
          >
            <CCard />
          </Stack>
          <Typography variant="h6">
            {/* A valid document in its original form to verify your identity */}
            {t("electronic.step14")}
          </Typography>
        </Stack>
      )}

      <Stack direction="row" alignItems="center" mb="12px">
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          minWidth={40}
          width={40}
          height={40}
          borderRadius="50%"
          mr="12px"
          bgcolor="rgb(243, 245, 248)"
        >
          <Wifi />
        </Stack>
        <Typography variant="h6">
          {t("electronic.step15")}
          {/* A good internet connection */}
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center" mb="12px">
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          minWidth={40}
          width={40}
          height={40}
          borderRadius="50%"
          mr="12px"
          bgcolor="rgb(243, 245, 248)"
        >
          <Connectdevice />
        </Stack>
        <Typography variant="h6">
          {t("electronic.step16")}
          {/* A device with a camera */}
        </Typography>
      </Stack>

      {!isIdentifyRegistered && (
        <Stack direction="row" alignItems="center" mb="12px">
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            width={40}
            height={40}
            borderRadius="50%"
            mr="12px"
            bgcolor="rgb(243, 245, 248)"
            minWidth={40}
          >
            <CardReader />
          </Stack>
          <Typography variant="h6">
            {/* A device with a card reader is plugged */}
            {t("electronic.step17")}
          </Typography>
        </Stack>
      )}
    </Box>
  );
};

Step1.propTypes = {
  isIdentifyRegistered: PropTypes.bool,
};

export default Step1;
