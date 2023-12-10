import facescan from "@/assets/images/facescan.jpg";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

export const Step5 = () => {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: "textBold.main" }}
        textAlign={"center"}
      >
        {/* Scan Face */}
        {t("electronic.step52")}
      </Typography>
      <Typography variant="h6" marginBottom="10px" textAlign="center">
        {/* Please, look to the camera to scan your face */}
        {t("electronic.step53")}
      </Typography>
      <Box width={263} marginX="auto" mt={8}>
        <img
          src={facescan}
          width="100%"
          //   height={250}
          style={{ borderRadius: "50%" }}
          alt="chip"
        />
      </Box>
    </Box>
  );
};

Step5.propTypes = {};

export default Step5;