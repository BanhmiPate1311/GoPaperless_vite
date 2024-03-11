package vn.mobileid.GoPaperless.model.apiModel;

import com.google.gson.JsonObject;

public class ShareToSignRequest {
    private int workFlowId;



    private Participants participant;
    private String signerName;
    private String fileName;
    private String signingToken;
    private String workFlowProcessType;
    private int documentId;
    public Participants getParticipant() {
        return participant;
    }

    public void setParticipant(Participants participant) {
        this.participant = participant;
    }
    public int getWorkFlowId() {
        return workFlowId;
    }

    public void setWorkFlowId(int workFlowId) {
        this.workFlowId = workFlowId;
    }



    public String getSignerName() {
        return signerName;
    }

    public void setSignerName(String signerName) {
        this.signerName = signerName;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getSigningToken() {
        return signingToken;
    }

    public void setSigningToken(String signingToken) {
        this.signingToken = signingToken;
    }

    public String getWorkFlowProcessType() {
        return workFlowProcessType;
    }

    public void setWorkFlowProcessType(String workFlowProcessType) {
        this.workFlowProcessType = workFlowProcessType;
    }

    public int getDocumentId() {
        return documentId;
    }

    public void setDocumentId(int documentId) {
        this.documentId = documentId;
    }


}
