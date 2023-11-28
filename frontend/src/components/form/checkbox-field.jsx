import React from "react";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";
import { Checkbox, FormControlLabel } from "@mui/material";

const CheckBoxField = ({
  name,
  label,
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
    <FormControlLabel
      control={
        <Checkbox
          checked={value}
          name={name}
          onChange={(event) => {
            // console.log("event: ", event);
            onChange(event);
          }}
        />
      }
      label={label}
      {...rest}
    />
  );
};

CheckBoxField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  control: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  ref: PropTypes.object,
  value: PropTypes.any,
};

export default CheckBoxField;
