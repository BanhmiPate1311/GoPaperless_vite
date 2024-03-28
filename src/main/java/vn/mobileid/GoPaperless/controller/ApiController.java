package vn.mobileid.GoPaperless.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.mobileid.GoPaperless.dto.apiDto.ApiDtoRequest;
import vn.mobileid.GoPaperless.dto.apiDto.SigningWorkflowDto;
import vn.mobileid.GoPaperless.model.apiModel.*;
import vn.mobileid.GoPaperless.process.ProcessDb;
import vn.mobileid.GoPaperless.service.CheckAndSendMailService;
import vn.mobileid.GoPaperless.service.FpsService;
import vn.mobileid.GoPaperless.utils.*;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.PublicKey;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static vn.mobileid.GoPaperless.utils.GetFeatureCertificate2.getCRLDistributionPoints;

@RestController
@RequestMapping("/uiApi")
public class ApiController {

    private final ProcessDb connect;
    private final FpsService fpsService;
    private final CheckAndSendMailService checkAndSendMailService;

    public ApiController(ProcessDb connect, FpsService fpsService, CheckAndSendMailService checkAndSendMailService) {
        this.connect = connect;
        this.fpsService = fpsService;
        this.checkAndSendMailService = checkAndSendMailService;
    }

    @PostMapping("/checkHeader")
    public ResponseEntity<?> checkHeader(@RequestBody ApiDtoRequest request) throws Exception {
        String signingToken = request.getSigningToken();
        System.out.println("checkHeader");
        WorkFlowList participants = new WorkFlowList();
        connect.USP_GW_PPL_WORKFLOW_GET(participants, signingToken);
        Map<String, Object> map = new HashMap<>();
        map.put("documenId", participants.getDocumentId());
        map.put("headerVisible", participants.getVisibleHeaderFooter());
        // if (participants.getVisibleHeaderFooter() == 1) {
        // List<Enterprise> enterprises =
        // LoadParamSystem.getEnterpriseStart(Difinitions.CONFIG_LOAD_PARAM_ENTERPRISE);
        //
        // if (enterprises.size() > 0) {
        // for (Enterprise enterprise : enterprises) {
        // if (enterprise.getId() == participants.getEnterpriseId()) {
        // map.put("loGo", enterprise.getLogo());
        // map.put("metadataGatewayView", enterprise.getMetadataGatewayView());
        // map.put("name", enterprise.getName());
        // map.put("notificationEmail", enterprise.getNotificationEmail());
        // }
        // }
        // }
        // }
        List<Enterprise> enterprises = LoadParamSystem.getEnterpriseStart(Difinitions.CONFIG_LOAD_PARAM_ENTERPRISE);

        if (enterprises.size() > 0) {
            for (Enterprise enterprise : enterprises) {
                if (enterprise.getId() == participants.getEnterpriseId()) {
                    map.put("loGo", enterprise.getLogo());
                    map.put("metadataGatewayView", enterprise.getMetadataGatewayView());
                    map.put("name", enterprise.getName());
                    map.put("notificationEmail", enterprise.getNotificationEmail());
                }
            }
        }
        return new ResponseEntity<>(map, HttpStatus.OK);
    }

    @PostMapping("/headerFooter")
    public ResponseEntity<?> headerFooter(@RequestBody ApiDtoRequest request) {
        System.out.println("headerFooter");
        // convert String to int
        int enterpriseId = request.getEnterpriseId();

        System.out.println("enterpriseId: " + enterpriseId);
        List<Enterprise> enterprises = LoadParamSystem.getEnterpriseStart(Difinitions.CONFIG_LOAD_PARAM_ENTERPRISE);

        if (enterprises.size() > 0) {
            for (Enterprise enterprise : enterprises) {
                if (enterprise.getId() == enterpriseId) {
                    return new ResponseEntity<>(enterprise, HttpStatus.OK);
                }
            }
        }

        return new ResponseEntity<>("Not Found", HttpStatus.OK);
    }

