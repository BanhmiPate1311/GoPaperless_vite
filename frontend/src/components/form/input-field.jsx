/* eslint-disable react/prop-types */
import { TextField } from "@mui/material";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";

export const InputField = ({
  name,
  control,
  onChange: externalOnChange, // không cho user overide lại các thuộc tính này
  onBlur: externalOnBlur,
  ref: externalRef,
  value: externalValue,
  ...rest
}) => {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({ name, control });
  return (
    <TextField
      fullWidth
      size="small"
      margin="normal"
      name={name}
      value={value}
      onChange={(event) => {
        onChange(event);
        externalOnChange?.(event);
      }}
      onBlur={onBlur}
      inputRef={ref}
      error={!!error}
      helperText={error?.message}
      {...rest}
    />
  );
};

InputField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  control: PropTypes.object,
  data: PropTypes.array,
};

export default InputField;
