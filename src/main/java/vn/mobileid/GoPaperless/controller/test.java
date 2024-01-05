package vn.mobileid.GoPaperless.controller;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.*;
import java.util.Date;
import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Map;

import static vn.mobileid.GoPaperless.utils.TimeUtils.convertToCurrentTimezone;


public class test {
    public static void main(String[] args) throws ParseException {
//        String time = "2023-12-04 09:24:26";
//        ZoneId timezone = ZoneId.systemDefault();
////        ZonedDateTime zonedDateTime = convertToCurrentTimezone(time);
//        // convert "2023-12-04 09:24:26" to ZonedDateTime
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
//        LocalDateTime localDateTime = LocalDateTime.parse(time, formatter);
//        ZonedDateTime zonedDateTime = localDateTime.atZone(ZoneId.systemDefault());
//        System.out.println(zonedDateTime.toString());
//
//        // remove [Asia/Bangkok] from ZonedDateTime
//        String zonedDateTimeString = zonedDateTime.toString();
//        String[] zonedDateTimeStringArray = zonedDateTimeString.split("\\[");
//        String zonedDateTimeStringWithoutTimeZone = zonedDateTimeStringArray[0];
//        System.out.println(zonedDateTimeStringWithoutTimeZone);

        //convert "Wed Jul 12 14:18:39 ICT 2023" to ZonedDateTime
//        String time = "Wed Jul 12 14:18:39 ICT 2023";
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE MMM dd HH:mm:ss zzz yyyy");
//        LocalDateTime localDateTime = LocalDateTime.parse(time, formatter);
//        ZonedDateTime zonedDateTime = localDateTime.atZone(ZoneId.systemDefault());
//        System.out.println(zonedDateTime.toString());

//        RestTemplate restTemplate = new RestTemplate();
//        String getImageBase64Url = "https://fps.mobile-id.vn/fps/v1/documents/" + 2165 + "/base64";
//        System.out.println("getImageBase64Url: " + getImageBase64Url);
//
//        String accessToken ="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDIxMTYzNTU3MTEsImlhdCI6MTcwMjExMjc1NTcxMSwiaXNzIjoiaHR0cHM6Ly9mcHMubW9iaWxlLWlkLnZuIiwiYXVkIjoiZW50ZXJwcmlzZSIsInN1YiI6IkZQUyIsInR5cCI6IkJlYXJlciIsInNjb3BlIjoiRG9rb2JpdF9HYXRld2F5Iiwic2lkIjoiNDc3OC0xNzIyMy01OTc4MyIsImF6cCI6Ik1vYmlsZS1JRCBDb21wYW55IiwibW9iaWxlIjoiMTkwMCA2ODg0IiwiYWlkIjozLCJpY2kiOjN9.be0BiTxvWRHw1uoJAPQUoCIT8BDBeVcgnq9WI0uH19vZqOq1Z1WRgl_MOtmlOh5uk6i0SfDX5aZkFS-zFfBzg-FaTRnnybVMQiwVfKk-qt-jnlZ1TCF6Qwic935mN3WD8P3eil1h84_OvKjnkiF2YSHmdj0pa1nLyvqZH2gBqLoKSdIF2m2v6fIg9EYP-u3fwpPFau6rgaeGAK7Sb94hCblYrx2JXrYkujOAIBAyeQTvx56ejlcPia2xRY8q-u7KMkKx5ItsvdPP_1uxtCcfxtzrsIYtjRRfJHD7Fuehffcg7FnBp0G1JsjlOkN3cjnlbY05VhIstIxCicGh0HtW_g";
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//        headers.setBearerAuth(accessToken);
//
//        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(headers);
//
//        try {
//            ResponseEntity<String> response = restTemplate.exchange(getImageBase64Url, HttpMethod.GET, httpEntity, String.class);
////            System.out.println("response: " + response.getBody());
//
//            System.out.println("response: " + response.getBody());
//        } catch (HttpClientErrorException e) {
//            HttpStatus statusCode = e.getStatusCode();
//            System.out.println("HTTP Status Code: " + statusCode.value());
//
//        }

        // convert  "2023-08-28T10:30:48+07:00" to "2023-08-28 10:30:48.0"
        String time = "2023-08-28T10:30:48+07:00";
        // Parse the input string
        OffsetDateTime offsetDateTime = OffsetDateTime.parse(time);

        // Define the desired output format
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.S");

        // Format the OffsetDateTime using the formatter
        String output = offsetDateTime.format(formatter);

        // Print the result
        System.out.println(output);


    }
}
