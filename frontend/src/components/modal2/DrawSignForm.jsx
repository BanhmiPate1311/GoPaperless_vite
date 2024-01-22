import logo1 from "@/assets/images/Logo/gopaperless_white.png";
import { ContentRight, DialogDraw } from "@/components/modal2";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import { forwardRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const DrawSignForm = forwardRef(
  (
    {
      dataSigning,
      headerFooter,
      formattedDatetime,
      onDisableSubmit,
      watch,
      control,
    },
    ref
  ) => {
    const { t } = useTranslation();
    const [openDraw, setOpenDraw] = useState(false);

    // const sigCanvasRef = useRef(null);

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

    useEffect(() => {
      //   console.log("drawUrl: ", watch("drawUrl"));
      if (watch("drawUrl") === "" || watch("email") === "") {
        onDisableSubmit(true);
      } else {
        onDisableSubmit(false);
      }
      // if (provider === "USB_TOKEN_SIGNING" && errorPG) {
      //   onDisableSubmit(true);
      // }
    }, [watch("drawUrl"), onDisableSubmit, watch("email"), watch]);

    const handleOpenDraw = () => {
      setOpenDraw(true);
    };

    const handleCloseDraw = () => {
      setOpenDraw(false);
    };

    //   const handleFormSubmit = () => {
    //     // console.log("data: ", data);
    //     // const data64 = sigCanvasRef.current.getTrimmedCanvas().toDataURL();
    //     // onDrawSubmit(data64);

    //     html2canvas(sigCanvasRef.current).then((canvas) => {
    //       const data64 = canvas.toDataURL();
    //       //   console.log(data64);
    //       onDrawSubmit(data64);
    //     });
    //   };

    const direction =
      watch("name") ||
      watch("date") ||
      watch("reason") ||
      watch("dn") ||
      watch("itver") ||
      watch("location");
    return (
      <Box
        // component="form"
        // ref={ref}
        // onSubmit={handleSubmit(handleFormSubmit)}
        sx={{ minWidth: 400 }}
      >
        <Box mb="10px">
          <Button
            variant="outlined"
            style={{
              height: "45px",
            }}
            onClick={handleOpenDraw}
          >
            {t("0-common.draw")}
          </Button>
        </Box>
        <Stack
          ref={ref}
          sx={{
            height: "170px",
            overflow: "hidden",
            borderRadius: "6px",
            border: "2px solid #357EEB",
            position: "relative",
            // backgroundColor: "white",
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
              alignItems: "center",
              // height: "150px",
              height: "100%",
            }}
            // ref={sigCanvasRef}
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

            <ContentRight
              direction={direction}
              subtitle={subtitle}
              watch={watch}
            />
          </Stack>
          {/* <Box
            style={{
              borderTop: "2px dashed #357EEB",
              height: "20px",
            }}
          ></Box> */}
        </Stack>

        <DialogDraw
          name="drawUrl"
          control={control}
          open={openDraw}
          handleClose={handleCloseDraw}
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
  onDisableSubmit: PropTypes.func,
  watch: PropTypes.func,
  control: PropTypes.object,
};
DrawSignForm.displayName = "DrawSignForm";
export default DrawSignForm;
