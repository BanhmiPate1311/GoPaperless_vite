import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export const AddFieldQrypto = ({ open, setOpen, handleAddField }) => {
  const { t } = useTranslation();
  const [label, setLabel] = useState("");
  const [type, setType] = useState("");
  const optionType = [
    { value: 1, label: "Text" },
    { value: 7, label: "Choice" },
    // { value: 1, label: "Bold Label" },
    // { value: 1, label: "Date" },
    // { value: 5, label: "Non-Editable Element" },
    // { value: 6, label: "Photo/ Image" },
    // { value: 7, label: "ID Picture with 4 labels" },
    // { value: 1, label: "File" },
    { value: 8, label: "Table" },
    // { value: 1, label: "URL" },
  ];
  return (
    <Dialog
      // keepMounted={false}
      // TransitionComponent={Transition}
      open={!!open}
      onClose={() => setOpen(false)}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      PaperProps={{
        sx: {
          width: "500px",
          maxWidth: "500px",
          height: "700px",
          borderRadius: "10px",
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
          ADD ELEMENT
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          backgroundColor: "dialogBackground.main",
          height: "100%",
          // py: "10px",
          borderBottom: "1px solid",
          borderColor: "borderColor.main",
          p: "0 20px 10px",
        }}
      >
        <DialogContentText
          component="form"
          id="scroll-dialog-description"
          tabIndex={-1}
          sx={{
            height: "100%",
          }}
        >
          <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
            <Box mb="10px">
              <Typography variant="h6" mb="10px">
                Label
              </Typography>
              <TextField
                name="fieldName"
                fullWidth
                size="small"
                margin="normal"
                // name={name}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                sx={{ my: 0, height: "44px" }}
                InputProps={{
                  sx: {
                    height: "44px",
                    backgroundColor: "signingWFBackground.main",
                    fontSize: "14px",
                  },
                }}
              />
              <FormControl fullWidth size="small" sx={{ mb: "15px" }}>
                <Typography variant="h6" mb="10px">
                  Type
                </Typography>

                <Select
                  labelId="demo-simple-select1-label-step1"
                  id="demo-simple-select-step1"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  sx={{
                    "& .MuiListItemSecondaryAction-root": {
                      right: "30px",
                      display: "flex",
                    },
                    backgroundColor: "signingWFBackground.main",
                  }}
                >
                  {optionType.map((item, i) => {
                    return (
                      <MenuItem key={i} value={item.value}>
                        {item.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: "15px 20px", height: "70px" }}>
        <Button
          variant="outlined"
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          onClick={() => setOpen(false)}
        >
          {t("0-common.cancel")}
        </Button>
        <Button
          variant="contained"
          disabled={!type || !label}
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
            handleAddField(type, label);
            setOpen(false);
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
