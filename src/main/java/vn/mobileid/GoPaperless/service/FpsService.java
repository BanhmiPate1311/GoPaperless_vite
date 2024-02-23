package vn.mobileid.GoPaperless.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import vn.mobileid.GoPaperless.dto.fpsDto.AccessTokenDto;
import vn.mobileid.GoPaperless.dto.rsspDto.RsspRequest;
import vn.mobileid.GoPaperless.dto.rsspDto.TextField;
import vn.mobileid.GoPaperless.model.fpsModel.BasicFieldAttribute;
import vn.mobileid.GoPaperless.model.fpsModel.FpsSignRequest;
import vn.mobileid.GoPaperless.model.fpsModel.HashFileRequest;
import vn.mobileid.GoPaperless.model.fpsModel.Signature;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.*;

@Service
public class FpsService {
    private String accessToken;

    private final RestTemplate restTemplate = new RestTemplate();

    public void getAccessToken() {
        System.out.println("getAccessToken");
        String authorizeUrl = "https://fps.mobile-id.vn/fps/v1/authenticate";

        // Tạo HttpHeaders để đặt các headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Tạo dữ liệu JSON cho yêu cầu POST
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("grant_type", "client_credentials");
        requestData.put("client_id", "Dokobit_Gateway");
        requestData.put("remember_me_enabled", false);
        requestData.put("client_secret", "TmFtZTogRG9rb2JpdCBHYXRld2F5IFdlYgpDcmVhdGVkIGF0OiAxNjk3NjAzNDE5CkNyZWF0ZWQgYnk6IEdpYVRLClZlcnNpb24gY2xpZW50IFNlY3JldDogMSA=");

        // Tạo HttpEntity với dữ liệu JSON và headers
        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        ResponseEntity<AccessTokenDto> responseEntity = restTemplate.exchange(authorizeUrl, HttpMethod.POST, httpEntity, AccessTokenDto.class);
        this.accessToken = Objects.requireNonNull(responseEntity.getBody()).getAccess_token();
    }

