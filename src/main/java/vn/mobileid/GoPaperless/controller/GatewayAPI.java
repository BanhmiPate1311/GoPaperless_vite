package vn.mobileid.GoPaperless.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.http.converter.ResourceHttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import vn.mobileid.GoPaperless.model.gwModal.ValidationResquest;
import vn.mobileid.GoPaperless.model.gwModal.PrepareSigningRequest;
import vn.mobileid.GoPaperless.model.gwModal.PrepareSigningResponse;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Component
public class GatewayAPI {

    @Value("${dev.url}")
    private boolean devUrl;

    private int timeOut = 50000;

    public String getBaseUrl() {
        return devUrl ? "https://dev-paperless-gw.mobile-id.vn" : "https://uat-paperless-gw.mobile-id.vn";
    }

    public byte[] previewFile(String uploadToken, String signerToken) throws MalformedURLException {
        String baseUrl = getBaseUrl();
        String previewUrl = baseUrl + "/file/" + uploadToken + "/preview/" + signerToken;

        RestTemplate restTemplate = new RestTemplate();


        ResponseEntity<byte[]> responseEntity = null;
        responseEntity = restTemplate.exchange(previewUrl, HttpMethod.GET, null, byte[].class);

        return responseEntity.getBody();
    }

    public String PrepareSign(PrepareSigningRequest prepareSigningRequest) {
        System.out.println("PrepareSign");
        String baseUrl = getBaseUrl();
//        String prepareUrl = baseUrl + "/apigw/signing/" + prepareSigningRequest.getSigning_token() + "/prepare.json?access_token=" + prepareSigningRequest.getSigner_token();
        // convert String to base64
        String prepareUrl = baseUrl + "/api/internalusage/signing/" + prepareSigningRequest.getSigning_token() + "/prepare.json?access_token=" + prepareSigningRequest.getSigner_token();


        StringBuilder pemBuilder = new StringBuilder();
        pemBuilder.append("-----BEGIN CERTIFICATE-----\n");

        int index = 0;
        int chunkSize = 64;
        while (index < prepareSigningRequest.getCertificate().length()) {
            pemBuilder.append(prepareSigningRequest.getCertificate(), index, Math.min(index + chunkSize, prepareSigningRequest.getCertificate().length()));
            pemBuilder.append("\n");
            index += chunkSize;
        }

        pemBuilder.append("-----END CERTIFICATE-----");

        String pemString = pemBuilder.toString();
//        System.out.println(pemString);

        String base64CertChain = Base64.getEncoder().encodeToString(pemString.getBytes());
//        System.out.println("base64CertChain: " + base64CertChain);
        RestTemplate restTemplate = new RestTemplate();

        // Tạo HttpHeaders để đặt các headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
//        headers.set("Authorization", "Bearer YourAccessToken"); // Thay thế bằng header bạn muốn gửi

        // Tạo dữ liệu JSON cho yêu cầu POST
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("signer_id", prepareSigningRequest.getSigner_id());
        requestData.put("certificate", base64CertChain);
        requestData.put("connector_name", prepareSigningRequest.getConnector_name());
        requestData.put("signing_option", prepareSigningRequest.getSigning_option());

        // Tạo HttpEntity với dữ liệu JSON và headers
        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);


