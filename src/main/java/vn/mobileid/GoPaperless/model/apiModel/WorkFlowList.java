package vn.mobileid.GoPaperless.model.apiModel;

public class WorkFlowList {
    private int Id;
    private String WorkFlowType;
    private int WorkFlowStatus;
    private int EnterpriseId;
    private int DocumentId;
    private String PostBackUrl;
    private String RedirectUri;
    private String FileUuid;
    private String SigningToken;
    private String WorkFlowDocumentName;
    private String WorkFlowDocumentFormat;
    private int VisibleHeaderFooter;

    public int getId() {
        return Id;
    }

    public void setId(int id) {
        Id = id;
    }

    public String getWorkFlowType() {
        return WorkFlowType;
    }

    public void setWorkFlowType(String workFlowType) {
        WorkFlowType = workFlowType;
    }

    public int getWorkFlowStatus() {
        return WorkFlowStatus;
    }

    public void setWorkFlowStatus(int workFlowStatus) {
        WorkFlowStatus = workFlowStatus;
    }

    public int getEnterpriseId() {
        return EnterpriseId;
    }

    public void setEnterpriseId(int enterpriseId) {
        EnterpriseId = enterpriseId;
    }

    public int getDocumentId() {
        return DocumentId;
    }

    public void setDocumentId(int documentId) {
        DocumentId = documentId;
    }

    public String getPostBackUrl() {
        return PostBackUrl;
    }

    public void setPostBackUrl(String postBackUrl) {
        PostBackUrl = postBackUrl;
    }

    public String getRedirectUri() {
        return RedirectUri;
    }

    public void setRedirectUri(String redirectUri) {
        RedirectUri = redirectUri;
    }

    public String getFileUuid() {
        return FileUuid;
    }

    public void setFileUuid(String fileUuid) {
        FileUuid = fileUuid;
    }

    public String getSigningToken() {
        return SigningToken;
    }

    public void setSigningToken(String signingToken) {
        SigningToken = signingToken;
    }

    public String getWorkFlowDocumentName() {
        return WorkFlowDocumentName;
    }

    public void setWorkFlowDocumentName(String workFlowDocumentName) {
        WorkFlowDocumentName = workFlowDocumentName;
    }

    public String getWorkFlowDocumentFormat() {
        return WorkFlowDocumentFormat;
    }

    public void setWorkFlowDocumentFormat(String workFlowDocumentFormat) {
        WorkFlowDocumentFormat = workFlowDocumentFormat;
    }

    public int getVisibleHeaderFooter() {
        return VisibleHeaderFooter;
    }

    public void setVisibleHeaderFooter(int visibleHeaderFooter) {
        VisibleHeaderFooter = visibleHeaderFooter;
    }
}
