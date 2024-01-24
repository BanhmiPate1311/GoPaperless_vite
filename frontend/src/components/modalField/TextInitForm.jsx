import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import { forwardRef, useEffect } from "react";
import { InputField } from "../form";

export const TextInitForm = forwardRef(
  ({ watch, control, onDisableSubmit }, ref) => {
    useEffect(() => {
      if (watch("text") === "") {
        onDisableSubmit(true);
      } else {
        onDisableSubmit(false);
      }
      // if (provider === "USB_TOKEN_SIGNING" && errorPG) {
      //   onDisableSubmit(true);
      // }
    }, [watch("text"), onDisableSubmit, watch]);
    return (
      <Box
        // component="form"
        // ref={ref}
        // onSubmit={handleSubmit(handleFormSubmit)}
        sx={{ minWidth: 400 }}
      >
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
        <Stack
          ref={ref}
          direction={"row"}
          alignItems={"center"}
          sx={{
            height: "170px",
            width: "100%",
            overflow: "hidden",
            borderRadius: "6px",
            border: "2px solid #357EEB",
            position: "relative",
            // background: "transparent",
          }}
        >
          <Box
            sx={{
              marginLeft: "auto",
              marginRight: "auto",
              width: "100%",
              fontSize: "36px",
              textAlign: "center",
              textTransform: "capitalize",
              fontWeight: "bold",
            }}
            className="font-moon-dance"
          >
            {watch("text") || ""}
          </Box>
        </Stack>
      </Box>
    );
  }
);

TextInitForm.propTypes = {
  watch: PropTypes.func,
  control: PropTypes.object,
  onDisableSubmit: PropTypes.func,
};
TextInitForm.displayName = "TextInitForm";
export default TextInitForm;