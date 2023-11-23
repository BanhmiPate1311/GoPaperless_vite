import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { SelectField } from "../form";
import { getSigner } from "@/utils/commonFunction";

export const Step2 = ({ workFlow }) => {
  console.log("workFlow: ", workFlow);
  const signer = getSigner(workFlow);
  //   console.log("signer: ", signer);
  const signingOptions = signer.signingOptions
    ? signer.signingOptions.map((item) => Object.keys(item))
    : ["mobile", "smartid", "usbtoken", "electronic_id"];
  console.log("signingOptions: ", signingOptions);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      method: "aes",
    },
  });

  return (
    <Box
      component="form"
      //   ref={ref}
      //   onSubmit={handleSubmit(onStep1Submit)}
      sx={{ minWidth: 400 }}
    >
      {/* <SelectField
        name="method"
        control={control}
        label="Select Level of Assurance"
        // data={value}
      /> */}
      abc
    </Box>
  );
};

Step2.propTypes = {
  workFlow: PropTypes.object,
};

export default Step2;
