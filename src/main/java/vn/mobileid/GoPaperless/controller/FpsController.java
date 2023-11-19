package vn.mobileid.GoPaperless.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.mobileid.GoPaperless.model.fpsModel.BasicFieldAttribute;
import vn.mobileid.GoPaperless.model.fpsModel.Signature;
import vn.mobileid.GoPaperless.service.FpsService;

import java.util.List;

@RestController
@RequestMapping("/fps")
public class FpsController {
    private final FpsService fpsService;

    public FpsController(FpsService fpsService) {
        this.fpsService = fpsService;
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

    @DeleteMapping("/{documentId}/{field_name}/deleteSignatue")
    public ResponseEntity<?> deleteSignatue(@PathVariable int documentId, @PathVariable String field_name) throws Exception {

        String response = fpsService.deleteSignatue(documentId, field_name);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
