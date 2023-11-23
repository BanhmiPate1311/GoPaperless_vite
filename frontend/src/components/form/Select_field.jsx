/* eslint-disable react/prop-types */
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";

export const SelectField = ({
  name,
  label,
  control,
  data,
  onChange: externalOnChange, // không cho user overide lại các thuộc tính này
  onBlur: externalOnBlur,
  ref: externalRef,
  value: externalValue,
  ...rest
}) => {
  const {
    field: { onChange, value },
  } = useController({ name, control });
  return (
    <FormControl sx={{ width: "100%" }} size="small">
      <InputLabel id="demo-select-small-label">{label}</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={value}
        label={label}
        onChange={(e) => {
          onChange(e.target.value);
          externalOnChange?.(e);
        }}
        {...rest}
      >
        {data}
      </Select>
    </FormControl>
  );
};
SelectField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  control: PropTypes.object,
  data: PropTypes.array,
};
export default SelectField;
