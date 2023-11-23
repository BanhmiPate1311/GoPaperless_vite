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
