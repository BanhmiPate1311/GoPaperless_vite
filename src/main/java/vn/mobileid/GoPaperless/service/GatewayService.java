package vn.mobileid.GoPaperless.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class GatewayService {
    @Value("${dev.url}")
    private boolean devUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    private final String baseUrl = devUrl ? "https://dev-paperless-gw.mobile-id.vn" : "https://uat-paperless-gw.mobile-id.vn";

    public String getSignatureId(String uuid,String fileName) throws Exception {
        System.out.println("getSignatureId");
        String getSignatureIdUrl = baseUrl + "/api/internalusage/validation/signature-id";

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("uuid", uuid);
        requestData.put("name", fileName);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData);

        try {
//            ResponseEntity<SynchronizeDto> responseEntity = restTemplate.exchange(addSignatureUrl, HttpMethod.POST, httpEntity, SynchronizeDto.class);
//            return Objects.requireNonNull(responseEntity.getBody()).getDocument_id();

            ResponseEntity<String> response = restTemplate.exchange(getSignatureIdUrl, HttpMethod.POST, httpEntity, String.class);
            System.out.println("response: " + response.getBody());
            return response.getBody();
        } catch (HttpClientErrorException e) {
            System.out.println("Error  đây: ");
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            throw new Exception(e.getMessage());
        }

    }
}