    @PostMapping("/getSigningWorkFlow")
    public ResponseEntity<?> getSigningWorkFlow(@RequestBody ApiDtoRequest request) throws Exception {
        System.out.println("getSigningWorkFlow");
        String signingToken = request.getSigningToken();
        List<Participants> participants = new ArrayList<>();

        SigningWorkflowDto signingWorkflowDto = new SigningWorkflowDto();

        System.out.println("getParticipants");
        try {
            connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_LIST(participants, signingToken);
        } catch (Exception e) {
            System.out.println("getParticipants: " + e.getMessage());
            throw new Exception(e.getMessage());
        }

        System.out.println("getLastFile");
        LastFile lastFile = new LastFile();
        try {
            connect.USP_GW_PPL_WORKFLOW_GET_LAST_FILE(lastFile, signingToken);
            signingWorkflowDto.setFirstFileId(lastFile.getFirstPplFileSignedId());
            signingWorkflowDto.setLastFileId(lastFile.getLastPplFileSignedId());
            signingWorkflowDto.setFileName(lastFile.getLastPplFileName());
            signingWorkflowDto.setFileSize(lastFile.getFileSize());
            signingWorkflowDto.setEnterpriseId(lastFile.getEnterpriseId());
            signingWorkflowDto.setWorkFlowId(lastFile.getPplWorkflowId());
            signingWorkflowDto.setDocumentName(lastFile.getWorkflowDocumentName());
            signingWorkflowDto.setSigningToken(signingToken);
            signingWorkflowDto.setDocumentId(lastFile.getDocumentId());
            signingWorkflowDto.setLastFileUuid(lastFile.getLastPplFileUuid());
            signingWorkflowDto.setWorkflowProcessType(lastFile.getWorkflowProcessType());
            signingWorkflowDto.setWorkflowStatus(lastFile.getWorkflowStatus());
            signingWorkflowDto.setWorkflowStatus(lastFile.getWorkflowStatus());
            signingWorkflowDto.setWorkflowStatus(lastFile.getWorkflowStatus());
            signingWorkflowDto.setWorkflowStatus(lastFile.getWorkflowStatus());
            signingWorkflowDto.setCreatedBy(lastFile.getCreatedBy());
            signingWorkflowDto.setCreatedAt(lastFile.getCreatedAt());
            signingWorkflowDto.setLastModifiedAt(lastFile.getLastModifiedAt());
            if (lastFile.getDeadlineAt() != null) {
                signingWorkflowDto.setDeadlineAt(CommonFunction.convertToGetTimeZone(lastFile.getDeadlineAt()));
            }
            // signingWorkflowDto.setDeadlineAt(CommonFunction.convertToGetTimeZone(lastFile.getDeadlineAt()));

            System.out.println("get connect xong: ");
            String base64 = fpsService.getBase64ImagePdf(lastFile.getDocumentId());
            signingWorkflowDto.setPdfBase64(base64);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("getLastFile: " + e.getMessage());
            throw new Exception(e.getMessage());
        }

        if (participants.size() > 0) {
            // for (Participants participant : participants) {
            // if (CommonFunction.isNotNullOrEmpty(participant.getCertificate())) {
            // String sIssue = "";
            // String sOwner = "";
            // String sFrom = "";
            // String sTo = "";
            // String sCertificate =
            // CommonFunction.CheckTextNull(participant.getCertificate());
            // System.out.println("signed time: " + participant.getSignedTime());
            // participant.setSignedTime(CommonFunction.convertToGetTimeZone(participant.getSignedTime()));
            //
            // ObjectMapper oMapperParse = new ObjectMapper();
            // CertificateJson itemParse = oMapperParse.readValue(sCertificate,
            // CertificateJson.class);
            //
            // if (itemParse != null) {
            // if(itemParse.signer_info != null){
            // System.out.println("trên");
            // sIssue =
            // CommonFunction.CheckTextNull(itemParse.signer_info.certificate.issuer);
            // sOwner =
            // CommonFunction.CheckTextNull(itemParse.signer_info.certificate.subject);
            // sFrom = itemParse.signer_info.certificate.valid_from;
            // sTo = itemParse.signer_info.certificate.valid_to;
            // } else {
            // System.out.println("duoi");
            // sIssue =
            // CommonFunction.CheckTextNull(itemParse.signer_info_dto.certificate.issuer);
            // sOwner =
            // CommonFunction.CheckTextNull(itemParse.signer_info_dto.certificate.subject);
            // sFrom = itemParse.signer_info_dto.certificate.valid_from;
            // sTo = itemParse.signer_info_dto.certificate.valid_to;
            // }
            // }
            // if (!"".equals(sIssue)) {
            // sIssue = CommonFunction.getCommonNameInDN(sIssue);
            // }
            // if (!"".equals(sOwner)) {
            // sOwner = CommonFunction.getCommonNameInDN(sOwner);
            // }
            // participant.setIssuer(sIssue);
            // participant.setOwner(sOwner);
            // System.out.println("sFrom: " + sFrom);
            // System.out.println("sTo: " + sTo);
            // participant.setValidFrom(sFrom);
            // participant.setValidTo(sTo);
            // }
            // }
            List<Participants> participantsList = new ArrayList<>(participants);
            signingWorkflowDto.setParticipants(participantsList);
        }

        return new ResponseEntity<>(signingWorkflowDto, HttpStatus.OK);
    }