    public String getBase64ImagePdf(int documentId) throws Exception {
        System.out.println("getBase64ImagePdf");
        String getImageBase64Url = "https://fps.mobile-id.vn/fps/v1/documents/" + documentId + "/base64";
        System.out.println("getImageBase64Url: " + getImageBase64Url);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(getImageBase64Url, HttpMethod.GET, httpEntity, String.class);
//            System.out.println("response: " + response.getBody());
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(response.getBody());
            return jsonNode.get("file_data").asText();
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return getBase64ImagePdf(documentId);
            } else {
                throw new Exception(e.getMessage());
            }
        }
    }

    public String getFields(int documentId) throws Exception {
        System.out.println("getFields");
        String getImageBasse64Url = "https://fps.mobile-id.vn/fps/v1/documents/" + documentId + "/fields";

//        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(getImageBasse64Url, HttpMethod.GET, httpEntity, String.class);

            return response.getBody();
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return getFields(documentId);
            } else {
                throw new Exception(e.getMessage());
            }
        }
    }

    public List<Signature> getVerification(int documentId) throws Exception {
        System.out.println("getVerification");
        if (accessToken == null) {
            getAccessToken();
        }
        String verificationUrl = "https://fps.mobile-id.vn/fps/v1/documents/" + documentId + "/verification";

//        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(headers);

        try {
            ParameterizedTypeReference<List<Signature>> responseType = new ParameterizedTypeReference<List<Signature>>() {
            };

            ResponseEntity<List<Signature>> response = restTemplate.exchange(verificationUrl, HttpMethod.GET, httpEntity, responseType);
            return response.getBody();
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return getVerification(documentId);
            } else {
                return Collections.emptyList();
//                throw new Exception(e.getMessage());
            }
        }
    }

    public String addSignature(int documentId, String field, BasicFieldAttribute data, boolean drag) throws Exception {
        System.out.println("addSignature");
        String addSignatureUrl = "https://fps.mobile-id.vn/fps/v1/documents/" + documentId + "/fields/" + field;

//        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);
        if (drag) {
            headers.set("x-dimension-unit", "percentage");
        }

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("field_name", data.getFieldName());
        requestData.put("page", data.getPage());
        requestData.put("suffix", data.getSuffix());
        requestData.put("dimension", data.getDimension());
        requestData.put("visible_enabled", data.getVisibleEnabled());

        System.out.println("requestData: " + requestData);
        List<String> list = new ArrayList<>();
        list.add("cades signature");
        requestData.put("level_of_assurance", list);

        // Convert requestData to JSON string
        ObjectMapper objectMapper = new ObjectMapper();
        String requestDataJson = objectMapper.writeValueAsString(requestData);

        // Log the JSON string
        System.out.println("Request Data as JSON: " + requestDataJson);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {
//            ResponseEntity<SynchronizeDto> responseEntity = restTemplate.exchange(addSignatureUrl, HttpMethod.POST, httpEntity, SynchronizeDto.class);
//            return Objects.requireNonNull(responseEntity.getBody()).getDocument_id();

            ResponseEntity<String> response = restTemplate.exchange(addSignatureUrl, HttpMethod.POST, httpEntity, String.class);

            return response.getBody();
        } catch (HttpClientErrorException e) {
            System.out.println("Error : ");
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return addSignature(documentId, field, data, drag);
            } else {
                throw new Exception(e.getMessage());
            }
        }
    }

    public String putSignature(int documentId, String field, BasicFieldAttribute data) throws Exception {
        System.out.println("putSignature");
        String putSignatureUrl = "https://fps.mobile-id.vn/fps/v1/documents/" + documentId + "/fields/" + field;
        System.out.println("putSignatureUrl: " + putSignatureUrl);
        System.out.println("replicate_all_pages: " + data.getReplicateAllPages());
        System.out.println("replicate: " + data.getReplicate());

//        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);
        headers.set("x-dimension-unit", "percentage");

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("field_name", data.getFieldName());
        if(data.getPage() != null) {
            requestData.put("page", data.getPage());
        }
//        requestData.put("page", data.getPage());

        System.out.println("x: " + data.getDimension().getX());
        System.out.println("y: " + data.getDimension().getY());
        System.out.println("width: " + data.getDimension().getWidth());
        System.out.println("height: " + data.getDimension().getHeight());

        Map<String, Object> dimension = new HashMap<>();
        if(data.getDimension().getX() != -1) {
            dimension.put("x", data.getDimension().getX());
        }
        if(data.getDimension().getY() != -1) {
            dimension.put("y", data.getDimension().getY());
        }
        if(data.getDimension().getWidth() != -1) {
            dimension.put("width", data.getDimension().getWidth());
        }
        if(data.getDimension().getHeight() != -1) {
            dimension.put("height", data.getDimension().getHeight());
        }

        requestData.put("dimension", dimension);
        if(data.getValue() != null) {
            requestData.put("value", data.getValue());
        }
        if(data.getFont() != null) {
            requestData.put("font", data.getFont());
        }
        if(data.getPlaceHolder() != null) {
            requestData.put("place_holder", data.getPlaceHolder());
        }
        if(data.getRequired() != null) {
            requestData.put("required", data.getRequired());
        }
        if(data.getRenamedAs() != null) {
            requestData.put("renamed_as", data.getRenamedAs());
        }
        if(data.getMaxLength() != null) {
            requestData.put("max_length", data.getMaxLength());
        }
        if(data.getReplicateAllPages() != null) {
            requestData.put("replicate_all_pages", data.getReplicateAllPages());
        }
        if(data.getReplicate() != null) {
            requestData.put("replicate", data.getReplicate());
        }
//        requestData.put("max_length", data.getMaxLength());
        requestData.put("visible_enabled", data.getVisibleEnabled());

//        System.out.println("x: " + data.getDimension().getX());
//        System.out.println("y: " + data.getDimension().getY());
//        System.out.println("width: " + data.getDimension().getWidth());
//        System.out.println("height: " + data.getDimension().getHeight());
//        System.out.println("putSignature: " + requestData);

        ObjectMapper objectMapper = new ObjectMapper();
        String requestDataJson = objectMapper.writeValueAsString(requestData);
        System.out.println("Request Data put signature: " + requestDataJson);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {
//            ResponseEntity<SynchronizeDto> responseEntity = restTemplate.exchange(addSignatureUrl, HttpMethod.POST, httpEntity, SynchronizeDto.class);
//            return Objects.requireNonNull(responseEntity.getBody()).getDocument_id();

            ResponseEntity<String> response = restTemplate.exchange(putSignatureUrl, HttpMethod.PUT, httpEntity, String.class);
            // Get the response body as a String

            return response.getBody();
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return putSignature(documentId, field, data);
            } else {
                throw new Exception(e.getMessage());
            }
        }
    }

    public String addTextBox(int documentId, String field, BasicFieldAttribute data, boolean drag) throws Exception {
        System.out.println("addTextBox");
        String addTextBoxUrl = "https://fps.mobile-id.vn/fps/v1/documents/" + documentId + "/fields/" + field;

        System.out.println("addTextBox: " + addTextBoxUrl);
//        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);
        if (drag) {
            headers.set("x-dimension-unit", "percentage");
        }

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("field_name", data.getFieldName());
        requestData.put("page", data.getPage());
        if(data.getType() != null) {
            requestData.put("type", data.getType());
        }
        if(data.getValue() != null) {
            requestData.put("value", data.getValue());
        }
        if(data.getMultiline() != null) {
            requestData.put("multiline", data.getMultiline());
        }
        if(data.getFormatType() != null) {
            requestData.put("format_type", data.getFormatType());
        }
        if(data.getPlaceHolder() != null) {
            requestData.put("place_holder", data.getPlaceHolder());
        }
        requestData.put("suffix", data.getSuffix());
        requestData.put("dimension", data.getDimension());
//        requestData.put("visible_enabled", data.getVisibleEnabled());
        System.out.println("requestData: " + requestData);
//        List<String> list = new ArrayList<>();
//        list.add("cades signature");
//        requestData.put("level_of_assurance", list);

        // Convert requestData to JSON string
        ObjectMapper objectMapper = new ObjectMapper();
        String requestDataJson = objectMapper.writeValueAsString(requestData);

        // Log the JSON string
        System.out.println("Request Data addTextBox as JSON: " + requestDataJson);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {
//            ResponseEntity<SynchronizeDto> responseEntity = restTemplate.exchange(addSignatureUrl, HttpMethod.POST, httpEntity, SynchronizeDto.class);
//            return Objects.requireNonNull(responseEntity.getBody()).getDocument_id();

            ResponseEntity<String> response = restTemplate.exchange(addTextBoxUrl, HttpMethod.POST, httpEntity, String.class);

            return response.getBody();
        } catch (HttpClientErrorException e) {
            System.out.println("Error : ");
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return addTextBox(documentId, field, data, drag);
            } else {
                throw new Exception(e.getMessage());
            }
        }
    }

    public String fillForm(int documentId, List<TextField> data) throws Exception {
        System.out.println("fillForm");
        String fillFormUrl = "https://fps.mobile-id.vn/fps/v1/documents/" + documentId + "/fields";

        System.out.println("fillForm: " + fillFormUrl);
//        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);


        Map<String, Object> requestData = new HashMap<>();
        requestData.put("text", data);

        // Convert requestData to JSON string
        ObjectMapper objectMapper = new ObjectMapper();
        String requestDataJson = objectMapper.writeValueAsString(requestData);

        // Log the JSON string
        System.out.println("Request Data fillForm as JSON: " + requestDataJson);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {
//            ResponseEntity<SynchronizeDto> responseEntity = restTemplate.exchange(addSignatureUrl, HttpMethod.POST, httpEntity, SynchronizeDto.class);
//            return Objects.requireNonNull(responseEntity.getBody()).getDocument_id();

            ResponseEntity<String> response = restTemplate.exchange(fillFormUrl, HttpMethod.PUT, httpEntity, String.class);

            return response.getBody();
        } catch (HttpClientErrorException e) {
            System.out.println("Error : ");
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return fillForm(documentId, data);
            } else {
                throw new Exception(e.getMessage());
            }
        }
    }

    public String fillInit(int documentId, BasicFieldAttribute data) throws Exception {
        System.out.println("fillInit");
        String fillInitUrl = "https://fps.mobile-id.vn/fps/v1/documents/" + documentId + "/initial";

        System.out.println("fillInit: " + fillInitUrl);
//        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        System.out.println("imageBase64: " + data.getImage());


        Map<String, Object> requestData = new HashMap<>();
        requestData.put("field_name", data.getFieldName());
        requestData.put("apply_to_all", data.getApply_to_all());
        if(!data.getApply_to_all()) {
            requestData.put("initial_pages", data.getInitial_pages());
        }
        requestData.put("image", data.getImage());

        // Convert requestData to JSON string
        ObjectMapper objectMapper = new ObjectMapper();
        String requestDataJson = objectMapper.writeValueAsString(requestData);

        // Log the JSON string
        System.out.println("Request Data fillInit as JSON: " + requestDataJson);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {
//            ResponseEntity<SynchronizeDto> responseEntity = restTemplate.exchange(addSignatureUrl, HttpMethod.POST, httpEntity, SynchronizeDto.class);
//            return Objects.requireNonNull(responseEntity.getBody()).getDocument_id();

            ResponseEntity<String> response = restTemplate.exchange(fillInitUrl, HttpMethod.POST, httpEntity, String.class);

            return response.getBody();
        } catch (HttpClientErrorException e) {
            System.out.println("Error : ");
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return fillInit(documentId, data);
            } else {
                throw new Exception(e.getMessage());
            }
        }
    }

    public String deleteSignatue(int documentId, String field_name) throws Exception {
        String deleteSignatureUrl = "https://fps.mobile-id.vn/fps/v1/documents/" + documentId + "/fields";

//        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("field_name", field_name);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {
//            ResponseEntity<SynchronizeDto> responseEntity = restTemplate.exchange(addSignatureUrl, HttpMethod.POST, httpEntity, SynchronizeDto.class);
//            return Objects.requireNonNull(responseEntity.getBody()).getDocument_id();

            ResponseEntity<String> response = restTemplate.exchange(deleteSignatureUrl, HttpMethod.DELETE, httpEntity, String.class);
            // Get the response body as a String

            return response.getBody();
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return deleteSignatue(documentId, field_name);
            } else {
                throw new Exception(e.getMessage());
            }
        }
    }

    public String hashSignatureField(int documentId, HashFileRequest data) throws Exception {
        String hashSignatureFieldUrl = "https://fps.mobile-id.vn/fps/v1/documents/" + documentId + "/hash";

//        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("field_name", data.getFieldName());
        requestData.put("hand_signature_image", data.getHandSignatureImage());
        requestData.put("signing_reason", data.getSigningReason());
        requestData.put("signing_location", data.getSigningLocation());
        requestData.put("skip_verification", true);
        requestData.put("signature_algorithm", "RSA");
        requestData.put("signed_hash", "SHA256");
        requestData.put("certificate_chain", data.getCertificateChain());
        requestData.put("signer_contact", data.getSignerContact());
//        System.out.println("hashSignatureField Data: " + requestData);

//        Gson gson = new Gson();
//        System.out.println("Request Data: " + gson.toJson(requestData));

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {
//            ResponseEntity<SynchronizeDto> responseEntity = restTemplate.exchange(addSignatureUrl, HttpMethod.POST, httpEntity, SynchronizeDto.class);
//            return Objects.requireNonNull(responseEntity.getBody()).getDocument_id();

            ResponseEntity<String> response = restTemplate.exchange(hashSignatureFieldUrl, HttpMethod.POST, httpEntity, String.class);
            // Get the response body as a String
            String responseBody = response.getBody();

//            JsonObject jsonObject1 = gson.fromJson(responseBody, JsonObject.class);
//            return jsonObject1.get("hash_value").getAsString();
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(responseBody);

            return jsonNode.get("hash_value").asText();
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return getBase64ImagePdf(documentId);
            } else {
                throw new Exception(e.getMessage());
            }
        } catch (HttpServerErrorException e) {
            // Bắt các lỗi 5xx và hiển thị thông báo chung
            System.out.println("Server error: " + e.getRawStatusCode());
            throw new Exception("Server error occurred. Please try again later.");
        }
    }

    public String signDocument(int documentId, FpsSignRequest data) throws Exception {
        String signDocumentUrl = "https://fps.mobile-id.vn/fps/v1/documents/" + documentId + "/sign";

//        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("field_name", data.getFieldName());
        requestData.put("hash_value", data.getHashValue());
        requestData.put("signature_value", data.getSignatureValue());
        requestData.put("certificate_chain", data.getCertificateChain());

        System.out.println("signDocument Data: " + requestData);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData, headers);

        try {
//            ResponseEntity<SynchronizeDto> responseEntity = restTemplate.exchange(addSignatureUrl, HttpMethod.POST, httpEntity, SynchronizeDto.class);
//            return Objects.requireNonNull(responseEntity.getBody()).getDocument_id();

            ResponseEntity<String> response = restTemplate.exchange(signDocumentUrl, HttpMethod.POST, httpEntity, String.class);
            // Get the response body as a String
//            System.out.println("signDocument: " + response.getBody());
            return response.getBody();
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return getBase64ImagePdf(documentId);
            } else {
                throw new Exception(e.getMessage());
            }
        } catch (HttpServerErrorException e) {
            // Bắt các lỗi 5xx và hiển thị thông báo chung
            System.out.println("Server error: " + e.getRawStatusCode());
            throw new Exception("Server error occurred. Please try again later.");
        }
    }

    public InputStream getImagePdf(int documentId) throws Exception {

        String getImageBasse64Url = "https://fps.mobile-id.vn/fps/v1/documents/" + documentId;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(headers);

        try {
            ResponseEntity<byte[]> response = restTemplate.exchange(getImageBasse64Url, HttpMethod.GET, httpEntity, byte[].class);
            InputStream inputStreamFile = null;


            if (response.getBody() != null) {
                inputStreamFile = new ByteArrayInputStream(response.getBody());
            }

            return inputStreamFile;
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            if (statusCode.value() == 401) {
                getAccessToken();
                return getImagePdf(documentId);
            } else {
                throw new Exception(e.getMessage());
            }
        }
    }
}
