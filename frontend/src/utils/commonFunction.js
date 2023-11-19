export const getSignerId = (value) => {
  return value?.participants?.find(
    (item) => item.signerToken === value.signerToken
  ).signerId;
};

export const getSignature = (value, signerId, workflowId) => {
  return value.find(
    (item) => item?.field_name === signerId && item?.workFlowId === workflowId
  );
};

export const checkIsPosition = (metaInf1) => {
  if (metaInf1.pdf && metaInf1.pdf.annotation) {
    return true;
  } else {
    return false;
  }
};
