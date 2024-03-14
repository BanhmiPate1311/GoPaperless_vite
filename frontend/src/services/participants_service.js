import { api } from "@/utils/api";

export const participantsService = {
    updateParticipant: (data) => {
        console.log("data participantsService: ", data);
        console.log("data metaInformation participantsService: ", data.metaInformation);
        // const value = { 
        //     firstName: data.firstName,
        //     lastName: data.lastName,
        //     sequenceNumber: data.sequenceNumber,
        //     customReason: data.customReason,
        //     signingPurpose: data.signingPurpose,
        //     signerToken: data.signerToken,
            data.metaInformation=JSON.stringify(data.metaInformation) ;

        // }
    return api.post("/participants/updateParticipant", data);
  },
};
