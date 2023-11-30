export const getSignature = (value, signerId, workflowId) => {
  return value.find(
    (item) => item?.field_name === signerId && item?.workFlowId === workflowId
  );
};

// export const checkIsPosition = (metaInf1) => {
//   if (metaInf1.pdf && metaInf1.pdf.annotation) {
//     return true;
//   } else {
//     return false;
//   }
// };

export const getSigner = (workFlow) => {
  const signer = workFlow?.participants?.find(
    (item) => item.signerToken === workFlow.signerToken
  );
  return signer;
};

// export const getSignerId = (workFlow) => {
//   const signer = workFlow?.participants?.find(
//     (item) => item.signerToken === workFlow.signerToken
//   );
//   return signer?.signerId;
// };

export const checkIsPosition = (workFlow) => {
  if (!workFlow) return false;
  const signer = workFlow.participants.find(
    (item) => item.signerToken === workFlow.signerToken
  );

  const metaInf1 = signer.metaInformation;
  if (metaInf1.pdf && metaInf1.pdf.annotation) {
    return true;
  } else {
    return false;
  }
};

export const checkSignerStatus = (item, signerToken) => {
  let status = null;
  if (item.status === 2) {
    status = 2;
  }

  status = item.signerToken === signerToken ? 1 : 0;

  return status;
};

export const checkSignerWorkFlow = (item, signerToken) => {
  if (item.signerToken === signerToken) {
    return true;
  } else {
    return false;
  }
};

export const convertSignOptionsToProvider = (signingOptions) => {
  // convert list ["mobile", "smartid"] to ["MOBILE_ID_SIGNING","SMART_ID_SIGNING"]
  return signingOptions.map((item) => {
    switch (item) {
      case "mobile":
        return "MOBILE_ID_SIGNING";
      case "smartid":
        return "SMART_ID_SIGNING";
      case "usbtoken":
        return "USB_TOKEN_SIGNING";
      case "electronic_id":
        return "ELECTRONIC_ID";
    }
  });
};

export const convertProviderToSignOption = (Provider) => {
  // convert list ["mobile", "smartid"] to ["MOBILE_ID_SIGNING","SMART_ID_SIGNING"]
  switch (Provider) {
    case "MOBILE_ID_SIGNING":
      return "mobile";
    case "SMART_ID_SIGNING":
      return "smartid";
    case "USB_TOKEN_SIGNING":
      return "usbtoken";
    case "ELECTRONIC_ID":
      return "electronic_id";
  }
};

export const getLang = () => {
  let lang = localStorage.getItem("language");
  switch (lang) {
    case "Vietnamese":
      lang = "VN";
      break;
    default:
      lang = "EN";
      break;
  }
  return lang;
};

export function removeBase64Prefix(base64String) {
  // Check if the string starts with the specified prefix
  if (base64String.startsWith("data:image/png;base64,")) {
    // Remove the prefix
    return base64String.substring("data:image/png;base64,".length);
  } else {
    // Return the original string if the prefix is not found
    return base64String;
  }
}
