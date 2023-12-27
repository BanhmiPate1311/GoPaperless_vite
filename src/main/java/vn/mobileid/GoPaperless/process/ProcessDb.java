package vn.mobileid.GoPaperless.process;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import vn.mobileid.GoPaperless.dto.apiDto.Constants;
import vn.mobileid.GoPaperless.dto.apiDto.SignatureValidation;
import vn.mobileid.GoPaperless.model.apiModel.*;
import vn.mobileid.GoPaperless.utils.CommonFunction;
import vn.mobileid.GoPaperless.utils.Difinitions;
import vn.mobileid.GoPaperless.utils.LoadParamSystem;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

@Component
public class ProcessDb {
    @Value("${db.driver.sql}")
    private String driver_sql;

    @Value("${db.url.sql}")
    private String url_sql;

    @Value("${db.username.sql}")
    private String username_sql;

    @Value("${db.password.sql}")
    private String password_sql;

    @Value("${db.connect.timeout}")
    private String connect_timeout;

    public Connection OpenDatabase() throws Exception {
        String Driver_Sql = driver_sql;
        String Url_Sql = url_sql;
        String Username_SQL = username_sql;
        String Password_SQL = password_sql;
        String DBConnect_Timeout = connect_timeout;
        Class.forName(Driver_Sql);
        DriverManager.setLoginTimeout(Integer.parseInt(DBConnect_Timeout));
        return DriverManager.getConnection(Url_Sql, Username_SQL, Password_SQL);
    }

    public void CloseDatabase(Connection[] temp) throws Exception {
        if (temp[0] != null) {
            temp[0].close();
        }
    }

    public void USP_GW_PPL_WORKFLOW_GET(WorkFlowList response, String pSIGNING_TOKEN) throws Exception {
        CallableStatement proc_stmt = null;
        Connection conns = null;
        ResultSet rs = null;
//        String convrtr = "0";

        try {
            conns = OpenDatabase();
            proc_stmt = conns.prepareCall("{ call USP_GW_PPL_WORKFLOW_GET(?,?) }");
            if (!"".equals(pSIGNING_TOKEN)) {
                proc_stmt.setString("pSIGNING_TOKEN", pSIGNING_TOKEN);
            } else {
                proc_stmt.setString("pSIGNING_TOKEN", null);
            }
            proc_stmt.registerOutParameter("pRESPONSE_CODE", java.sql.Types.NVARCHAR);
            proc_stmt.execute();
//            convrtr = proc_stmt.getString("pRESPONSE_CODE");
            proc_stmt.getString("pRESPONSE_CODE");

//            System.out.println("USP_PPL_WORKFLOW_GET: " + proc_stmt.toString());
            rs = proc_stmt.executeQuery();
            while (rs.next()) {
                response.setId(rs.getInt("ID"));
                response.setPostBackUrl(CommonFunction.CheckTextNull(rs.getString("POSTBACK_URL")));
                response.setWorkFlowStatus(rs.getInt("WORKFLOW_STATUS"));
                response.setEnterpriseId(rs.getInt("ENTERPRISE_ID"));
                response.setDocumentId(rs.getInt("DOCUMENT_ID"));
                response.setWorkFlowDocumentName(rs.getString("WORKFLOW_DOCUMENT_NAME"));
                response.setWorkFlowDocumentFormat(rs.getString("WORKFLOW_DOCUMENT_FORMAT"));
                response.setVisibleHeaderFooter(rs.getInt("VISIBLE_HEADER_FOOTER"));

            }
        } catch (Exception e) {
            System.out.println("USP_GW_PPL_WORKFLOW_GET: " + e.getMessage());
        } finally {
            if (rs != null) {
                rs.close();
            }
            if (proc_stmt != null) {
                proc_stmt.close();
            }
            Connection[] temp_connection = new Connection[]{conns};
            CloseDatabase(temp_connection);
        }
    }


    public void USP_GW_PPL_WORKFLOW_GET_FIRST_FILE(FirstFile response, String pSIGNING_TOKEN) throws Exception {
        CallableStatement proc_stmt = null;
        Connection conns = null;
        ResultSet rs = null;
        ArrayList<FirstFile> tempList = new ArrayList<>();
//        String convrtr = "0";
        try {
            conns = OpenDatabase();
            proc_stmt = conns.prepareCall("{ call USP_GW_PPL_WORKFLOW_GET_FIRST_FILE(?,?) }");
            proc_stmt.setString("pSIGNING_TOKEN", pSIGNING_TOKEN);

            proc_stmt.registerOutParameter("pRESPONSE_CODE", java.sql.Types.NVARCHAR);
            proc_stmt.execute();
            proc_stmt.getString("pRESPONSE_CODE");
//            convrtr = proc_stmt.getString("pRESPONSE_CODE");

//            System.out.println("USP_PPL_WORKFLOW_GET_FIRST_FILE: " + proc_stmt.toString());
            rs = proc_stmt.executeQuery();
            while (rs.next()) {

                response.setId(rs.getInt("PPL_FILE_ID"));
                response.setFileId(rs.getInt("PPL_FILE_ID"));
                response.setFileName(rs.getString("FIRST_PPL_FILE_NAME"));
                response.setFileUuid(rs.getString("FIRST_PPL_FILE_UUID"));
                response.setUploadToken(rs.getString("UPLOAD_TOKEN"));
                response.setEnterpriseId(rs.getInt("ENTERPRISE_ID"));
                response.setWorkflowDocumentName(rs.getString("WORKFLOW_DOCUMENT_NAME"));
                response.setWorkflowDocumentFormat(rs.getString("WORKFLOW_DOCUMENT_FORMAT"));
                response.setWorkflowId(rs.getInt("PPL_WORKFLOW_ID"));
            }

        } catch (Exception e) {
            System.out.println("USP_GW_PPL_WORKFLOW_GET_FIRST_FILE: " + e.getMessage());
        } finally {
            if (rs != null) {
                rs.close();
            }
            if (proc_stmt != null) {
                proc_stmt.close();
            }
            Connection[] temp_connection = new Connection[]{conns};
            CloseDatabase(temp_connection);
        }
    }

