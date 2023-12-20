import { MenuItem, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import PropTypes from "prop-types";
import { InputField, SelectField } from "../form";
import CheckBoxField from "../form/checkbox-field";
import ToggleAlignment from "../form/toggle-alignment";
import { useTranslation } from "react-i18next";

export const AddSubtitle = ({ control }) => {
  const { t } = useTranslation();
  const dataSelect = [
    {
      label: "0123456789",
      value: 10,
    },
  ];

  const selectContent = dataSelect.map((item, i) => {
    return (
      <MenuItem key={i} value={item.value}>
        {item.label}
      </MenuItem>
    );
  });
  return (
    <>
      <Box>
        <Typography
          variant="h6"
          color="#1F2937"
          fontWeight={600}
          mb="10px"
          height={17}
        >
          {t("signing.contact_information")}
        </Typography>
        <InputField
          label=""
          name="email"
          control={control}
          inputProps={{
            sx: {
              backgroundColor: "signingWFBackground.main",
            },
          }}
          sx={{ m: "0 0 10px" }}
        />
      </Box>
      <FormLabel
        component="legend"
        sx={{
          fontSize: "14px",
          height: 17,
          mb: "10px",
          color: "signingtext1.main",
        }}
      >
        {t("signing.include_text")}
      </FormLabel>
      <FormGroup sx={{ flexDirection: "row" }}>
        <Box width={"50%"}>
          <CheckBoxField
            name="name"
            control={control}
            label={t("0-common.name")}
            sx={{
              width: "100%",
              "& .MuiCheckbox-root": {
                padding: "0 9px",
              },
            }}
          />
          <CheckBoxField
            name="date"
            control={control}
            label={t("0-common.date")}
            sx={{
              width: "100%",
              "& .MuiCheckbox-root": {
                padding: "0 9px",
              },
            }}
          />
          <CheckBoxField
            name="logo"
            control={control}
            label={t("0-common.logo")}
            sx={{
              width: "100%",
              "& .MuiCheckbox-root": {
                padding: "0 9px",
              },
            }}
          />
          <CheckBoxField
            name="reason"
            control={control}
            label={t("0-common.Reason")}
            sx={{
              width: "100%",
              "& .MuiCheckbox-root": {
                padding: "0 9px",
              },
            }}
          />
          <FormLabel
            component="legend"
            sx={{
              fontSize: "14px",
              height: 17,
              mb: "10px",
              color: "signingtext1.main",
            }}
          >
            {t("0-common.text direction")}
          </FormLabel>
          <ToggleAlignment
            name="alignment"
            control={control}
            size="small"
            color="primary"
            exclusive
            sx={{ height: "45px" }}
          />
        </Box>
        <Box width={"50%"}>
          <CheckBoxField
            name="dn"
            control={control}
            label={t("0-common.distinguished name")}
            sx={{
              width: "100%",
              "& .MuiCheckbox-root": {
                padding: "0 9px",
              },
            }}
          />
          <CheckBoxField
            name="itver"
            control={control}
            label={t("0-common.itext version")}
            sx={{
              width: "100%",
              "& .MuiCheckbox-root": {
                padding: "0 9px",
              },
            }}
          />
          <CheckBoxField
            name="location"
            control={control}
            label={t("0-common.Location")}
            sx={{
              width: "100%",
              "& .MuiCheckbox-root": {
                padding: "0 9px",
              },
            }}
          />
          <CheckBoxField
            name="label"
            control={control}
            label={t("0-common.labels")}
            sx={{
              width: "100%",
              "& .MuiCheckbox-root": {
                padding: "0 9px",
              },
            }}
          />
          <FormLabel
            component="legend"
            sx={{
              fontSize: "14px",
              height: 17,
              mb: "10px",
              color: "signingtext1.main",
            }}
          >
            {t("0-common.digits format")}
          </FormLabel>
          <SelectField
            name="format"
            control={control}
            content={selectContent}
          />
        </Box>
      </FormGroup>
    </>
  );
};

AddSubtitle.propTypes = {
  control: PropTypes.object,
};

export default AddSubtitle;
