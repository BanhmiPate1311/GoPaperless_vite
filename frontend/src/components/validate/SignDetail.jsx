import { createValidName } from "@/utils/commonFunction";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import ShowSignature from "./ShowSignature";

export const SignDetail = ({ sign, signType }) => {
  // console.log("sign: ", sign);
  let name = sign.name + " " + signType;
  const [expanded, setExpanded] = useState("panel");

  const handleChangeShow = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : true);
  };

  return (
    <Accordion
      expanded={expanded === "panel"}
      onChange={handleChangeShow("panel")}
      sx={{ boxShadow: "none", borderBottom: "1px solid #ccc" }}
      style={{ margin: 0 }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
        sx={{
          background: "rgb(232, 235, 240)",
          boxShadow: "none",
          minHeight: "unset !important",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ width: "90%", flexShrink: 0 }}>
          {createValidName(name)}
        </Typography>
        <Typography variant="h6" sx={{ color: "text.secondary" }}>
          {sign.value.length}
        </Typography>
      </AccordionSummary>
      {sign.value.map((val, i) => {
        return (
          <AccordionDetails key={i} sx={{ padding: "unset !important" }}>
            <ShowSignature
              sig={val}
              sign={sign}
              signType={signType}
              index={i}
            />
            {/* <Divider /> */}
          </AccordionDetails>
        );
      })}
    </Accordion>
  );
};
SignDetail.propTypes = {
  sign: PropTypes.object,
  signType: PropTypes.string,
};
export default SignDetail;
