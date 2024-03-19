package vn.mobileid.GoPaperless.model.rsspModel;

public class CertResponse {
    private String subject;
    private String subjectDN;
    private String issuer;
    private String validFrom;
    private String validTo;
    private String cert;
    private String credentialID;
    private boolean isSeal;

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getSubjectDN() {
        return subjectDN;
    }

    public void setSubjectDN(String subjectDN) {
        this.subjectDN = subjectDN;
    }

    public String getIssuer() {
        return issuer;
    }

    public void setIssuer(String issuer) {
        this.issuer = issuer;
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

    public String getCert() {
        return cert;
    }

    public void setCert(String cert) {
        this.cert = cert;
    }

    public String getCredentialID() {
        return credentialID;
    }

    public void setCredentialID(String credentialID) {
        this.credentialID = credentialID;
    }

    public boolean isSeal() {
        return isSeal;
    }

    public void setSeal(boolean seal) {
        isSeal = seal;
    }
}
