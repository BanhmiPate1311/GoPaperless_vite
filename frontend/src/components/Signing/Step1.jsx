import { MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { forwardRef } from "react";
import { useForm } from "react-hook-form";
import { SelectField } from "../form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// eslint-disable-next-line react/prop-types
export const Step1 = forwardRef(({ onStep1Submit }, ref) => {
  const schema = yup.object().shape({
    method: yup.string().required("Please select Level of Assurance"),
  });

  const { control, handleSubmit } = useForm({
    defaultValues: {
      method: "",
    },
    resolver: yupResolver(schema),
  });

  const value = [
    {
      label: "Advanced Electronic (AES)",
      value: "aes",
    },
    {
      label: "Electronic Seal (eSeal)",
      value: "eseal",
    },
  ];

  const data = value.map((item, index) => (
    <MenuItem key={index} value={item.value}>
      {item.label}
    </MenuItem>
  ));

  return (
    <Box
      component="form"
      ref={ref}
      onSubmit={handleSubmit(onStep1Submit)}
      sx={{ minWidth: 400 }}
    >
      <SelectField
        name="method"
        control={control}
        label="Select Level of Assurance"
        data={data}
      />
    </Box>
  );
});

Step1.propTypes = {
  onStep1Submit: PropTypes.func,
};

Step1.displayName = "Step1";

export default Step1;
