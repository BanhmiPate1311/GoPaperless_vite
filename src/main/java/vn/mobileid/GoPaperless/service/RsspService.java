package vn.mobileid.GoPaperless.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import ua_parser.Client;
import ua_parser.Parser;
import vn.mobileid.GoPaperless.dto.rsspDto.RsspRequest;
import vn.mobileid.GoPaperless.model.Electronic.datatypes.JwtModel;
import vn.mobileid.GoPaperless.model.Electronic.request.CheckCertificateRequest;
import vn.mobileid.GoPaperless.model.apiModel.ConnectorName;
import vn.mobileid.GoPaperless.model.apiModel.Participants;
import vn.mobileid.GoPaperless.model.apiModel.WorkFlowList;
import vn.mobileid.GoPaperless.model.fpsModel.FpsSignRequest;
import vn.mobileid.GoPaperless.model.fpsModel.HashFileRequest;
import vn.mobileid.GoPaperless.model.rsspModel.*;
import vn.mobileid.GoPaperless.process.ProcessDb;
import vn.mobileid.GoPaperless.utils.CommonFunction;
import vn.mobileid.GoPaperless.utils.Difinitions;
import vn.mobileid.GoPaperless.utils.VCStoringService;

import javax.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class RsspService {

    private final RestTemplate restTemplate = new RestTemplate();

    private String refreshToken;
    private String bearer;
    private String lang;
    private final String profile = "rssp-119.432-v2.0";

    private int retryLogin = 0;

    private final ProcessDb connect;

    private final PostBack postBack;

    private final Property property;

    private final GatewayService gatewayService;
    private final FpsService fpsService;

    private final VCStoringService vcStoringService;

    public RsspService(ProcessDb connect, PostBack postBack, Property property, GatewayService gatewayService, FpsService fpsService, VCStoringService vcStoringService) {
        this.connect = connect;
        this.postBack = postBack;
        this.property = property;
        this.gatewayService = gatewayService;
        this.fpsService = fpsService;
        this.vcStoringService = vcStoringService;
    }

    @Value("${dev.mode}")
    private boolean devMode;

    public void login() throws Exception {
        System.out.println("____________auth/login____________");
//        Property property = new Property();

        String loginUrl = property.getBaseUrl() + "auth/login";

        String authHeader;

        if (refreshToken != null) {
            authHeader = refreshToken;
        } else {
            retryLogin++;
            authHeader = property.getAuthorization();
        }

//        authHeader = property.getAuthorization();

        // Tạo HttpHeaders để đặt các headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", authHeader);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("rememberMeEnabled", true);
        requestData.put("relyingParty", property.getRelyingParty());
        requestData.put("lang", lang);
        requestData.put("profile", profile);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {

            ResponseEntity<LoginResponse> response = restTemplate.exchange(loginUrl, HttpMethod.POST, httpEntity, LoginResponse.class);

            if (response.getBody().getError() == 3005 || response.getBody().getError() == 3006) {
                refreshToken = null;
                if (retryLogin >= 5) {
                    retryLogin = 0;
                    System.out.println("Response code: " + response.getBody().getError());
                    System.out.println("Response Desscription: " + response.getBody().getErrorDescription());
                    System.out.println("Response ID: " + response.getBody().getResponseID());
                    System.out.println("AccessToken: " + response.getBody().getAccessToken());
                    throw new Exception(response.getBody().getErrorDescription());
                }
                login();
            } else if (response.getBody().getError() != 0) {
                System.out.println("Err code khac 0: " + response.getBody().getError());
                System.out.println("Err Desscription: " + response.getBody().getErrorDescription());
                System.out.println("Response ID: " + response.getBody().getResponseID());
                throw new Exception(response.getBody().getErrorDescription());
            } else {
                this.bearer = "Bearer " + response.getBody().getAccessToken();

                if (response.getBody().getRefreshToken() != null) {
                    this.refreshToken = "Bearer " + response.getBody().getRefreshToken();
                    System.out.println("Response code: " + response.getBody().getError());
                    System.out.println("Response Desscription: " + response.getBody().getErrorDescription());
                    System.out.println("Response ID: " + response.getBody().getResponseID());
                    System.out.println("AccessToken: " + response.getBody().getAccessToken());
                }
            }
        } catch (HttpClientErrorException e) {
            System.out.println("____________auth/login____________ error: ");
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
//            if (statusCode.value() == 401) {
//                getAccessToken();
//                return addSignature(documentId, field, data, drag);
//            } else {
            throw new Exception(e.getMessage());
//            }
        }

//        return "response";
    }

    public CredentialList credentialsList(String lang, String codeNumber) throws Exception {
        System.out.println("____________credentialsLists/list____________");

        String credentialsListUrl = property.getBaseUrl() + "credentials/list";
        String authHeader = bearer;

        // Tạo HttpHeaders để đặt các headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", authHeader);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("userID", codeNumber);
        requestData.put("lang", lang);
        requestData.put("profile", profile);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);
        restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));

        try {

            ResponseEntity<CredentialList> response = restTemplate.exchange(credentialsListUrl, HttpMethod.POST, httpEntity, CredentialList.class);
            System.out.println("error: " + response.getBody().getError());
            System.out.println("getErrorDescription: " + response.getBody().getErrorDescription());
            System.out.println("response: " + response.getStatusCode());

            if (response.getBody().getError() == 3005 || response.getBody().getError() == 3006) {
                login();
                return credentialsList(lang, codeNumber);
            } else if (response.getBody().getError() != 0) {
                System.out.println("Err Code: " + response.getBody().getError());
                System.out.println("Err Desscription: " + response.getBody().getErrorDescription());
                throw new Exception(response.getBody().getErrorDescription());
            }

            return response.getBody();
        } catch (HttpClientErrorException e) {
            System.out.println("____________auth/login____________ error: ");
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            throw new Exception(e.getMessage());
        }
    }

    public CredentialInfo getCredentialinFo(String lang, String credentialID) throws Exception {
//        System.out.println("____________credentialsLists/info____________");

        String credentialInfoUrl = property.getBaseUrl() + "credentials/info";
        String authHeader = bearer;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", authHeader);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("credentialID", credentialID);
        requestData.put("lang", lang);
        requestData.put("profile", profile);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {

            ResponseEntity<CredentialInfo> response = restTemplate.exchange(credentialInfoUrl, HttpMethod.POST, httpEntity, CredentialInfo.class);
//            System.out.println("error: " + response.getBody().getError());
//            System.out.println("getErrorDescription: " + response.getBody().getErrorDescription());
            System.out.println("response: " + response.getStatusCode());

            if (response.getBody().getError() == 3005 || response.getBody().getError() == 3006) {
                login();
                return getCredentialinFo(lang, credentialID);
            } else if (response.getBody().getError() != 0) {
//                System.out.println("Err Code: " + response.getBody().getError());
//                System.out.println("Err Desscription: " + response.getBody().getErrorDescription());
//                throw new Exception(response.getBody().getErrorDescription());
                return null;
            }

            return response.getBody();
        } catch (HttpClientErrorException e) {
            System.out.println("credentialsLists/info error: ");
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            throw new Exception(e.getMessage());
        }
    }

    public String authorizeVc(String lang, String credentialID, DocumentDigests doc, MobileDisplayTemplate displayTemplate, int numSignatures) throws Exception {
        System.out.println("____________credentialsLists/authorizeVc____________");

        String authorizeVcUrl = property.getBaseUrl() + "credentials/authorize";
        System.out.println("authorizeVcUrl: " + authorizeVcUrl);
        String authHeader = bearer;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", authHeader);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("credentialID", credentialID);
        requestData.put("numSignatures", numSignatures);
        requestData.put("documentDigests", doc);
        requestData.put("notificationMessage", displayTemplate.getNotificationMessage());
        requestData.put("messageCaption", displayTemplate.getMessageCaption());
        requestData.put("message", displayTemplate.getMessage());
        requestData.put("rpName", displayTemplate.getRpName());
        requestData.put("scaIdentity", displayTemplate.getScaIdentity());
        requestData.put("vcEnabled", displayTemplate.isVcEnabled());
        requestData.put("acEnabled", displayTemplate.isAcEnabled());
//        requestData.put("signAlgo", "1.2.840.113549.1.1.11");
        requestData.put("validityPeriod", 300);
        requestData.put("operationMode", "S");

        requestData.put("lang", lang);
        requestData.put("profile", profile);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {

            ResponseEntity<String> response = restTemplate.exchange(authorizeVcUrl, HttpMethod.POST, httpEntity, String.class);
            String responseBody = response.getBody();

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(responseBody);

            System.out.println("error: " + jsonNode.get("error").asInt());
            System.out.println("getErrorDescription: " + jsonNode.get("errorDescription").asText());
            System.out.println("response: " + response.getStatusCode());

            if (jsonNode.get("error").asInt() == 3005 || jsonNode.get("error").asInt() == 3006) {
                login();
                return authorizeVc(lang, credentialID, doc, displayTemplate, numSignatures);
            } else if (jsonNode.get("error").asInt() != 0) {
                System.out.println("Err Code: " + jsonNode.get("error").asInt());
                System.out.println("Err Desscription: " + jsonNode.get("errorDescription").asText());
                throw new Exception(jsonNode.get("errorDescription").asText());
            }
            return jsonNode.get("SAD").asText();
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    public String authorizeOtp(String lang, String credentialID, int numSignatures,
                               String otpRequestID, String otp) throws Exception {
        System.out.println("____________credentials/authorize____________");
        String authorizeOtpUrl = property.getBaseUrl() + "credentials/authorize";
        System.out.println("authorizeOtpUrl: " + authorizeOtpUrl);
        // numSignatures =1;
        String authHeader = bearer;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", authHeader);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("vcEnabled", true);
        requestData.put("credentialID", credentialID);
        requestData.put("numSignatures", numSignatures);
        requestData.put("requestID", otpRequestID);
        requestData.put("authorizeCode", otp);
        requestData.put("validityPeriod", 300);
        requestData.put("operationMode", "S");
        requestData.put("lang", lang);
        requestData.put("profile", profile);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {

            ResponseEntity<String> response = restTemplate.exchange(authorizeOtpUrl, HttpMethod.POST, httpEntity, String.class);
            String responseBody = response.getBody();

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(responseBody);

            System.out.println("error: " + jsonNode.get("error").asInt());
            System.out.println("getErrorDescription: " + jsonNode.get("errorDescription").asText());
            System.out.println("response: " + response.getStatusCode());

            if (jsonNode.get("error").asInt() == 3005 || jsonNode.get("error").asInt() == 3006) {
                login();
                return authorizeOtp(lang, credentialID, numSignatures, otpRequestID, otp);
            } else if (jsonNode.get("error").asInt() != 0) {
                System.out.println("Err Code: " + jsonNode.get("error").asInt());
                System.out.println("Err Desscription: " + jsonNode.get("errorDescription").asText());
                throw new Exception(jsonNode.get("errorDescription").asText());
            }
            return jsonNode.get("SAD").asText();
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    public String sendOTP(String lang, String credentialID) throws Throwable {
        System.out.println("____________credentials/sendOTP____________");

        String sendOTPUrl = property.getBaseUrl() + "credentials/sendOTP";
        String authHeader = bearer;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", authHeader);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("credentialID", credentialID);
        requestData.put("lang", lang);
        requestData.put("profile", profile);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {

            ResponseEntity<String> response = restTemplate.exchange(sendOTPUrl, HttpMethod.POST, httpEntity, String.class);
            String responseBody = response.getBody();

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(responseBody);

            System.out.println("error: " + jsonNode.get("error").asInt());
            System.out.println("getErrorDescription: " + jsonNode.get("errorDescription").asText());
            System.out.println("response: " + response.getStatusCode());

            if (jsonNode.get("error").asInt() == 3005 || jsonNode.get("error").asInt() == 3006) {
                login();
                return sendOTP(lang, credentialID);
            } else if (jsonNode.get("error").asInt() != 0) {
                System.out.println("Err Code: " + jsonNode.get("error").asInt());
                System.out.println("Err Desscription: " + jsonNode.get("errorDescription").asText());
                throw new Exception(jsonNode.get("errorDescription").asText());
            }
            return response.getBody();
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    public List<byte[]> signHash(String lang, String credentialID, DocumentDigests doc, String signAlgo, String sad) throws Exception {
        System.out.println("____________signatures/signHash____________");
        String signHashUrl = property.getBaseUrl() + "signatures/signHash";

        String authHeader = bearer;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", authHeader);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("credentialID", credentialID);
        requestData.put("documentDigests", doc);
        requestData.put("operationMode", "S");
        requestData.put("signAlgo", signAlgo);
        requestData.put("validityPeriod", 300);
        requestData.put("SAD", sad);
        requestData.put("lang", lang);
        requestData.put("profile", profile);

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(requestData);
        System.out.println("jsonSignHash: " + json);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {

            ResponseEntity<SignHashResponse> response = restTemplate.exchange(signHashUrl, HttpMethod.POST, httpEntity, SignHashResponse.class);
            System.out.println("error: " + response.getBody().getError());
            System.out.println("getErrorDescription: " + response.getBody().getErrorDescription());
            System.out.println("response: " + response.getStatusCode());

            if (response.getBody().getError() == 3005 || response.getBody().getError() == 3006) {
                login();
                return signHash(lang, credentialID, doc, signAlgo, sad);
            } else if (response.getBody().getError() != 0) {
                System.out.println("Err Code: " + response.getBody().getError());
                System.out.println("Err Desscription: " + response.getBody().getErrorDescription());
//                throw new Exception(response.getBody().getErrorDescription());
                return null;
            }

            return response.getBody().getSignatures();
        } catch (HttpClientErrorException e) {
            System.out.println("credentialsLists/info error: ");
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            throw new Exception(e.getMessage());
        }

    }

    public void getProperty(CheckCertificateRequest checkCertificateRequest) throws Exception {
        ConnectorName connectorName = connect.getIdentierConnector(checkCertificateRequest.getConnectorNameRSSP());
        System.out.println("getCertificates");
        String prefixCode = connectorName.getPrefixCode();
//        this.lang = request.getLanguage();
//        boolean codeEnable = true;
//        Property property = new Property();
        JsonNode jsonObject = new ObjectMapper().readTree(connectorName.getIdentifier());
        JsonNode attributes = jsonObject.get("attributes");

        for (JsonNode att : attributes) {
            JsonNode nameNode = att.get("name");
            JsonNode valueNode = att.get("value");

            if (nameNode != null && valueNode != null) {
                String name = nameNode.asText();
                String value = valueNode.asText();

                if ("URI".equals(name)) {
//                    BaseURL = value;
                    property.setBaseUrl(value);
                }
                if ("NAME".equals(name)) {
                    property.setRelyingParty(value);
                }
                if ("USERNAME".equals(name)) {
                    property.setRelyingPartyUser(value);
                }
                if ("PASSWORD".equals(name)) {
                    property.setRelyingPartyPassword(value);
                }
                if ("SIGNATURE".equals(name)) {
                    property.setRelyingPartySignature(value);
                }
                if ("KEYSTORE_FILE_URL".equals(name)) {
                    if (devMode) {
                        property.setRelyingPartyKeyStore("D:/project/file/PAPERLESS.p12");
                    } else {
                        property.setRelyingPartyKeyStore(value);
                    }
                }
                if ("KEYSTORE_PASSWORD".equals(name)) {
                    property.setRelyingPartyKeyStorePassword(value);
                }
//                if ("VERIFICATION_CODE_ENABLED".equals(name)) {
//                    codeEnable = Boolean.parseBoolean(value);
//                }
            }
        }
//        return property;
    }

    public String ownerCreate(JwtModel jwt, String lang) throws Exception {
        System.out.println("____________owner/create____________");

        String ownerCreateUrl = property.getBaseUrl() + "owner/create";
//        OwnerCreateRequest request = new OwnerCreateRequest();

//        request.phone = jwt.getPhone_number();
//        request.username = jwt.getDocument_number();
//        request.fullname = jwt.getName();
//        request.email = (jwt.getEmail() != null && !"".equals(jwt.getEmail())) ? jwt.getEmail() : jwt.getDocument_number() + "@gmail.com";
//        request.identificationType = jwt.getDocument_type();
//        request.identification = jwt.getDocument_number();
//        request.lang = lang;

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("phone", jwt.getPhone_number());
        requestData.put("username", jwt.getDocument_number());
        requestData.put("fullname", jwt.getName());
        requestData.put("email", (jwt.getEmail() != null && !"".equals(jwt.getEmail())) ? jwt.getEmail() : jwt.getDocument_number() + "@gmail.com");
        requestData.put("identificationType", jwt.getDocument_type());
        requestData.put("identification", jwt.getDocument_number());
        requestData.put("lang", lang);
        requestData.put("profile", profile);


        String authHeader = bearer;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", authHeader);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {

            ResponseEntity<String> response = restTemplate.exchange(ownerCreateUrl, HttpMethod.POST, httpEntity, String.class);
            String responseBody = response.getBody();

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(responseBody);

            System.out.println("error: " + jsonNode.get("error").asInt());
            System.out.println("getErrorDescription: " + jsonNode.get("errorDescription").asText());
            System.out.println("response: " + response.getStatusCode());

            if (jsonNode.get("error").asInt() == 3005 || jsonNode.get("error").asInt() == 3006) {
                login();
                return ownerCreate(jwt, lang);
            } else if (jsonNode.get("error").asInt() != 0) {
                System.out.println("Err Code: " + jsonNode.get("error").asInt());
                System.out.println("Err Desscription: " + jsonNode.get("errorDescription").asText());
//                throw new Exception(jsonNode.get("errorDescription").asText());
            }
            return response.getBody();
        } catch (HttpClientErrorException e) {
            System.out.println("credentialsLists/info error: ");
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            throw new Exception(e.getMessage());
        }
    }

    public String credentialsIssue(JwtModel jwt, String lang) throws Exception {
        System.out.println("____________credentials/issue____________");
        String credentialsIssueUrl = property.getBaseUrl() + "credentials/issue";

        System.out.println("type: " + jwt.getDocument_type());
        String authHeader = bearer;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", authHeader);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("user", jwt.getDocument_number());
        requestData.put("userType", jwt.getDocument_type());
        requestData.put("authorizeCode", "");
        requestData.put("requestID", "");
        requestData.put("certificateProfile", "T2PSB21D");
        requestData.put("signingProfileValue", 0);
        requestData.put("SCAL", 1);
        requestData.put("authMode", "EXPLICIT/OTP-SMS");
        requestData.put("multisign", 1);
        requestData.put("hsmProfileID", 0);
        requestData.put("certificates", "single");
        requestData.put("lang", lang);
        requestData.put("profile", profile);

        Map<String, Object> certificateDetails = new HashMap<>();
        certificateDetails.put("commonName", jwt.getName());
        certificateDetails.put("telephoneNumber", jwt.getPhone_number());
        certificateDetails.put("stateOrProvince", jwt.getCity_province());
        certificateDetails.put("country", "VN");
        certificateDetails.put("email", (jwt.getEmail() != null && !"".equals(jwt.getEmail())) ? jwt.getEmail() : jwt.getDocument_number() + "@gmail.com");


        Map<String, Object> identification = new HashMap<>();
        identification.put("type", "CITIZEN_IDENTITY_CARD");
        identification.put("value", jwt.getDocument_number());
        List<Map<String, Object>> identifications = new ArrayList<>();
        identifications.add(identification);

        certificateDetails.put("identifications", identifications);

        requestData.put("certDetails", certificateDetails);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {

            ResponseEntity<String> response = restTemplate.exchange(credentialsIssueUrl, HttpMethod.POST, httpEntity, String.class);
            String responseBody = response.getBody();

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(responseBody);

            System.out.println("error: " + jsonNode.get("error").asInt());
            System.out.println("getErrorDescription: " + jsonNode.get("errorDescription").asText());
            System.out.println("response: " + response.getStatusCode());

            if (jsonNode.get("error").asInt() == 3005 || jsonNode.get("error").asInt() == 3006) {
                login();
                return credentialsIssue(jwt, lang);
            } else if (jsonNode.get("error").asInt() != 0) {
                System.out.println("Err Code: " + jsonNode.get("error").asInt());
                System.out.println("Err Desscription: " + jsonNode.get("errorDescription").asText());
                throw new Exception(jsonNode.get("errorDescription").asText());
            }
            return jsonNode.get("credentialID").asText();
        } catch (HttpClientErrorException e) {
            System.out.println("credentialsLists/info error: ");
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            throw new Exception(e.getMessage());
        }
    }

    public Map<String, Object> getCertificates(RsspRequest request) throws Exception {
        ConnectorName connectorName = connect.getIdentierConnector(request.getConnectorName());
        System.out.println("getCertificates");
        String prefixCode = connectorName.getPrefixCode();
        this.lang = request.getLanguage();
        boolean codeEnable = true;
//        Property property = new Property();
        JsonNode jsonObject = new ObjectMapper().readTree(connectorName.getIdentifier());
        JsonNode attributes = jsonObject.get("attributes");

        for (JsonNode att : attributes) {
            JsonNode nameNode = att.get("name");
            JsonNode valueNode = att.get("value");

            if (nameNode != null && valueNode != null) {
                String name = nameNode.asText();
                String value = valueNode.asText();

                if ("URI".equals(name)) {
//                    BaseURL = value;
                    property.setBaseUrl(value);
                }
                if ("NAME".equals(name)) {
                    property.setRelyingParty(value);
                }
                if ("USERNAME".equals(name)) {
                    property.setRelyingPartyUser(value);
                }
                if ("PASSWORD".equals(name)) {
                    property.setRelyingPartyPassword(value);
                }
                if ("SIGNATURE".equals(name)) {
                    property.setRelyingPartySignature(value);
                }
                if ("KEYSTORE_FILE_URL".equals(name)) {
                    if (devMode) {
                        property.setRelyingPartyKeyStore("D:/project/file/PAPERLESS.p12");
                    } else {
                        property.setRelyingPartyKeyStore(value);
                    }
                }
                if ("KEYSTORE_PASSWORD".equals(name)) {
                    property.setRelyingPartyKeyStorePassword(value);
                }
                if ("VERIFICATION_CODE_ENABLED".equals(name)) {
                    codeEnable = Boolean.parseBoolean(value);
                }
            }
        }

        login();
        CredentialList credentialList = credentialsList(request.getLanguage(), request.getCodeNumber());
        CredentialInfo credentialinFo = null;

        Map<String, Object> response = new HashMap<>();
        response.put("relyingParty", property.getRelyingParty());
        response.put("prefixCode", prefixCode);
        response.put("codeEnable", codeEnable);

        List<CertResponse> listCertificate = new ArrayList<>();
        if (credentialList.getCerts().size() > 0) {
            for (CredentialItem credential : credentialList.getCerts()) {
                String credentialID = credential.getCredentialID();
                credentialinFo = getCredentialinFo(request.getLanguage(), credentialID);
                if (credentialinFo != null) {
                    String authMode = credentialinFo.getAuthMode();
                    String status = credentialinFo.getCert().getStatus();
//                    System.out.println("authMode ne: " + authMode);
//                    System.out.println("status ne: " + status);
                    if ("IMPLICIT/TSE".equals(authMode) && "OPERATED".equals(status)) {
                        int lastIndex = credentialinFo.getCert().getCertificates().size() - 1;
                        String certChain = credentialinFo.getCert().getCertificates().get(lastIndex);

                        Object[] info1 = new Object[3];
                        String[] time = new String[2];
                        int[] intRes = new int[1];

                        CommonFunction.VoidCertificateComponents(certChain, info1, time, intRes);
                        if (intRes[0] == 0) {
                            CertResponse certResponse = new CertResponse();
                            certResponse.setSubject(CommonFunction.getCommonnameInDN(info1[0].toString()));
                            certResponse.setIssuer(CommonFunction.getCommonnameInDN(info1[1].toString()));
                            certResponse.setValidFrom(time[0]);
                            certResponse.setValidTo(time[1]);
                            certResponse.setCert(certChain);
                            certResponse.setCredentialID(credentialID);
//                        certResponse.setCodeNumber(codeNumber);
                            certResponse.setRelyingParty(property.getRelyingParty());
                            certResponse.setPrefixCode(prefixCode);
                            certResponse.setCodeEnable(codeEnable);
                            listCertificate.add(certResponse);
                        }
                    }
                }
            }
            response.put("listCertificate", listCertificate);
        }
        return response;
    }

    public String signFile(
            RsspRequest signRequest,
            HttpServletRequest request) throws Throwable {
        String field_name = signRequest.getFieldName();
        System.out.println("field_name: " + field_name);
        String codeNumber = signRequest.getCodeNumber();
        String connectorName = signRequest.getConnectorName();
        String country = !Objects.equals(signRequest.getCountry(), "") ? signRequest.getCountry() : signRequest.getCountryRealtime();
        System.out.println("country: " + country);
        int documentId = signRequest.getDocumentId();
        int enterpriseId = signRequest.getEnterpriseId();
        String fileName = signRequest.getFileName();
        String imageBase64 = signRequest.getImageBase64();
        String lang = signRequest.getLanguage();
        int lastFileId = signRequest.getLastFileId();
        String lastUuid = signRequest.getLastFileUuid();
        String requestID = signRequest.getRequestID();
        String signerId = signRequest.getSignerId();
        String signerToken = signRequest.getSignerToken();
        String signingOption = signRequest.getSigningOption();
        String signingPurpose = signRequest.getSigningPurpose();
        System.out.println("signingPurpose: " + signingPurpose);
        String signingToken = signRequest.getSigningToken();
        int workFlowId = signRequest.getWorkFlowId();
        String relyingParty = signRequest.getCertChain().getRelyingParty();
        String prefixCode = signRequest.getCertChain().getPrefixCode();
        boolean codeEnable = signRequest.getCertChain().isCodeEnable();
        String credentialID = signRequest.getCertChain().getCredentialID();
        String certChain = signRequest.getCertChain().getCert();

        try {
            System.out.println("connectorName: " + connectorName);
            boolean error = false;

            WorkFlowList rsWFList = new WorkFlowList();
            connect.USP_GW_PPL_WORKFLOW_GET(rsWFList, signingToken);
            String sResult = "0";

            if (rsWFList == null || rsWFList.getWorkFlowStatus() != Difinitions.CONFIG_PPL_WORKFLOW_STATUS_PENDING) {
//                error = true;
                sResult = "Signer Status invalid";// trạng thái không hợp lệ
                return sResult;
//                throw new Exception(sResult);
            }

            // check workflow participant
            Participants rsParticipant = new Participants();
            connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_GET(rsParticipant, signerToken);
            if (rsParticipant == null || rsParticipant.getSignerStatus() != Difinitions.CONFIG_WORKFLOW_PARTICIPANTS_SIGNER_STATUS_ID_PENDING) {
                return sResult = "The document has already been signed";
            }

//            String meta = rsParticipant.getMetaInformation();

//            int isSetPosition = CommonFunction.checkIsSetPosition(field_name, meta);
//
//            System.out.println("isSetPosition: " + isSetPosition);

            String pDMS_PROPERTY = CommonFunction.getPropertiesFMS();

//            long millis = System.currentTimeMillis();
//            String sSignatureHash = signerToken + millis;
//            String sSignature_id = prefixCode + "-" + CommonFunction.toHexString(CommonFunction.hashPass(sSignatureHash)).toUpperCase();


            // get user-agent
            String userAgent = request.getHeader("User-Agent");
            Parser parser = new Parser();
            Client c = parser.parse(userAgent);
            // set app interface
            String rpName = "{\"OPERATING SYSTEM\":\"" + c.os.family + " " + c.os.major + "\",\"BROWSER\":\"" + c.userAgent.family + " " + c.userAgent.major + "\",\"RP NAME\":\"" + relyingParty + "\"}";

            String fileType2 = fileName.substring(fileName.lastIndexOf(".") + 1);
            String message = " {\"FILE NAME\":\"" + fileName + "\", \"FILE TYPE\":\"" + fileType2 + "\"}";

            MobileDisplayTemplate template = new MobileDisplayTemplate();
            template.setScaIdentity("PAPERLESS GATEWAY");
            template.setMessageCaption("DOCUMENT SIGNING");
            template.setNotificationMessage("PAPERLESS GATEWAY ACTIVITES");
            template.setMessage(message);
            template.setRpName(rpName);
            template.setVcEnabled(codeEnable);
            template.setAcEnabled(true);

            List<String> listCertChain = new ArrayList<>();
            listCertChain.add(certChain);

            HashFileRequest hashFileRequest = new HashFileRequest();

            hashFileRequest.setCertificateChain(listCertChain);
            hashFileRequest.setSigningReason(signingPurpose);
            hashFileRequest.setSignatureAlgorithm("RSA");
            hashFileRequest.setSignedHash("SHA256");
            hashFileRequest.setSigningLocation(country);
            hashFileRequest.setFieldName(field_name);
            hashFileRequest.setHandSignatureImage(imageBase64);

            String hashList = fpsService.hashSignatureField(documentId, hashFileRequest);

            HashAlgorithmOID hashAlgo = HashAlgorithmOID.SHA_256;
            DocumentDigests doc = new DocumentDigests();
            doc.hashAlgorithmOID = "2.16.840.1.101.3.4.2.1";
            doc.hashes = new ArrayList<>();
            doc.hashes.add(CommonFunction.base64Decode(hashList));

            if (codeEnable) {
                List<byte[]> list = new ArrayList<>();
                list.add(Base64.getMimeDecoder().decode(hashList));
                String codeVC = CommonFunction.computeVC(list);
                vcStoringService.store(requestID, codeVC);
            }

//            String sad = crt.authorize(connectorLogRequest, lang, credentialID, 1, doc, null, template);
//            authorizeVc(request, credentialID, doc, template, numSignatures)
            String sad = authorizeVc(signRequest.getLanguage(), credentialID, doc, template, 1);
            System.out.println("kiem tra sad: " + sad);

//            commonRepository.connectorLog(connectorLogRequest);
//            SignAlgo signAlgo = SignAlgo.RSA;
            String signAlgo = "1.2.840.113549.1.1.1";
            List<byte[]> signatures = signHash(lang, credentialID, doc, signAlgo, sad);
            String signature = Base64.getEncoder().encodeToString(signatures.get(0));
            System.out.println("kiem tra signature: " + signature);


            FpsSignRequest fpsSignRequest = new FpsSignRequest();
            fpsSignRequest.setFieldName(field_name);
            fpsSignRequest.setHashValue(hashList);
            fpsSignRequest.setSignatureValue(signature);


            fpsSignRequest.setCertificateChain(listCertChain);

            System.out.println("kiem tra progress: ");

            String responseSign = fpsService.signDocument(documentId, fpsSignRequest);

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode signNode = objectMapper.readTree(responseSign);
            String uuid = signNode.get("uuid").asText();
            int fileSize = signNode.get("file_size").asInt();
            String digest = signNode.get("digest").asText();
            String signedHash = signNode.get("signed_hash").asText();
            String signedTime = signNode.get("signed_time").asText();
            String sSignature_id = signNode.get("signature_name").asText();

//            String sSignature_id = gatewayService.getSignatureId(uuid, fileName);
//            String sSignature_id = requestID; // temporary

            int isSetPosition = 1;
            postBack.postBack2(isSetPosition, signerId, fileName, signingToken, pDMS_PROPERTY, sSignature_id, signerToken, signedTime, rsWFList, lastFileId, certChain, codeNumber, signingOption, uuid, fileSize, enterpriseId, digest, signedHash, signature, request);
            return responseSign;

        } catch (Exception e) {

            if (field_name == null || field_name.isEmpty()) {
                fpsService.deleteSignatue(documentId, signerId);
            }

            throw new Exception(e.getMessage());
        } finally {
            vcStoringService.remove(requestID);
        }

    }

    public String getVc(String requestID) {
        Long startTime = System.currentTimeMillis();
        try {
            while (true) {
                String VC = vcStoringService.get(requestID);
                if (VC != null) {
                    vcStoringService.remove(requestID);
                    return VC;
                } else {
                    Long endTime = System.currentTimeMillis();
                    if (endTime - startTime > 60000) {
                        return VC;
                    }
                    Thread.sleep(5000);
                }
            }
        } catch (Exception e) {
            return null;
        }
    }

}
