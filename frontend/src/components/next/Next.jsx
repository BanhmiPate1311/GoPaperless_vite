import Box from "@mui/material/Box";
import PropTypes from "prop-types";

export const Next = ({ newFields, value, handleChange }) => {
  //   console.log("newFields: ", newFields.length);

  //   console.log("value: ", value);

  return (
    <Box
      sx={{
        position: "fixed",
        top: "20rem",
        left: "1rem",
        zIndex: 3,
        backgroundColor: "orange",
        p: "10px",
        userSelect: "none",
        cursor: "pointer", // Thêm style cursor để biểu thị rằng đây là một phần có thể click
      }}
      onClick={handleChange}
    >
      Next: {newFields.length > 0 ? value + 1 : 0 + "/" + newFields.length}
    </Box>
  );
};

Next.propTypes = {
  newFields: PropTypes.array,
  value: PropTypes.number,
  handleChange: PropTypes.func,
};

export default Next;
