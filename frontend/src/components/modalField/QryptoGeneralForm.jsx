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
import FormControl from "@mui/material/FormControl";
import { AddFieldQrypto } from "./AddFieldQrypto";
import { MenuItem } from "@mui/material";
import Select from "@mui/material/Select";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import AddIcon from "@mui/icons-material/Add";

export const QryptoGeneralForm = ({
  control,
  watch,
  register,
  setValue,
  unregister,
}) => {
  const { items } = watch();

  const [open, setOpen] = useState(false);

  const handleAddField = (type, label) => {
    const index = items.length;
    console.log("type: ", type);
    console.log("label: ", label);
    switch (type) {
      case 1:
        setValue(`items[${index}].field`, label);
        setValue(`items[${index}].type`, 1);
        setValue(`items[${index}].value`, "");
        break;
      case 7:
        setValue(`items[${index}].field`, label);
        setValue(`items[${index}].type`, 7);
        setValue(`items[${index}].value`, []);
        break;
      case 8:
        setValue(`items[${index}].field`, label);
        setValue(`items[${index}].type`, 8);
        setValue(`items[${index}].value`, [
          {
            column_1: "",
            column_2: "",
            column_3: "",
          },
          {
            column_1: "",
          },
        ]);
        break;
    }
  };
  const removeField = (index) => {
    unregister(`items.${index}`);
  };
  return (
    <>
      <Box>
        {items?.map((field, index) => {
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
                      sx={{
                        "& .MuiInputBase-root": {
                          height: "auto",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderWidth: "0",
                          },
                        },
                        "& .MuiInputBase-input": {
                          fontWeight: 500,
                          padding: "0",
                        },
                      }}
                      {...register(`items[${index}].field`)}
                    />
                    {/* <input
                      style={{ display: "none" }}
                      {...register(`items[${index}].type`)}
                    /> */}
                    <Button onClick={() => removeField(index)}>
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
            case 7:
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
                      sx={{
                        "& .MuiInputBase-root": {
                          height: "auto",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderWidth: "0",
                          },
                        },
                        "& .MuiInputBase-input": {
                          fontWeight: 500,
                          padding: "0",
                        },
                      }}
                      {...register(`items[${index}].field`)}
                    />
                    {/* <input
                      style={{ display: "none" }}
                      {...register(`items[${index}].type`)}
                    /> */}
                    <Button onClick={() => removeField(index)}>
                      <TrashIcon sx={{ color: "#F24E1E" }} />
                    </Button>
                  </Box>
                  <FormControl fullWidth size="small" sx={{ mb: "15px" }}>
                    <Box sx={{ display: "flex ", gap: "10px" }}>
                      <Select
                        labelId="demo-simple-select1-label-step1"
                        id="demo-simple-select-step1"
                        // value={type}
                        onChange={(e) => console.log(e.target.value)}
                        sx={{
                          "& .MuiListItemSecondaryAction-root": {
                            right: "30px",
                            display: "flex",
                          },
                          backgroundColor: "signingWFBackground.main",
                          width: "100%",
                        }}
                      >
                        {field.value?.map((item, i) => {
                          console.log(item, item !== null, "item");
                          return (
                            item && (
                              <MenuItem key={i} value={item.value}>
                                {item.element}
                              </MenuItem>
                            )
                          );
                        })}
                      </Select>
                      <Button
                        variant="contained"
                        onClick={() => {
                          setValue(`items[${index}].value`, [
                            ...field.value,
                            { element: "", choise: false },
                          ]);
                        }}
                      >
                        <AddIcon />
                      </Button>
                    </Box>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      // defaultValue={true}
                      name="radio-buttons-group"
                      // {...register(`items[${index}].value[${i}].choise`)}
                    >
                      {field.value?.map((values, i) => {
                        return (
                          values && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                marginTop: "10px",
                                gap: "10px",
                              }}
                            >
                              <FormControlLabel
                                value={values.element + i}
                                control={<Radio />}
                              />
                              <InputField
                                label=""
                                name={`items[${index}].value[${i}].element`}
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
                              <Button
                                variant="contained"
                                onClick={() => {
                                  unregister(`items.[${index}].value.[${i}]`);
                                }}
                              >
                                <TrashIcon sx={{ color: "#fff" }} />
                              </Button>
                            </Box>
                          )
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
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
                    <TextField
                      sx={{
                        "& .MuiInputBase-root": {
                          height: "auto",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderWidth: "0",
                          },
                        },
                        "& .MuiInputBase-input": {
                          fontWeight: 500,
                          padding: "0",
                        },
                      }}
                      {...register(`items[${index}].field`)}
                    />
                    <Button onClick={() => removeField(index)}>
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
          onClick={() => setOpen(true)}
          variant="contained"
          sx={{ width: "100%", borderRadius: "10px", marginBottom: "10px" }}
        >
          <AddRoundedIcon />
          Add Element
        </Button>
      </Box>
      {open && (
        <AddFieldQrypto
          open={open}
          setOpen={setOpen}
          handleAddField={handleAddField}
        />
      )}
    </>
  );
};
