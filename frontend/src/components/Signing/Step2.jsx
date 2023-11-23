import { ReactComponent as EidIcon } from "@/assets/images/svg/e-id.svg";
import { ReactComponent as MobileIdIcon } from "@/assets/images/svg/mobile-id.svg";
import { ReactComponent as SmartIdIcon } from "@/assets/images/svg/smart-id.svg";
import { ReactComponent as UsbIcon } from "@/assets/images/svg/usb-token.svg";
import { apiService } from "@/services/api_service";
import {
  convertSignOptionsToProvider,
  getSigner,
} from "@/utils/commonFunction";
import { Box, ListItemSecondaryAction, MenuItem } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import { SelectField } from "../form";

export const Step2 = forwardRef(({ workFlow, onStepSubmit }, ref) => {
  // console.log("workFlow: ", workFlow);
  const signer = getSigner(workFlow);
  //   console.log("signer: ", signer);
  const signingOptions = signer.signingOptions
    ? signer.signingOptions.map((item) => Object.keys(item)[0])
    : ["mobile", "smartid", "usbtoken", "electronic_id"];

  const providerName = convertSignOptionsToProvider(signingOptions);
  // console.log("providerName: ", providerName);

  const { data: connectorList } = useQuery({
    queryKey: ["getConnectorList"],
    queryFn: () => {
      return apiService.getConnecterProvider(providerName);
    },
  });

  // eslint-disable-next-line no-unused-vars
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      provider: "",
      connector: "",
    },
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
  console.log("connectorList: ", connectorList?.data);
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
    console.log(e.target.value);
    reset({ provider: e.target.value, connector: "" });
    const filterValue = e.target.value;

    // Assuming connectorList is a state variable
    const filteredData = connectorList?.data?.[filterValue];

    if (filteredData) {
      const updatedData2 = filteredData.map((item, i) => (
        <MenuItem key={i} value={item.remark}>
          {item.remark}
          <ListItemSecondaryAction>
            <img src={item.logo} height="25" alt="logo" />
          </ListItemSecondaryAction>
        </MenuItem>
      ));

      setData2(updatedData2);
    } else {
      setData2(null); // Handle the case where filteredData is undefined or null
    }
  };

  return (
    <Box
      component="form"
      ref={ref}
      onSubmit={handleSubmit(onStepSubmit)}
      sx={{ minWidth: 400 }}
    >
      <Box mb={4} width={"100%"}>
        <SelectField
          name="provider"
          control={control}
          label="Signing method"
          data={data1}
          onChange={handleChange1}
          sx={{
            "& .MuiListItemSecondaryAction-root": {
              right: "30px",
              display: "flex",
            },
          }}
        />
      </Box>
      <Box width={"100%"}>
        <SelectField
          name="connector"
          control={control}
          label="Select Remote Signing Service Provider"
          data={data2}
          MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
          sx={{
            "& .MuiListItemSecondaryAction-root": {
              right: "30px",
              display: "flex",
            },
          }}
        />
      </Box>
    </Box>
  );
});

Step2.propTypes = {
  workFlow: PropTypes.object,
  onStepSubmit: PropTypes.func,
};

Step2.displayName = "Step2";
export default Step2;
