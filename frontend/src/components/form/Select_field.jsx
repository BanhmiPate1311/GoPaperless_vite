/* eslint-disable react/prop-types */
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";

export const SelectField = ({
  name,
  label,
  control,
  content,
  onChange: externalOnChange, // không cho user overide lại các thuộc tính này
  // onBlur: externalOnBlur,
  // ref: externalRef,
  // value: externalValue,
  ...rest
}) => {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({ name, control });
  return (
    <FormControl sx={{ width: "100%" }} size="small">
      <InputLabel
        id="demo-select-small-label"
        sx={{ backgroundColor: "signingWFBackground.main" }}
      >
        {label}
      </InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={value}
        label={label}
        onChange={(e) => {
          onChange(e.target.value);
          externalOnChange?.(e);
        }}
        // error={!!error}
        // renderValue={(value) => `⚠️  - ${value}`}
        {...rest}
      >
        {content}
      </Select>
      <FormHelperText
        // sx={{ color: "error.main", position: "absolute", top: "100%" }}
        sx={{ color: "error.main" }}
      >
        {error?.message}
      </FormHelperText>
    </FormControl>
  );
};
SelectField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  control: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  ref: PropTypes.object,
  value: PropTypes.any,
};
export default SelectField;
