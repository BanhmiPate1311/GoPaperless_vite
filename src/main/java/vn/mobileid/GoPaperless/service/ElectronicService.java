package vn.mobileid.GoPaperless.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.mobileid.GoPaperless.model.Electronic.datatypes.PadesConstants;
import vn.mobileid.GoPaperless.model.Electronic.request.CheckIdentityRequest;
import vn.mobileid.GoPaperless.model.Electronic.response.SubjectResponse;
import vn.mobileid.GoPaperless.model.Electronic.response.TokenResponse;
import vn.mobileid.GoPaperless.model.apiModel.ConnectorName;
import vn.mobileid.GoPaperless.process.AWSCall;
import vn.mobileid.GoPaperless.process.HttpUtilsAWS;
import vn.mobileid.GoPaperless.utils.Difinitions;
import vn.mobileid.GoPaperless.utils.LoadParamSystem;

import java.io.IOException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class ElectronicService {
    private Gson gson = new Gson();
    final private int timeOut = 5000;
    final private String contentType = "application/json";
    private String accessToken;

    @Autowired
    private AWSCall aWSCall;

    public String checkPersonalCode(String lang, String code, String type, String connectorName) throws IOException {
        String sPropertiesFMS = "";
        List<ConnectorName> connector = LoadParamSystem.getConnectorStart(Difinitions.CONFIG_LOAD_PARAM_CONNECTOR_NAME);
        if (connector.size() > 0) {
            for (int m = 0; m < connector.size(); m++) {
                if (connector.get(m).getConnectorName().equals(connectorName)) {
                    sPropertiesFMS = connector.get(m).getIdentifier();
                }
            }
            JsonObject jsonObject = new JsonParser().parse(sPropertiesFMS).getAsJsonObject();
            JsonArray attributes = jsonObject.getAsJsonArray("attributes");

            for (JsonElement att : attributes) {
                JsonObject annotationObject = att.getAsJsonObject();
                if (annotationObject.get("name").getAsString().equals("URI")) {
                    PadesConstants.BASE_URL = annotationObject.get("value").getAsString();
                }
                if (annotationObject.get("name").getAsString().equals("ACCESSKEY")) {
                    PadesConstants.ACCESSKEY = annotationObject.get("value").getAsString();
                }
                if (annotationObject.get("name").getAsString().equals("SECRETKEY")) {
                    PadesConstants.SECRETKEY = annotationObject.get("value").getAsString();
                }
                if (annotationObject.get("name").getAsString().equals("REGIONNAME")) {
                    PadesConstants.REGIONNAME = annotationObject.get("value").getAsString();
                }
                if (annotationObject.get("name").getAsString().equals("SERVICENAME")) {
                    PadesConstants.SERVICENAME = annotationObject.get("value").getAsString();
                }
                if (annotationObject.get("name").getAsString().equals("XAPIKEY")) {
                    PadesConstants.XAPIKEY = annotationObject.get("value").getAsString();
                }
            }
        }

        String token = getToken();
        return token;
    }

    public String getToken() throws IOException {
        String sPropertiesFMS = "";
        List<ConnectorName> connector = LoadParamSystem.getConnectorStart(Difinitions.CONFIG_LOAD_PARAM_CONNECTOR_NAME);
        if (connector.size() > 0) {
            for (int m = 0; m < connector.size(); m++) {
                if (connector.get(m).getConnectorName().equals("MOBILE_ID_IDENTITY")) {
                    sPropertiesFMS = connector.get(m).getIdentifier();
                }
            }
            JsonObject jsonObject = new JsonParser().parse(sPropertiesFMS).getAsJsonObject();
            JsonArray attributes = jsonObject.getAsJsonArray("attributes");

            for (JsonElement att : attributes) {
                JsonObject annotationObject = att.getAsJsonObject();
                if (annotationObject.get("name").getAsString().equals("URI")) {
                    PadesConstants.BASE_URL = annotationObject.get("value").getAsString();
                }
                if (annotationObject.get("name").getAsString().equals("ACCESSKEY")) {
                    PadesConstants.ACCESSKEY = annotationObject.get("value").getAsString();
                }
                if (annotationObject.get("name").getAsString().equals("SECRETKEY")) {
                    PadesConstants.SECRETKEY = annotationObject.get("value").getAsString();
                }
                if (annotationObject.get("name").getAsString().equals("REGIONNAME")) {
                    PadesConstants.REGIONNAME = annotationObject.get("value").getAsString();
                }
                if (annotationObject.get("name").getAsString().equals("SERVICENAME")) {
                    PadesConstants.SERVICENAME = annotationObject.get("value").getAsString();
                }
                if (annotationObject.get("name").getAsString().equals("XAPIKEY")) {
                    PadesConstants.XAPIKEY = annotationObject.get("value").getAsString();
                }
                if (annotationObject.get("name").getAsString().equals("BASICTOKEN")) {
                    PadesConstants.BASIC_TOKEN = annotationObject.get("value").getAsString();
                }
            }
        }
        System.out.println("PadesConstants.BASE_URL" + PadesConstants.BASE_URL);
        System.out.println("PadesConstants.ACCESSKEY" + PadesConstants.ACCESSKEY);
        System.out.println("PadesConstants.SECRETKEY" + PadesConstants.SECRETKEY);
        System.out.println("PadesConstants.BASIC_TOKEN" + PadesConstants.BASIC_TOKEN);

        String tokenUrl = PadesConstants.BASE_URL + "/v2/e-identity/general/token/get";
        System.out.println("tokenUrl" + tokenUrl);
        aWSCall = new AWSCall(tokenUrl,
                "GET",
                PadesConstants.ACCESSKEY,
                PadesConstants.SECRETKEY,
                PadesConstants.REGIONNAME,
                PadesConstants.SERVICENAME,
                5000,
                PadesConstants.XAPIKEY,
                contentType,
                null);
        // /v1/e-verification/oidc/token {get acess_token}
//        String token = aWSCall.v1VeriOidcToken("/v2/e-identity/general/token/get", basicToken);

        String response = HttpUtilsAWS.invokeHttpRequest(
                new URL(tokenUrl),
                "GET",
                this.timeOut,
                aWSCall.getAWSV4Auth(null, "/v2/e-identity/general/token/get", PadesConstants.BASIC_TOKEN),
                null);

        //Response
        System.out.println("response" + response);
        ObjectMapper objectMapper = new ObjectMapper();
        TokenResponse tokenResponse = gson.fromJson(response, TokenResponse.class);
        //Past Bearer for Step 2 (E-verification/pades)
//        String bearerToken = "Bearer " + tokenResponse.access_token;
//        System.out.println("Bearer Token: " + bearerToken);
        this.accessToken = tokenResponse.access_token;
        return tokenResponse.access_token;
    }

    public SubjectResponse getSubject(CheckIdentityRequest checkIdentityRequest) throws IOException {
        String access_token = getToken();
        String bearerToken = "Bearer " + access_token;
        Map<String, Object> request = new HashMap<>();
        Map<String, Object> identity_document = new HashMap<>();

        request.put("email", "");
        request.put("mobile", "");
        identity_document.put("type", checkIdentityRequest.getType());
        identity_document.put("value", checkIdentityRequest.getCode());
        request.put("identity_document", identity_document);
        request.put("dg1_enabled", false);
        request.put("dg2_enabled", true);
        request.put("dg3_enabled", false);
        request.put("dg13_enabled", false);
        request.put("lang", checkIdentityRequest.getLang());

        String bodyRequest = gson.toJson(request);

        String getSubjectUrl = PadesConstants.BASE_URL + "/v2/e-identity/subject/get";
        System.out.println("ownerUrl: " + getSubjectUrl);
        TreeMap<String, String> queryParametes = new TreeMap<>();
        String base64 = Base64.getEncoder().encodeToString(bodyRequest.getBytes(StandardCharsets.UTF_8));
        queryParametes.put("request_data_base64", base64);

        aWSCall = new AWSCall(getSubjectUrl,
                "GET",
                PadesConstants.ACCESSKEY,
                PadesConstants.SECRETKEY,
                PadesConstants.REGIONNAME,
                PadesConstants.SERVICENAME,
                5000,
                PadesConstants.XAPIKEY,
                contentType,
                queryParametes);

        String response = HttpUtilsAWS.invokeHttpRequest(
                new URL(getSubjectUrl),
                "GET",
                this.timeOut,
                aWSCall.getAWSV4AuthForFormData(null, bearerToken, null),
                bodyRequest);

        System.out.println("getSubject: " + response);
        SubjectResponse subjectResponse = gson.fromJson(response, SubjectResponse.class);
        return subjectResponse;
    }
}
