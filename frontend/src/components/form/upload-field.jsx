import styled from "@emotion/styled";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useController } from "react-hook-form";

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

export const UploadField = ({
  name,
  label,
  control,
  setErrorFile,
  onChange: externalOnChange, // không cho user overide lại các thuộc tính này
  // onBlur: externalOnBlur,
  // ref: externalRef,
  // value: externalValue,
  ...rest
}) => {
  const {
    field: { onChange },
    fieldState: { error },
  } = useController({ name, control });

  useEffect(() => {
    if (error) {
      setErrorFile(error?.message);
    }
  }, [error, setErrorFile]);
  const handleUploadImage = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      //   sigImgCropRef.current.style.backgroundImage = `url(${reader.result})`;
      //   setCurrentImgCropping(reader.result);
      //   setShowModalEditImage(true);
      onChange(reader.result);
      externalOnChange();
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <Button
      component="label"
      name={name}
      startIcon={<CloudUploadIcon />}
      sx={{
        marginBottom: "0.5rem",
        marginTop: "1rem",
        fontWeight: "medium",
      }}
      {...rest}
    >
      {label}
      <VisuallyHiddenInput type="file" onChange={handleUploadImage} />
    </Button>
  );
};

UploadField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  control: PropTypes.object,
  data: PropTypes.array,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  ref: PropTypes.object,
  value: PropTypes.any,
  setErrorFile: PropTypes.func,
};

export default UploadField;