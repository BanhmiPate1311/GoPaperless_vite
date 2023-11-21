import { ReactComponent as OverviewIcon } from "@/assets/images/svg/overview.svg";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

export const OverView = () => {
  const { t } = useTranslation();
  return (
    <Box>
      <Box sx={{ p: 2 }}>
        <Stack
          sx={{ fontWeight: "550" }}
          direction="row"
          spacing={1}
          alignItems="center"
        >
          <OverviewIcon /> {t("0-common.overview")}
        </Stack>
      </Box>

      <Divider sx={{ color: "borderColor.main" }} />
      <Stack sx={{ px: 2, py: 1 }} spacing={1}>
        <Box
          sx={{
            border: "1px solid",
            borderColor: "borderColor.main",
            borderRadius: 2,
            p: "5px 15px",
          }}
        >
          <Typography sx={{ color: "signingtext2.main" }}>
            {t("0-common.shared_by")}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Stack
              justifyContent="center"
              alignItems="center"
              sx={{
                height: "32px",
                width: "32px",
                borderRadius: "50%",
                backgroundColor: "#E64DB0",
                color: "white",
              }}
            >
              G
            </Stack>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: "black",
                }}
              >
                Gopaperless Enterprise
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: "black",
                }}
              >
                info@goparperless.com
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Box
          sx={{
            border: "1px solid",
            borderColor: "borderColor.main",
            borderRadius: 2,
            p: "5px 15px",
          }}
        >
          <Typography sx={{ color: "signingtext2.main" }}>
            {t("0-common.deadline")}
          </Typography>
          <Typography>13/11/2023 17:35:58</Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default OverView;
