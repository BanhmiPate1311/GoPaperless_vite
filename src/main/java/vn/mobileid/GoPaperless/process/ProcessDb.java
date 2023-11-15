package vn.mobileid.GoPaperless.process;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import vn.mobileid.GoPaperless.model.apiModel.Enterprise;
import vn.mobileid.GoPaperless.model.apiModel.WorkFlowList;
import vn.mobileid.GoPaperless.utils.CommonFunction;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;

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

    public void USP_GW_ENTERPRISE_LIST(Enterprise enterprise) throws Exception {
        CallableStatement proc_stmt = null;
        Connection conns = null;
        ResultSet rs = null;
        String convrtr = "0";

        try {
            conns = OpenDatabase();
            proc_stmt = conns.prepareCall("{ call USP_GW_ENTERPRISE_LIST() }");

            rs = proc_stmt.executeQuery();
            while (rs.next()) {
                enterprise.setId(rs.getInt("ID"));
                enterprise.setMetadataGatewayView(rs.getString("METADATA_GATEWAY_VIEW"));
                enterprise.setLogo(rs.getString("LOGO"));
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
}
