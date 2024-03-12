package vn.mobileid.GoPaperless.dto.rsspDto;

import java.util.List;

public class RsspRequest {
    private CertChain certChain;
    private String usbCertChain;
    private String usbCertId;
    private String codeNumber;
    private String connectorName;
    private String country;
    private String countryRealtime;
    private int documentId;
    private int enterpriseId;
    private String fileName;
    private String fieldName;
    private String imageBase64;
    private String language;
    private int lastFileId;
    private String lastFileUuid;
    private String provider;
    private String reason;
    private String requestID;
    private String signerId;
    private String signerToken;
    private int signerType;
    private String signingOption;
    private String signingPurpose;
    private String signingToken;
    private String hashList;
    private String relyingParty;
    private String contactInfor;
    private boolean codeEnable;
    private List<String> signatures;
    private int workFlowId;
    private String assurance;
    private String workFlowProcessType;
    private String qrypto;
    private List<TextField> textField;

    public CertChain getCertChain() {
        return certChain;
    }

    public void setCertChain(CertChain certChain) {
        this.certChain = certChain;
    }

    public String getUsbCertChain() {
        return usbCertChain;
    }

    public void setUsbCertChain(String usbCertChain) {
        this.usbCertChain = usbCertChain;
    }

    public String getUsbCertId() {
        return usbCertId;
    }

    public void setUsbCertId(String usbCertId) {
        this.usbCertId = usbCertId;
    }

    public String getCodeNumber() {
        return codeNumber;
    }

    public void setCodeNumber(String codeNumber) {
        this.codeNumber = codeNumber;
    }

    public String getConnectorName() {
        return connectorName;
    }

    public void setConnectorName(String connectorName) {
        this.connectorName = connectorName;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCountryRealtime() {
        return countryRealtime;
    }

    public void setCountryRealtime(String countryRealtime) {
        this.countryRealtime = countryRealtime;
    }

    public int getDocumentId() {
        return documentId;
    }

    public void setDocumentId(int documentId) {
        this.documentId = documentId;
    }

    public int getEnterpriseId() {
        return enterpriseId;
    }

    public void setEnterpriseId(int enterpriseId) {
        this.enterpriseId = enterpriseId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getImageBase64() {
        return imageBase64;
    }

    public void setImageBase64(String imageBase64) {
        this.imageBase64 = imageBase64;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public int getLastFileId() {
        return lastFileId;
    }

    public void setLastFileId(int lastFileId) {
        this.lastFileId = lastFileId;
    }

    public String getLastFileUuid() {
        return lastFileUuid;
    }

    public void setLastFileUuid(String lastFileUuid) {
        this.lastFileUuid = lastFileUuid;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getRequestID() {
        return requestID;
    }

    public void setRequestID(String requestID) {
        this.requestID = requestID;
    }

    public String getSignerId() {
        return signerId;
    }

    public void setSignerId(String signerId) {
        this.signerId = signerId;
    }

    public String getSignerToken() {
        return signerToken;
    }

    public void setSignerToken(String signerToken) {
        this.signerToken = signerToken;
    }

    public String getSigningOption() {
        return signingOption;
    }

    public void setSigningOption(String signingOption) {
        this.signingOption = signingOption;
    }

    public String getSigningPurpose() {
        return signingPurpose;
    }

    public void setSigningPurpose(String signingPurpose) {
        this.signingPurpose = signingPurpose;
    }

    public String getSigningToken() {
        return signingToken;
    }

    public void setSigningToken(String signingToken) {
        this.signingToken = signingToken;
    }

    public String getHashList() {
        return hashList;
    }

    public void setHashList(String hashList) {
        this.hashList = hashList;
    }

    public String getRelyingParty() {
        return relyingParty;
    }

    public void setRelyingParty(String relyingParty) {
        this.relyingParty = relyingParty;
    }

    public String getContactInfor() {
        return contactInfor;
    }

    public void setContactInfor(String contactInfor) {
        this.contactInfor = contactInfor;
    }

    public boolean isCodeEnable() {
        return codeEnable;
    }

    public void setCodeEnable(boolean codeEnable) {
        this.codeEnable = codeEnable;
    }

    public List<String> getSignatures() {
        return signatures;
    }

    public void setSignatures(List<String> signatures) {
        this.signatures = signatures;
    }

    public int getWorkFlowId() {
        return workFlowId;
    }

    public void setWorkFlowId(int workFlowId) {
        this.workFlowId = workFlowId;
    }

    public String getAssurance() {
        return assurance;
    }

    public void setAssurance(String assurance) {
        this.assurance = assurance;
    }

    public List<TextField> getTextField() {
        return textField;
    }

    public void setTextField(List<TextField> textField) {
        this.textField = textField;
    }

    public int getSignerType() {
        return signerType;
    }

    public void setSignerType(int signerType) {
        this.signerType = signerType;
    }

    public String getQrypto() {
        return qrypto;
    }

    public void setQrypto(String qrypto) {
        this.qrypto = qrypto;
    }

    public String getWorkFlowProcessType() {
        return workFlowProcessType;
    }

    public void setWorkFlowProcessType(String workFlowProcessType) {
        this.workFlowProcessType = workFlowProcessType;
    }
}
