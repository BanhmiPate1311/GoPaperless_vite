package vn.mobileid.GoPaperless.service;

import com.google.gson.Gson;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import vn.mobileid.GoPaperless.controller.GatewayAPI;
import vn.mobileid.GoPaperless.model.gwModal.ValidPostBackRequest;
import vn.mobileid.GoPaperless.model.gwModal.ValidationResquest;
import vn.mobileid.GoPaperless.process.ProcessDb;

import java.util.HashMap;
import java.util.Map;

@Service
public class ValidationService {
    private final GatewayAPI gatewayAPI;
    private final GatewayService getwayService;

    private final ProcessDb connect;

    public ValidationService(GatewayAPI gatewayAPI, GatewayService getwayService, ProcessDb connect) {
        this.gatewayAPI = gatewayAPI;
        this.getwayService = getwayService;
        this.connect = connect;
    }

    public String getView(ValidationResquest validationResquest) {
        return getwayService.ValidView(validationResquest);
    }

    public String postback(ValidPostBackRequest validPostBackRequest) throws Exception {

        String postbackUrl = validPostBackRequest.getPostBackUrl();
        System.out.println("postbackUrl: " + postbackUrl);

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("status", validPostBackRequest.getStatus());
        requestData.put("upload_token", validPostBackRequest.getUploadToken());

        Gson gson = new Gson();

        System.out.println("postback Data: " + gson.toJson(requestData));

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {
//            ResponseEntity<SynchronizeDto> responseEntity = restTemplate.exchange(addSignatureUrl, HttpMethod.POST, httpEntity, SynchronizeDto.class);
//            return Objects.requireNonNull(responseEntity.getBody()).getDocument_id();

            ResponseEntity<String> response = restTemplate.exchange(postbackUrl, HttpMethod.POST, httpEntity, String.class);
            connect.USP_GW_PPL_FILE_VALIDATION_UPDATE_POSTBACK_STATUS(validPostBackRequest.getFileValidationId(), 1, "GoPaperLess");

            return response.getBody();
        } catch (HttpClientErrorException e) {
            System.out.println("Error  đây: ");
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            throw new Exception(e.getMessage());
        }

    }

    public int checkStatus(ValidPostBackRequest validPostBackRequest) throws Exception {

        return connect.USP_GW_PPL_FILE_VALIDATION_GET_POSTBACK_STATUS(validPostBackRequest.getFileValidationId());

    }
}
