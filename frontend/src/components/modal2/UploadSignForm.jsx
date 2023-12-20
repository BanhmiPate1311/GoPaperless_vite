import logo1 from "@/assets/images/Logo/gopaperless_white.png";
import { ContentRight, DialogFile } from "@/components/modal2";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import { forwardRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UploadField } from "../form";

const UploadSignForm = forwardRef(
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

    const [openCrop, setOpenCrop] = useState(false);

    const handleOpenCrop = () => {
      setOpenCrop(true);
    };

    const handleCloseCrop = () => {
      setOpenCrop(false);
    };

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

    // const subtitle = {
    //   labelText: false,
    //   nameText: "name name",
    //   dnText: "your Distinguished Name",
    //   reasonText: "your reason",
    //   locationText: "your location",
    //   dateText: "your date",
    //   itverText: "your itver",
    // };

    const direction =
      watch("name") ||
      watch("date") ||
      watch("reason") ||
      (watch("dn") && subtitle.dnText) ||
      watch("itver") ||
      watch("location");

    useEffect(() => {
      if (watch("fileUrl") === "" || watch("email") === "") {
        onDisableSubmit(true);
      } else {
        onDisableSubmit(false);
      }
      // if (provider === "USB_TOKEN_SIGNING" && errorPG) {
      //   onDisableSubmit(true);
      // }
    }, [watch("fileUrl"), onDisableSubmit, watch("email"), watch]);

    const handleUploadFile = () => {
      handleOpenCrop();
    };

    return (
      <Box
        // component="form"
        // ref={ref}
        // onSubmit={handleSubmit(handleFormSubmit)}
        sx={{ minWidth: 400 }}
      >
        <Box mb="10px">
          <UploadField
            variant="outlined"
            name="fileUrl"
            label={t("0-common.upload")}
            control={control}
            sx={{
              height: "45px",
            }}
            onChange={handleUploadFile}
          />
        </Box>
        <Stack
          ref={ref}
          sx={{
            height: "170px",
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
              height: "150px",
              alignItems: "center",
              minHeight: "100px",
              // padding: "2rem 0",
            }}
            // ref={sigFileRef}
          >
            <Box
              sx={{
                marginLeft: "auto",
                marginRight: "auto",
                width: direction ? "50%" : "100%",
                height: "100%",
                fontSize: "2rem",
                textAlign: "center",
                textTransform: "capitalize",
              }}
              className="font-moon-dance"
            >
              {/* {watch("text") || ""} */}
              {watch("imageScrop") ? (
                <Box
                  component="img"
                  sx={{
                    // height: "100%",
                    // maxWidth: "70%",
                    maxHeight: "100%",
                  }}
                  alt="The house from the offer."
                  src={watch("imageScrop")}
                />
              ) : null}
            </Box>
            <ContentRight
              direction={direction}
              subtitle={subtitle}
              watch={watch}
            />
          </Stack>
          <Box
            style={{
              borderTop: "2px dashed #357EEB",
              height: "20px",
            }}
          ></Box>
        </Stack>

        <DialogFile
          name="imageScrop"
          control={control}
          open={openCrop}
          handleClose={handleCloseCrop}
          data={watch("fileUrl")}
        />
      </Box>
    );
  }
);

UploadSignForm.propTypes = {
  onFileSubmit: PropTypes.func,
  signer: PropTypes.object,
  dataSigning: PropTypes.object,
  headerFooter: PropTypes.object,
  formattedDatetime: PropTypes.string,
  onDisableSubmit: PropTypes.func,
  watch: PropTypes.func,
  control: PropTypes.object,
};
UploadSignForm.displayName = "TextSignForm";
export default UploadSignForm;
