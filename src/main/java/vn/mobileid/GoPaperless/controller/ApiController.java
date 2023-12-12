package vn.mobileid.GoPaperless.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Autowired;
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
import vn.mobileid.GoPaperless.dto.rsspDto.RsspRequest;
import vn.mobileid.GoPaperless.model.apiModel.*;
import vn.mobileid.GoPaperless.process.ProcessDb;
import vn.mobileid.GoPaperless.service.FpsService;
import vn.mobileid.GoPaperless.utils.CommonFunction;
import vn.mobileid.GoPaperless.utils.Difinitions;
import vn.mobileid.GoPaperless.utils.LoadParamSystem;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/uiApi")
public class ApiController {

    private final ProcessDb connect;
    private final FpsService fpsService;

    public ApiController(ProcessDb connect, FpsService fpsService) {
        this.connect = connect;
        this.fpsService = fpsService;
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
//        if (participants.getVisibleHeaderFooter() == 1) {
//            List<Enterprise> enterprises = LoadParamSystem.getEnterpriseStart(Difinitions.CONFIG_LOAD_PARAM_ENTERPRISE);
//
//            if (enterprises.size() > 0) {
//                for (Enterprise enterprise : enterprises) {
//                    if (enterprise.getId() == participants.getEnterpriseId()) {
//                        map.put("loGo", enterprise.getLogo());
//                        map.put("metadataGatewayView", enterprise.getMetadataGatewayView());
//                        map.put("name", enterprise.getName());
//                        map.put("notificationEmail", enterprise.getNotificationEmail());
//                    }
//                }
//            }
//        }
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
            if(lastFile.getDeadlineAt() != null){
                signingWorkflowDto.setDeadlineAt(CommonFunction.convertToGetTimeZone(lastFile.getDeadlineAt()));
            }
//            signingWorkflowDto.setDeadlineAt(CommonFunction.convertToGetTimeZone(lastFile.getDeadlineAt()));

            System.out.println("get connect xong: " );
            String base64 = fpsService.getBase64ImagePdf(lastFile.getDocumentId());
            signingWorkflowDto.setPdfBase64(base64);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("getLastFile: " + e.getMessage());
            throw new Exception(e.getMessage());
        }

        if (participants.size() > 0) {
            for (Participants participant : participants) {
                if (CommonFunction.isNotNullOrEmpty(participant.getCertificate())) {
                    String sIssue = "";
                    String sOwner = "";
                    String sFrom = "";
                    String sTo = "";
                    String sCertificate = CommonFunction.CheckTextNull(participant.getCertificate());
                    System.out.println("signed time: " + participant.getSignedTime());
                    participant.setSignedTime(CommonFunction.convertToGetTimeZone(participant.getSignedTime()));

                    ObjectMapper oMapperParse = new ObjectMapper();
                    CertificateJson itemParse = oMapperParse.readValue(sCertificate, CertificateJson.class);

                    if (itemParse != null) {
                        if(itemParse.signer_info != null){
                            System.out.println("trên");
                            sIssue = CommonFunction.CheckTextNull(itemParse.signer_info.certificate.issuer);
                            sOwner = CommonFunction.CheckTextNull(itemParse.signer_info.certificate.subject);
                            sFrom = itemParse.signer_info.certificate.valid_from;
                            sTo = itemParse.signer_info.certificate.valid_to;
                        } else {
                            System.out.println("duoi");
                            sIssue = CommonFunction.CheckTextNull(itemParse.signer_info_dto.certificate.issuer);
                            sOwner = CommonFunction.CheckTextNull(itemParse.signer_info_dto.certificate.subject);
                            sFrom = itemParse.signer_info_dto.certificate.valid_from;
                            sTo = itemParse.signer_info_dto.certificate.valid_to;
                        }
                    }
                    if (!"".equals(sIssue)) {
                        sIssue = CommonFunction.getCommonNameInDN(sIssue);
                    }
                    if (!"".equals(sOwner)) {
                        sOwner = CommonFunction.getCommonNameInDN(sOwner);
                    }
                    participant.setIssuer(sIssue);
                    participant.setOwner(sOwner);
                    System.out.println("sFrom: " + sFrom);
                    System.out.println("sTo: " + sTo);
                    participant.setValidFrom(sFrom);
                    participant.setValidTo(sTo);
                }
            }
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
        connect.USP_GW_PPL_FILE_DETAIL_GET_SIGNATURE(request.getFileId(), listPplFileDetail);

        return new ResponseEntity<>(listPplFileDetail, HttpStatus.OK);
    }

    @PostMapping("/getConnecterProvider")
    public ResponseEntity<?> getConnecterProvider(@RequestBody ApiDtoRequest request) throws Exception {
        System.out.println("getConnecterProvider");
        System.out.println("request: " + request.getSigningOptions());
        try {
            Map<String, List<Map<String, String>>> responseList = new HashMap<>();
            List<ConnectorName> connectorNameList = LoadParamSystem.getConnectorStart(Difinitions.CONFIG_LOAD_PARAM_CONNECTOR_NAME);

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

                                String jsonInput = connectorNameItem.getIdentifier(); // Assuming this is your JSON string

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
                List<CountryName> countryNameList = LoadParamSystem.getCountryNameList(Difinitions.CONFIG_LOAD_PARAM_COUNTRY);
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
//            LOGGER.error("Error in getConnecterProvider", e112);
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

        if(lastFile.getLastPplFileName() == null || lastFile.getLastPplFileName().isEmpty()){
            return new ResponseEntity<>("File not found", HttpStatus.NOT_FOUND);
        }
        String fileName = lastFile.getLastPplFileName().replace(".pdf", "");

        InputStream response = fpsService.getImagePdf(lastFile.getDocumentId());
        if (response != null) {
            // trả về stream input file để download kèm header content type và content
            // length để browser hiểu
            HttpHeaders headers = new HttpHeaders();
//                headers.add("Content-Disposition", "attachment; filename=" + "file.pdf");
            headers.add("Content-Disposition", "attachment; filename=" + fileName + ".pdf");
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
//        Resource resource = new UrlResource("static/checkid.zip");
        // Trả về file dưới dạng response để người dùng tải về
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"checkid_client_installer.exe\"")
                .body(resource);
    }

}
