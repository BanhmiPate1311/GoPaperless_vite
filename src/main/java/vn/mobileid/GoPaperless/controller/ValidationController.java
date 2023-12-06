package vn.mobileid.GoPaperless.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.mobileid.GoPaperless.model.gwModal.ValidPostBackRequest;
import vn.mobileid.GoPaperless.model.gwModal.ValidationResquest;
import vn.mobileid.GoPaperless.service.ValidationService;

@RestController
@RequestMapping("/val")
public class ValidationController {
    @Autowired
    private ValidationService validationService;

    @PostMapping("/getView")
    public ResponseEntity<?> getView (@RequestBody ValidationResquest validationResquest){
        String result = validationService.getView(validationResquest);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/postback")
    public ResponseEntity<?> postback (@RequestBody ValidPostBackRequest validPostBackRequest) throws Exception {

        String result = validationService.postback(validPostBackRequest);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/checkStatus")
    public ResponseEntity<?> checkStatus (@RequestBody ValidPostBackRequest validPostBackRequest) throws Exception {

        int result = validationService.checkStatus(validPostBackRequest);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
