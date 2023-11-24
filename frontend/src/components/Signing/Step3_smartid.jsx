import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
// import { ref, object, string, boolean } from "yup";
import MenuItem from "@mui/material/MenuItem";
import * as yup from "yup";
import { InputField, PhoneInputField, SelectField } from "../form";

const Step3_smartid = forwardRef(({ onStepSubmit, data }, ref) => {
  const schema = yup.object().shape({
    criteria: yup.string().required("Please Select Signing Method"),

    personalCode: yup.string().when("criteria", (criteria, schema) => {
      if (
        criteria.includes("CITIZEN-IDENTITY-CARD") ||
        criteria.includes("PERSONAL-ID") ||
        criteria.includes("PASSPORT-ID")
      ) {
        return schema
          .required("This field is required.")
          .length(12, "This field must be at 12 character.");
      }
    }),
    phoneNumber: yup.string().when("criteria", (criteria, schema) => {
      if (criteria.includes("PHONE")) {
        return schema
          .required("This field is required.")
          .length(11, "This field must be at 11 character.");
      }
    }),
  });

  // eslint-disable-next-line no-unused-vars
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      criteria: "PHONE",
      personalCode: "",
      phoneNumber: "",
    },
    resolver: yupResolver(schema),
  });

  const [isPhoneSelect, setIsPhoneSelect] = useState(true);

  const data1 = data?.map((item) => (
    <MenuItem key={item.id} value={item.name}>
      {item.remark}
    </MenuItem>
  ));

  const handleChange1 = (event) => {
    console.log("event: ", event.target.value);
    if (event.target.value === "PHONE") {
      reset({
        criteria: event.target.value,
        personalCode: "",
      });
      setIsPhoneSelect(true);
    } else {
      reset({
        criteria: event.target.value,
        phoneNumber: "",
      });
      setIsPhoneSelect(false);
    }
  };

  const onchange = (event, data) => {
    console.log("data: ", data);
    console.log("event: ", event);
  };

  return (
    <Box
      component="form"
      ref={ref}
      onSubmit={handleSubmit(onStepSubmit)}
      sx={{ minWidth: 400, height: 300 }}
    >
      <Box mb={4} width={"100%"}>
        <SelectField
          name="criteria"
          control={control}
          label="Signing method"
          data={data1}
          onChange={handleChange1}
          //   sx={{
          //     "& .MuiListItemSecondaryAction-root": {
          //       right: "30px",
          //       display: "flex",
          //     },
          //   }}
        />
      </Box>

      {/* {isPhoneSelect ? ( */}
      <Box width={"100%"} display={isPhoneSelect ? "block" : "none"}>
        {/* <InputField
            label="Phone Number"
            name="phoneNumber"
            control={control}
          /> */}
        <PhoneInputField
          label="Phone Number"
          name="phoneNumber"
          control={control}
          onChange={onchange}
        />
      </Box>
      {/* ) : ( */}
      <Box width={"100%"} display={isPhoneSelect ? "none" : "block"}>
        <InputField label="Code" name="personalCode" control={control} />
      </Box>
      {/* )} */}
    </Box>
  );
});

Step3_smartid.propTypes = {
  onStepSubmit: PropTypes.func,
  data: PropTypes.array,
};
Step3_smartid.displayName = "Step3";
export default Step3_smartid;
