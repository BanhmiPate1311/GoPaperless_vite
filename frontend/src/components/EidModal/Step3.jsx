import checkid from "@/assets/images/checkid.png";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

export const Step3 = () => {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: "textBold.main" }}>
        {/* Read the document chip */}
        {t("electronic.step31")}
      </Typography>
      <Typography variant="h6" my={2}>
        {/* Insert/place the document on the card reader. */}
        {t("electronic.step32")}
      </Typography>

      <Box
        style={{ textAlign: "center" }}
        width="250px"
        height="250px"
        marginX="auto"
      >
        <img
          src={checkid}
          width="100%"
          height="100%"
          style={{ borderRadius: "50%" }}
          alt="chip"
        />
      </Box>
    </Box>
  );
};

Step3.propTypes = {};

export default Step3;