    public void USP_GW_PPL_WORKFLOW_PARTICIPANTS_LIST(List<Participants> responseList, String signingToken) throws Exception {
        CallableStatement proc_stmt = null;
        Connection conns = null;
        ResultSet rs = null;
//        String convrtr = "0";
        try {
            conns = OpenDatabase();
            proc_stmt = conns.prepareCall("{ call USP_GW_PPL_WORKFLOW_PARTICIPANTS_LIST(?,?) }");
            proc_stmt.setString("pSIGNING_TOKEN", signingToken);

            proc_stmt.registerOutParameter("pRESPONSE_CODE", java.sql.Types.NVARCHAR);
            proc_stmt.execute();
//            convrtr = proc_stmt.getString("pRESPONSE_CODE");
            proc_stmt.getString("pRESPONSE_CODE");

//            System.out.println("USP_PPL_WORKFLOW_GET_FIRST_FILE: " + proc_stmt.toString());
            rs = proc_stmt.executeQuery();
            while (rs.next()) {
                Participants response = new Participants();
                response.setId(rs.getInt("ID"));
                response.setPplWorkflowId(rs.getInt("PPL_WORKFLOW_ID"));
                response.setSignerId(rs.getString("SIGNER_ID"));
                response.setFirstName(rs.getString("FIRST_NAME"));
                response.setLastName(rs.getString("LAST_NAME"));
                response.setEmail(rs.getString("EMAIL"));
                response.setMetaInformation(rs.getString("META_INFORMATION"));
                response.setSignerStatus(rs.getInt("SIGNER_STATUS"));
                response.setSignerToken(rs.getString("SIGNER_TOKEN"));
                response.setSigningOptions(rs.getString("SIGNING_OPTIONS"));
                response.setAnnotation(rs.getString("ANNOTATION"));
                response.setSignedType(rs.getString("SIGNED_TYPE"));
                response.setSignedTime(rs.getString("SIGNED_TIME"));
                response.setCustomReason(rs.getString("CUSTOM_REASON"));
                response.setSigningPurpose(rs.getString("SIGNING_PURPOSE"));
                response.setCertificate(rs.getString("CERTIFICATE"));

                responseList.add(response);
            }

        } catch (Exception e) {
            System.out.println("USP_GW_PPL_WORKFLOW_PARTICIPANTS_LIST: " + e.getMessage());
        } finally {
            if (rs != null) {
                rs.close();
            }
            if (proc_stmt != null) {
                proc_stmt.close();
            }
            Connection[] temp_connection = new Connection[]{conns};
            CloseDatabase(temp_connection);
        }
    }

    public void USP_GW_PPL_WORKFLOW_GET_LAST_FILE(LastFile response, String pSIGNING_TOKEN) throws Exception {
        CallableStatement proc_stmt = null;
        Connection conns = null;
        ResultSet rs = null;
        ArrayList<FirstFile> tempList = new ArrayList<>();
//        String convrtr = "0";
        try {
            conns = OpenDatabase();
            proc_stmt = conns.prepareCall("{ call USP_GW_PPL_WORKFLOW_GET_LAST_FILE(?,?) }");
            proc_stmt.setString("pSIGNING_TOKEN", pSIGNING_TOKEN);

            proc_stmt.registerOutParameter("pRESPONSE_CODE", java.sql.Types.NVARCHAR);
            proc_stmt.execute();
            proc_stmt.getString("pRESPONSE_CODE");
//            convrtr = proc_stmt.getString("pRESPONSE_CODE");

//            System.out.println("USP_PPL_WORKFLOW_GET_FIRST_FILE: " + proc_stmt.toString());
            rs = proc_stmt.executeQuery();
            while (rs.next()) {

                response.setPplWorkflowId(rs.getInt("PPL_WORKFLOW_ID"));
                response.setFirstPplFileSignedId(rs.getInt("FIRST_PPL_FILE_SIGNED_ID"));
                response.setLastPplFileSignedId(rs.getInt("LAST_PPL_FILE_SIGNED_ID"));
                response.setLastPplFileName(rs.getString("LAST_PPL_FILE_NAME"));
                response.setLastPplFileUuid(rs.getString("LAST_PPL_FILE_UUID"));
                response.setFileSize(rs.getInt("FILE_SIZE"));
                response.setFileType(rs.getString("FILE_TYPE"));
                response.setUploadToken(rs.getString("UPLOAD_TOKEN"));
                response.setDocumentId(rs.getInt("DOCUMENT_ID"));
                response.setWorkflowDocumentName(rs.getString("WORKFLOW_DOCUMENT_NAME"));
                response.setWorkflowDocumentFormat(rs.getString("WORKFLOW_DOCUMENT_FORMAT"));
                response.setEnterpriseId(rs.getInt("ENTERPRISE_ID"));
                response.setDeadlineAt(rs.getString("DEADLINE_AT"));
            }

        } catch (Exception e) {
            System.out.println("USP_GW_PPL_WORKFLOW_GET_LAST_FILE: " + e.getMessage());
        } finally {
            if (rs != null) {
                rs.close();
            }
            if (proc_stmt != null) {
                proc_stmt.close();
            }
            Connection[] temp_connection = new Connection[]{conns};
            CloseDatabase(temp_connection);
        }
    }

