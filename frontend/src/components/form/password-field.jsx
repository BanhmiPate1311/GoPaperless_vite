/* eslint-disable no-unused-vars */
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";

export const PasswordField = ({
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
    // <FormControl name={name} sx={{ width: "100%" }} variant="outlined">
    //   {/* <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel> */}
    //   <OutlinedInput
    //     id="outlined-adornment-password"
    //     type={"password"}
    //     // value={value}
    //     inputRef={ref}
    //     onChange={(event) => {
    //       onChange(event);
    //       externalOnChange?.(event);
    //     }}
    //     // label="Password"
    //     {...rest}
    //   />
    // </FormControl>

    <Box
      //   component="form"
      width={"60%"}
      mx={"auto"}
    >
      <TextField
        fullWidth
        error={!!error}
        size="small"
        id="outlined-password-input1"
        // label="Password"
        type="password"
        // autoComplete="current-password"
        onChange={(event) => {
          onChange(event);
          externalOnChange?.(event);
        }}
        inputRef={ref}
        helperText={error?.message}
        {...rest}
      />
    </Box>
  );
};

PasswordField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  control: PropTypes.object,
  data: PropTypes.array,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  ref: PropTypes.object,
  value: PropTypes.any,
};

export default PasswordField;
