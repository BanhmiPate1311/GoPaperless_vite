import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export const ContentRight = ({ direction, watch, subtitle }) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        marginLeft: "auto",
        marginRight: "auto",
        width: direction ? "50%" : "0",
        // fontSize: "12px",
        textAlign:
          watch("alignment") === "auto" || watch("alignment") === "left"
            ? "left"
            : "right",
        // textTransform: "capitalize",
        color: "black",
        fontWeight: "bold",
        wordBreak: "break-word",
      }}
    >
      <Typography fontSize={12}>
        {watch("name")
          ? (watch("label") ? t("modal.content1") + ": " : "") +
            subtitle.nameText
          : ""}
      </Typography>
      <Typography fontSize={12}>
        {watch("dn") && subtitle.dnText
          ? (watch("label") ? "DN: " : "") + subtitle.dnText
          : ""}
      </Typography>
      <Typography fontSize={12}>
        {watch("reason")
          ? (watch("label") ? t("0-common.Reason") + ": " : "") +
            subtitle.reasonText
          : ""}
      </Typography>
      <Typography fontSize={12}>
        {watch("location")
          ? (watch("label") ? t("0-common.Location") + ": " : "") +
            subtitle.locationText
          : ""}
      </Typography>
      <Typography fontSize={12}>
        {watch("date")
          ? (watch("label") ? t("0-common.date") + ": " : "") +
            subtitle.dateText
          : ""}
      </Typography>
      <Typography fontSize={12}>
        {watch("itver")
          ? (watch("label") ? t("0-common.itext version") + ": " : "") +
            subtitle.itverText
          : ""}
      </Typography>
    </Box>
  );
};

ContentRight.propTypes = {
  subtitle: PropTypes.object,
  direction: PropTypes.bool,
  watch: PropTypes.func,
};

export default ContentRight;