    public int USP_GW_SIGNER_CHECK_EXIST(String pSIGNING_TOKEN, String pSIGNER_TOKEN) throws Exception {
        int convrtr = 0;
        Connection conns = null;
        CallableStatement proc_stmt = null;
        try {
            conns = OpenDatabase();
            proc_stmt = conns.prepareCall("{ call USP_GW_SIGNER_CHECK_EXIST(?,?,?,?) }");

            proc_stmt.setString("pSIGNING_TOKEN", pSIGNING_TOKEN);
            proc_stmt.setString("pSIGNER_TOKEN", pSIGNER_TOKEN);

            proc_stmt.registerOutParameter("pIS_EXIST", java.sql.Types.INTEGER);
            proc_stmt.registerOutParameter("pRESPONSE_CODE", java.sql.Types.NVARCHAR);

            proc_stmt.execute();
//            pIS_EXIST[0] = proc_stmt.getInt("pIS_EXIST");
            convrtr = proc_stmt.getInt("pIS_EXIST");
        } finally {
            if (proc_stmt != null) {
                proc_stmt.close();
            }
            Connection[] temp_connection = new Connection[]{conns};
            CloseDatabase(temp_connection);
        }
        return convrtr;
    }

    public void USP_GW_PPL_FILE_DETAIL_GET(int pPPL_FILE_ID, List<PplFileDetail> listPplFileDetail) throws Exception {
//        String convrtr = "1";
        Connection conns = null;
        CallableStatement proc_stmt = null;
        ResultSet rs = null;

        ObjectMapper objectMapper = new ObjectMapper().setPropertyNamingStrategy(PropertyNamingStrategy.SNAKE_CASE);

        try {
            System.out.println("pPPL_FILE_ID: " + pPPL_FILE_ID);
            conns = OpenDatabase();
            proc_stmt = conns.prepareCall("{ call USP_GW_PPL_FILE_DETAIL_GET(?,?) }");
            proc_stmt.setInt("pPPL_FILE_ID", pPPL_FILE_ID);
            proc_stmt.registerOutParameter("pRESPONSE_CODE", java.sql.Types.NVARCHAR);

            proc_stmt.execute();
            proc_stmt.getString("pRESPONSE_CODE");
//            convrtr = proc_stmt.getString("pRESPONSE_CODE");

            rs = proc_stmt.executeQuery();
            while (rs.next()) {
                PplFileDetail pplFileDetail = new PplFileDetail();
                pplFileDetail.setId(rs.getInt("ID"));
                pplFileDetail.setPpl_file_id(rs.getInt("PPL_FILE_ID"));
                pplFileDetail.setPpl_file_attr_type_id(rs.getInt("PPL_FILE_ATTR_TYPE_ID"));
//                pplFileDetail.setValue(rs.getString("VALUE"));
                pplFileDetail.setValue(objectMapper.readValue(Constants.JSON_VALUE, SignatureValidation.class));
                pplFileDetail.setHmac(rs.getString("HMAC"));
                pplFileDetail.setCreated_by(rs.getString("CREATED_BY"));
                pplFileDetail.setCreated_at(rs.getDate("CREATED_AT"));
                pplFileDetail.setLast_modified_by(rs.getString("LAST_MODIFIED_BY"));
                pplFileDetail.setLast_modified_at(rs.getDate("LAST_MODIFIED_AT"));
                listPplFileDetail.add(pplFileDetail);
            }
//            return convrtr;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        } finally {
            if (proc_stmt != null) {
                proc_stmt.close();
            }
            Connection[] temp_connection = new Connection[]{conns};
            CloseDatabase(temp_connection);
        }
    }

    public void USP_GW_ENTERPRISE_LIST(List<Enterprise> enterpriseList) throws Exception {
        CallableStatement proc_stmt = null;
        Connection conns = null;
        ResultSet rs = null;
//        String convrtr = "0";

        try {
            conns = OpenDatabase();
            proc_stmt = conns.prepareCall("{ call USP_GW_ENTERPRISE_LIST() }");

            rs = proc_stmt.executeQuery();
            while (rs.next()) {
                Enterprise enterprise = new Enterprise();
                enterprise.setId(rs.getInt("ID"));
                enterprise.setMetadataGatewayView(rs.getString("METADATA_GATEWAY_VIEW"));
                enterprise.setLogo(rs.getString("LOGO"));
                enterprise.setName(rs.getString("NAME"));
                enterprise.setNotificationEmail(rs.getString("NOTIFICATION_EMAIL"));
                enterpriseList.add(enterprise);
            }
        } catch (Exception e) {
            System.out.println("USP_GW_ENTERPRISE_LIST: " + e.getMessage());
        } finally {
            if (rs != null) {
                rs.close();
            }
            if (proc_stmt != null) {
                proc_stmt.close();
            }
            Connection[] temp_connection = new Connection[]{conns};
            CloseDatabase(temp_connection);
        }
    }

