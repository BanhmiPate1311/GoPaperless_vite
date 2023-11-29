package vn.mobileid.GoPaperless.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GatewayService {
    @Value("${dev.url}")
    private boolean devUrl;

    private final String baseUrl = devUrl ? "https://dev-paperless-gw.mobile-id.vn" : "https://uat-paperless-gw.mobile-id.vn";

    public String getSignatureId() {
        System.out.println("getSignatureId");
        String getSignatureIdUrl = baseUrl + "/api/internalusage/validation/signature-id";

        return baseUrl;
    }
}
