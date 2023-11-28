import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import html2canvas from "html2canvas";
import PropTypes from "prop-types";
import { forwardRef, useRef } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { InputField } from "../form";
import AddSubtitle from "./AddSubtitle";
import logo1 from "@/assets/images/Logo/gopaperless_white.png";

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
      name: false,
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

  const sigTextRef = useRef(null);

  const subtitle = {
    labelText: false,
    nameText: watch("text"),
    dnText: "your Distinguished Name",
    reasonText: "your reason",
    locationText: "your location",
    dateText: "your date",
    itverText: "your itver",
  };

  const handleFormSubmit = () => {
    // console.log("data: ", data);
    html2canvas(sigTextRef.current).then((canvas) => {
      const data64 = canvas.toDataURL();
      //   console.log(data64);
      onTextSubmit(data64);
    });
  };

  const direction =
    watch("name") ||
    watch("date") ||
    watch("reason") ||
    watch("dn") ||
    watch("itver") ||
    watch("location");
  // console.log("alignment: ", watch("alignment"));

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
          // backgroundColor: "white",
          // set background image
          backgroundImage: `url(${logo1})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Stack
          // direction="row-reverse"
          direction={
            watch("alignment") === "auto" || watch("alignment") === "left"
              ? "row"
              : "row-reverse"
          }
          sx={{
            // flexDirection: "row-reversed",
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
              width: direction ? "50%" : "100%",
              fontSize: "2rem",
              textAlign: "center",
              textTransform: "capitalize",
            }}
            className="font-moon-dance"
          >
            {watch("text") || ""}
          </Box>
          <Box
            sx={{
              marginLeft: "auto",
              marginRight: "auto",
              width: direction ? "50%" : "0",
              // fontSize: "12px",
              textAlign:
                watch("alignment") === "auto" || watch("alignment") === "left"
                  ? "left"
                  : "right",
              textTransform: "capitalize",
            }}
          >
            <Typography fontSize={12}>
              {watch("name")
                ? (watch("label") ? "Digitally signed by " : "") +
                  subtitle.nameText
                : ""}
            </Typography>
            <Typography fontSize={12}>
              {watch("dn")
                ? (watch("label") ? "DN: " : "") + subtitle.dnText
                : ""}
            </Typography>
            <Typography fontSize={12}>
              {watch("reason")
                ? (watch("label") ? "Reason: " : "") + subtitle.reasonText
                : ""}
            </Typography>
            <Typography fontSize={12}>
              {watch("location")
                ? (watch("label") ? "Location: " : "") + subtitle.locationText
                : ""}
            </Typography>
            <Typography fontSize={12}>
              {watch("date")
                ? (watch("label") ? "Date: " : "") + subtitle.dateText
                : ""}
            </Typography>
            <Typography fontSize={12}>
              {watch("itver")
                ? (watch("label") ? "IText version: " : "") + subtitle.itverText
                : ""}
            </Typography>
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
          sx={{
            my: 1,
          }}
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
        <AddSubtitle control={control} />
      </Box>
    </Box>
  );
});

TextSignForm.propTypes = {
  onTextSubmit: PropTypes.func,
};
TextSignForm.displayName = "TextSignForm";
export default TextSignForm;