    public void USP_GW_CONNECTOR_LIST(List<ConnectorName> connectorNameList) throws Exception {
        CallableStatement proc_stmt = null;
        Connection conns = null;
        ResultSet rs = null;
//        String convrtr = "0";

        try {
            conns = OpenDatabase();
            proc_stmt = conns.prepareCall("{ call USP_GW_CONNECTOR_LIST() }");

            rs = proc_stmt.executeQuery();
            while (rs.next()) {
                ConnectorName connectorName = new ConnectorName();
                connectorName.setId(rs.getInt("ID"));
                connectorName.setIdentifier(rs.getString("IDENTIFIER"));
                connectorName.setLogo(rs.getString("LOGO"));
                connectorName.setConnectorName(rs.getString("CONNECTOR_NAME"));
                connectorName.setRemark(rs.getString("REMARK"));
                connectorName.setPrefixCode(rs.getString("PREFIX_CODE"));
                connectorName.setProvider(rs.getString("PROVIDER"));
                connectorNameList.add(connectorName);
            }
        } catch (Exception e) {
            System.out.println("USP_GW_CONNECTOR_LIST: " + e.getMessage());
        } finally {
            if (rs != null) {
                rs.close();
            }
            if (proc_stmt != null) {
                proc_stmt.close();
            }
            Connection[] temp_connection = new Connection[]{conns};
            CloseDatabase(temp_connection);
        }
    }

    public ConnectorName getIdentierConnector(String sConnectorName) throws Exception {

        ConnectorName connectorName = new ConnectorName();
        List<ConnectorName> connectorNameList = LoadParamSystem.getConnectorStart(Difinitions.CONFIG_LOAD_PARAM_CONNECTOR_NAME);
        if (connectorNameList.size() > 0) {
            for (ConnectorName connectorNameItem : connectorNameList) {
                if (connectorNameItem.getConnectorName().equals(sConnectorName)) {
                    connectorName.setIdentifier(connectorNameItem.getIdentifier());
                    connectorName.setPrefixCode(connectorNameItem.getPrefixCode());
                }
            }

        }
        return connectorName;
    }

    public void USP_GW_COUNTRY_WITH_ELECTRONIC_LIST(List<CountryName> countryNameList) throws Exception {
        CallableStatement proc_stmt = null;
        Connection conns = null;
        ResultSet rs = null;
//        String convrtr = "0";

        try {
            conns = OpenDatabase();
            proc_stmt = conns.prepareCall("{ call USP_GW_COUNTRY_WITH_ELECTRONIC_LIST() }");

            rs = proc_stmt.executeQuery();
            while (rs.next()) {
                CountryName countryName = new CountryName();
                countryName.setId(rs.getInt("ID"));
                countryName.setMetadata(rs.getString("META_DATA"));
                countryName.setRemarkEn(rs.getString("REMARK_EN"));
                countryName.setRemark(rs.getString("REMARK"));

                countryNameList.add(countryName);
            }

//            System.out.println(tempList);
        } catch (Exception e) {
            System.out.println("USP_GW_COUNTRY_WITH_ELECTRONIC_LIST: " + e.getMessage());
        } finally {
            if (rs != null) {
                rs.close();
            }
            if (proc_stmt != null) {
                proc_stmt.close();
            }
            Connection[] temp_connection = new Connection[]{conns};
            CloseDatabase(temp_connection);
        }
    }

    public void USP_GW_PREFIX_PERSONAL_CODE_LIST(List<Prefix> prefixList, String pTYPE, String pLANGUAGE_NAME) throws Exception {
        CallableStatement proc_stmt = null;
        Connection conns = null;
        ResultSet rs = null;
//        String convrtr = "0";

        try {
            conns = OpenDatabase();
            proc_stmt = conns.prepareCall("{ call USP_GW_PREFIX_PERSONAL_CODE_LIST(?,?,?) }");
            if (!"".equals(pTYPE)) {
                proc_stmt.setString("pTYPE", pTYPE);
            } else {
                proc_stmt.setString("pTYPE", null);
            }
            if (!"".equals(pLANGUAGE_NAME)) {
                proc_stmt.setString("pLANGUAGE_NAME", pLANGUAGE_NAME);
            } else {
                proc_stmt.setString("pLANGUAGE_NAME", "en");
            }

            proc_stmt.registerOutParameter("pRESPONSE_CODE", java.sql.Types.NVARCHAR);
            proc_stmt.execute();
            proc_stmt.getString("pRESPONSE_CODE");
//            convrtr = proc_stmt.getString("pRESPONSE_CODE");

//            System.out.println("USP_PREFIX_PERSONAL_CODE_LIST: " + proc_stmt.toString());
            rs = proc_stmt.executeQuery();
            while (rs.next()) {
                Prefix prefix = new Prefix();
                prefix.setId(rs.getInt("ID"));
                prefix.setName(rs.getString("NAME"));
                prefix.setRemark(rs.getString("REMARK"));
                prefix.setType(rs.getString("TYPE"));

                prefixList.add(prefix);
            }

//            System.out.println(tempList);
        } catch (Exception e) {
            System.out.println("USP_GW_PREFIX_PERSONAL_CODE_LIST: " + e.getMessage());
        } finally {
            if (rs != null) {
                rs.close();
            }
            if (proc_stmt != null) {
                proc_stmt.close();
            }
            Connection[] temp_connection = new Connection[]{conns};
            CloseDatabase(temp_connection);
        }
    }

