import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export const Step4 = ({ image, personalInfomation }) => {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: "textBold.main" }}>
        {/* Personal Information */}
        {t("electronic.step41")}
      </Typography>

      <Box
        width="120px"
        height="120px"
        marginX="auto"
        borderRadius="50%"
        overflow="hidden"
        my={2}
      >
        <img
          src={`data:image/png;base64,${image}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover", // Để hình ảnh không bị méo
          }}
          alt="image123"
        />
      </Box>

      <Box sx={{ flexGrow: 1 }} mt={1}>
        <Grid container spacing={1.5}>
          <Grid item xs={12}>
            <TextField
              size="small"
              id="outlined-read-only-input"
              label={t("electronic.step42")}
              defaultValue={personalInfomation?.fullName}
              sx={{ width: "100%" }}
              InputLabelProps={{
                sx: {
                  backgroundColor: "signingWFBackground.main",
                },
              }}
              inputProps={{
                sx: {
                  readOnly: true,
                  backgroundColor: "signingWFBackground.main",
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              size="small"
              id="outlined-read-only-input"
              label={t("electronic.step43")}
              defaultValue={personalInfomation?.gender}
              sx={{ width: "100%" }}
              InputLabelProps={{
                sx: {
                  backgroundColor: "signingWFBackground.main",
                },
              }}
              inputProps={{
                sx: {
                  readOnly: true,
                  backgroundColor: "signingWFBackground.main",
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              size="small"
              id="outlined-read-only-input"
              label={t("electronic.step44")}
              defaultValue={personalInfomation?.birthDate}
              sx={{ width: "100%" }}
              InputLabelProps={{
                sx: {
                  backgroundColor: "signingWFBackground.main",
                },
              }}
              inputProps={{
                sx: {
                  readOnly: true,
                  backgroundColor: "signingWFBackground.main",
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              size="small"
              id="outlined-read-only-input"
              label={t("electronic.step45")}
              defaultValue={personalInfomation?.personalNumber}
              sx={{ width: "100%" }}
              InputLabelProps={{
                sx: {
                  backgroundColor: "signingWFBackground.main",
                },
              }}
              inputProps={{
                sx: {
                  readOnly: true,
                  backgroundColor: "signingWFBackground.main",
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              size="small"
              id="outlined-read-only-input"
              label={t("electronic.step46")}
              defaultValue={personalInfomation?.nationality}
              sx={{ width: "100%" }}
              InputLabelProps={{
                sx: {
                  backgroundColor: "signingWFBackground.main",
                },
              }}
              inputProps={{
                sx: {
                  readOnly: true,
                  backgroundColor: "signingWFBackground.main",
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              size="small"
              id="outlined-read-only-input"
              label={t("electronic.step47")}
              defaultValue={personalInfomation?.placeOfOrigin}
              sx={{ width: "100%" }}
              InputLabelProps={{
                sx: {
                  backgroundColor: "signingWFBackground.main",
                },
              }}
              inputProps={{
                sx: {
                  readOnly: true,
                  backgroundColor: "signingWFBackground.main",
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

Step4.propTypes = {
  image: PropTypes.string,
  personalInfomation: PropTypes.object,
};

export default Step4;
