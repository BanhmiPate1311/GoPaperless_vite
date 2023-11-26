import { ReactComponent as EidIcon } from "@/assets/images/svg/e-id.svg";
import { ReactComponent as MobileIdIcon } from "@/assets/images/svg/mobile-id.svg";
import { ReactComponent as SmartIdIcon } from "@/assets/images/svg/smart-id.svg";
import { ReactComponent as UsbIcon } from "@/assets/images/svg/usb-token.svg";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";
import { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { SelectField } from "../form";

export const Step2 = forwardRef(
  ({ onStepSubmit, providerName, connectorList, filterConnector }, ref) => {
    const schema = yup.object().shape({
      provider: yup.string().required("Please Select Signing Method"),
      connector: yup
        .string()
        .required("Please Select Remote Signing Service Provider"),
    });

    // eslint-disable-next-line no-unused-vars
    const { control, handleSubmit, reset } = useForm({
      defaultValues: {
        provider: "",
        connector: "",
      },
      resolver: yupResolver(schema),
    });

    const mapProvider = providerName.reduce((acc, option, i) => {
      switch (option) {
        case "MOBILE_ID_SIGNING":
          acc[i] = {
            label: "Mobile-ID",
            icon: <MobileIdIcon />,
            value: "MOBILE_ID_SIGNING",
          };
          break;
        case "SMART_ID_SIGNING":
          acc[i] = {
            label: "Smart-ID",
            icon: <SmartIdIcon />,
            value: "SMART_ID_SIGNING",
          };
          break;
        case "USB_TOKEN_SIGNING":
          acc[i] = {
            label: "USB-Token",
            icon: <UsbIcon />,
            value: "USB_TOKEN_SIGNING",
          };
          break;
        case "ELECTRONIC_ID":
          acc[i] = {
            label: "Electronic video base Identification",
            icon: <EidIcon />,
            value: "ELECTRONIC_ID",
          };
          break;
        default:
          // Handle unknown signing option
          break;
      }
      return acc;
    }, []);
    const data1 = mapProvider.map((item, i) => {
      return (
        <MenuItem key={i} value={item.value}>
          {item.label}
          <ListItemSecondaryAction>{item.icon}</ListItemSecondaryAction>
        </MenuItem>
      );
    });

    const [data2, setData2] = useState(null);

    const handleChange1 = (e) => {
      // console.log(e.target.value);
      reset({ provider: e.target.value, connector: "" });
      const filterValue = e.target.value;

      // Assuming connectorList is a state variable
      const filteredData = connectorList?.data?.[filterValue];

      if (filteredData) {
        const updatedData2 = filteredData.map((item, i) => {
          if (
            filterConnector.length === 0 ||
            filterConnector.includes(item.connectorName)
          ) {
            return (
              <MenuItem key={i} value={item.connectorName}>
                {item.remark}
                <ListItemSecondaryAction>
                  <img src={item.logo} height="25" alt="logo" />
                </ListItemSecondaryAction>
              </MenuItem>
            );
          }
        });

        setData2(updatedData2);
      } else {
        setData2(null); // Handle the case where filteredData is undefined or null
      }
    };

    const handleFormSubmit = (data) => {
      onStepSubmit(data);
    };

    return (
      <Box
        component="form"
        ref={ref}
        onSubmit={handleSubmit(handleFormSubmit)}
        sx={{ minWidth: 400 }}
      >
        <Box mb={4} width={"100%"}>
          <SelectField
            name="provider"
            control={control}
            label="Signing method"
            content={data1}
            onChange={handleChange1}
            sx={{
              "& .MuiListItemSecondaryAction-root": {
                right: "30px",
                display: "flex",
              },
              backgroundColor: "signingWFBackground.main",
            }}
          />
        </Box>
        <Box width={"100%"}>
          <SelectField
            name="connector"
            control={control}
            label="Select Remote Signing Service Provider"
            disabled={!data2}
            content={data2}
            MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
            sx={{
              "& .MuiListItemSecondaryAction-root": {
                right: "30px",
                display: "flex",
              },
              backgroundColor: "signingWFBackground.main",
            }}
          />
        </Box>
      </Box>
    );
  }
);

Step2.propTypes = {
  providerName: PropTypes.array,
  onStepSubmit: PropTypes.func,
  connectorList: PropTypes.object,
  filterConnector: PropTypes.array,
};

Step2.displayName = "Step2";
export default Step2;