    public void USP_GW_PPL_WORKFLOW_PARTICIPANTS_GET(Participants response, String pSIGNER_TOKEN) throws Exception {
        CallableStatement proc_stmt = null;
        Connection conns = null;
        ResultSet rs = null;
        ArrayList<Participants> tempList = new ArrayList<>();
//        String convrtr = "1";
        try {
            conns = OpenDatabase();
            proc_stmt = conns.prepareCall("{ call USP_GW_PPL_WORKFLOW_PARTICIPANTS_GET(?,?) }");
            proc_stmt.setString(1, pSIGNER_TOKEN);

            proc_stmt.registerOutParameter(2, java.sql.Types.NVARCHAR);
            proc_stmt.execute();
            proc_stmt.getString(2);

//            System.out.println("USP_PPL_WORKFLOW_PARTICIPANTS_GET: " + proc_stmt.toString());
            rs = proc_stmt.executeQuery();
            while (rs.next()) {
                response.setId(rs.getInt("ID"));
                response.setPplWorkflowId(rs.getInt("PPL_WORKFLOW_ID"));
                response.setFirstName(rs.getString("FIRST_NAME"));
                response.setLastName(rs.getString("LAST_NAME"));
                response.setSignerStatus(rs.getInt("SIGNER_STATUS"));
                response.setCertificate(rs.getString("CERTIFICATE"));
                response.setSigningOptions(rs.getString("SIGNING_OPTIONS"));
                response.setSignerId(rs.getString("SIGNER_ID"));
                response.setCustomReason(rs.getString("CUSTOM_REASON"));
                response.setSigningPurpose(rs.getString("SIGNING_PURPOSE"));
                response.setMetaInformation(rs.getString("META_INFORMATION"));
                response.setAnnotation(rs.getString("ANNOTATION"));
            }

        } catch (Exception e) {
            System.out.println("USP_GW_PREFIX_PERSONAL_CODE_LIST: " + e.getMessage());
        } finally {
            if (rs != null) {
                rs.close();
            }
            if (proc_stmt != null) {
                proc_stmt.close();
            }
            Connection[] temp_connection = new Connection[]{conns};
            CloseDatabase(temp_connection);
        }
    }

    public String USP_GW_PPL_FILE_ADD(int pENTERPRISE_ID, String pFILE_NAME, Integer pFILE_SIZE, int pFILE_STATUS, String pURL, String pFILE_TYPE,
                                      String pMIME_TYPE,
                                      String pDIGEST, String pCONTENT, String pFILE_UUID, String pDMS_PROPERTY, String pUPLOAD_TOKEN,
                                      String pHMAC,
                                      String pCREATED_BY, int[] pFILE_ID) throws Exception {
        String convrtr = "1";
        Connection conns = null;
        CallableStatement proc_stmt = null;
        try {
            conns = OpenDatabase();
            proc_stmt = conns.prepareCall("{ call USP_PPL_FILE_ADD(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) }");

            proc_stmt.setInt("pENTERPRISE_ID", pENTERPRISE_ID); // pENTERPRISE_ID
            proc_stmt.setString("pFILE_NAME", pFILE_NAME); // file name
            // file size
            proc_stmt.setInt("pFILE_SIZE", pFILE_SIZE);

            // file status
            proc_stmt.setInt("pFILE_STATUS", pFILE_STATUS);

            // file URL
            if (!"".equals(pURL)) {
                proc_stmt.setString("pURL", pURL);
            } else {
                proc_stmt.setString("pURL", null);
            }

            // file type
            proc_stmt.setString("pFILE_TYPE", pFILE_TYPE);

            // file mime type
            proc_stmt.setString("pMIME_TYPE", pMIME_TYPE);

            proc_stmt.setString("pDIGEST", pDIGEST); // file digest

            // file content
            if (!"".equals(pCONTENT)) {
                proc_stmt.setString("pCONTENT", pCONTENT);
            } else {
                proc_stmt.setString("pCONTENT", null);
            }

            // uuid file
            proc_stmt.setString("pFILE_UUID", pFILE_UUID);

            // file DMS property
            proc_stmt.setString("pDMS_PROPERTY", pDMS_PROPERTY);

            // upload token
            proc_stmt.setString("pUPLOAD_TOKEN", pUPLOAD_TOKEN);

            // hmac
            if (!"".equals(pHMAC)) {
                proc_stmt.setString("pHMAC", pHMAC);
            } else {
                proc_stmt.setString("pHMAC", null);
            }
            // create by
            if (!"".equals(pCREATED_BY)) {
                proc_stmt.setString("pCREATED_BY", pCREATED_BY);
            } else {
                proc_stmt.setString("pCREATED_BY", null);
            }

            proc_stmt.registerOutParameter("pFILE_ID", java.sql.Types.BIGINT); // giá trị out file_id
            proc_stmt.registerOutParameter("pRESPONSE_CODE", java.sql.Types.NVARCHAR); // giá trị out response code

//            System.out.println("USP_PPL_FILE_ADD: " + proc_stmt); // kiem tra
            proc_stmt.execute();
            pFILE_ID[0] = proc_stmt.getInt("pFILE_ID");
            convrtr = String.valueOf(proc_stmt.getInt("pRESPONSE_CODE"));
        } finally {
            if (proc_stmt != null) {
                proc_stmt.close();
            }
            Connection[] temp_connection = new Connection[]{conns};
            CloseDatabase(temp_connection);
        }
        return convrtr;
    }

