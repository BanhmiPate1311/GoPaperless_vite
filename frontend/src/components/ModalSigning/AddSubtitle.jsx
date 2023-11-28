import { MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import PropTypes from "prop-types";
import { SelectField } from "../form";
import CheckBoxField from "../form/checkbox-field";
import ToggleAlignment from "../form/toggle-alignment";

export const AddSubtitle = ({ control }) => {
  const dataSelect = [
    {
      label: "0123456789",
      value: 10,
    },
    {
      label: "9876543210",
      value: 20,
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
      <FormLabel component="legend">Include Text</FormLabel>
      <FormGroup sx={{ flexDirection: "row" }}>
        <Box width={"50%"}>
          <CheckBoxField
            name="name"
            control={control}
            label="Name"
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
            label="Date"
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
            label="Logo"
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
            label="Reason"
            sx={{
              width: "100%",
              "& .MuiCheckbox-root": {
                padding: "0 9px",
              },
            }}
          />
          <FormLabel component="legend">Text Direction</FormLabel>
          <ToggleAlignment
            name="alignment"
            control={control}
            size="small"
            color="primary"
            exclusive
          />
        </Box>
        <Box width={"50%"}>
          <CheckBoxField
            name="dn"
            control={control}
            label="Distinguished Name"
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
            label="IText Version"
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
            label="Location"
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
            label="Labels"
            sx={{
              width: "100%",
              "& .MuiCheckbox-root": {
                padding: "0 9px",
              },
            }}
          />
          <FormLabel component="legend">Text Direction</FormLabel>
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
  control: PropTypes.object.isRequired,
};

export default AddSubtitle;
