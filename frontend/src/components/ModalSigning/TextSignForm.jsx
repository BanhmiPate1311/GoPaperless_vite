import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { forwardRef, useRef } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { InputField, SelectField } from "../form";
import CheckBoxField from "../form/checkbox-field";
import ToggleAlignment from "../form/toggle-alignment";
import { MenuItem } from "@mui/material";
import html2canvas from "html2canvas";

export const TextSignForm = forwardRef(({ onTextSubmit }, ref) => {
  const schema = yup.object().shape({
    text: yup.string().required("Please enter your name"),
    email: yup
      .string()
      .email("Please enter your email")
      .required("This field is required."),
    name: yup.boolean(),
    date: yup.boolean(),
    logo: yup.boolean(),
    reason: yup.boolean(),
    dn: yup.boolean(),
    itver: yup.boolean(),
    location: yup.boolean(),
    label: yup.boolean(),
    alignment: yup.string(),
    format: yup.number(),
  });
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      text: "",
      name: true,
      email: "",
      date: false,
      logo: false,
      reason: false,
      dn: false,
      itver: false,
      location: false,
      label: false,
      alignment: "auto",
      format: 10,
    },
    resolver: yupResolver(schema),
  });

  //   const selectContent = (
  //     <>
  //       <MenuItem value={10}>0123456789</MenuItem>
  //       <MenuItem value={20}>0123456789</MenuItem>
  //     </>
  //   );

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

  const sigTextRef = useRef(null);

  const handleFormSubmit = (data) => {
    html2canvas(sigTextRef.current).then((canvas) => {
      const data64 = canvas.toDataURL();
      //   console.log(data64);
      onTextSubmit(data64);
    });
  };
  return (
    <Box
      component="form"
      ref={ref}
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{ minWidth: 400 }}
    >
      <Box mb={2}>
        <InputField
          label="Name"
          name="text"
          control={control}
          InputLabelProps={{
            sx: {
              backgroundColor: "signingWFBackground.main",
            },
          }}
          inputProps={{
            sx: {
              backgroundColor: "signingWFBackground.main",
            },
          }}
        />
      </Box>
      <Stack
        sx={{
          overflow: "hidden",
          borderRadius: "6px",
          border: "1px solid #357EEB",
          backgroundColor: "white",
        }}
      >
        <Stack
          direction="row"
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            minHeight: "100px",
            // padding: "2rem 0",
          }}
          ref={sigTextRef}
        >
          <Box
            sx={{
              marginLeft: "auto",
              marginRight: "auto",
              width: "50%",
              fontSize: "2rem",
              textAlign: "center",
              textTransform: "capitalize",
            }}
            className="font-moon-dance"
          >
            {watch("text") || ""}
          </Box>
        </Stack>
        <Box
          style={{
            borderTop: "2px dashed #357EEB",
            height: "2rem",
          }}
        ></Box>
      </Stack>
      <Typography mt={1}>Contact Information</Typography>
      <Box mb={1}>
        <InputField
          //   label="Name"
          name="email"
          control={control}
          InputLabelProps={{
            sx: {
              backgroundColor: "signingWFBackground.main",
            },
          }}
          inputProps={{
            sx: {
              backgroundColor: "signingWFBackground.main",
            },
          }}
        />
      </Box>
      <Box>
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
      </Box>
    </Box>
  );
});

TextSignForm.propTypes = {
  onTextSubmit: PropTypes.func,
};
TextSignForm.displayName = "TextSignForm";
export default TextSignForm;