    public String USP_GW_PPL_FILE_UPDATE(int pFILE_ID, int pFILE_STATUS, String pFILE_NAME,
                                         String pFILE_SIZE, String pURL, String pFILE_TYPE, String pMIME_TYPE, String pDIGEST,
                                         String pCONTENT, String pFILE_UUID, String pDMS_PROPERTY, String pHMAC,
                                         String pLAST_MOTIFIED_BY) throws Exception {
        String convrtr = "1";
        Connection conns = null;
        CallableStatement proc_stmt = null;
        try {
            conns = OpenDatabase();
            proc_stmt = conns.prepareCall("{ call USP_PPL_FILE_UPDATE(?,?,?,?,?,?,?,?,?,?,?,?,?,?) }");

            proc_stmt.setInt("pFILE_ID", pFILE_ID);
            proc_stmt.setInt("pFILE_STATUS", pFILE_STATUS);

            if (!"".equals(pFILE_NAME)) {
                proc_stmt.setString("pFILE_NAME", pFILE_NAME);
            } else {
                proc_stmt.setString("pFILE_NAME", null);
            }

            if (!"".equals(pFILE_SIZE)) {
                proc_stmt.setInt("pFILE_SIZE", Integer.parseInt(pFILE_SIZE));
            } else {
                proc_stmt.setString("pFILE_SIZE", null);
            }
            if (!"".equals(pURL)) {
                proc_stmt.setString("pURL", pURL);
            } else {
                proc_stmt.setString("pURL", null);
            }
            if (!"".equals(pFILE_TYPE)) {
                proc_stmt.setString("pFILE_TYPE", pFILE_TYPE);
            } else {
                proc_stmt.setString("pFILE_TYPE", null);
            }
            if (!"".equals(pMIME_TYPE)) {
                proc_stmt.setString("pMIME_TYPE", pMIME_TYPE);
            } else {
                proc_stmt.setString("pMIME_TYPE", null);
            }
            if (!"".equals(pDIGEST)) {
                proc_stmt.setString("pDIGEST", pDIGEST);
            } else {
                proc_stmt.setString("pDIGEST", null);
            }
            if (!"".equals(pCONTENT)) {
                proc_stmt.setString("pCONTENT", pCONTENT);
            } else {
                proc_stmt.setString("pCONTENT", null);
            }

            proc_stmt.setString("pFILE_UUID", pFILE_UUID);
            proc_stmt.setString("pDMS_PROPERTY", pDMS_PROPERTY);

            // if(!"".equals(pUPLOAD_TOKEN)){
            // proc_stmt.setString("pUPLOAD_TOKEN", pUPLOAD_TOKEN);
            // } else {
            // proc_stmt.setString("pUPLOAD_TOKEN", null);
            // }
            if (!"".equals(pHMAC)) {
                proc_stmt.setString("pHMAC", pHMAC);
            } else {
                proc_stmt.setString("pHMAC", null);
            }
            if (!"".equals(pLAST_MOTIFIED_BY)) {
                proc_stmt.setString("pLAST_MODIFIED_BY", pLAST_MOTIFIED_BY);
            } else {
                proc_stmt.setString("pLAST_MODIFIED_BY", null);
            }
            proc_stmt.registerOutParameter("pRESPONSE_CODE", java.sql.Types.NVARCHAR);
//            System.out.println("USP_PPL_FILE_UPDATE: " + proc_stmt);
            proc_stmt.execute();
            convrtr = proc_stmt.getString("pRESPONSE_CODE");
        } finally {
            if (proc_stmt != null) {
                proc_stmt.close();
            }
            Connection[] temp_connection = new Connection[]{conns};
            CloseDatabase(temp_connection);
        }
        return convrtr;
    }

    public String USP_GW_PPL_WORKFLOW_PARTICIPANTS_UPDATE_STATUS(String pSIGNER_TOKEN, int pSIGNER_STATUS,
                                                                 String pLAST_MODIFIED_BY, int intIS_SET_POSITION)
            throws Exception {
        String convrtr = "1";
        Connection conns = null;
        CallableStatement proc_stmt = null;
        try {
            conns = OpenDatabase();
            proc_stmt = conns.prepareCall("{ call USP_GW_PPL_WORKFLOW_PARTICIPANTS_UPDATE_STATUS(?,?,?,?,?) }");

            proc_stmt.setString("pSIGNER_TOKEN", pSIGNER_TOKEN);
            proc_stmt.setInt("pSIGNER_STATUS", pSIGNER_STATUS);
            if (!"".equals(pLAST_MODIFIED_BY)) {
                proc_stmt.setString("pLAST_MODIFIED_BY", pLAST_MODIFIED_BY);
            } else {
                proc_stmt.setString("pLAST_MODIFIED_BY", null);
            }
            proc_stmt.setInt("IS_SET_POSITION", intIS_SET_POSITION);

            proc_stmt.registerOutParameter("pRESPONSE_CODE", java.sql.Types.NVARCHAR);
//            System.out.println("USP_GW_PPL_WORKFLOW_PARTICIPANTS_UPDATE_STATUS: " + proc_stmt.toString());
            proc_stmt.execute();
            convrtr = proc_stmt.getString("pRESPONSE_CODE");
        } finally {
            if (proc_stmt != null) {
                proc_stmt.close();
            }
            Connection[] temp_connection = new Connection[]{conns};
            CloseDatabase(temp_connection);
        }
        return convrtr;
    }

