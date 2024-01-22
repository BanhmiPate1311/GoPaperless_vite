import logo1 from "@/assets/images/Logo/gopaperless_white.png";
import { ContentRight } from "@/components/modal2";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import { forwardRef, useEffect } from "react";
import { InputField } from "../form";

export const TextSignForm = forwardRef(
  (
    {
      watch,
      dataSigning,
      headerFooter,
      formattedDatetime,
      onDisableSubmit,
      control,
      showInput,
      imgBase64,
    },
    ref
  ) => {
    // console.log("dataSigning: ", dataSigning);
    // const sigTextRef = useRef(null);

    const nameValue =
      typeof dataSigning.certChain.subject === "string"
        ? dataSigning.certChain.subject
        : dataSigning.certChain.subject.commonName;
    const dnValue = dataSigning.certChain.subjectDN
      ? dataSigning.certChain.subjectDN
      : dataSigning.certChain.name;
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
      itverText: "itext core 8.0.2",
    };

    const direction =
      watch("name") ||
      watch("date") ||
      watch("reason") ||
      watch("dn") ||
      watch("itver") ||
      watch("location");
    // console.log("alignment: ", watch("alignment"));

    useEffect(() => {
      if (watch("text") === "" || watch("email") === "") {
        onDisableSubmit(true);
      } else {
        onDisableSubmit(false);
      }
      // if (provider === "USB_TOKEN_SIGNING" && errorPG) {
      //   onDisableSubmit(true);
      // }
    }, [watch("text"), onDisableSubmit, watch("email"), watch]);

    return (
      <Box
        // component="form"
        // ref={ref}
        // onSubmit={handleSubmit(handleFormSubmit)}
        sx={showInput ? { width: "100%", height: "100%" } : { minWidth: 400 }}
      >
        <Box sx={showInput ? { display: "none" } : {}}>
          <InputField
            label=""
            name="text"
            control={control}
            inputProps={{
              sx: {
                backgroundColor: "signingWFBackground.main",
              },
            }}
            sx={{ m: "0 0 10px" }}
          />
        </Box>
        <Stack
          ref={ref}
          sx={{
            height: showInput ? "100%" : "170px",
            overflow: "hidden",
            borderRadius: "6px",
            border: !imgBase64 ? "2px solid #357EEB" : "none",
            position: "relative",
            // background: "transparent",
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
                  backgroundImage: !imgBase64 ? `url(${logoValue})` : "none",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  // backgroundColor: "rgba(255, 255, 255, 0.5)",
                }
              : {},
          }}
        >
          {imgBase64 && (
            <img src={imgBase64} style={{ width: "auto", height: "100%" }} />
          )}
          {!imgBase64 && (
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
                // height: "150px",
                height: "100%",
                // padding: "2rem 0",
              }}
              // ref={sigTextRef}
            >
              <Box
                sx={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: direction ? "50%" : "100%",
                  fontSize: "36px",
                  textAlign: "center",
                  textTransform: "capitalize",
                  fontWeight: "bold",
                }}
                className="font-moon-dance"
              >
                {watch("text") || ""}
              </Box>
              <ContentRight
                direction={direction}
                subtitle={subtitle}
                watch={watch}
              />
            </Stack>
          )}
          {/* <Box
            style={{
              borderTop: "2px dashed #357EEB",
              height: "20px",
            }}
          ></Box> */}
        </Stack>
      </Box>
    );
  }
);

TextSignForm.propTypes = {
  onTextSubmit: PropTypes.func,
  signer: PropTypes.object,
  dataSigning: PropTypes.object,
  headerFooter: PropTypes.object,
  formattedDatetime: PropTypes.string,
  onDisableSubmit: PropTypes.func,
  watch: PropTypes.func,
  control: PropTypes.object,
  showInput: PropTypes.bool,
  imgBase64: PropTypes.string,
};
TextSignForm.displayName = "TextSignForm";
export default TextSignForm;