    @PostMapping("/checkWorkFlow")
    public ResponseEntity<?> checkWorkFlow(@RequestBody ApiDtoRequest request) throws Exception {
        System.out.println("checkWorkFlow");

        int valid = connect.USP_GW_SIGNER_CHECK_EXIST(request.getSigningToken(), request.getSignerToken());

        return new ResponseEntity<>(valid, HttpStatus.OK);
    }

    @PostMapping("/getSignedInfo")
    public ResponseEntity<?> getSignedInfo(@RequestBody ApiDtoRequest request) throws Exception {
        System.out.println("getSignedInfo");
        List<PplFileDetail> listPplFileDetail = new ArrayList<>();
        connect.USP_GW_PPL_FILE_DETAIL_GET(request.getFileId(), listPplFileDetail);

        return new ResponseEntity<>(listPplFileDetail, HttpStatus.OK);
    }

    @PostMapping("/getConnecterProvider")
    public ResponseEntity<?> getConnecterProvider(@RequestBody ApiDtoRequest request) throws Exception {
        System.out.println("getConnecterProvider");
        System.out.println("request: " + request.getSigningOptions());
        try {
            Map<String, List<Map<String, String>>> responseList = new HashMap<>();
            List<ConnectorName> connectorNameList = LoadParamSystem
                    .getConnectorStart(Difinitions.CONFIG_LOAD_PARAM_CONNECTOR_NAME);

            if (connectorNameList != null && !connectorNameList.isEmpty()) {
                for (String provider : request.getSigningOptions()) {
                    List<Map<String, String>> connectorList = new ArrayList<>();

                    for (ConnectorName connectorNameItem : connectorNameList) {
                        if (connectorNameItem.getProvider().equals(provider)) {
                            Map<String, String> map = new HashMap<>();
                            map.put("connectorName", connectorNameItem.getConnectorName());
                            map.put("logo", connectorNameItem.getLogo());
                            map.put("remark", connectorNameItem.getRemark());
                            map.put("provider", provider);
                            if (connectorNameItem.getProvider().equals("USB_TOKEN_SIGNING")) {

                                String jsonInput = connectorNameItem.getIdentifier(); // Assuming this is your JSON
                                // string

                                try {
                                    ObjectMapper objectMapper = new ObjectMapper();
                                    JsonNode rootNode = objectMapper.readTree(jsonInput);

                                    JsonNode attributesNode = rootNode.path("attributes");
                                    if (attributesNode.isArray()) {
                                        for (JsonNode attributeNode : attributesNode) {
                                            String identifierValue = attributeNode.path("value").toString();
                                            map.put("identifier", identifierValue);
                                        }
                                    }
                                } catch (Exception e) {
                                    e.printStackTrace(); // Handle exception according to your needs
                                }
                            }
                            connectorList.add(map);
                        }
                    }

                    responseList.put(provider, connectorList);
                }
            }

            if (request.getSigningOptions().contains("ELECTRONIC_ID")) {
                List<CountryName> countryNameList = LoadParamSystem
                        .getCountryNameList(Difinitions.CONFIG_LOAD_PARAM_COUNTRY);
                if (countryNameList != null && !countryNameList.isEmpty()) {
                    List<Map<String, String>> connectorList = new ArrayList<>();

                    for (CountryName countryNameItem : countryNameList) {
                        Map<String, String> map = new HashMap<>();
                        map.put("connectorName", "MOBILE_ID_IDENTITY");
                        map.put("logo", countryNameItem.getMetadata());
                        map.put("remark", countryNameItem.getRemarkEn());
                        map.put("provider", "ELECTRONIC_ID");
                        connectorList.add(map);
                    }

                    responseList.put("ELECTRONIC_ID", connectorList);
                }
            }

            return new ResponseEntity<>(responseList, HttpStatus.OK);
        } catch (Exception e) {
            // LOGGER.error("Error in getConnecterProvider", e112);
            return new ResponseEntity<>("An error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = {"/getPrefixList"})
    public ResponseEntity<?> getPrefixList(@RequestBody ApiDtoRequest request) throws Exception {
        System.out.println("getPrefixList");
        String lang = request.getLanguage();

        List<Prefix> prefixList = new ArrayList<>();
        connect.USP_GW_PREFIX_PERSONAL_CODE_LIST(prefixList, null, lang);

        return new ResponseEntity<>(prefixList, HttpStatus.OK);

    }

    @GetMapping("/signing/{signingToken}/download")
    public ResponseEntity<?> download(@PathVariable String signingToken) throws Exception {

        LastFile lastFile = new LastFile();
        connect.USP_GW_PPL_WORKFLOW_GET_LAST_FILE(lastFile, signingToken);

        if (lastFile.getLastPplFileName() == null || lastFile.getLastPplFileName().isEmpty()) {
            return new ResponseEntity<>("File not found", HttpStatus.NOT_FOUND);
        }
        String fileName = lastFile.getLastPplFileName().replace(".pdf", "_signed.pdf");
//        System.out.println("fileName: " + fileName);

        InputStream response = fpsService.getImagePdf(lastFile.getDocumentId());
        if (response != null) {
            // trả về stream input file để download kèm header content type và content
            // length để browser hiểu
            HttpHeaders headers = new HttpHeaders();
            // headers.add("Content-Disposition", "attachment; filename=" + "file.pdf");
            String encodedFileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8.toString())
                    .replace("+", "%20");
            headers.add("Content-Disposition", "attachment; filename=" + encodedFileName);
            // headers.add("Content-Disposition", "attachment; filename=" + fileName +
            // ".pdf");
            // jrbFile.getFileName());
            InputStreamResource inputStreamResource = new InputStreamResource(response);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .headers(headers)
                    .body(inputStreamResource);
        } else {
            // trả về lỗi không tìm thấy file để download
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");
        }
    }

    @RequestMapping(value = {"/download/checkid"}, method = RequestMethod.GET)
    public ResponseEntity<Resource> downloadCheckId() throws IOException {
        // Đọc file checkid.exe từ thư mục tài nguyên tĩnh
        Resource resource = new ClassPathResource("static/checkid_client_installer.exe");
        // Resource resource = new UrlResource("static/checkid.zip");
        // Trả về file dưới dạng response để người dùng tải về
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"checkid_client_installer.exe\"")
                .body(resource);
    }

    @PostMapping("/getFromQR")
    public String getView(@RequestBody Map<String, String> request) throws Exception {
        System.out.println("qr: " + request.get("qr"));
        System.out.println("res: " + connect.USP_GW_PPL_WORKFLOW_GET_FROM_QR_TOKEN(request.get("qr")));
        return connect.USP_GW_PPL_WORKFLOW_GET_FROM_QR_TOKEN(request.get("qr"));
    }

    @PostMapping("/approve")
    public ResponseEntity<?> getView(@RequestBody ApproveRequest request) throws Exception {
        Participants participant = new Participants();
        connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_GET(participant, request.getSignerToken());
        String signerName = participant.getLastName() + " " + participant.getFirstName();
        LastFile lastFile = new LastFile();

        connect.USP_GW_PPL_WORKFLOW_GET_LAST_FILE(lastFile, request.getSigningToken());

        if (!request.getComment().isEmpty()) {
            connect.USP_GW_PPL_WORKFLOW_COMMENT_ADD(lastFile.getPplWorkflowId(), participant.getId(), request.getComment(), request.getRecipientID(), request.getHmac(), signerName);
        }


        int updateStatus = participant.getSignerType() == 2 ? Difinitions.CONFIG_WORKFLOW_PARTICIPANTS_REVIEWER_STATUS_ID_VIEWED : Difinitions.CONFIG_WORKFLOW_PARTICIPANTS_EDITORER_STATUS_ID_EDITED;
        connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_UPDATE_STATUS(request.getSignerToken(),
                updateStatus, "", 0);

        byte[] data = fpsService.getByteImagePdf(lastFile.getDocumentId());

        checkAndSendMailService.checkAndSendMail(lastFile.getWorkflowProcessType(), request.getSignerToken(), request.getSigningToken(), signerName, participant.getEmail(), lastFile.getLastPplFileName(), lastFile.getDeadlineAt(), data);

        return new ResponseEntity<>("workFlowCommentId", HttpStatus.OK);
    }

    @PostMapping("/shareToSign")
    public ResponseEntity<?> shareToSign(@RequestBody ShareToSignRequest request) throws Exception {
        System.out.println("request: " + request.getSigningToken());
        System.out.println("request: " + request.getFileName());
        LastFile lastFile = new LastFile();
        connect.USP_GW_PPL_WORKFLOW_GET_LAST_FILE(lastFile, request.getSigningToken());
        byte[] data = fpsService.getByteImagePdf(request.getDocumentId());
        int result = checkAndSendMailService.shareToSign(lastFile.getDeadlineAt(), request.getWorkFlowProcessType(), request.getSigningToken(), request.getSignerName(), request.getParticipant().getEmail(), request.getFileName(), request.getParticipant(), data);
        if(result == 0){
            connect.USP_GW_PPL_WORKFLOW_UPDATE_STATUS(request.getSigningToken(),2,"Gateway view");
            return new ResponseEntity<>("Success", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("Fail", HttpStatus.BAD_REQUEST);
        }

    }

    @PostMapping("/checkPerMission")
    public ResponseEntity<?> checkPerMission(@RequestBody Map<String, String> request) throws Exception {
        System.out.println("signerToken: " + request.get("signerToken"));
        int response = connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_CHECK_PERMISSION(request.get("signerToken"));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/getCertDetail")
    public ResponseEntity<?> getCertDetail(@RequestBody Map<String, String> request) throws Exception {
//        System.out.println("cert: " + request.get("cert").length());
        String certificate = request.get("cert");

        String pemData = "-----BEGIN CERTIFICATE-----\n" + certificate + "-----END CERTIFICATE-----";
        CertificateFactory certFactory = CertificateFactory.getInstance("X.509");
        X509Certificate cert = (X509Certificate) certFactory.generateCertificate(
                new java.io.ByteArrayInputStream(pemData.getBytes())
        );

        BigInteger bi = new BigInteger(cert.getSerialNumber().toString());
        System.out.println("SN: " + bi.toString(16));
        PublicKey publicKey = cert.getPublicKey();

        // Convert the public key to a byte array
//        byte[] publicKeyBytes = publicKey.getEncoded();

// Convert the byte array to a hexadecimal string
//        String publicKeyHex = DatatypeConverter.printHexBinary(publicKeyBytes);

//        sComponent[0] = "0";
        String version = "V" + cert.getVersion();
        String serialNumber = bi.toString(16);
        String sigAlgName = cert.getSigAlgName();
        String algorithm = publicKey.getAlgorithm();
        String issuerDN = cert.getIssuerDN().toString();
        String validFrom = cert.getNotBefore().toString();
        String validTo = cert.getNotAfter().toString();
        String subjectDN = cert.getSubjectDN().toString();
        String authorityInformationAccess = GetFeatureCertificate2.getAccessLocation(cert);
        String keyUsage = GenFeatureCertificate.getKeyUsage(pemData);
        String enhancedKeyUsage = cert.getExtendedKeyUsage() == null ? "" : cert.getExtendedKeyUsage().toString();
        String subjectKeyIdentifier = GetFeatureCertificate2.getSubjectKeyID(cert);
        String authorityKeyIdentifier = GetFeatureCertificate2.getAuthorityKeyIdentifier(cert);
        String certificatePolicies = GetFeatureCertificate2.getCertificatePolicyId(cert, 0, 0);
        List<String> sCRL = getCRLDistributionPoints(cert);
        String crlDistributionPoints = sCRL.toString();
        String basicConstraints = GetFeatureCertificate2.getSubjectType(cert);
        String subjectAlternativeName = cert.getSubjectAlternativeNames() == null ? "" : cert.getSubjectAlternativeNames().toString();
//            String thumbprintAlgorithm = confWs.GetPropertybyCode(Definitions.CONFIG_REPORT_NEAC_THUMBPRINT_ALGORITHM_API);
//        sComponent[13] = "SHA-1";
        String thumbprint = GetFeatureCertificate2.getThumprintCert(cert, "SHA-1");
        String publicKeyHex = javax.xml.bind.DatatypeConverter.printHexBinary(publicKey.getEncoded());

        Map<String, Object> response = new HashMap<>();
        response.put("version", version);
        response.put("serialNumber", serialNumber);
        response.put("sigAlgName", sigAlgName);
        response.put("algorithm", algorithm);
        response.put("issuerDN", issuerDN);
        response.put("validFrom", validFrom);
        response.put("validTo", validTo);
        response.put("subjectDN", subjectDN);
        response.put("publicKey", publicKey.toString());
        response.put("authorityInformationAccess", authorityInformationAccess);
        response.put("keyUsage", keyUsage);
        response.put("enhancedKeyUsage", enhancedKeyUsage);
        response.put("subjectKeyIdentifier", subjectKeyIdentifier);
        response.put("authorityKeyIdentifier", authorityKeyIdentifier);
        response.put("certificatePolicies", certificatePolicies);
        response.put("crlDistributionPoints", crlDistributionPoints);
        response.put("basicConstraints", basicConstraints);
        response.put("subjectAlternativeName", subjectAlternativeName);
        response.put("thumbprint", thumbprint);
        response.put("publicKeyHex", publicKeyHex);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
