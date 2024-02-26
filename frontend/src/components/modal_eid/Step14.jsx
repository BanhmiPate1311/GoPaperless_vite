import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const Step14 = ({
  onDisableSubmit,
  handleSubmit,
  isSubmitDisabled,
  taxInformation,
  workFlow,
  setActiveStep,
  setTaxIndex,
  setTaxCode,
}) => {
  const { t } = useTranslation();

  const handleTax = (e) => {
    tax.current = e.target.value;
    if (e.target.value.length < 10 || e.target.value.length > 14) {
      onDisableSubmit(true);
    } else {
      onDisableSubmit(false);
    }
  };
  // Radio button
  const [taxCodes, setTaxCodes] = React.useState(
    taxInformation.document_data.tax_informations[0].company_information
      .business_license
  );
  useEffect(() => {
    setTaxCode(taxCodes);
  }, [taxCodes]);
  const handleChange = (event) => {
    setTaxCodes(event.target.value);
  };

  const controlProps = (item) => ({
    checked: taxCodes === item,
    onChange: handleChange,
    value: item,
    name: "size-radio-button-demo",
    inputProps: { "aria-label": item },
  });
  return (
    <Box>
      <Typography
        variant="h6"
        // sx={{ height: "17px" }}
        mb={"10px"}
      >
        {/* Enter your phone number to receive a verification code. */}
        {t("electronic.step147")}
      </Typography>
      <Typography
        variant="h6"
        // textAlign={"center"}
        mb={"10px"}
        sx={{ fontWeight: 600, color: "textBold.main", height: "17px" }}
      >
        {/* Phone Verification */}
        {t("signing.personal_code")}
        {/* Citizen identification Code */}
      </Typography>

      <Box
        sx={{
          width: "100%",
          height: "45px",
        }}
        autoComplete="off"
      >
        <TextField
          fullWidth
          size="small"
          id="outlined-read-only-input"
          label=""
          type="number"
          autoComplete="new-password"
          value={workFlow.code}
          disabled
          inputProps={{
            sx: {
              backgroundColor: "signingWFBackground.main",
            },
            maxLength: 10,
          }}
          onChange={handleTax}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isSubmitDisabled) {
              handleSubmit();
            }
          }}
        />
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          marginTop: "10px",
          boxShadow: "none",
          border: "1px solid rgba(224, 224, 224, 1)",
        }}
      >
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="female"
          name="radio-buttons-group"
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow
                sx={{
                  height: "30px",
                  "& th,td": {
                    paddingTop: "0px",
                    paddingBottom: "0px",
                  },
                }}
              >
                <TableCell></TableCell>
                <TableCell
                  align="left"
                  sx={{
                    borderLeft: " 1px solid rgba(224, 224, 224, 1)",
                    borderRight: " 1px solid rgba(224, 224, 224, 1)",
                    color: "#6B7280",
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: "500" }}>
                    {t("signing.tax_code")}
                  </Typography>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    color: "#6B7280",
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: "500" }}>
                    {t("signing.taxpayer_name")}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                "& td": {
                  padding: "5px 20px",
                },
              }}
            >
              {taxInformation.document_data.tax_informations.map(
                (taxInfo, index) => (
                  <TableRow key={taxInfo.company_information.business_license}>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        width: "50px",
                        padding: "5px",
                      }}
                    >
                      {" "}
                      <Radio
                        {...controlProps(
                          taxInfo.company_information.business_license
                        )}
                        size="small"
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        textWrap: "nowrap",
                        borderLeft: "1px solid rgba(224, 224, 224, 1)",
                        backgroundColor: "dialogBackground.main",
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: "500" }}>
                        {taxInfo.company_information.tax_code}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        backgroundColor: "dialogBackground.main",
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: "600",
                          cursor: "pointer",
                          "&:hover": {
                            color: "primary.main",
                          },
                        }}
                        onClick={() => {
                          setActiveStep(15);
                          setTaxIndex(index);
                        }}
                      >
                        {taxInfo.company_information.official_name}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </RadioGroup>
      </TableContainer>
    </Box>
  );
};

Step14.propTypes = {
  onDisableSubmit: PropTypes.func,
  handleSubmit: PropTypes.func,
  isSubmitDisabled: PropTypes.bool,
  taxInformation: PropTypes.object,
  workFlow: PropTypes.object,
};

export default Step14;