    public String USP_GW_PPL_WORKFLOW_FILE_ADD(int pPPL_WORKFLOW_ID, int pPPL_FILE_ID, String pTYPE,
                                               String pFILE_INFO, int pFROM_FILE_ID, String pHMAC, String pCREATED_BY) throws Exception {
        String convrtr = "1";
        Connection conns = null;
        CallableStatement proc_stmt = null;
        try {
            conns = OpenDatabase();
            proc_stmt = conns.prepareCall("{ call USP_PPL_WORKFLOW_FILE_ADD(?,?,?,?,?,?,?,?) }");

            proc_stmt.setInt("pPPL_WORKFLOW_ID", pPPL_WORKFLOW_ID);
            proc_stmt.setInt("pPPL_FILE_ID", pPPL_FILE_ID);
            proc_stmt.setString("pTYPE", pTYPE);
            proc_stmt.setString("pFILE_INFO", pFILE_INFO);
            if (pFROM_FILE_ID != 0) {
                proc_stmt.setInt("pFROM_FILE_ID", pFROM_FILE_ID);
            } else {
                proc_stmt.setString("pFROM_FILE_ID", null);
            }
            proc_stmt.setString("pHMAC", pHMAC);
            proc_stmt.setString("pCREATED_BY", pCREATED_BY);

            proc_stmt.registerOutParameter("pRESPONSE_CODE", java.sql.Types.NVARCHAR);
//            System.out.println("USP_PPL_WORKFLOW_FILE_ADD: " + proc_stmt);
            proc_stmt.execute();
            convrtr = proc_stmt.getString("pRESPONSE_CODE");
        } finally {
            if (proc_stmt != null) {
                proc_stmt.close();
            }
            Connection[] temp_connection = new Connection[]{conns};
            CloseDatabase(temp_connection);
        }
        return convrtr;
    }

    public String USP_GW_PPL_WORKFLOW_PARTICIPANTS_UPDATE(String pSIGNER_TOKEN, String pSIGNED_TYPE,
                                                          String pSIGNED_TIME,
                                                          String pSIGNATURE_ID, String pSIGNED_ALGORITHM, String dataResponse, String pSIGNATURE_TYPE,
                                                          String pSIGNING_OPTION, String pGRACE_PERIOD_END_TIME, String pSIGNATURE_VALUE,
                                                          int pPPL_FILE_SIGNED_ID, String pLAST_MODIFIED_BY) throws Exception {
        String convrtr = "1";
        Connection conns = null;
        CallableStatement proc_stmt = null;
        try {
            System.out.println("dzo day");
            System.out.println("pSIGNED_TIME" + pSIGNED_TIME);
            System.out.println("pGRACE_PERIOD_END_TIME" + pGRACE_PERIOD_END_TIME);
            System.out.println("pPPL_FILE_SIGNED_ID" + pPPL_FILE_SIGNED_ID);
            System.out.println("pLAST_MODIFIED_BY" + pLAST_MODIFIED_BY);
            conns = OpenDatabase();
            proc_stmt = conns.prepareCall("{ call USP_GW_PPL_WORKFLOW_PARTICIPANTS_UPDATE(?,?,?,?,?,?,?,?,?,?,?,?,?) }");

            proc_stmt.setString("pSIGNER_TOKEN", pSIGNER_TOKEN);
            proc_stmt.setString("pSIGNED_TYPE", pSIGNED_TYPE);
            if (pSIGNED_TIME != null) {
                proc_stmt.setObject("pSIGNED_TIME", pSIGNED_TIME);
            } else {
                proc_stmt.setString("pSIGNED_TIME", null);
            }
            proc_stmt.setString("pSIGNATURE_ID", pSIGNATURE_ID);
            proc_stmt.setString("pSIGNED_ALGORITHM", pSIGNED_ALGORITHM);
            proc_stmt.setString("pCERTIFICATE", dataResponse);
            proc_stmt.setString("pSIGNATURE_TYPE", pSIGNATURE_TYPE);
            proc_stmt.setString("pSIGNING_OPTION", pSIGNING_OPTION);
            proc_stmt.setString("pGRACE_PERIOD_END_TIME", pGRACE_PERIOD_END_TIME);
            proc_stmt.setString("pSIGNATURE_VALUE", pSIGNATURE_VALUE);
            proc_stmt.setInt("pPPL_FILE_SIGNED_ID", pPPL_FILE_SIGNED_ID);
            proc_stmt.setString("pLAST_MODIFIED_BY", pLAST_MODIFIED_BY);

            proc_stmt.registerOutParameter("pRESPONSE_CODE", java.sql.Types.NVARCHAR);
//            System.out.println("USP_PPL_WORKFLOW_PARTICIPANTS_UPDATE: " + proc_stmt.toString());
            proc_stmt.execute();
            convrtr = proc_stmt.getString("pRESPONSE_CODE");
        } finally {
            if (proc_stmt != null) {
                proc_stmt.close();
            }
            Connection[] temp_connection = new Connection[]{conns};
            CloseDatabase(temp_connection);
        }
        return convrtr;
    }

