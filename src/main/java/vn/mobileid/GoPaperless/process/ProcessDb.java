package vn.mobileid.GoPaperless.process;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import vn.mobileid.GoPaperless.model.apiModel.*;

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
        Connection connInner = DriverManager.getConnection(Url_Sql, Username_SQL, Password_SQL);
        return connInner;
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
        String convrtr = "0";

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
            convrtr = proc_stmt.getString("pRESPONSE_CODE");

//            System.out.println("USP_PPL_WORKFLOW_GET: " + proc_stmt.toString());
            rs = proc_stmt.executeQuery();
            while (rs.next()) {
//                response.setId(rs.getInt("ID"));
//                response.setPostBackUrl(CommonFunction.CheckTextNull(rs.getString("POSTBACK_URL")));
//                response.setWorkFlowStatus(rs.getInt("WORKFLOW_STATUS"));
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

    public void USP_GW_ENTERPRISE_LIST(List<Enterprise> enterpriseList) throws Exception {
        CallableStatement proc_stmt = null;
        Connection conns = null;
        ResultSet rs = null;
        String convrtr = "0";

        try {
            conns = OpenDatabase();
            proc_stmt = conns.prepareCall("{ call USP_GW_ENTERPRISE_LIST() }");

            rs = proc_stmt.executeQuery();
            while (rs.next()) {
                Enterprise enterprise = new Enterprise();
                enterprise.setId(rs.getInt("ID"));
                enterprise.setMetadataGatewayView(rs.getString("METADATA_GATEWAY_VIEW"));
                enterprise.setLogo(rs.getString("LOGO"));
                enterpriseList.add(enterprise);
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
        String convrtr = "0";
        try {
            conns = OpenDatabase();
            proc_stmt = conns.prepareCall("{ call USP_GW_PPL_WORKFLOW_GET_FIRST_FILE(?,?) }");
            proc_stmt.setString("pSIGNING_TOKEN", pSIGNING_TOKEN);

            proc_stmt.registerOutParameter("pRESPONSE_CODE", java.sql.Types.NVARCHAR);
            proc_stmt.execute();
            convrtr = proc_stmt.getString("pRESPONSE_CODE");

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
        String convrtr = "0";
        try {
            conns = OpenDatabase();
            proc_stmt = conns.prepareCall("{ call USP_GW_PPL_WORKFLOW_PARTICIPANTS_LIST(?,?) }");
            proc_stmt.setString("pSIGNING_TOKEN", signingToken);

            proc_stmt.registerOutParameter("pRESPONSE_CODE", java.sql.Types.NVARCHAR);
            proc_stmt.execute();
            convrtr = proc_stmt.getString("pRESPONSE_CODE");

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
//                response.setSignedType(rs.getString("SIGNED_TYPE"));
//                response.setSignedTime(rs.getString("SIGNED_TIME"));
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
        String convrtr = "0";
        try {
            conns = OpenDatabase();
            proc_stmt = conns.prepareCall("{ call USP_GW_PPL_WORKFLOW_GET_LAST_FILE(?,?) }");
            proc_stmt.setString("pSIGNING_TOKEN", pSIGNING_TOKEN);

            proc_stmt.registerOutParameter("pRESPONSE_CODE", java.sql.Types.NVARCHAR);
            proc_stmt.execute();
            convrtr = proc_stmt.getString("pRESPONSE_CODE");

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

    public String USP_GW_PPL_FILE_DETAIL_GET_SIGNATURE(int pPPL_FILE_ID, List<PplFileDetail> listPplFileDetail) throws Exception {
        String convrtr = "1";
        Connection conns = null;
        CallableStatement proc_stmt = null;
        ResultSet rs = null;

        try {
            System.out.println("pPPL_FILE_ID: " + pPPL_FILE_ID);
            conns = OpenDatabase();
            proc_stmt = conns.prepareCall("{ call USP_GW_PPL_FILE_DETAIL_GET_SIGNATURE(?,?) }");
            proc_stmt.setInt("pPPL_FILE_ID", pPPL_FILE_ID);
            proc_stmt.registerOutParameter("pRESPONSE_CODE", java.sql.Types.NVARCHAR);

            proc_stmt.execute();
            convrtr = proc_stmt.getString("pRESPONSE_CODE");

            rs = proc_stmt.executeQuery();
            while (rs.next()) {
                PplFileDetail pplFileDetail = new PplFileDetail();
                pplFileDetail.setId(rs.getInt("ID"));
                pplFileDetail.setPpl_file_id(rs.getInt("PPL_FILE_ID"));
                pplFileDetail.setPpl_file_attr_type_id(rs.getInt("PPL_FILE_ATTR_TYPE_ID"));
                pplFileDetail.setValue(rs.getString("VALUE"));
                pplFileDetail.setHmac(rs.getString("HMAC"));
                pplFileDetail.setCreated_by(rs.getString("CREATED_BY"));
                pplFileDetail.setCreated_at(rs.getDate("CREATED_AT"));
                pplFileDetail.setLast_modified_by(rs.getString("LAST_MODIFIED_BY"));
                pplFileDetail.setLast_modified_at(rs.getDate("LAST_MODIFIED_AT"));
                listPplFileDetail.add(pplFileDetail);
            }
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
}
