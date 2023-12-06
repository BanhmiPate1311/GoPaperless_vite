import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";

export const SignerInfor = ({ data }) => {
  console.log("data: ", data);
  return (
    <Box width={"400px"}>
      <Typography variant="h6" fontWeight={600}>
        Signer
      </Typography>
      <Box
        p={1}
        color={"signingtext1.main"}
        bgcolor={"accordingBackGround.main"}
        borderRadius={2}
        mb={1}
      >
        {data.lastName} {data.firstName}
      </Box>
      <Typography variant="h6" fontWeight={600}>
        Name
      </Typography>
      <Box
        p={1}
        color={"signingtext1.main"}
        bgcolor={"accordingBackGround.main"}
        borderRadius={2}
        mb={1}
      >
        {data.firstName}
      </Box>
      <Typography variant="h6" fontWeight={600}>
        Email
      </Typography>
      <Box
        p={1}
        color={"signingtext1.main"}
        bgcolor={"accordingBackGround.main"}
        borderRadius={2}
        mb={1}
      >
        {data.email}
      </Box>
    </Box>
  );
};
SignerInfor.propTypes = {
  data: PropTypes.object,
};
export default SignerInfor;
