/* eslint-disable react/prop-types */
import { Box } from "@mui/material";
import { useController } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

export const PhoneInputField = ({
  name,
  control,
  label,
  disabled = false,
  onChange: externalOnChange, // không cho user overide lại các thuộc tính này
  onBlur: externalOnBlur,
  ref: externalRef,
  value: externalValue,
  copyNumbersOnly = true,
  ...rest
}) => {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({ name, control });
  return (
    <Box>
      <PhoneInput
        name={name}
        country={"vn"}
        placeholder={label}
        enableSearch={true}
        specialLabel={label}
        value={value}
        onChange={(phone, country) => {
          onChange(phone);
          externalOnChange(phone, country);
        }}
        // inputProps={{
        //   name: name,
        //   ref: ref,
        // }}
        // onKeyDown={enterToSubmit}
        // onBlur={(phone, country) => {
        //   if (phoneNumber === "") setPhoneNumber(`+ ${country.dialCode}`);
        // }}
        // onFocus={(phone, country) => {
        //   if (phoneNumber === "") setPhoneNumber(`+ ${country.dialCode}`);
        // }}
        inputStyle={{
          height: "40px",
          opacity: disabled ? "0.5" : "1",
          width: "100%",
        }}
        disabled={disabled}
        copyNumbersOnly={false}
        isValid={() => {
          if (error) {
            return "Invalid value: " + error?.message;
          } else {
            return true;
          }
        }}
        {...rest}
      />
    </Box>
  );
};

export default PhoneInputField;
