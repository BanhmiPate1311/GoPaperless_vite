import { ReactComponent as TrashIcon } from "@/assets/images/svg/trash.svg";
import AddIcon from "@mui/icons-material/Add";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import WatchLaterRoundedIcon from "@mui/icons-material/WatchLaterRounded";
import { MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import * as React from "react";
import { useState } from "react";
import { InputField } from "../form";
import { AddFieldQrypto } from "./AddFieldQrypto";
import { Typography } from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { styled } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

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
    switch (type) {
      case "text":
        setValue(`items[${index}].field`, label);
        setValue(`items[${index}].type`, 1);
        setValue(`items[${index}].value`, "");
        setValue(`items[${index}].remark`, "text");
        setValue(`items[${index}].mandatory_enable`, false);
        break;
      case "boldLabel":
        setValue(`items[${index}].field`, label);
        setValue(`items[${index}].type`, 6);
        setValue(`items[${index}].remark`, "boldLabel");
        setValue(`items[${index}].mandatory_enable`, false);

        break;
      case "date":
        setValue(`items[${index}].field`, label);
        setValue(`items[${index}].type`, 1);
        setValue(
          `items[${index}].value`,

          new Date().getMonth +
            "/" +
            new Date().getDay +
            "/" +
            new Date().getFullYear()
        );
        setValue(`items[${index}].remark`, "date");
        setValue(`items[${index}].mandatory_enable`, false);

        break;
      case "choice":
        setValue(`items[${index}].field`, label);
        setValue(`items[${index}].type`, 7);
        setValue(`items[${index}].value`, []);
        setValue(`items[${index}].remark`, "choice");
        setValue(`items[${index}].mandatory_enable`, false);

        break;
      case "picture":
        setValue(`items[${index}].field`, label);
        setValue(`items[${index}].type`, 9);
        setValue(`items[${index}].value`, "");
        setValue(`items[${index}].remark`, "picture");
        setValue(`items[${index}].file_format`, "");
        setValue(`items[${index}].file_name`, "");
        setValue(`items[${index}].mandatory_enable`, false);

        break;
      case "file":
        setValue(`items[${index}].field`, label);
        setValue(`items[${index}].type`, 9);
        setValue(`items[${index}].value`, "");
        setValue(`items[${index}].remark`, "file");
        setValue(`items[${index}].file_format`, "");
        setValue(`items[${index}].file_name`, "");
        setValue(`items[${index}].mandatory_enable`, false);

        break;
      case "table":
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
        setValue(`items[${index}].remark`, "table");
        setValue(`items[${index}].mandatory_enable`, false);

        break;
      case "pictureLabel":
        setValue(`items[${index}].field`, label);
        setValue(`items[${index}].type`, 11);
        setValue(`items[${index}].value`, {
          label_1: "",
          label_2: "",
          label_3: "",
          label_4: "",
          file_data: "",
        });
        setValue(`items[${index}].remark`, "pictureLabel");
        setValue(`items[${index}].file_format`, "");
        setValue(`items[${index}].file_name`, "");
        setValue(`items[${index}].mandatory_enable`, false);

        break;
      case "url":
        setValue(`items[${index}].field`, label);
        setValue(`items[${index}].type`, 10);
        setValue(`items[${index}].value.url`, "");
        setValue(`items[${index}].value.label`, "");
        setValue(`items[${index}].remark`, "url");
        setValue(`items[${index}].mandatory_enable`, false);

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
          switch (field.remark) {
            case "text":
              return (
                <TextElement
                  register={register}
                  index={index}
                  removeField={removeField}
                  control={control}
                  field={field}
                />
              );
            case "boldLabel":
              return (
                <BoldLabelElement
                  register={register}
                  index={index}
                  removeField={removeField}
                  field={field}
                />
              );
            case "date":
              return (
                <DateElement
                  register={register}
                  index={index}
                  removeField={removeField}
                  setValue={setValue}
                  field={field}
                />
              );
            case "choice":
              return (
                <ChoiceElement
                  register={register}
                  index={index}
                  removeField={removeField}
                  setValue={setValue}
                  field={field}
                  control={control}
                  unregister={unregister}
                />
              );
            case "picture":
              return (
                <PictureElement
                  register={register}
                  index={index}
                  removeField={removeField}
                  setValue={setValue}
                  field={field}
                />
              );
            case "file":
              return (
                <FileElement
                  register={register}
                  index={index}
                  removeField={removeField}
                  setValue={setValue}
                  field={field}
                />
              );
            case "pictureLabel":
              return (
                <PictureLabelElement
                  register={register}
                  index={index}
                  removeField={removeField}
                  setValue={setValue}
                  field={field}
                  control={control}
                />
              );
            case "table":
              return (
                <Box sx={{ my: "10px" }}>
                  <TableElement
                    register={register}
                    index={index}
                    removeField={removeField}
                    field={field}
                    control={control}
                  />
                </Box>
              );
            case "url":
              return (
                <UrlElement
                  register={register}
                  index={index}
                  removeField={removeField}
                  control={control}
                  field={field}
                />
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

const TextElement = ({ register, index, removeField, control, field }) => {
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
          disabled={field.mandatory_enable}
        />
        {/* <input
          style={{ display: "none" }}
          {...register(`items[${index}].type`)}
        /> */}
        <Button sx={{ color: "#F24E1E" }} onClick={() => removeField(index)}>
          <TrashIcon />
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
        disabled={field.mandatory_enable}
      />
    </Box>
  );
};
const BoldLabelElement = ({ register, index, removeField }) => {
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
              fontWeight: 700,
              padding: "0",
            },
          }}
          {...register(`items[${index}].field`)}
          disabled={field.mandatory_enable}
        />
        <Button sx={{ color: "#F24E1E" }} onClick={() => removeField(index)}>
          <TrashIcon />
        </Button>
      </Box>
    </Box>
  );
};
const DateElement = ({ register, index, removeField, setValue, field }) => {
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
        <Button sx={{ color: "#F24E1E" }} onClick={() => removeField(index)}>
          <TrashIcon />
        </Button>
      </Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          sx={{ width: "100%" }}
          value={dayjs(field.value)}
          onChange={(newValue) => {
            setValue(
              `items[${index}].value`,
              newValue.month() +
                1 +
                "/" +
                newValue.date() +
                "/" +
                newValue.year()
            );
          }}
          disabled={field.mandatory_enable}
        />
      </LocalizationProvider>
    </Box>
  );
};
const ChoiceElement = ({
  register,
  index,
  removeField,
  setValue,
  field,
  control,
  unregister,
}) => {
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
          disabled={field.mandatory_enable}
        />
        {/* <input
        style={{ display: "none" }}
        {...register(`items[${index}].type`)}
      /> */}
        <Button sx={{ color: "#F24E1E" }} onClick={() => removeField(index)}>
          <TrashIcon />
        </Button>
      </Box>
      <FormControl fullWidth size="small" sx={{ mb: "15px" }}>
        <Box sx={{ display: "flex ", gap: "10px" }}>
          <Select
            labelId="demo-simple-select1-label-step1"
            id="demo-simple-select-step1"
            defaultValue={
              field?.value?.filter((item) => item.choise === true)[0]?.element
            }
            sx={{
              maxWidth: "371px",
              "& .MuiListItemSecondaryAction-root": {
                right: "30px",
                display: "flex",
              },
              backgroundColor: "signingWFBackground.main",
              width: "100%",
            }}
          >
            {field.value?.map((item, i) => {
              return (
                item && (
                  <MenuItem key={i} value={item.element}>
                    {item.element}
                  </MenuItem>
                )
              );
            })}
          </Select>
          <Button
            variant="contained"
            onClick={() => {
              if (field.value) {
                setValue(`items[${index}].value`, [
                  ...field.value,
                  { element: "", choise: false },
                ]);
              } else {
                setValue(`items[${index}].value`, [
                  { element: "", choise: false },
                ]);
              }
            }}
          >
            <AddIcon />
          </Button>
        </Box>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          // defaultValue={true}
          onChange={(e) => {
            const value = e.target.value.trim();
            console.log();
            field.value.map((item, i) => {
              setValue(`items[${index}].value[${i}].choise`, false);
            });
            setValue(
              `items[${index}].value[${value.substring(
                value.length - 1,
                value.length
              )}].choise`,
              true
            );
          }}
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
                  key={i}
                >
                  <FormControlLabel
                    value={values.element + i}
                    control={<Radio />}
                    checked={values.choise}
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
                    variant=""
                    onClick={() => {
                      unregister(`items.[${index}].value.[${i}]`);
                    }}
                    sx={{ color: "#F24E1E" }}
                  >
                    <CloseRoundedIcon />
                  </Button>
                </Box>
              )
            );
          })}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};
