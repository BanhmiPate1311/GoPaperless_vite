import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import logo1 from "../../assets/Logo/gopaperless_white.png";

export const Header = ({ headerFooter }) => {
  // console.log("headerFooter: ", headerFooter);
  const check =
    headerFooter &&
    headerFooter.metadataGatewayView !== "null" &&
    headerFooter.metadataGatewayView !== undefined;
  let metaData = null;
  // console.log("check: ", check);
  if (check) {
    metaData = JSON.parse(headerFooter.metadataGatewayView);
    // console.log("metaData: ", metaData);
  }
  return (
    <Box
      component={"header"}
      height={(theme) => theme.GoPaperless.headerHeight}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",

        px: 5,
        background: check
          ? metaData.headerBackgroundColor
          : "-webkit-linear-gradient(right, #0a98e7 0%, #3e3a94 100%)",
        cursor: `url(${logo1}), auto`,
      }}
    >
      <Box
        component="img"
        sx={{
          height: 53,
        }}
        alt="The house from the offer."
        src={check ? headerFooter.loGo : logo1}
      />
    </Box>
  );
};
Header.propTypes = {
  headerFooter: PropTypes.shape({
    // Define the structure of the object if needed
    // For example:
    // key1: PropTypes.string,
    // key2: PropTypes.number,
    metadataGatewayView: PropTypes.string,
    loGo: PropTypes.string,
  }),
};
export default Header;
