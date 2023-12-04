import { ReactComponent as CardReader } from "@/assets/images/eid/cardreader.svg";
import { ReactComponent as CCard } from "@/assets/images/eid/ccard.svg";
import { ReactComponent as Connectdevice } from "@/assets/images/eid/connectdevice.svg";
import { ReactComponent as Light } from "@/assets/images/eid/light.svg";
import { ReactComponent as Wifi } from "@/assets/images/eid/wifi.svg";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

const Step1 = ({ isIdentifyRegistered }) => {
  return (
    <Box color="#26293F">
      <Typography fontSize="24px" fontWeight={600} lineHeight="36px">
        {/* Get a Qualified Electronic Signature in minutes. */}
        {/* {t("electronicid.step11")} */}
        Get a Qualified Electronic Signature in minutes.
      </Typography>

      <Typography fontSize={14} my="16px">
        {/* Make sure you have the following before starting: */}
        {/* {t("electronicid.step12")} */}
        Make sure you have the following before starting:
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
          <Light />
        </Stack>
        <Typography fontSize="14px">
          {/* {t("electronicid.step13")} */}A well-lit place
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
          <Typography>
            A valid document in its original form to verify your identity
            {/* {t("electronicid.step14")} */}
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
        <Typography fontSize="14px">
          {/* {t("electronicid.step15")} */}A good internet connection
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
        <Typography fontSize="14px">
          {/* {t("electronicid.step16")} */}A device with a camera
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
          <Typography>
            A device with a card reader is plugged
            {/* {t("electronicid.step17")} */}
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
