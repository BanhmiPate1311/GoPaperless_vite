package vn.mobileid.GoPaperless.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import vn.mobileid.GoPaperless.dto.rsspDto.RsspRequest;
import vn.mobileid.GoPaperless.model.apiModel.ConnectorName;
import vn.mobileid.GoPaperless.model.apiModel.Participants;
import vn.mobileid.GoPaperless.model.apiModel.WorkFlowList;
import vn.mobileid.GoPaperless.model.rsspModel.*;
import vn.mobileid.GoPaperless.process.ProcessDb;
import vn.mobileid.GoPaperless.utils.CommonFunction;
import vn.mobileid.GoPaperless.utils.Difinitions;

import javax.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class RsspService {

    private final RestTemplate restTemplate = new RestTemplate();

    private String refreshToken;
    private String bearer;
    private String lang;
    private final String profile="rssp-119.432-v2.0";

    private int retryLogin = 0;

    private final ProcessDb connect;

    private final Property property;

    public RsspService(ProcessDb connect, Property property) {
        this.connect = connect;
        this.property = property;
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

            if (response.getBody().getError() == 3005 || response.getBody().getError() == 3006){
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
            }else if (response.getBody().getError() != 0) {
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

    public CredentialList credentialsList(RsspRequest request) throws Exception {
        System.out.println("____________credentialsLists/list____________");

        String credentialsListUrl = property.getBaseUrl() + "credentials/list";
        String authHeader = bearer;
        System.out.println("authHeader: " + authHeader);

        // Tạo HttpHeaders để đặt các headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", authHeader);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("userID", request.getCodeNumber());
        requestData.put("lang", request.getLanguage());
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
                return credentialsList(request);
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

    public CredentialInfo getCredentialinFo(RsspRequest request, String credentialID) throws Exception {
        System.out.println("____________credentialsLists/info____________");

        String credentialInfoUrl = property.getBaseUrl() + "credentials/info";
        String authHeader = bearer;
        System.out.println("authHeader: " + authHeader);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", authHeader);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("credentialID", credentialID);
        requestData.put("lang", request.getLanguage());
        requestData.put("profile", profile);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {

            ResponseEntity<CredentialInfo> response = restTemplate.exchange(credentialInfoUrl, HttpMethod.POST, httpEntity, CredentialInfo.class);
            System.out.println("error: " + response.getBody().getError());
            System.out.println("getErrorDescription: " + response.getBody().getErrorDescription());
            System.out.println("response: " + response.getStatusCode());

            if (response.getBody().getError() == 3005 || response.getBody().getError() == 3006) {
                login();
                return getCredentialinFo(request,credentialID);
            } else if (response.getBody().getError() != 0) {
                System.out.println("Err Code: " + response.getBody().getError());
                System.out.println("Err Desscription: " + response.getBody().getErrorDescription());
//                throw new Exception(response.getBody().getErrorDescription());
                return null;
            }

            return response.getBody();
        } catch (HttpClientErrorException e) {
            System.out.println("____________auth/login____________ error: ");
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
        CredentialList credentialList = credentialsList(request);
        CredentialInfo credentialinFo = null;

        Map<String, Object> response = new HashMap<>();
        response.put("relyingParty", property.getRelyingParty());
        response.put("prefixCode", prefixCode);
        response.put("codeEnable", codeEnable);

        List<CertResponse> listCertificate = new ArrayList<>();
        if (credentialList.getCerts().size() >0){
            for (CredentialItem credential : credentialList.getCerts()) {
                String credentialID = credential.getCredentialID();
                credentialinFo = getCredentialinFo(request, credentialID);
                if (credentialinFo != null) {
                    String authMode = credentialinFo.getAuthMode();
                    String status = credentialinFo.getCert().getStatus();
                    System.out.println("authMode ne: " + authMode);
                    System.out.println("status ne: " + status);
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

//    public String signFile(
//            RsspRequest signRequest,
//            HttpServletRequest request) throws Throwable {
//        String field_name = signRequest.getFieldName();
//        System.out.println("field_name: " + field_name);
//        String connectorName = signRequest.getConnectorName();
//        int enterpriseId = signRequest.getEnterpriseId();
//        int workFlowId = signRequest.getWorkFlowId();
//        String signingToken = signRequest.getSigningToken();
//        String signerToken = signRequest.getSignerToken();
//        String lang = signRequest.getLanguage();
//        String codeNumber = signRequest.getCodeNumber();
//        String relyingParty = signRequest.getCertChain().getRelyingParty();
//        String prefixCode = signRequest.getCertChain().getPrefixCode();
//        boolean codeEnable = signRequest.getCertChain().isCodeEnable();
//        String credentialID = signRequest.getCertChain().getCredentialID();
//        String signingOption = signRequest.getSigningOption();
//        String signerId = signRequest.getSignerId();
//        String certChain = signRequest.getCertChain().getCert();
//        String fileName = signRequest.getFileName();
//        String requestID = signRequest.getRequestID();
//        int lastFileId = signRequest.getLastFileId();
//        int documentId = signRequest.getDocumentId();
//
//        try {
//            System.out.println("connectorName: " + connectorName);
//            boolean error = false;
//
//            WorkFlowList rsWFList = new WorkFlowList();
//            connect.USP_GW_PPL_WORKFLOW_GET(rsWFList, signingToken);
//            String sResult = "0";
//
//            // check workflow status
////            if (rsWFList[0] == null || rsWFList[0].length == 0 || rsWFList[0][0].WORKFLOW_STATUS != Difinitions.CONFIG_PPL_WORKFLOW_STATUS_PENDING) {
////                error = true;
////                sResult = "Signer Status invalid";// trạng thái không hợp lệ
////                throw new Exception(sResult);
////            }
//            if(rsWFList == null || rsWFList.getWorkFlowStatus() != Difinitions.CONFIG_PPL_WORKFLOW_STATUS_PENDING){
////                error = true;
//                sResult = "Signer Status invalid";// trạng thái không hợp lệ
//                throw new Exception(sResult);
//            }
//
//            // check workflow participant
//            Participants rsParticipant = new Participants();
//            connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_GET(rsParticipant, signerToken);
//            if (rsParticipant == null  || rsParticipant.getSignerStatus() != Difinitions.CONFIG_WORKFLOW_PARTICIPANTS_SIGNER_STATUS_ID_PENDING) {
//                return sResult = "The document has already been signed";
//            }
//
//            String meta = rsParticipant.getMetaInformation();
//
////            int isSetPosition = CommonFunction.checkIsSetPosition(field_name, meta);
////
////            System.out.println("isSetPosition: " + isSetPosition);
//
//            String pDMS_PROPERTY = CommonFunction.getPropertiesFMS();
//
//            long millis = System.currentTimeMillis();
//            String sSignatureHash = signerToken + millis;
//            String sSignature_id = prefixCode + "-" + CommonHash.toHexString(CommonHash.hashPass(sSignatureHash)).toUpperCase();
//
//            String documentDetails = fpsService.getDocumentDetails(documentId);
//
//            ObjectMapper objectMapper = new ObjectMapper();
//            JsonNode jsonNode = objectMapper.readTree(documentDetails);
//            JsonNode documentNode = jsonNode.get(0);
//
////            System.out.println("documentDetails: " + jsonNode.get(0).get("document_height").asInt());
//            int pageHeight = 0;
//            int pageWidth = 0;
//            if (documentNode != null) {
//                pageHeight = documentNode.get("document_height").asInt();
//                pageWidth = documentNode.get("document_width").asInt();
//            }
//
//            // get user-agent
//            String userAgent = request.getHeader("User-Agent");
//            Parser parser = new Parser();
//            Client c = parser.parse(userAgent);
//            // set app interface
//            String rpName = "{\"OPERATING SYSTEM\":\"" + c.os.family + " " + c.os.major + "\",\"BROWSER\":\"" + c.userAgent.family + " " + c.userAgent.major + "\",\"RP NAME\":\"" + relyingParty + "\"}";
//
//            String fileType2 = fileName.substring(fileName.lastIndexOf(".") + 1);
//            String message = " {\"FILE NAME\":\"" + fileName + "\", \"FILE TYPE\":\"" + fileType2 + "\"}";
//
//            MobileDisplayTemplate template = new MobileDisplayTemplate();
//            template.setScaIdentity("PAPERLESS GATEWAY");
//            template.setMessageCaption("DOCUMENT SIGNING");
//            template.setNotificationMessage("PAPERLESS GATEWAY ACTIVITES");
//            template.setMessage(message);
//            template.setRpName(rpName);
//            template.setVcEnabled(codeEnable);
//            template.setAcEnabled(true);
//
//            List<String> listCertChain = new ArrayList<>();
//            listCertChain.add(certChain);
//
//            HashFileRequest hashFileRequest = commonRepository.getMetaData(signerToken, meta);
//            hashFileRequest.setCertificateChain(listCertChain);
//
//            if (field_name == null || field_name.isEmpty()) {
//                System.out.println("kiem tra:");
//                commonRepository.addSign(pageHeight, pageWidth, signingToken, signerId, meta, documentId);
////                hashFileRequest.setFieldName(signerToken);
//            }
////            else {
////                hashFileRequest.setFieldName(signRequest.getFieldName());
////            }
//            System.out.println("kiem tra1:");
//            hashFileRequest.setFieldName(!field_name.isEmpty() ? field_name : signerId);
//            String hashList = fpsService.hashSignatureField(documentId, hashFileRequest);
//
//            HashAlgorithmOID hashAlgo = HashAlgorithmOID.SHA_256;
//            DocumentDigests doc = new DocumentDigests();
//            doc.hashAlgorithmOID = hashAlgo;
//            doc.hashes = new ArrayList<>();
//            doc.hashes.add(Utils.base64Decode(hashList));
//
//            if (codeEnable) {
//                List<byte[]> list = new ArrayList<>();
//                list.add(Base64.getMimeDecoder().decode(hashList));
//                String codeVC = CommonFunction.computeVC(list);
//                vcStoringService.store(requestID, codeVC);
//            }
//
//            String sad = crt.authorize(connectorLogRequest, lang, credentialID, 1, doc, null, template);
//
////            commonRepository.connectorLog(connectorLogRequest);
//            SignAlgo signAlgo = SignAlgo.RSA;
//            List<byte[]> signatures = crt.signHash(connectorLogRequest, lang, credentialID, doc, signAlgo, sad);
//            String signature = Base64.getEncoder().encodeToString(signatures.get(0));
//            System.out.println("kiem tra signature: " + signature);
//
//
//            FpsSignRequest fpsSignRequest = new FpsSignRequest();
//            fpsSignRequest.setFieldName(!field_name.isEmpty() ? field_name : signerId);
//            fpsSignRequest.setHashValue(hashList);
//            fpsSignRequest.setSignatureValue(signature);
//
//
//            fpsSignRequest.setCertificateChain(listCertChain);
//
//            System.out.println("kiem tra progress: ");
//
//            String responseSign = fpsService.signDocument(documentId, fpsSignRequest);
//
//
//            JsonNode signNode = objectMapper.readTree(responseSign);
//            String uuid = signNode.get("uuid").asText();
//            int fileSize = signNode.get("file_size").asInt();
//            String digest = signNode.get("digest").asText();
//            String signedHash = signNode.get("signed_hash").asText();
//            String signedTime = signNode.get("signed_time").asText();
//
//            CallBackLogRequest callBackLogRequest = new CallBackLogRequest();
//            callBackLogRequest.setpENTERPRISE_ID(enterpriseId);
//            callBackLogRequest.setpWORKFLOW_ID(workFlowId);
//
//
//            commonRepository.postBack2(callBackLogRequest, isSetPosition, signerId, fileName, signingToken, pDMS_PROPERTY, sSignature_id, signerToken, signedTime, rsWFList, lastFileId, certChain, codeNumber, signingOption, uuid, fileSize, enterpriseId, digest, signedHash, signature, request);
//            return responseSign;
//
//        } catch (Exception e) {
//            commonRepository.connectorLog(connectorLogRequest);
//            if(field_name == null || field_name.isEmpty()){
//                fpsService.deleteSignatue(documentId, signerId);
//            }
//
//            throw new Exception(e.getMessage());
//        } finally {
//            vcStoringService.remove(requestID);
//        }
//
//    }
}
