import { ReactComponent as AddText } from "@/assets/images/contextmenu/addtext.svg";
import { ReactComponent as Company } from "@/assets/images/contextmenu/checkbox.svg";
import { ReactComponent as Email } from "@/assets/images/contextmenu/email.svg";
import { ReactComponent as Initial } from "@/assets/images/contextmenu/initial.svg";
import { ReactComponent as JobTitle } from "@/assets/images/contextmenu/jobtitle.svg";
import { ReactComponent as Name } from "@/assets/images/contextmenu/name.svg";
import { ReactComponent as QRCode } from "@/assets/images/contextmenu/qrcode.svg";
import { ReactComponent as QrQrypto } from "@/assets/images/contextmenu/qrypto.svg";
import { ReactComponent as Seal } from "@/assets/images/contextmenu/seal.svg";
import { ReactComponent as Signature } from "@/assets/images/contextmenu/signature.svg";
import { ReactComponent as Camera } from "@/assets/images/contextmenu/camera.svg";
import { ListItemIcon, ListItemText } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { ReactComponent as TextField } from "@/assets/images/contextmenu/TextField.svg";
import { ReactComponent as TextArea } from "@/assets/images/contextmenu/TextArea.svg";
import { ReactComponent as DateTime } from "@/assets/images/contextmenu/DateTime.svg";

export const ContextMenu = ({
  contextMenu,
  handleClose,
  handleClickMenu,
  tabBar,
  signerType,
}) => {
  const { t } = useTranslation();
  let data = [
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
    {
      icon: <Seal />,
      label: t("0-common.seal"),
      value: "SEAL",
    },

    { icon: <Name />, label: t("0-common.name"), value: "NAME" },
    { icon: <Email />, label: t("0-common.email"), value: "EMAIL" },
    {
      icon: <JobTitle />,
      label: t("0-common.jobtitle"),
      value: "JOBTITLE",
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
    { icon: <QrQrypto />, label: "QR Qrypto", value: "QRYPTO" },
    {
      icon: <AddText />,
      label: t("0-common.addtext"),
      value: "AddText",
    },
    {
      icon: <Camera />,
      label: t("0-common.camera"),
      value: "CAMERA",
    },
    {
      icon: <TextField />,
      label: t("0-common.text field"),
      value: "TEXTBOX",
    },
    {
      icon: <TextArea />,
      label: t("0-common.text area"),
      value: "TEXTAREA",
    },
    {
      icon: <DateTime />,
      label: t("0-common.date time"),
      value: "DATETIME",
    },
  ];
  let menu = [];
  switch (signerType) {
    case 1:
      menu = data.filter(
        (item) => item.value !== "QR" && item.value !== "QRYPTO"
      );
      break;
    case 2:
      menu = data.filter((item) => item.value !== "SIGNATURE");
      break;
    case 3:
      menu = data.filter(
        (item) =>
          item.value !== "SIGNATURE" &&
          item.value !== "QR" &&
          item.value !== "QRYPTO"
      );
      break;
    case 4:
      menu = data.filter((item) => item.value !== "SIGNATURE");
      break;
    case 5:
      menu = [];
      break;
  }
  // Arrangement Overview

  switch (tabBar) {
    case 0:
      menu = data.filter(
        (item) =>
          (item.value === "QRYPTO") |
          (item.value == "QR") |
          (item.value == "CAMERA")
      );
      break;

    case 1:
      menu = menu.filter(
        (item) => item.value !== "QRYPTO" && item.value !== "QR"
      );
      signerType ? null : (menu = []);
      break;
    case 2:
      return;
    case 3:
      return;
  }

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
      {menu.map((item, index) => (
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
  signerType: PropTypes.number,
  tabBar: PropTypes.number,
};
export default ContextMenu;
