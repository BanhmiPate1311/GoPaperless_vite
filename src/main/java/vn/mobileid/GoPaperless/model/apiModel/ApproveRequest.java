package vn.mobileid.GoPaperless.model.apiModel;

public class ApproveRequest {
    private int workFlowId;
    private int participantID;
    private String comment;
    private int recipientID;
    private String hmac;
    private String signerName;
    private String signerToken;
    private String signingToken;
    private int documentId;
    private String workFlowProcessType;
    private String fileName;
    private String signerEmail;
    private int signerType;

    public int getWorkFlowId() {
        return workFlowId;
    }

    public void setWorkFlowId(int workFlowId) {
        this.workFlowId = workFlowId;
    }

    public int getParticipantID() {
        return participantID;
    }

    public void setParticipantID(int participantID) {
        this.participantID = participantID;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public int getRecipientID() {
        return recipientID;
    }

    public void setRecipientID(int recipientID) {
        this.recipientID = recipientID;
    }

    public String getHmac() {
        return hmac;
    }

    public void setHmac(String hmac) {
        this.hmac = hmac;
    }

    public String getSignerName() {
        return signerName;
    }

    public void setSignerName(String signerName) {
        this.signerName = signerName;
    }

    public String getSignerToken() {
        return signerToken;
    }

    public void setSignerToken(String signerToken) {
        this.signerToken = signerToken;
    }

    public String getSigningToken() {
        return signingToken;
    }

    public void setSigningToken(String signingToken) {
        this.signingToken = signingToken;
    }

    public int getDocumentId() {
        return documentId;
    }

    public void setDocumentId(int documentId) {
        this.documentId = documentId;
    }

    public String getWorkFlowProcessType() {
        return workFlowProcessType;
    }

    public void setWorkFlowProcessType(String workFlowProcessType) {
        this.workFlowProcessType = workFlowProcessType;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getSignerEmail() {
        return signerEmail;
    }

    public void setSignerEmail(String signerEmail) {
        this.signerEmail = signerEmail;
    }

    public int getSignerType() {
        return signerType;
    }

    public void setSignerType(int signerType) {
        this.signerType = signerType;
    }
}
