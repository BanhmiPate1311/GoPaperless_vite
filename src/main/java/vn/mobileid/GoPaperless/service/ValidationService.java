package vn.mobileid.GoPaperless.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import vn.mobileid.GoPaperless.controller.GatewayAPI;
import vn.mobileid.GoPaperless.dto.apiDto.ValidView;
import vn.mobileid.GoPaperless.model.apiModel.PplFileDetail;
import vn.mobileid.GoPaperless.model.gwModal.ValidPostBackRequest;
import vn.mobileid.GoPaperless.model.gwModal.ValidationResquest;
import vn.mobileid.GoPaperless.process.ProcessDb;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ValidationService {
    private final GatewayAPI gatewayAPI;

    private final ProcessDb connect;

    public ValidationService(GatewayAPI gatewayAPI, ProcessDb connect) {
        this.gatewayAPI = gatewayAPI;
        this.connect = connect;
    }

    public String getView(ValidationResquest validationResquest) throws IOException {
        return gatewayAPI.ValidView(validationResquest);
//        InputStream inputStream = getClass().getResourceAsStream("/static/json/view.json");
//        ObjectMapper objectMapper = new ObjectMapper();
//        return objectMapper.readValue(inputStream, ValidView.class);
    }

    public List<PplFileDetail> getFileDetail(ValidationResquest validationResquest) throws Exception {
        List<PplFileDetail> listPplFileDetail = new ArrayList<>();
        connect.USP_GW_PPL_FILE_VALIDATION_DETAIL_GET_FROM_UPLOAD_TOKEN(validationResquest.getUploadToken(), listPplFileDetail);
        return listPplFileDetail;
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
