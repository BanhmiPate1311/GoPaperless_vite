import { ListItemIcon, ListItemText } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { ReactComponent as Company } from "@/assets/images/contextmenu/checkbox.svg";
import { ReactComponent as Email } from "@/assets/images/contextmenu/email.svg";
import { ReactComponent as Initial } from "@/assets/images/contextmenu/initial.svg";
import { ReactComponent as JobTitle } from "@/assets/images/contextmenu/jobtitle.svg";
import { ReactComponent as Name } from "@/assets/images/contextmenu/name.svg";
import { ReactComponent as QRCode } from "@/assets/images/contextmenu/qrcode.svg";
import { ReactComponent as Signature } from "@/assets/images/contextmenu/signature.svg";
import { ReactComponent as AddText } from "@/assets/images/contextmenu/addtext.svg";

export const ContextMenu = ({ contextMenu, handleClose, handleClickMenu }) => {
  const { t } = useTranslation();
  const data = [
    {
      icon: <Signature />,
      label: t("0-common.signature"),
      value: "SIGNATURE",
    },
    {
      icon: <Initial />,
      label: t("0-common.initials"),
      value: "INITIAL",
    },
    { icon: <Name />, label: t("0-common.name"), value: "NAME" },
    { icon: <Email />, label: t("0-common.email"), value: "EMAIL" },
    {
      icon: <JobTitle />,
      label: t("0-common.jobtitle"),
      value: "JOB_TITLE",
    },
    {
      icon: <Company />,
      label: t("0-common.company"),
      value: "COMPANY",
    },
    // { icon: <Date />, label: "Date" },
    // { icon: <TextField />, label: "Text Field" },
    // { icon: <TextArea />, label: "Text Area" },
    // { icon: <RadioButton />, label: "Radio Button" },
    // { icon: <CheckBox />, label: "Check Box" },
    { icon: <QRCode />, label: t("0-common.qrcode"), value: "QR" },
    {
      icon: <AddText />,
      label: t("0-common.addtext"),
      value: "AddText",
    },
  ];
  return (
    <Menu
      open={contextMenu !== null}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={
        contextMenu !== null
          ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
          : undefined
      }
      sx={{
        "& .MuiPaper-root": {
          borderRadius: 4,
        },
      }}
    >
      {data.map((item, index) => (
        <MenuItem key={index} onClick={handleClickMenu(item.value)}>
          <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: "medium",
              color: "#1F2937",
            }}
          />
        </MenuItem>
      ))}
    </Menu>
  );
};
ContextMenu.propTypes = {
  contextMenu: PropTypes.shape({
    mouseY: PropTypes.number,
    mouseX: PropTypes.number,
  }),
  handleClose: PropTypes.func,
  handleClickMenu: PropTypes.func,
};
export default ContextMenu;
