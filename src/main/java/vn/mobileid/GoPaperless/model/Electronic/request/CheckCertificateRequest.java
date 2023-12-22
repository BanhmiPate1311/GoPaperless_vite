package vn.mobileid.GoPaperless.model.Electronic.request;

public class CheckCertificateRequest extends ElectronicBaseRequest{
    private String jwt;
    private String credentialID;
    private String connectorNameRSSP;
    private String assurance;
    private String taxCode;

    public String getJwt() {
        return jwt;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }

    public String getCredentialID() {
        return credentialID;
    }

    public void setCredentialID(String credentialID) {
        this.credentialID = credentialID;
    }

    public String getConnectorNameRSSP() {
        return connectorNameRSSP;
    }

    public void setConnectorNameRSSP(String connectorNameRSSP) {
        this.connectorNameRSSP = connectorNameRSSP;
    }

    public String getAssurance() {
        return assurance;
    }

    public void setAssurance(String assurance) {
        this.assurance = assurance;
    }

    public String getTaxCode() {
        return taxCode;
    }

    public void setTaxCode(String taxCode) {
        this.taxCode = taxCode;
    }
}