const TableElement = ({ register, index, removeField, field, control }) => {
  return (
    <Box
      key={index}
      sx={{
        border: "1px solid #E5E7EB",
        borderRadius: "6px",
        marginBottom: "10px",
        padding: "5px",
        margin: "-6px",
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
          disabled={field.mandatory_enable}
        />
        <Button sx={{ color: "#F24E1E" }} onClick={() => removeField(index)}>
          <TrashIcon />
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        {field.value?.map((values, i) => {
          if (
            Object.values(values).length > 1 &&
            Object.values(values)[Object.values(values).length - 1] !==
              undefined
          ) {
            return (
              <Grid container spacing={1} key={i} sx={{ marginBottom: "10px" }}>
                <Grid item xs={5.3}>
                  <InputField
                    label=""
                    name={`items[${index}].value[${i}].column_${i + 1}`}
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
                    disabled={field.mandatory_enable}
                  />
                </Grid>
                <Grid item xs={5.3}>
                  <InputField
                    label=""
                    name={`items[${index}].value[${i}].column_${i + 2}`}
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
                    disabled={field.mandatory_enable}
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
                    <Tooltip title={values.column_3.toString()} placement="top">
                      <WatchLaterRoundedIcon sx={{ color: "#6B7280" }} />
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
                  disabled={field.mandatory_enable}
                />
              </Grid>
            </Grid>
          );
        })}
      </Box>
    </Box>
  );
};
const PictureElement = ({ register, index, removeField, setValue, field }) => {
  const readFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      setValue(`items[${index}].file_format`, file.type);
      setValue(`items[${index}].file_name`, file.name);
      setValue(
        `items[${index}].value`,
        e.target.result.replace(`data:${file.type};base64,`, "")
      );
    };
  };
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

        <Button sx={{ color: "#F24E1E" }} onClick={() => removeField(index)}>
          <TrashIcon />
        </Button>
      </Box>
      <Box>
        <Box
          sx={{
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "10px auto 0",
            backgroundColor: "#E5E7EB",
          }}
        >
          {field.value && (
            <img
              style={{ width: "auto", height: "100%" }}
              src={`data:${field.file_format};base64,${field.value}`}
            />
          )}
        </Box>
        <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Button
            variant="contained"
            sx={{ borderRadius: "50px" }}
            startIcon={<FileUploadOutlinedIcon />}
            role={undefined}
            component="label"
            tabIndex={-1}
          >
            Upload
            <VisuallyHiddenInput
              type="file"
              onChange={(e) => {
                readFile(e.target.files[0]);
                e.target.value = "";
              }}
            />
          </Button>
          <Typography
            variant="body"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "200px",
            }}
          >
            {field.file_name || "No File Chosen"}
          </Typography>
          {field.file_name && (
            <Button
              variant=""
              onClick={() => {
                setValue(`items[${index}].file_format`, "");
                setValue(`items[${index}].file_name`, "");
                setValue(`items[${index}].value`, "");
              }}
              sx={{ color: "#F24E1E" }}
            >
              <CloseRoundedIcon />
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};
const PictureLabelElement = ({
  register,
  index,
  removeField,
  setValue,
  field,
  control,
}) => {
  const readFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      setValue(`items[${index}].file_format`, file.type);
      setValue(`items[${index}].file_name`, file.name);
      setValue(
        `items[${index}].value.file_data`,
        e.target.result.replace(`data:${file.type};base64,`, "")
      );
    };
  };
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

        <Button sx={{ color: "#F24E1E" }} onClick={() => removeField(index)}>
          <TrashIcon />
        </Button>
      </Box>
      <Box>
        <Box sx={{ display: "flex", gap: "10px" }}>
          <Box
            sx={{
              width: "150px",
              height: "auto",
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "10px",
              backgroundColor: "#E5E7EB",
              flexGrow: "1",
            }}
          >
            {field.value.file_data && (
              <img
                style={{ width: "100%", height: "100%" }}
                src={`data:${field.file_format};base64,${field.value.file_data}`}
              />
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              flexGrow: "1",
            }}
          >
            <InputField
              label=""
              name={`items[${index}].value.label_1`}
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
            <InputField
              label=""
              name={`items[${index}].value.label_2`}
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
            <InputField
              label=""
              name={`items[${index}].value.label_3`}
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
            <InputField
              label=""
              name={`items[${index}].value.label_4`}
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
        </Box>
        <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Button
            variant="contained"
            sx={{ borderRadius: "50px" }}
            startIcon={<FileUploadOutlinedIcon />}
            role={undefined}
            component="label"
            tabIndex={-1}
          >
            Upload
            <VisuallyHiddenInput
              type="file"
              onChange={(e) => {
                readFile(e.target.files[0]);
                e.target.value = "";
              }}
            />
          </Button>
          <Typography
            variant="body"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "200px",
            }}
          >
            {field.file_name || "No File Chosen"}
          </Typography>
          {field.file_name && (
            <Button
              variant=""
              onClick={() => {
                setValue(`items[${index}].file_format`, "");
                setValue(`items[${index}].file_name`, "");
                setValue(`items[${index}].value`, "");
              }}
              sx={{ color: "#F24E1E" }}
            >
              <CloseRoundedIcon />
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};
const FileElement = ({ register, index, removeField, setValue, field }) => {
  const readFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      setValue(`items[${index}].file_format`, file.type);
      setValue(`items[${index}].file_name`, file.name);
      setValue(
        `items[${index}].value`,
        e.target.result.replace(`data:${file.type};base64,`, "")
      );
    };
  };
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

        <Button sx={{ color: "#F24E1E" }} onClick={() => removeField(index)}>
          <TrashIcon />
        </Button>
      </Box>
      <Box>
        <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Button
            variant="contained"
            sx={{ borderRadius: "50px" }}
            startIcon={<FileUploadOutlinedIcon />}
            role={undefined}
            component="label"
            tabIndex={-1}
          >
            Upload
            <VisuallyHiddenInput
              type="file"
              onChange={(e) => readFile(e.target.files[0])}
            />
          </Button>
          <Typography
            variant="body"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "200px",
            }}
          >
            {field.file_name || "No File Chosen"}
          </Typography>
          {field.file_name && (
            <Button
              variant=""
              onClick={() => {
                setValue(`items[${index}].file_format`, "");
                setValue(`items[${index}].file_name`, "");
                setValue(`items[${index}].value`, "");
              }}
              sx={{ color: "#F24E1E" }}
            >
              <CloseRoundedIcon />
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};
const UrlElement = ({ register, index, removeField, control }) => {
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
        <Button sx={{ color: "#F24E1E" }} onClick={() => removeField(index)}>
          <TrashIcon />
        </Button>
      </Box>
      <Box>
        <Typography variant="h6" sx={{ marginBottom: "5px" }}>
          Link Text
        </Typography>
        <InputField
          label=""
          name={`items[${index}].value.label`}
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
          sx={{ mt: 0, mb: "10px", height: "45px" }}
        />
        <Typography variant="h6" sx={{ marginBottom: "5px" }}>
          URL
        </Typography>
        <InputField
          label=""
          name={`items[${index}].value.url`}
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
    </Box>
  );
};
