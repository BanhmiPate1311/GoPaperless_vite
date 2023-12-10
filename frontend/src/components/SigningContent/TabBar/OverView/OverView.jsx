import { ReactComponent as OverviewIcon } from "@/assets/images/svg/overview.svg";
import { useCommonHook } from "@/hook";
import { apiService } from "@/services/api_service";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { convertTime } from "@/utils/commonFunction";

export const OverView = ({ workFlow }) => {
  // console.log("workFlow: ", workFlow);
  const { t } = useTranslation();
  const { signingToken } = useCommonHook();
  const { data: headerFooter } = useQuery({
    queryKey: ["checkHeader"],
    queryFn: () => apiService.checkHeaderFooter(signingToken),
    enabled: signingToken !== undefined, //chỉ gọi api khi có giá trị id
  });
  // console.log("headerFooter: ", headerFooter?.data);
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
              {headerFooter?.data?.name.charAt(0)}
            </Stack>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: "black",
                }}
              >
                {headerFooter?.data?.name}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: "black",
                }}
              >
                {headerFooter?.data?.notificationEmail}
              </Typography>
            </Box>
          </Stack>
        </Box>
        {workFlow.deadlineAt && (
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
            <Typography variant="h6">
              {convertTime(workFlow.deadlineAt)}
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
};
OverView.propTypes = {
  workFlow: PropTypes.object,
};
export default OverView;
