import i18n from "./languages/i18n";

export const getSignature = (value, signerId, workflowId) => {
  return value.find(
    (item) => item?.field_name === signerId && item?.workFlowId === workflowId
  );
};

export const getSigner = (workFlow) => {
  const signer = workFlow?.participants?.find(
    (item) => item.signerToken === workFlow.signerToken
  );
  return signer;
};

export const checkIsPosition = (workFlow) => {
  if (!workFlow) return false;
  //Begin: Check for Arrangement
  if (!workFlow.signerToken) return false;
  //End: Check for Arrangement
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
  // console.log("item: ", item);
  let status = null;
  if (item.signerStatus === 2) {
    return (status = 2);
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
  let lang = "English";
  if (typeof window.localStorage === "object") {
    if (typeof window.localStorage?.getItem !== "undefined") {
      lang = localStorage.getItem("language");
    }
  }
  // let lang = localStorage.getItem("language");
  switch (lang) {
    case "Việt Nam":
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

export const checkWorkflowStatus = (workflow) => {
  return workflow?.participants?.every((item) => item?.signerStatus !== 1);
};

export const convertTime = (time) => {
  const date = new Date(time);
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  const formattedDate = date
    .toLocaleString("en-US", options)
    .replace(/(\d+)\/(\d+)\/(\d+), (\d+:\d+:\d+)/, "$2/$1/$3 $4");

  return formattedDate;
}; // Output: 01/12/2023, 14:22:37

export const getUrlWithoutProtocol = () => {
  const currentURL = window.location.href;
  const url = new URL(currentURL);
  return url.origin.replace(/^(https?:\/\/)/, "");
};

//check time is after now
export const checkTimeIsAfterNow = (time) => {
  const date = new Date(time);
  const now = new Date();
  return date > now;
};

//convert time to local time
export const convertTimeToLocal = (time) => {
  const date = new Date(time);
  return date.toLocaleString();
};

export const convertTypeEid = (criteria) => {
  switch (criteria) {
    case "CITIZEN-IDENTITY-CARD":
      return "CITIZEN_CARD";
    case "MOBILE_ID_SIGNING":
      return "Mobile ID";
    case "SMART_ID_SIGNING":
      return "Smart ID";
    case "USB_TOKEN_SIGNING":
      return "USB Token";
  }
};

export const convertEidType = (type) => {
  switch (type) {
    case "CITIZEN_CARD":
      return "CITIZEN-IDENTITY-CARD";
    case "Mobile ID":
      return "MOBILE_ID_SIGNING";
    case "Smart ID":
      return "SMART_ID_SIGNING";
    case "USB Token":
      return "USB_TOKEN_SIGNING";
  }
};

export const createValidName = (value) => {
  switch (value) {
    case "valid Signature":
      return i18n.t("validation.validSig");
    case "indeterminate Signature":
      return i18n.t("validation.indeterminateSig");
    case "invalid Signature":
      return i18n.t("validation.invalidSig");
    case "valid Seal":
      return i18n.t("validation.validSeal");
    case "indeterminate Seal":
      return i18n.t("validation.indeterminateSeal");
    case "invalid Seal":
      return i18n.t("validation.invalidSeal");
    default:
      return null;
  }
};

export const createValidIcon = (value) => {
  switch (value) {
    case "overview":
      return "<InsertDriveFileOutlinedIcon />";
    case "signatures":
      return "<GroupOutlinedIcon />";
    case "seals":
      return "<WorkspacePremiumIcon />";
    case "details":
      return "<DescriptionOutlinedIcon />";
    default:
      return "Unknown Tab";
  }
};

export const createValidLabel = (value) => {
  switch (value) {
    case "overview":
      return i18n.t("validation.tab1");
    case "signatures":
      return i18n.t("validation.tab2");
    case "seals":
      return i18n.t("validation.tab3");
    case "details":
      return i18n.t("validation.tab4");
    default:
      return "Unknown Tab";
  }
};

export const createValidTitle = (value) => {
  switch (value) {
    case "Signature is valid":
      return i18n.t("validation.sigValidTitle2");
    case "Seal is valid":
      return i18n.t("validation.sealValidTitle2");
    default:
      return null;
  }
};

export const createValidSubTitle = (value) => {
  switch (value) {
    case "Electronic Signature":
      return i18n.t("validation.signSubTitle");
    case "Electronic Seal":
      return i18n.t("validation.sealSubTitle");
    default:
      return null;
  }
};

export const checkEseal = (cert) => {
  const certElement = cert.name;
  // const certElement = "CN=CMC-CA Test, S=HCM, C=VN";

  const cccdRegex = /\bCCCD\b/;
  const cmndRegex = /\bCMND\b/;
  const bhxhRegex = /\bBHXH\b/;
  const hcRegex = /\bHC\b/;
  const pidRegex = /\bPID\b/;
  const ppidRegex = /\bPPID\b/;

  // const cert =
  //   "OID.2.5.4.20=0901790767, EMAILADDRESS=huynhcuong@gmail.com, UID=CCCD:079083011315, CN=Huỳnh Cường, ST=Hồ Chí Minh, C=VN";
  // check if cert contains "UID" and cert contains "CCCD" or "CMND"
  return (
    !cccdRegex.test(certElement) && // Using the regular expression test method
    !cmndRegex.test(certElement) &&
    !hcRegex.test(certElement) &&
    !bhxhRegex.test(certElement) &&
    !pidRegex.test(certElement) &&
    !ppidRegex.test(certElement)
  );
};

export const debounce = (fn, delay = 1000) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
};

export const downloadCertFromPEM = (data, name) => {
  const blob = new Blob([data], { type: "application/x-x509-ca-cert" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${name}.cer`);
  document.body.appendChild(link);
  link.click();
  // console.log("data: ", data);
};

export function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

// export function capitalLize(string) {
//   return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
// }

export function capitalLize(str) {
  // Tách chuỗi thành các câu bằng dấu chấm, dấu chấm than hoặc dấu chấm hỏi
  const sentences = str.split(/\.|\?|!/);

  // Lặp qua mỗi câu và viết hoa chữ cái đầu của nó
  const capitalizedSentences = sentences.map((sentence) => {
    // Loại bỏ các khoảng trắng thừa ở đầu câu trước khi viết hoa
    sentence = sentence.trim();

    // Viết hoa chữ cái đầu của câu
    if (sentence.length > 0) {
      sentence =
        sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
    }
    return sentence;
  });

  // Kết hợp lại các câu thành một chuỗi và trả về
  return capitalizedSentences.join(". ") + ".";
}