    public String USP_GW_PPL_WORKFLOW_UPDATE_STATUS(String pSIGNING_TOKEN, int pWORKFLOW_STATUS, String pLAST_MODIFIED_BY) throws Exception {
        String convrtr = "1";
        Connection conns = null;
        CallableStatement proc_stmt = null;
        try {
            conns = OpenDatabase();
            proc_stmt = conns.prepareCall("{ call USP_PPL_WORKFLOW_UPDATE_STATUS(?,?,?,?) }");

            proc_stmt.setString("pSIGNING_TOKEN", pSIGNING_TOKEN);
            proc_stmt.setInt("pWORKFLOW_STATUS", pWORKFLOW_STATUS);
            proc_stmt.setString("pLAST_MODIFIED_BY", pLAST_MODIFIED_BY);
            proc_stmt.registerOutParameter("pRESPONSE_CODE", java.sql.Types.NVARCHAR);
//            System.out.println("USP_PPL_WORKFLOW_UPDATE_STATUS: " + proc_stmt.toString());
            proc_stmt.execute();
            convrtr = proc_stmt.getString("pRESPONSE_CODE");
        } finally {
            if (proc_stmt != null) {
                proc_stmt.close();
            }
            Connection[] temp_connection = new Connection[]{conns};
            CloseDatabase(temp_connection);
        }
        return convrtr;
    }

//    public String USP_GW_PPL_FILE_DETAIL_GET_FROM_UPLOAD_TOKEN(String pUPLOAD_TOKEN, List<PplFileDetail> listPplFileDetail) throws Exception {
//        String convrtr = "1";
//        Connection conns = null;
//        CallableStatement proc_stmt = null;
//        ResultSet rs = null;
//
//        try {
//            System.out.println("pUPLOAD_TOKEN: " + pUPLOAD_TOKEN);
//            conns = OpenDatabase();
//            proc_stmt = conns.prepareCall("{ call USP_GW_PPL_FILE_DETAIL_GET_FROM_UPLOAD_TOKEN(?,?) }");
//            proc_stmt.setString("pUPLOAD_TOKEN", pUPLOAD_TOKEN);
//            proc_stmt.registerOutParameter("pRESPONSE_CODE", java.sql.Types.NVARCHAR);
//
//            proc_stmt.execute();
//            convrtr = proc_stmt.getString("pRESPONSE_CODE");
//
//            rs = proc_stmt.executeQuery();
//            while (rs.next()) {
//                PplFileDetail pplFileDetail = new PplFileDetail();
//                pplFileDetail.setId(rs.getInt("ID"));
//                pplFileDetail.setPpl_file_id(rs.getInt("PPL_FILE_ID"));
//                pplFileDetail.setPpl_file_attr_type_id(rs.getInt("PPL_FILE_ATTR_TYPE_ID"));
//                pplFileDetail.setValue(rs.getString("VALUE"));
//                pplFileDetail.setHmac(rs.getString("HMAC"));
//                pplFileDetail.setCreated_by(rs.getString("CREATED_BY"));
//                pplFileDetail.setCreated_at(rs.getDate("CREATED_AT"));
//                pplFileDetail.setLast_modified_by(rs.getString("LAST_MODIFIED_BY"));
//                pplFileDetail.setLast_modified_at(rs.getDate("LAST_MODIFIED_AT"));
//                listPplFileDetail.add(pplFileDetail);
//            }
//            return convrtr;
//        } catch (Exception e) {
//            throw new Exception(e.getMessage());
//        } finally {
//            if (proc_stmt != null) {
//                proc_stmt.close();
//            }
//            Connection[] temp_connection = new Connection[]{conns};
//            CloseDatabase(temp_connection);
//        }
//    }

    public String USP_GW_PPL_FILE_VALIDATION_UPDATE_POSTBACK_STATUS(int pFILE_VALIDATION_ID, int pPOSTBACK_STATUS, String pLAST_MODIFIED_BY) throws Exception {
        String convrtr = "1";
        Connection conns = null;
        CallableStatement proc_stmt = null;
        ResultSet rs = null;

        try {

            conns = OpenDatabase();
            proc_stmt = conns.prepareCall("{ call USP_GW_PPL_FILE_VALIDATION_UPDATE_POSTBACK_STATUS(?,?,?,?) }");
            proc_stmt.setInt("pFILE_VALIDATION_ID", pFILE_VALIDATION_ID);
            proc_stmt.setInt("pPOSTBACK_STATUS", pPOSTBACK_STATUS);
            proc_stmt.setString("pLAST_MODIFIED_BY", pLAST_MODIFIED_BY);
            proc_stmt.registerOutParameter("pRESPONSE_CODE", java.sql.Types.NVARCHAR);

            proc_stmt.execute();
            convrtr = proc_stmt.getString("pRESPONSE_CODE");

            rs = proc_stmt.executeQuery();

            return convrtr;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        } finally {
            if (proc_stmt != null) {
                proc_stmt.close();
            }
            Connection[] temp_connection = new Connection[]{conns};
            CloseDatabase(temp_connection);
        }
    }

    public int USP_GW_PPL_FILE_VALIDATION_GET_POSTBACK_STATUS(int pFILE_VALIDATION_ID) throws Exception {
        String convrtr = "1";
        Connection conns = null;
        CallableStatement proc_stmt = null;
        ResultSet rs = null;
        int val = 1;

        try {

            conns = OpenDatabase();
            proc_stmt = conns.prepareCall("{ call USP_GW_PPL_FILE_VALIDATION_GET_POSTBACK_STATUS(?,?) }");
            proc_stmt.setInt("pFILE_VALIDATION_ID", pFILE_VALIDATION_ID);

            proc_stmt.registerOutParameter("pRESPONSE_CODE", java.sql.Types.NVARCHAR);

            proc_stmt.execute();
            convrtr = proc_stmt.getString("pRESPONSE_CODE");

            rs = proc_stmt.executeQuery();
            while (rs.next()) {

                val = rs.getInt("POSTBACK_STATUS");
            }
            return val;

        } catch (Exception e) {
            throw new Exception(e.getMessage());
        } finally {
            if (proc_stmt != null) {
                proc_stmt.close();
            }
            Connection[] temp_connection = new Connection[]{conns};
            CloseDatabase(temp_connection);
        }
    }
}
