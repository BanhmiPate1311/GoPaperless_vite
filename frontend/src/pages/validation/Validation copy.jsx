import { ReactComponent as Lock } from "@/assets/images/validation/lock_validate.svg";
import "@/assets/style/validation.css";
import { PDFViewer, TabDocument } from "@/components/validate";
import { validationService } from "@/services/validation";
import i18n from "@/utils/languages/i18n";
import { IosShareOutlined } from "@mui/icons-material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import Chip from "@mui/material/Chip";

const CustomButton = styled(Button)`
  text-transform: none; /* Đặt textTransform thành none để bỏ chữ in hoa */
  border-radius: 50px;
  white-space: nowrap;
  background: rgb(90, 51, 139);
`;

export const Validation = () => {
  const { t } = useTranslation();

  const { upload_token } = useParams();
  // console.log("upload_token: ", upload_token);

  const [isFetching, setIsFetching] = useState(false);

  // const [infoFile, setInfoFile] = useState({});
  const [validFile, setValidFile] = useState({});
  const [isFinish, setIsFinish] = useState(null);

  const [lang, setLang] = useState("English");

  useEffect(() => {
    if (lang) {
      // setLanguage(lang);
      switch (lang) {
        case "en":
          i18n.changeLanguage("0");
          localStorage.setItem("language", "EngLish");
          break;
        case "vi":
          i18n.changeLanguage("1");
          localStorage.setItem("language", "Vietnamese");
          break;
        default:
          break;
      }
    }
  }, [lang]);

  useEffect(() => {
    if (upload_token) {
      // getFirstFileFromUploadToken(upload_token);
      getValidView();
    }
  }, []);

  useEffect(() => {
    if (validFile.ppl_file_validation_id) {
      checkStatus();
    }
  }, [validFile]);

  const getValidView = async () => {
    setIsFetching(true);
    try {
      const response = await validationService.getView({
        uploadToken: upload_token,
      });

      setValidFile(response.data);
      setLang(response.data.lang);
      setIsFetching(false);
      // setInfoFile(response.data);
    } catch (error) {
      setIsFetching(false);
      console.error(error);
    }
  };

  const postback = async () => {
    const data = {
      postBackUrl: validFile.postback_url,
      status: "OK",
      uploadToken: upload_token,
      fileValidationId: validFile.ppl_file_validation_id,
    };
    try {
      await validationService.postBack(data);
      checkStatus();
    } catch (error) {
      console.error(error);
    }
  };

  const checkStatus = async () => {
    const data = {
      fileValidationId: validFile.ppl_file_validation_id,
    };
    try {
      const response = await validationService.checkStatus(data);
      setIsFinish(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main>
      {isFetching && (
        <div
          className="modal backdrop fade show d-flex justify-content-center align-items-center"
          style={{ background: "#00000080" }}
        >
          <div className="loader" />
        </div>
      )}
      <div className="container preview-document-container isign-signing-show isign-signature-pdf ">
        <Box>
          <AppBar
            position="static"
            sx={{
              height: (theme) => theme.GoPaperless.appBarHeight,
            }}
          >
            <Toolbar
              variant="dense"
              sx={{
                backgroundColor: "signingWFBackground.main",
                gap: 2,
                height: (theme) => theme.GoPaperless.appBarHeight,
                padding: "13px 0",
              }}
            >
              {/* <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  sx={{ mr: 2 }}
                  // onClick={handleBack}
                >
                  <ArrowBackIcon />
                </IconButton> */}

              <Chip
                label="PDF"
                size="small"
                sx={{
                  backgroundColor: "#4F4E4E",
                  color: "white",
                  fontWeight: "500",
                }}
                onClick={() => {
                  console.log("click click click");
                }}
              />
              <Typography
                color="signingtext1.main"
                variant="h3"
                component="div"
                sx={{ flexGrow: 1, textTransform: "uppercase" }}
              >
                {validFile?.file?.file_name}
              </Typography>

              <Box sx={{ flexGrow: 1 }} />
              <Box
                sx={{
                  // display: { xs: "none", md: "flex" },
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                {/* <IconButton
                    // aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <Avatar sx={{ background: "#E8B001", fontSize: "1.0rem" }}>
                      XP
                    </Avatar>
                  </IconButton> */}
                {/* <IconButton
                  size="large"
                  aria-label="show 4 new mails"
                  color="#ccc"
                >
                  <Tooltip title="Delete report">
                    <DeleteOutlineIcon />
                  </Tooltip>
                </IconButton> */}
                {validFile.postback_url && (
                  <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="#ccc"
                    onClick={postback}
                    disabled={isFinish === 1}
                  >
                    <Tooltip title="Finish">
                      <IosShareOutlined />
                    </Tooltip>
                  </IconButton>
                )}

                <a
                  style={{ color: "white", textDecoration: "none" }}
                  href={`${window.location.origin}/api/internalusage/validation/${upload_token}/download/report-pdf`}
                >
                  <CustomButton
                    startIcon={<FileDownloadOutlinedIcon />}
                    variant="contained"
                    disabled={
                      validFile?.signatures?.length === 0 &&
                      validFile?.seals?.length === 0
                    }
                  >
                    {t("validation.downloadReport")}
                  </CustomButton>
                </a>
                {/* <Button
                  disabled={
                    validFile?.signatures?.length === 0 &&
                    validFile?.seals?.length === 0
                  }
                >
                  <a
                    style={{ color: "white", textDecoration: "none" }}
                    href={`${window.location.origin}/internalusage/api/validation/${upload_token}/download/report-pdf`}
                  >
                    <CustomButton
                      startIcon={<FileDownloadOutlinedIcon />}
                      variant="contained"
                    >
                      {t("validation.downloadReport")}
                    </CustomButton>
                  </a>
                </Button> */}

                {/* <CustomButtonFill
                  // startIcon={<FileDownloadOutlinedIcon />}
                  size="medium"
                  sx={{ px: 2 }}
                >
                  Download report
                </CustomButtonFill> */}
              </Box>

              {/* <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="show more"
                  // aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  // onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </Box> */}
            </Toolbar>
          </AppBar>
        </Box>

        <div className="content-sign">
          <div className="css-ufz7ne">
            <div className="css-91kxzg">
              <div className="css-r11a23">
                <div className="css-thqqgj css-10ktgt9">
                  <div className="css-h6dcj7">
                    {Object.keys(validFile).length !== 0 && (
                      <PDFViewer base64={validFile?.file?.content} />
                    )}
                  </div>
                </div>
                <div className="css-pmda5y css-1e61wdr css-wnj41j css-1nqdrf4 css-1r2zlre">
                  <div style={{ opacity: 1, transform: "none" }}>
                    <TabDocument validFile={validFile} />
                    {/* Form */}
                    <div className="css-10vgal8 css-19wcyhm">
                      <div className="css-1oy1ewu">
                        <Box
                          sx={{
                            overflow: "hidden",
                            background: "rgb(232, 235, 240)",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "20px",
                              p: 2,
                            }}
                          >
                            {/* <img src={Lock} alt="lock"></img> */}
                            <Lock style={{ width: "100px" }} />
                            <Typography variant="h6">
                              {t("validation.val1")}
                              <Link
                                to="https://gopaperless.mobile-id.vn/compliance/signature-validation-service-practice-statement-and-policy"
                                target="_blank"
                              >
                                {/* Privacy Policy */}
                                {t("validation.val2")}
                              </Link>{" "}
                              {t("validation.val3")}
                            </Typography>
                          </Box>
                        </Box>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <CookieSetting /> */}
        </div>
      </div>
    </main>
  );
};

export default Validation;
