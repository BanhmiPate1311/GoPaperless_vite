package vn.mobileid.GoPaperless.dto.rsspDto;

public class CertChain {
    private String cert;
    private boolean codeEnable;
    private String credentialID;
    private String issuer;
    private String prefixCode;
    private String relyingParty;
    private String subject;
    private String validFrom;
    private String validTo;

    public String getCert() {
        return cert;
    }

    public void setCert(String cert) {
        this.cert = cert;
    }

    public boolean isCodeEnable() {
        return codeEnable;
    }

    public void setCodeEnable(boolean codeEnable) {
        this.codeEnable = codeEnable;
    }

    public String getCredentialID() {
        return credentialID;
    }

    public void setCredentialID(String credentialID) {
        this.credentialID = credentialID;
    }

    public String getIssuer() {
        return issuer;
    }

    public void setIssuer(String issuer) {
        this.issuer = issuer;
    }

    public String getPrefixCode() {
        return prefixCode;
    }

    public void setPrefixCode(String prefixCode) {
        this.prefixCode = prefixCode;
    }

    public String getRelyingParty() {
        return relyingParty;
    }

    public void setRelyingParty(String relyingParty) {
        this.relyingParty = relyingParty;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getValidFrom() {
        return validFrom;
    }

    public void setValidFrom(String validFrom) {
        this.validFrom = validFrom;
    }

    public String getValidTo() {
        return validTo;
    }

    public void setValidTo(String validTo) {
        this.validTo = validTo;
    }
}
