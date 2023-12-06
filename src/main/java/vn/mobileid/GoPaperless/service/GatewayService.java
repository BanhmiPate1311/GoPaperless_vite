package vn.mobileid.GoPaperless.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import vn.mobileid.GoPaperless.model.gwModal.ValidationResquest;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
public class GatewayService {
    @Value("${dev.url}")
    private boolean devUrl;

    private final RestTemplate restTemplate = new RestTemplate();

//    private final String baseUrl = devUrl ? "https://dev-paperless-gw.mobile-id.vn" : "https://uat-paperless-gw.mobile-id.vn";

    public String getSignatureId(String uuid,String fileName) throws Exception {
        System.out.println("getSignatureId");
        String baseUrl = devUrl ? "https://dev-paperless-gw.mobile-id.vn" : "https://uat-paperless-gw.mobile-id.vn";
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

    public String ValidView(ValidationResquest validationResquest) {
        System.out.println("ValidView");
        System.out.println("devUrl: " + devUrl);
        String baseUrl = devUrl ? "https://dev-paperless-gw.mobile-id.vn" : "https://uat-paperless-gw.mobile-id.vn";
        System.out.println("baseUrl: " + baseUrl);
        System.out.println("uploadToken: " + validationResquest.getUploadToken());
        String getValidViewUrl = baseUrl + "/api/internalusage/validation/" + validationResquest.getUploadToken() + "/view.json";
        System.out.println("getValidViewUrl: " + getValidViewUrl);
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));

        ResponseEntity<String> responseEntity = null;
        responseEntity = restTemplate.exchange(getValidViewUrl, HttpMethod.GET, null, String.class);

        return responseEntity.getBody();
    }
}