        // Gửi yêu cầu POST và nhận phản hồi
        ResponseEntity<String> responseEntity = restTemplate.exchange(prepareUrl, HttpMethod.POST, httpEntity, String.class);
        Gson gson = new Gson();
        PrepareSigningResponse prepareSigningResponse = gson.fromJson(responseEntity.getBody(), PrepareSigningResponse.class);
        return prepareSigningResponse.getDtbs_hash();

    }

    public String sign(String signingToken, String SignerToken, String signerId, String signature) {
        String baseUrl = getBaseUrl();
        String prepareUrl = baseUrl + "/api/internalusage/signing/" + signingToken + "/sign?access_token=" + SignerToken;
        // convert String to base64
        System.out.println("signerId: " + signerId);
        System.out.println("signature_value: " + signature);

        RestTemplate restTemplate = new RestTemplate();

        // Tạo HttpHeaders để đặt các headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
//        headers.set("Authorization", "Bearer YourAccessToken"); // Thay thế bằng header bạn muốn gửi

        // Tạo dữ liệu JSON cho yêu cầu POST
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("signer_id", signerId);
        requestData.put("signature_value", signature);
        Gson gson = new Gson();
        System.out.println("requestData: " + gson.toJson(requestData));

        // Tạo HttpEntity với dữ liệu JSON và headers
        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);


        // Gửi yêu cầu POST và nhận phản hồi
        ResponseEntity<String> responseEntity = restTemplate.exchange(prepareUrl, HttpMethod.POST, httpEntity, String.class);

        return responseEntity.getBody();

    }

    public byte[] getFileFromUploadToken(String uploadToken) {
        String baseUrl = getBaseUrl();
        String getFileUrl = baseUrl + "/api/internalusage/open/" + uploadToken;

        RestTemplate restTemplate = new RestTemplate();


        ResponseEntity<byte[]> responseEntity = null;
        responseEntity = restTemplate.exchange(getFileUrl, HttpMethod.GET, null, byte[].class);

        return responseEntity.getBody();
    }

    public byte[] getLastFile(String signingToken, String signerToken) {
        String baseUrl = getBaseUrl();
        String getLastFileUrl = baseUrl + "/api/internalusage/signing/" + signingToken + "/download";

        //{{url}}/apigw/signing/{{signing_token}}/download?access_token={{signer_token}}

        RestTemplate restTemplate = new RestTemplate();


        ResponseEntity<byte[]> responseEntity = null;
        responseEntity = restTemplate.exchange(getLastFileUrl, HttpMethod.GET, null, byte[].class);

        return responseEntity.getBody();
    }

    public String ValidView(ValidationResquest validationResquest) {
        String baseUrl = getBaseUrl();
        String getValidViewUrl = baseUrl + "/api/internalusage/validation/" + validationResquest.getUploadToken() + "/view.json";
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));

        ResponseEntity<String> responseEntity = restTemplate.exchange(getValidViewUrl, HttpMethod.GET, null, String.class);

        return responseEntity.getBody();
    }

    public InputStream downloadReport(String uploadToken) throws IOException {
        String baseUrl = getBaseUrl();
        String getValidViewUrl = baseUrl + "/api/internalusage/validation/" + uploadToken + "/download/report-pdf";
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getMessageConverters().add(0, new ResourceHttpMessageConverter());
        System.out.println("getValidViewUrl: " + getValidViewUrl);
        ResponseEntity<InputStreamResource> responseEntity = restTemplate.exchange(getValidViewUrl, HttpMethod.GET, null, InputStreamResource.class);

        return Objects.requireNonNull(responseEntity.getBody()).getInputStream();
    }



    public String getSignatureId(String signatureName, String fileName, String content, String digest) throws Exception {
        System.out.println("get signature id");
        String baseUrl = getBaseUrl();
        String getSignatureIdUrl = baseUrl + "/api/internalusage/validation/signature-name.json";

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("signature_name", signatureName);

        Map<String, Object> file = new HashMap<>();
        file.put("name", fileName);
        file.put("digest", digest);
        file.put("content", content);

        requestData.put("file", file);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData);

        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));

        try {
//            ResponseEntity<SynchronizeDto> responseEntity = restTemplate.exchange(addSignatureUrl, HttpMethod.POST, httpEntity, SynchronizeDto.class);
//            return Objects.requireNonNull(responseEntity.getBody()).getDocument_id();

            ResponseEntity<String> response = restTemplate.exchange(getSignatureIdUrl, HttpMethod.POST, httpEntity, String.class);
//            String responseBody = response.getBody();

//            ObjectMapper objectMapper = new ObjectMapper();
//            JsonNode jsonNode = objectMapper.readTree(responseBody);
//
//            return jsonNode.get("signature_id").asText();
            System.out.println("responseGet Data to update DB: " + response.getBody());
            return response.getBody();
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            throw new Exception(e.getMessage());
        }
    }
}
