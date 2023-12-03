import logo1 from "@/assets/images/Logo/gopaperless_white.png";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import html2canvas from "html2canvas";
import PropTypes from "prop-types";
import { forwardRef, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { AddSubtitle, DialogDraw } from "../ModalSigning";
import { InputField } from "../form";

export const DrawSignForm = forwardRef(
  (
    { onDrawSubmit, signer, dataSigning, headerFooter, formattedDatetime },
    ref
  ) => {
    const schema = yup.object().shape({
      drawUrl: yup.string().required("Please set your draw"),
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
        drawUrl: "",
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

    const [openDraw, setOpenDraw] = useState(false);

    const [errorDraw, setErrorDraw] = useState(false);

    const sigCanvasRef = useRef(null);

    const nameValue = dataSigning.certChain.subject;
    const dnValue = "your Distinguished Name";
    const reasonValue = dataSigning.reason;
    const logoValue = headerFooter.loGo ? headerFooter.loGo : logo1;
    const location = dataSigning.countryRealtime;

    const subtitle = {
      labelText: false,
      nameText: nameValue,
      dnText: dnValue,
      reasonText: reasonValue || "signature",
      locationText: location,
      dateText: formattedDatetime,
      itverText: "Itext core 8.0.2",
    };

    // const subtitle = {
    //   labelText: false,
    //   nameText: "name name",
    //   dnText: "your Distinguished Name",
    //   reasonText: "your reason",
    //   locationText: "your location",
    //   dateText: "your date",
    //   itverText: "your itver",
    // };

    const handleOpenDraw = () => {
      setOpenDraw(true);
    };

    const handleCloseDraw = () => {
      setOpenDraw(false);
    };

    const handleFormSubmit = () => {
      // console.log("data: ", data);
      // const data64 = sigCanvasRef.current.getTrimmedCanvas().toDataURL();
      // onDrawSubmit(data64);

      html2canvas(sigCanvasRef.current).then((canvas) => {
        const data64 = canvas.toDataURL();
        //   console.log(data64);
        onDrawSubmit(data64);
      });
    };

    const direction =
      watch("name") ||
      watch("date") ||
      watch("reason") ||
      watch("dn") ||
      watch("itver") ||
      watch("location");

    return (
      <Box
        component="form"
        ref={ref}
        onSubmit={handleSubmit(handleFormSubmit)}
        sx={{ minWidth: 400 }}
      >
        <Box mb={2}>
          <Button
            variant="contained"
            style={{
              marginBottom: "0.5rem",
              marginTop: "1rem",
              fontWeight: "medium",
            }}
            onClick={handleOpenDraw}
          >
            Draw
          </Button>
        </Box>
        <Stack
          sx={{
            overflow: "hidden",
            borderRadius: "6px",
            border: "1px solid #357EEB",
            position: "relative",
            // backgroundColor: "white",
            // set background image
            "&:before": watch("logo")
              ? {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0.2,
                  zIndex: 1,
                  backgroundImage: `url(${logoValue})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                }
              : {},
          }}
        >
          <Stack
            direction={
              watch("alignment") === "auto" || watch("alignment") === "left"
                ? "row"
                : "row-reverse"
            }
            sx={{
              display: "flex",
              width: "100%",
              // alignItems: "center",
              minHeight: "100px",
              // padding: "2rem 0",
            }}
            ref={sigCanvasRef}
          >
            <Stack
              direction="row"
              justifyContent={"center"}
              alignItems="center"
              sx={{
                marginLeft: "auto",
                marginRight: "auto",
                width: direction ? "50%" : "100%",
                fontSize: "2rem",
                textAlign: "center",
                textTransform: "capitalize",
              }}
            >
              {/* {watch("drawUrl") || ""} */}
              {watch("drawUrl") ? (
                <Box
                  component="img"
                  sx={{
                    // height: "100%",
                    maxWidth: "70%",
                  }}
                  alt="The house from the offer."
                  src={watch("drawUrl")}
                />
              ) : null}
            </Stack>

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
                  ? (watch("label") ? "IText version: " : "") +
                    subtitle.itverText
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
        <FormHelperText sx={{ color: "error.main", mx: "14px" }}>
          {errorDraw && errorDraw}
        </FormHelperText>
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
          <AddSubtitle control={control} signer={signer} />
        </Box>

        <DialogDraw
          name="drawUrl"
          control={control}
          open={openDraw}
          handleClose={handleCloseDraw}
          setErrorDraw={setErrorDraw}
        />
      </Box>
    );
  }
);

DrawSignForm.propTypes = {
  onDrawSubmit: PropTypes.func,
  signer: PropTypes.object,
  dataSigning: PropTypes.object,
  headerFooter: PropTypes.object,
  formattedDatetime: PropTypes.string,
};
DrawSignForm.displayName = "TextSignForm";
export default DrawSignForm;
