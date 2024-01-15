package vn.mobileid.GoPaperless.service;

import org.apache.commons.io.FilenameUtils;
import org.springframework.stereotype.Service;
import vn.mobileid.GoPaperless.model.apiModel.WorkFlowList;
import vn.mobileid.GoPaperless.process.ProcessDb;
import vn.mobileid.GoPaperless.utils.CommonFunction;
import vn.mobileid.GoPaperless.utils.Difinitions;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

@Service
public class PostBack {
    private final ProcessDb connect;

    public PostBack(ProcessDb connect) {
        this.connect = connect;
    }

    public void postBack2(
            String dataResponse,
            String signedType,
            int isSetPosition,
            String signerId,
            String fileName,
            String signingToken,
            String pDMS_PROPERTY,
            String signatureId,
            String signerToken,
            String signedTime,
            WorkFlowList rsWFList,
            int sFileID_Last,
            String certEncode,
            String serialNumber,
            String signingOption,
            String uuid,
            int fileSize,
            int enterpriseId,
            String digest,
            String signedHash,
            String pSIGNATURE_VALUE,
            HttpServletRequest request
    ) throws Exception {
        String pLAST_MODIFIED_BY = "CoreGateway";
        String fileName1 = fileName.replace(".pdf", "");

//        String fileName_Signed = fileName1 + "_" + CommonFunction.generateNumberDays() + "_signed"
//                + ".pdf";
//        System.out.println("fileName_Signed: " + fileName_Signed);
        Path path = new File(fileName).toPath();
        String mimeType = Files.probeContentType(path);

//        String sBase64 = "";
//        try {
//            sBase64 = Base64.getEncoder().encodeToString(pdfSigned);
////            sBase64 = DatatypeConverter.printBase64Binary(pdfSigned);
//        } catch (Exception e) {
//            System.out.println(e.getMessage());
//        }
//        String fileDigest = Hex.encodeHexString(
//                CommonFunction.hashData(pdfSigned, CommonFunction.HASH_SHA256));

        UUID uuid1 = UUID.randomUUID();
        String uploadToken = CommonFunction.getCryptoHash(uuid1.toString());
        String fileType = FilenameUtils.getExtension(fileName);
        String pHMAC = "";
        String pCREATED_BY = "";
        String pURL = "";
        String SIGNATURE_TYPE = "aes";
        int[] pFILE_ID = new int[1];


        String sInsertFile = connect.USP_GW_PPL_FILE_ADD(enterpriseId, fileName, fileSize,
                Difinitions.CONFIG_PPL_FILE_STATUS_PENDING,
                pURL, fileType, mimeType, digest, "", "", pDMS_PROPERTY, uploadToken,
                pHMAC, pCREATED_BY, pFILE_ID);
        if ("1".equals(sInsertFile)) {
            // test
//            sFileID_Last = pFILE_ID[0];
            String sAction = "signer_signed";
            String sSigner = CommonFunction.CheckTextNull(signerId);
            String sStatus = "ok";
            String sFileSigner = "";
            String sFileComplete = "";
            String sCountryCode = "vn";
            // String pSIGNED_TIME = "";
//                String pSIGNED_ALGORITHM = "";
//                                    String[] sResultConnector = new String[2];
//                                    String pIdentierConnector = connectDB.getIdentierConnector(connectorName, sResultConnector);
//                                    String prefixCode = sResultConnector[1];
//                                    long millis = System.currentTimeMillis();
//                                    String sSignatureHash = signerToken + millis;
            String sSignature_id = signatureId;
//                try {
////                                        byte[] byteSigned = IOUtils.toByteArray(new FileInputStream(sFileSigned));
//                    List<VerifyResult> vrf = PdfProfile.verify(pdfSigned, false);
//                    for (VerifyResult veryfy : vrf) {
//                        //pSIGNED_TIME = veryfy.getSigningTimes();
//                        pSIGNED_ALGORITHM = veryfy.getAlgorithm();
//                        //System.out.println("Time Signed: " + pSIGNED_TIME);
//                        System.out.println("ALGORITHM Signed: " + pSIGNED_ALGORITHM);
//                    }
//                } catch (Exception e) {
//                    System.out.println(e.getMessage());
//                }

            // update file signed
            String sUpdateFile = connect.USP_GW_PPL_FILE_UPDATE(pFILE_ID[0],
                    Difinitions.CONFIG_PPL_FILE_STATUS_UPLOADED,
                    "", "", "", "", "", "", "", uuid, pDMS_PROPERTY, "", pLAST_MODIFIED_BY);
            connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_UPDATE_STATUS(signerToken,
                    Difinitions.CONFIG_WORKFLOW_PARTICIPANTS_SIGNER_STATUS_ID_SIGNED, "", isSetPosition);
            int pPPL_WORKFLOW_ID = rsWFList.getId();// sStatusWFCheck[0];
            String result = connect.USP_GW_PPL_WORKFLOW_FILE_ADD(pPPL_WORKFLOW_ID, pFILE_ID[0], Difinitions.CONFIG_WORKFLOW_FILE_SIGNED_FILE, "", sFileID_Last, "", "");
            System.out.println("result: " + result);
            System.out.println("signedTime: " + signedTime);
//            SimpleDateFormat inputFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
//            SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            try {
//                Date date = inputFormat.parse(signedTime);
//                String sDateSign = outputFormat.format(date);
//                String TimePostback = CommonFunction.convertTimeSentPostBack(signedTime);
                String sDateSign = CommonFunction.convertTimeToUpDb(signedTime);
                System.out.println("sDateSign: " + sDateSign);
                // call again to get the latest status
                rsWFList = new WorkFlowList();
                connect.USP_GW_PPL_WORKFLOW_GET(rsWFList, signingToken);
                // khởi tạo request
                String protocol = request.getHeader("X-Forwarded-Proto");
                if (protocol == null) {
                    protocol = request.getScheme(); // fallback to default scheme
                }

                sFileSigner = protocol + "://" + request.getHeader("host") + "/view/uiApi/signing/"
                        + signingToken + "/download/" + sSigner;
                String sJsonCertResult = CommonFunction.JsonCertificateObject(certEncode, serialNumber, sDateSign, signingOption, sAction, signingToken,
                        sSigner, sStatus, sFileSigner, digest, sSignature_id, sCountryCode);
                if (!"".equals(rsWFList.getPostBackUrl()) && rsWFList.getPostBackUrl() != null) {
                    CommonFunction.PostBackJsonCertificateObject(rsWFList.getPostBackUrl(), certEncode, serialNumber, signedTime, signingOption, sAction, signingToken,
                            sSigner, sStatus, sFileSigner, digest, sSignature_id, sCountryCode);

                }
//                String signedType = "NORMAL";
                connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_UPDATE(signerToken,
                        signedType, sDateSign, sSignature_id, signedHash, dataResponse, SIGNATURE_TYPE, signingOption, sDateSign, pSIGNATURE_VALUE, pFILE_ID[0], pLAST_MODIFIED_BY);
                if (rsWFList != null) {
                    if (rsWFList.getWorkFlowStatus() != Difinitions.CONFIG_PPL_WORKFLOW_STATUS_PENDING) {
                        connect.USP_GW_PPL_WORKFLOW_UPDATE_STATUS(signingToken, Difinitions.CONFIG_PPL_WORKFLOW_STATUS_COMPLETED, "");
                        if (!"".equals(rsWFList.getPostBackUrl())) {
                            sAction = "signing_completed";
//                                log.info(
//                                        "link download : " + protocol + "://"
//                                                + request.getHeader("host") + "/api/signing/"
//                                                + signingToken
//                                                + "/download/");
                            sFileComplete = protocol + "://" + request.getHeader("host") + "/view/uiApi/signing/"
                                    + signingToken + "/download/";
                            CommonFunction.PostBackJsonObject(rsWFList.getPostBackUrl(), certEncode,
                                    serialNumber, signingOption, sAction, signingToken, sSigner, sStatus, sFileComplete, sCountryCode, digest);

                        }
                    }
                }

            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
    }
}
