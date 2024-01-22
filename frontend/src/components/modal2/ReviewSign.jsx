/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { UseUpdateSig } from "@/hook/use-fpsService";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import html2canvas from "html2canvas";
import { forwardRef, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ResizableBox } from "react-resizable";
import { TextSignForm } from "../modal2/TextSignForm";
import { PDFViewer } from "../validate";
import DrawSignForm from "./DrawSignForm";
import UploadSignForm from "./UploadSignForm";

export const ReviewSign = forwardRef(
  (
    {
      open,
      handleOpenResize,
      dataSigning,
      headerFooter,
      formattedDatetime,
      onDisableSubmit,
      watch,
      control,
      value,
      signatureData,
      pdfPage,
      isControlled,
      isSetPos,
      index,
      signerId,
      maxPosibleResizeWidth,
      maxPosibleResizeHeight,
      workFlow,
      setImgBase64,
    },
    ref
  ) => {
    const { t } = useTranslation();
    const putSignature = UseUpdateSig();
    const queryClient = useQueryClient();
    const textElement = useRef(null);
    const renderPage = (props) => {
      return (
        <>
          {props.canvasLayer.children}
          <ResizableBox
            width={
              signatureData.dimension?.width
                ? signatureData.dimension?.width * (pdfPage.width / 100)
                : Infinity
            }
            height={
              signatureData.dimension?.height
                ? signatureData.dimension?.height * (pdfPage.height / 100)
                : 150
            }
            style={{
              // background: "#fff",
              position: "absolute",
              borderRadius: "6px",
              top: signatureData.dimension?.y + "%",
              left: signatureData.dimension?.x + "%",
              zIndex: 100,
              opacity: signatureData.verification === undefined ? 1 : 0,
              transition: isControlled ? `transform 0.3s` : `none`,
            }}
            // minConstraints={[
            //   signatureData.dimension?.width * (signatureData.pdfPage.width / 100),
            //   signatureData.dimension?.height * (signatureData.pdfPage.height / 100),
            // ]}
            // maxConstraints={[
            //   signatureData.dimension?.width * (signatureData.pdfPage.width / 100),
            //   signatureData.dimension?.height * (signatureData.pdfPage.height / 100),
            // ]}
            minConstraints={[
              isSetPos ||
              signerId +
                "_" +
                signatureData.type +
                "_" +
                signatureData.suffix !==
                signatureData.field_name
                ? signatureData.dimension?.width * (pdfPage.width / 100)
                : pdfPage
                ? (pdfPage.width * 20) / 100
                : 200,
              isSetPos ||
              signerId +
                "_" +
                signatureData.type +
                "_" +
                signatureData.suffix !==
                signatureData.field_name
                ? signatureData.dimension?.height * (pdfPage.height / 100)
                : pdfPage
                ? (pdfPage.height * 5) / 100
                : 50,
            ]}
            maxConstraints={[
              isSetPos ||
              signerId +
                "_" +
                signatureData.type +
                "_" +
                signatureData.suffix !==
                signatureData.field_name
                ? signatureData.dimension?.width * (pdfPage.width / 100)
                : pdfPage
                ? maxPosibleResizeWidth
                : 200,
              isSetPos ||
              signerId +
                "_" +
                signatureData.type +
                "_" +
                signatureData.suffix !==
                signatureData.field_name
                ? signatureData.dimension?.height * (pdfPage.height / 100)
                : pdfPage
                ? maxPosibleResizeHeight
                : 200,
            ]}
            onResize={(e, { size }) => {
              // setShowTopbar(false);
              // setSignature({
              //   ...signatureData,
              //   dimension: {
              //     ...signatureData.dimension,
              //     width: (size.width / signatureData.pdfPage.width) * 100,
              //     height: (size.height / signatureData.pdfPage.height) * 100,
              //   },
              // });
            }}
            onResizeStop={(e, { size }) => {
              console.log("e: ", e);
              if (
                isSetPos ||
                signerId +
                  "_" +
                  signatureData.type +
                  "_" +
                  signatureData.suffix !==
                  signatureData.field_name
              )
                return;
              console.log(size, pdfPage, size.width / pdfPage.width);
              putSignature.mutate(
                {
                  body: {
                    field_name: signatureData.field_name,
                    page: pdfPage.currentPage,
                    dimension: {
                      x: signatureData.dimension.x,
                      y: signatureData.dimension.y,
                      width: (size.width / pdfPage.width) * 100,
                      height: (size.height / pdfPage.height) * 100,
                    },
                    visible_enabled: true,
                  },
                  field: signatureData.type.toLowerCase(),
                  documentId: workFlow.documentId,
                },
                {
                  onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["getField"] });
                  },
                }
              );
            }}
            className={`sig choioi-${index}`}
          >
            {value == 0 && (
              <TextSignForm
                ref={textElement}
                dataSigning={dataSigning}
                headerFooter={headerFooter}
                formattedDatetime={formattedDatetime}
                onDisableSubmit={onDisableSubmit}
                watch={watch}
                control={control}
                showInput={true}
              />
            )}
            {value == 1 && (
              <DrawSignForm
                ref={textElement}
                dataSigning={dataSigning}
                headerFooter={headerFooter}
                formattedDatetime={formattedDatetime}
                onDisableSubmit={onDisableSubmit}
                watch={watch}
                control={control}
                showInput={true}
              />
            )}

            {value == 2 && (
              <UploadSignForm
                ref={textElement}
                dataSigning={dataSigning}
                headerFooter={headerFooter}
                formattedDatetime={formattedDatetime}
                onDisableSubmit={onDisableSubmit}
                watch={watch}
                control={control}
                showInput={true}
              />
            )}
          </ResizableBox>
        </>
      );
    };
    const pageLayout = {
      transformSize: ({ size }) => ({
        height: size.height + 30,
        width: size.width + 30,
      }),
      // buildPageStyles: ({ numPages, pageIndex }) => ({
      //   zIndex: numPages - pageIndex,
      // }),
    };
    return (
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiPaper-root": {
            maxWidth: "1300px",
            width: "100%",
          },
        }}
      >
        <DialogTitle
          component="div"
          id="scroll-dialog-title"
          sx={{
            backgroundColor: "dialogBackground.main",
            p: "10px 20px",
            height: "51px",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              textTransform: "uppercase",
              display: "inline-block",
              color: "signingtextBlue.main",
              borderBottom: "4px solid",
              borderColor: "signingtextBlue.main",
              borderRadius: "5px",
              paddingBottom: "5px",
            }}
          >
            {/* {title} */}
            {t("Review Signature")}
          </Typography>
        </DialogTitle>

        <DialogContent
          sx={{
            overflow: "scroll",
          }}
        >
          <Box
            sx={{
              width: "100%",
              position: "relative",
            }}
          >
            <PDFViewer
              base64={workFlow.pdfBase64}
              renderPage={renderPage}
              pageLayout={pageLayout}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
            onClick={() => {
              handleOpenResize(false);
              setImgBase64(null);
            }}
          >
            {t("0-common.cancel")}
          </Button>
          <Button
            variant="contained"
            // startIcon={
            //   isPending ? <CircularProgress color="inherit" size="1em" /> : null
            // }
            sx={{
              borderRadius: "10px",
              borderColor: "borderColor.main",
              marginLeft: "20px !important",
            }}
            type="button"
            onClick={() => {
              html2canvas(textElement.current).then((canvas) => {
                const data64 = canvas.toDataURL();
                setImgBase64(data64);
                handleOpenResize(false);
              });
            }}
          >
            SAVE
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

ReviewSign.displayName = "ReviewSign";
