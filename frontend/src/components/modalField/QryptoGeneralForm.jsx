import { ReactComponent as TrashIcon } from "@/assets/images/svg/trash.svg";
import WatchLaterRoundedIcon from "@mui/icons-material/WatchLaterRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { InputField } from "../form";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { useController } from "react-hook-form";
import { use } from "i18next";

export const QryptoGeneralForm = ({ control, watch, register }) => {
  const { items } = watch();

  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState(items);

  const handleOpen = () => {
    console.log(register);
    items.push();
    setFields([...fields, { type: 1, field: "name value", value: "" }]);
  };
  return (
    <>
      <Box>
        {fields?.map((field, index) => {
          switch (field.type) {
            case 1:
              return (
                <Box key={index} sx={{ marginBottom: "10px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <TextField
                      fullWidth
                      // value={}
                      sx={{
                        "& .MuiInputBase-root": {
                          height: "auto",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderWidth: "0",
                          },
                        },
                        "& .MuiInputBase-input": {
                          padding: "0",
                        },
                      }}
                      {...register(`items[${index}].field`)}
                    />
                    <input
                      style={{ display: "none" }}
                      {...register(`items[${index}].type`)}
                    />
                    <Button>
                      <TrashIcon sx={{ color: "#F24E1E" }} />
                    </Button>
                  </Box>
                  <InputField
                    label=""
                    name={`items[${index}].value`}
                    control={control}
                    InputLabelProps={{
                      sx: {
                        backgroundColor: "signingWFBackground.main",
                      },
                    }}
                    inputProps={{
                      sx: {
                        py: "10.5px",
                        backgroundColor: "signingWFBackground.main",
                      },
                    }}
                    sx={{ my: 0, height: "45px" }}
                  />
                </Box>
              );
            case 8:
              return (
                <Box
                  key={index}
                  sx={{
                    border: "1px solid #E5E7EB",
                    borderRadius: "6px",
                    marginBottom: "10px",
                    padding: "5px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <Typography variant="h6">{field.field}</Typography>
                    <Button>
                      <TrashIcon sx={{ color: "#F24E1E" }} />
                    </Button>
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    {field.value?.map((values, i) => {
                      if (
                        Object.values(values).length > 1 &&
                        Object.values(values)[
                          Object.values(values).length - 1
                        ] !== undefined
                      ) {
                        return (
                          <Grid
                            container
                            spacing={1}
                            key={i}
                            sx={{ marginBottom: "10px" }}
                          >
                            <Grid item xs={5.3}>
                              <InputField
                                label=""
                                name={`items[${index}].value[${i}].column_${
                                  i + 1
                                }`}
                                control={control}
                                InputLabelProps={{
                                  sx: {
                                    backgroundColor: "signingWFBackground.main",
                                  },
                                }}
                                inputProps={{
                                  sx: {
                                    p: "14px 16px",
                                    backgroundColor: "signingWFBackground.main",
                                  },
                                }}
                                sx={{ my: 0, height: "45px" }}
                              />
                            </Grid>
                            <Grid item xs={5.3}>
                              <InputField
                                label=""
                                name={`items[${index}].value[${i}].column_${
                                  i + 2
                                }`}
                                control={control}
                                InputLabelProps={{
                                  sx: {
                                    backgroundColor: "signingWFBackground.main",
                                  },
                                }}
                                inputProps={{
                                  sx: {
                                    py: "10.5px",
                                    backgroundColor: "signingWFBackground.main",
                                  },
                                }}
                                sx={{ my: 0, height: "45px" }}
                              />
                            </Grid>
                            <Grid
                              item
                              xs={1.4}
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <Box
                                sx={{
                                  bgcolor: "#fff",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  border: "1px solid #ccc",
                                  height: "44px",
                                  borderRadius: "5px",
                                  width: "48px",
                                }}
                              >
                                <Tooltip
                                  title={values.column_3.toString()}
                                  placement="top"
                                >
                                  <WatchLaterRoundedIcon
                                    sx={{ color: "#6B7280" }}
                                  />
                                </Tooltip>
                              </Box>
                            </Grid>
                          </Grid>
                        );
                      }
                      return (
                        <Grid container spacing={2} key={i}>
                          <Grid item xs={12}>
                            <InputField
                              label=""
                              name={`items[${index}].value[${i}].column_${1}`}
                              control={control}
                              InputLabelProps={{
                                sx: {
                                  backgroundColor: "signingWFBackground.main",
                                },
                              }}
                              inputProps={{
                                sx: {
                                  p: "10.5px",
                                  backgroundColor: "signingWFBackground.main",
                                },
                              }}
                              sx={{ my: 0, height: "45px" }}
                            />
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Box>
                </Box>
              );
          }
        })}
        <Button
          onClick={handleOpen}
          variant="contained"
          sx={{ width: "100%", borderRadius: "10px", marginBottom: "10px" }}
        >
          <AddRoundedIcon />
          Add Element
        </Button>
      </Box>
      {open && <Box>Modal</Box>}
    </>
  );
};
