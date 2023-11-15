package vn.mobileid.GoPaperless.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.mobileid.GoPaperless.model.apiModel.WorkFlowList;
import vn.mobileid.GoPaperless.process.ProcessDb;

import java.util.Map;

@RestController
@RequestMapping("")
public class ApiController {

    @Autowired
    private ProcessDb connect;

    @PostMapping("/checkHeader")
    public ResponseEntity<?> checkHeader(@RequestBody Map<String, String> signingToken) throws Exception {
        System.out.println("signingToken: " + signingToken.get("signingToken"));
        WorkFlowList participants = new WorkFlowList();
        connect.USP_GW_PPL_WORKFLOW_GET(participants, signingToken.get("signingToken"));
        return new ResponseEntity<>(participants, HttpStatus.OK);
    }

    @PostMapping("/headerFooter")
    public ResponseEntity<?> headerFooter(@RequestBody Map<String, String> signingToken) throws Exception {
        System.out.println("signingToken: " + signingToken.get("signingToken"));
        WorkFlowList participants = new WorkFlowList();
        connect.USP_GW_PPL_WORKFLOW_GET(participants, signingToken.get("signingToken"));
        return new ResponseEntity<>(participants, HttpStatus.OK);
    }
}
