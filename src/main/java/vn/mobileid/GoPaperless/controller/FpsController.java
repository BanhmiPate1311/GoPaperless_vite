package vn.mobileid.GoPaperless.controller;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.mobileid.GoPaperless.dto.rsspDto.RsspRequest;
import vn.mobileid.GoPaperless.dto.rsspDto.TextField;
import vn.mobileid.GoPaperless.model.fpsModel.BasicFieldAttribute;
import vn.mobileid.GoPaperless.model.fpsModel.Signature;
import vn.mobileid.GoPaperless.process.ProcessDb;
import vn.mobileid.GoPaperless.service.FpsService;

import java.io.InputStream;
import java.util.List;

@RestController
@RequestMapping("/fps")
public class FpsController {
    private final FpsService fpsService;

    private final ProcessDb connect;

    public FpsController(FpsService fpsService, ProcessDb connect) {
        this.fpsService = fpsService;
        this.connect = connect;
    }

    @GetMapping("/{documentId}/getFields")
    public ResponseEntity<?> getFields(@PathVariable int documentId) throws Exception {
        // Đọc file checkid.exe từ thư mục tài nguyên tĩnh
        String fields = fpsService.getFields(documentId);
        return new ResponseEntity<>(fields, HttpStatus.OK);
    }

    @GetMapping("/{documentId}/verification")
    public ResponseEntity<?> verification(@PathVariable int documentId) throws Exception {
        // Đọc file checkid.exe từ thư mục tài nguyên tĩnh
        List<Signature> signatures = fpsService.getVerification(documentId);
        return new ResponseEntity<>(signatures, HttpStatus.OK);
    }

    @PostMapping("/{documentId}/{field}/addSignature")
    public ResponseEntity<?> addSignature(@PathVariable int documentId, @PathVariable String field, @RequestBody BasicFieldAttribute data) throws Exception {

        String response = fpsService.addSignature(documentId, field, data, true);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{documentId}/{field}/putSignature")
    public ResponseEntity<?> putSignature(@PathVariable int documentId, @PathVariable String field, @RequestBody BasicFieldAttribute data) throws Exception {

        String response = fpsService.putSignature(documentId, field, data);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/{documentId}/{field}/addTextBox")
    public ResponseEntity<?> addTextField(@PathVariable int documentId, @PathVariable String field, @RequestBody BasicFieldAttribute data) throws Exception {

        String response = fpsService.addTextBox(documentId, field, data, true);
        System.out.println("field: " + field);
        System.out.println("qrtoken: " + data.getQrToken());
        System.out.println("signingtoken: " + data.getSigningToken());
        if (("qrcode").equals(field)) {
            String result = connect.USP_GW_PPL_WORKFLOW_UPDATE_QR_TOKEN(data.getSigningToken(), data.getQrToken(), "Gateway view");
            if (result.equals("1")) {
                System.out.println("update qr token success");
            } else {
                System.out.println("update qr token fail");
            }
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{documentId}/{field_name}/deleteSignatue")
    public ResponseEntity<?> deleteSignatue(@PathVariable int documentId, @PathVariable String field_name) throws Exception {

        String response = fpsService.deleteSignatue(documentId, field_name);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/{documentId}/fillInit")
    public ResponseEntity<?> fillInit(@PathVariable int documentId, @RequestBody BasicFieldAttribute data) throws Exception {

        String response = fpsService.fillInit(documentId, data);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/{documentId}/fillForm")
    public ResponseEntity<?> fillForm(@PathVariable int documentId, @RequestBody RsspRequest data) throws Exception {
        List<TextField> textFields = data.getTextField();
        String response = fpsService.fillForm(documentId, textFields);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/download/{documentId}")
    public ResponseEntity<?> download(@PathVariable int documentId) throws Exception {

        InputStream response = fpsService.getImagePdf(documentId);
        if (response != null) {
            // trả về stream input file để download kèm header content type và content
            // length để browser hiểu
            HttpHeaders headers = new HttpHeaders();
//                headers.add("Content-Disposition", "attachment; filename=" + "file.pdf");
            headers.add("Content-Disposition", "attachment; filename=" + documentId + ".pdf");
            // jrbFile.getFileName());
            InputStreamResource inputStreamResource = new InputStreamResource(response);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .headers(headers)
                    .body(inputStreamResource);
        } else {
            // trả về lỗi không tìm thấy file để download
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");
        }
    }


}
