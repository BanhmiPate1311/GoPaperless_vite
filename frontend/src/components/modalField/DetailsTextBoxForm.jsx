import React from "react";
import { useTranslation } from "react-i18next";
import { Box, Grid, TextField, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "transparent",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  // color: theme.palette.text.secondary,
}));
export const DetailsTextBoxForm = () => {
  const { t } = useTranslation();
  return (
    <>
      <Box mb="10px">
        <Typography variant="h6" mb="10px">
          {t("0-common.field name")}
        </Typography>
        <TextField
          fullWidth
          size="small"
          margin="normal"
          // name={name}
          defaultValue={123123123}
          sx={{ my: 0, height: "44px" }}
          InputProps={{
            readOnly: true,
            sx: {
              height: "44px",
              backgroundColor: "signingWFBackground.main",
              fontSize: "14px",
            },
          }}
        />
      </Box>
      <Box sx={{ width: "100%" }}>
        <Grid
          container
          rowSpacing="10px"
          columnSpacing={{ xs: 4, sm: 5, md: 6 }}
          p="10px"
        >
          <Grid item xs={6}>
            <Item
              sx={{
                borderBottom: "1.25px solid",
                borderColor: "borderColor.main",
                height: "20px",
                p: 0,
                borderRadius: 0,
                textAlign: "center",
              }}
              elevation={0}
            >
              <Typography variant="h6">{t("0-common.screen")}</Typography>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item
              sx={{
                borderBottom: "1.25px solid",
                borderColor: "borderColor.main",
                height: "20px",
                p: 0,
                borderRadius: 0,
                textAlign: "center",
              }}
              elevation={0}
            >
              <Typography variant="h6">PDF</Typography>
            </Item>
          </Grid>

          <Grid item xs={6} pt={0}>
            <Item sx={{ p: 0 }} elevation={0}>
              <Typography variant="h6" mb="10px" height={"17px"}>
                {t("0-common.left")}
              </Typography>
              <TextField
                fullWidth
                size="small"
                margin="normal"
                // name={name}
                defaultValue={123123}
                sx={{ my: 0, height: "44px" }}
                InputProps={{
                  // readOnly: true,
                  sx: {
                    height: "44px",
                    backgroundColor: "signingWFBackground.main",
                    fontSize: "14px",
                  },
                }}
              />
            </Item>
          </Grid>
          <Grid item xs={6} pt={0}>
            <Item sx={{ p: 0 }} elevation={0}>
              <Typography variant="h6" mb="10px" height={"17px"}>
                {t("0-common.left")}
              </Typography>
              <TextField
                fullWidth
                size="small"
                margin="normal"
                // name={name}
                defaultValue={123123}
                sx={{ my: 0, height: "44px" }}
                InputProps={{
                  disabled: true,
                  sx: {
                    height: "44px",
                    backgroundColor: "signingWFBackground.main",
                    fontSize: "14px",
                  },
                }}
              />
            </Item>
          </Grid>

          <Grid item xs={6} pt={0}>
            <Item sx={{ p: 0 }} elevation={0}>
              <Typography variant="h6" mb="10px" height={"17px"}>
                {t("0-common.top")}
              </Typography>
              <TextField
                fullWidth
                size="small"
                margin="normal"
                // name={name}
                defaultValue={123123123}
                sx={{ my: 0, height: "44px" }}
                InputProps={{
                  // readOnly: true,
                  sx: {
                    height: "44px",
                    backgroundColor: "signingWFBackground.main",
                    fontSize: "14px",
                  },
                }}
              />
            </Item>
          </Grid>
          <Grid item xs={6} pt={0}>
            <Item sx={{ p: 0 }} elevation={0}>
              <Typography variant="h6" mb="10px" height={"17px"}>
                {t("0-common.top")}
              </Typography>
              <TextField
                fullWidth
                size="small"
                margin="normal"
                // name={name}
                defaultValue={123123123}
                sx={{ my: 0, height: "44px" }}
                InputProps={{
                  disabled: true,
                  sx: {
                    height: "44px",
                    backgroundColor: "signingWFBackground.main",
                    fontSize: "14px",
                  },
                }}
              />
            </Item>
          </Grid>

          <Grid item xs={6} pt={0}>
            <Item sx={{ p: 0 }} elevation={0}>
              <Typography variant="h6" mb="10px" height={"17px"}>
                {t("0-common.width")}
              </Typography>
              <TextField
                fullWidth
                size="small"
                margin="normal"
                // name={name}
                defaultValue={123123123}
                sx={{ my: 0, height: "44px" }}
                InputProps={{
                  // readOnly: true,
                  sx: {
                    height: "44px",
                    backgroundColor: "signingWFBackground.main",
                    fontSize: "14px",
                  },
                }}
              />
            </Item>
          </Grid>
          <Grid item xs={6} pt={0}>
            <Item sx={{ p: 0 }} elevation={0}>
              <Typography variant="h6" mb="10px" height={"17px"}>
                {t("0-common.width")}
              </Typography>
              <TextField
                fullWidth
                size="small"
                margin="normal"
                // name={name}
                defaultValue={123123123}
                sx={{ my: 0, height: "44px" }}
                InputProps={{
                  disabled: true,
                  sx: {
                    height: "44px",
                    backgroundColor: "signingWFBackground.main",
                    fontSize: "14px",
                  },
                }}
              />
            </Item>
          </Grid>

          <Grid item xs={6} pt={0}>
            <Item sx={{ p: 0 }} elevation={0}>
              <Typography variant="h6" mb="10px" height={"17px"}>
                {t("0-common.height")}
              </Typography>
              <TextField
                fullWidth
                size="small"
                margin="normal"
                // name={name}
                defaultValue={123123123}
                sx={{ my: 0, height: "44px" }}
                InputProps={{
                  // readOnly: true,
                  sx: {
                    height: "44px",
                    backgroundColor: "signingWFBackground.main",
                    fontSize: "14px",
                  },
                }}
              />
            </Item>
          </Grid>
          <Grid item xs={6} pt={0}>
            <Item sx={{ p: 0 }} elevation={0}>
              <Typography variant="h6" mb="10px" height={"17px"}>
                {t("0-common.height")}
              </Typography>
              <TextField
                fullWidth
                size="small"
                margin="normal"
                // name={name}
                defaultValue={123123123}
                sx={{ my: 0, height: "44px" }}
                InputProps={{
                  disabled: true,
                  sx: {
                    height: "44px",
                    backgroundColor: "signingWFBackground.main",
                    fontSize: "14px",
                  },
                }}
              />
            </Item>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
