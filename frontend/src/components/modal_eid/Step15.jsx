import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export const Step15 = ({ taxInformation }) => {
  console.log("taxInformation: ", taxInformation);
  const [tax, setTax] = React.useState([]);
  const { t } = useTranslation();
  useEffect(() => {
    const taxDemo = [];

    taxDemo.push({
      title: "electronic.step151.businessNumber",
      value: taxInformation?.company_information?.business_license,
    });

    taxDemo.push({
      title: "electronic.step151.dateOfIssue",
      value: taxInformation?.company_information?.tax_code_issuance_date,
    });

    taxDemo.push({
      title: "electronic.step151.taxCodeClosingDate",
      value: taxInformation?.company_information?.tax_code_revoke_date,
    });

    taxDemo.push({
      title: "electronic.step151.officialName",
      value: taxInformation?.company_information?.official_name,
    });

    taxDemo.push({
      title: "electronic.step151.tradingName",
      value: taxInformation?.company_information?.short_name,
    });

    taxDemo.push({
      title: "electronic.step151.whereToRegisterForTaxAdministration",
      value:
        taxInformation?.company_information
          ?.place_of_registration_tax_management,
    });

    taxDemo.push({
      title: "electronic.step151.headOfficeAddress",
      value: taxInformation?.company_information?.address,
    });

    taxDemo.push({
      title: "electronic.step151.whereToRegisterToPayTaxes",
      value:
        taxInformation?.company_information?.place_of_registration_pay_taxes,
    });

    taxDemo.push({
      title: "electronic.step151.addressToReceiveTaxNotices",
      value: taxInformation?.company_information?.address_receive_tax_notices,
    });

    taxDemo.push({
      title: "electronic.step151.establishmentDecisionDateOfIssue",
      value: "-",
    });

    taxDemo.push({
      title: "electronic.step151.decisionMakingBody",
      value: "-",
    });

    taxDemo.push({
      title: "electronic.step151.businessLicenseDateOfIssue",
      value:
        taxInformation?.company_information?.business_license +
        " - " +
        taxInformation?.company_information?.business_license_issuance_date,
    });

    taxDemo.push({
      title: "electronic.step151.issuingAuthority",
      value: "",
    });

    taxDemo.push({
      title: "electronic.step151.dateOfReceiptOfTheDeclaration",
      value: taxInformation?.company_information?.receipt_declaration_date,
    });

    taxDemo.push({
      title: "electronic.step151.dateMonthOfStartOfFiscalYear",
      value: taxInformation?.company_information?.financial_start_time,
    });

    taxDemo.push({
      title: "electronic.step151.dateMonthOfTheEndOfTheFiscalYear",
      value: taxInformation?.company_information?.financial_end_time,
    });

    taxDemo.push({
      title: "electronic.step151.currentCode",
      value: "",
    });

    taxDemo.push({
      title: "electronic.step151.contractStartDate",
      value: taxInformation?.company_information?.operation_start_date,
    });
    taxDemo.push({
      title: "electronic.step151.chapterClause",
      value: taxInformation?.company_information?.chapter_clause,
    });

    taxDemo.push({
      title: "electronic.step151.formHMath",
      value: taxInformation?.company_information?.payment_form,
    });

    taxDemo.push({
      title: "electronic.step151.vatMethod",
      value: taxInformation?.company_information?.method_VAT,
    });

    taxDemo.push({
      title: "electronic.step151.ownerLegalRepresentative",
      value: taxInformation?.owner_information?.full_name,
    });

    taxDemo.push({
      title: "electronic.step151.addressOfOwnerLegalRepresentative",
      value: taxInformation?.owner_information?.address,
    });

    taxDemo.push({
      title: "electronic.step151.directorsName",
      value: taxInformation?.director_information?.full_name,
    });

    taxDemo.push({
      title: "electronic.step151.directorsAddress",
      value: taxInformation?.director_information?.address,
    });
    taxDemo.push({
      title: "electronic.step151.chiefAccountant",
      value: taxInformation?.chief_accountant_information?.full_name,
    });
    taxDemo.push({
      title: "electronic.step151.chiefAccountantAddress",
      value: taxInformation?.chief_accountant_information?.address,
    });
    setTax(taxDemo);
  }, [taxInformation]);
  return (
    <TableContainer
      component={Paper}
      sx={{
        marginTop: "10px",
        boxShadow: "none",
        border: "1px solid rgba(224, 224, 224, 1)",
      }}
    >
      <Table aria-label="simple table">
        <TableBody
          sx={{
            "& td": {
              padding: "5px 20px",
            },
          }}
        >
          {tax.map((taxInfo, index) => (
            <TableRow key={index + taxInfo.title}>
              <TableCell
                align="left"
                sx={{
                  textWrap: "nowrap",
                  borderRight: "1px solid rgba(224, 224, 224, 1)",
                  backgroundColor: "dialogBackground.main",
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: "500" }}>
                  {t(taxInfo.title)}
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
                    fontWeight: "500",
                    // "&:hover": {
                    //   color: "primary.main",
                    // },
                  }}
                  // onClick={() => setActiveStep(15)}
                >
                  {taxInfo.value}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

Step15.propTypes = {
  taxInformation: PropTypes.object,
};
