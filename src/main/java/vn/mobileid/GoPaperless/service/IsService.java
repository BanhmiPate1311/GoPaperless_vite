package vn.mobileid.GoPaperless.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import vn.mobileid.GoPaperless.dto.rsspDto.RsspRequest;
import vn.mobileid.GoPaperless.model.apiModel.Participants;
import vn.mobileid.GoPaperless.model.apiModel.WorkFlowList;
import vn.mobileid.GoPaperless.model.fpsModel.FpsSignRequest;
import vn.mobileid.GoPaperless.model.fpsModel.HashFileRequest;
import vn.mobileid.GoPaperless.process.ProcessDb;
import vn.mobileid.GoPaperless.utils.CommonFunction;
import vn.mobileid.GoPaperless.utils.Difinitions;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Service
public class IsService {

    private final ProcessDb connect;
    private final FpsService fpsService;
    private final PostBack postBack;

    public IsService(ProcessDb connect, FpsService fpsService, PostBack postBack) {
        this.connect = connect;
        this.fpsService = fpsService;
        this.postBack = postBack;
    }

    public Map<String, String> getHash(RsspRequest data) throws Exception {
        System.out.println("getHash");
        String sResult = "";

        String fieldName = data.getFieldName();
        String signerToken = data.getSignerToken();
        String connectorName = data.getConnectorName();
        int documentId = data.getDocumentId();
        String certChain = data.getUsbCertChain();
        String signingToken = data.getSigningToken();
        String signerId = data.getSignerId();
        String signingPurpose = data.getSigningPurpose();
        String country = !Objects.equals(data.getCountry(), "") ? data.getCountry() : data.getCountryRealtime();
        String imageBase64 = data.getImageBase64();

        try {
            Participants rsParticipant = new Participants();
            connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_GET(rsParticipant, signerToken);
            if (rsParticipant == null || rsParticipant.getSignerStatus() != Difinitions.CONFIG_WORKFLOW_PARTICIPANTS_SIGNER_STATUS_ID_PENDING) {
                sResult = "Signer Status invalid";// trạng thái không hợp lệ
                throw new Exception(sResult);
            }

            List<String> listCertChain = new ArrayList<>();
            listCertChain.add(certChain);

            HashFileRequest hashFileRequest = new HashFileRequest();

            hashFileRequest.setCertificateChain(listCertChain);
            hashFileRequest.setSigningReason(signingPurpose);
            hashFileRequest.setSignatureAlgorithm("RSA");
            hashFileRequest.setSignedHash("SHA256");
            hashFileRequest.setSigningLocation(country);
            hashFileRequest.setFieldName(fieldName);
            hashFileRequest.setHandSignatureImage(imageBase64);

            String hashList = fpsService.hashSignatureField(documentId, hashFileRequest);
            System.out.println("hash file xong:");
            // convert base64 to hex

//        byte[] decoded = Base64.decodeBase64(hashList);
//        String hash = Hex.encodeHexString(decoded);
            byte[] decodedBytes = Base64.getDecoder().decode(hashList);
            String hash = CommonFunction.bytesToHex(decodedBytes);

            Map<String, String> response = new HashMap<>();
            response.put("hashPG", hash);
            response.put("hash", hashList);

            return response;
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception(e.getMessage());
        }
    }

    public String packFile(RsspRequest data, HttpServletRequest request) throws Exception {
        System.out.println("packFile");
        try {
            String signingToken = data.getSigningToken();
            String signerToken = data.getSignerToken();
            String hashList = data.getHashList();
            String certChain = data.getUsbCertChain();
            String signerId = data.getSignerId();
            List<String> signatures = data.getSignatures();
            int documentId = data.getDocumentId();
            String fileName = data.getFileName();
            int lastFileId = data.getLastFileId();
            String codeNumber = data.getCodeNumber();
            String signingOption = data.getSigningOption();
            int enterpriseId = data.getEnterpriseId();
            String sResult = "";

            WorkFlowList rsWFList = new WorkFlowList();
            connect.USP_GW_PPL_WORKFLOW_GET(rsWFList, signingToken);

            if (rsWFList == null || rsWFList.getWorkFlowStatus() != Difinitions.CONFIG_PPL_WORKFLOW_STATUS_PENDING) {
                return sResult = "Signer Status invalid";// trạng thái không hợp lệ

            }

            Participants rsParticipant = new Participants();
            connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_GET(rsParticipant, signerToken);
            if (rsParticipant == null || rsParticipant.getSignerStatus() != Difinitions.CONFIG_WORKFLOW_PARTICIPANTS_SIGNER_STATUS_ID_PENDING) {
                return sResult = "The document has already been signed";
            }

            String pDMS_PROPERTY = CommonFunction.getPropertiesFMS();

            String sSignature_id = data.getUsbCertId();
            System.out.println("sSignature_id: " + sSignature_id);
            String signature = signatures.get(0);

            List<String> listCertChain = new ArrayList<>();
            listCertChain.add(certChain);
            FpsSignRequest fpsSignRequest = new FpsSignRequest();
            fpsSignRequest.setFieldName(!data.getFieldName().isEmpty() ? data.getFieldName() : signerId);
            fpsSignRequest.setHashValue(hashList);
            fpsSignRequest.setSignatureValue(signature);

            fpsSignRequest.setCertificateChain(listCertChain);

            String responseSign = fpsService.signDocument(documentId, fpsSignRequest);

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode signNode = objectMapper.readTree(responseSign);
            String uuid = signNode.get("uuid").asText();
            int fileSize = signNode.get("file_size").asInt();
            String digest = signNode.get("digest").asText();
            String signedHash = signNode.get("signed_hash").asText();
            String signedTime = signNode.get("signed_time").asText();

//            String sSignature_id = gatewayService.getSignatureId(uuid, fileName);
//            String sSignature_id = requestID; // temporary

            int isSetPosition = 1;
            postBack.postBack2(isSetPosition, signerId, fileName, signingToken, pDMS_PROPERTY, sSignature_id, signerToken, signedTime, rsWFList, lastFileId, certChain, codeNumber, signingOption, uuid, fileSize, enterpriseId, digest, signedHash, signature, request);
            return responseSign;

        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception(e.getMessage());
        }

    }
}
