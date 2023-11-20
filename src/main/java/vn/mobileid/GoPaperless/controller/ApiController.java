package vn.mobileid.GoPaperless.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.mobileid.GoPaperless.dto.apiDto.ApiDtoRequest;
import vn.mobileid.GoPaperless.dto.apiDto.SigningWorkflowDto;
import vn.mobileid.GoPaperless.model.apiModel.*;
import vn.mobileid.GoPaperless.process.ProcessDb;
import vn.mobileid.GoPaperless.service.FpsService;
import vn.mobileid.GoPaperless.utils.CommonFunction;
import vn.mobileid.GoPaperless.utils.Difinitions;
import vn.mobileid.GoPaperless.utils.LoadParamSystem;

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
        if (participants.getVisibleHeaderFooter() == 1) {
            List<Enterprise> enterprises = LoadParamSystem.getParamEnterpriseStart(Difinitions.CONFIG_LOAD_PARAM_ENTERPRISE);

            if (enterprises.size() > 0) {
                for (Enterprise enterprise : enterprises) {
                    if (enterprise.getId() == participants.getEnterpriseId()) {
                        map.put("loGo", enterprise.getLogo());
                        map.put("metadataGatewayView", enterprise.getMetadataGatewayView());
                    }
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
        List<Enterprise> enterprises = LoadParamSystem.getParamEnterpriseStart(Difinitions.CONFIG_LOAD_PARAM_ENTERPRISE);

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

            String base64 = fpsService.getBase64ImagePdf(lastFile.getDocumentId());
            signingWorkflowDto.setPdfBase64(base64);
        } catch (Exception e) {
            System.out.println("getLastFile: " + e.getMessage());
            throw new Exception(e.getMessage());
        }

        if (participants.size() > 0) {
            for (Participants participant : participants) {
                if(CommonFunction.isNotNullOrEmpty(participant.getCertificate())){
                    String sIssue = "";
                    String sOwner = "";
                    String sFrom = "";
                    String sTo = "";
                    String sCertificate = CommonFunction.CheckTextNull(participant.getCertificate());

                    ObjectMapper oMapperParse = new ObjectMapper();
                    CertificateJson itemParse = oMapperParse.readValue(sCertificate, CertificateJson.class);

                    if (itemParse != null) {
                        sIssue = CommonFunction.CheckTextNull(itemParse.signer_info.certificate.issuer);
                        sOwner = CommonFunction.CheckTextNull(itemParse.signer_info.certificate.subject);
                        sFrom = itemParse.signer_info.certificate.valid_from;
                        sTo = itemParse.signer_info.certificate.valid_to;
                    }
                    if (!"".equals(sIssue)) {
                        sIssue = CommonFunction.getCommonNameInDN(sIssue);
                    }
                    if (!"".equals(sOwner)) {
                        sOwner = CommonFunction.getCommonNameInDN(sOwner);
                    }
                    participant.setIssuer(sIssue);
                    participant.setOwner(sOwner);
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
}
