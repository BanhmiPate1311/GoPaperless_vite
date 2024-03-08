/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package vn.mobileid.GoPaperless.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.mobileid.GoPaperless.model.participantsModel.ParticipantsObject;
import vn.mobileid.GoPaperless.process.ProcessDb;
import vn.mobileid.GoPaperless.service.FpsService;

@RestController
@RequestMapping("/participants")
public class ParticipantsController {

    private final ProcessDb connect;

    public ParticipantsController(ProcessDb connect) {
        this.connect = connect;
    }

//    public ResponseEntity<?> updateParticipant(
//            @RequestBody UpdateParticipantRequest updateParticipantRequest) throws Exception {
//
//        String response = electronicIdService.updateParticipant(updateSubjectRequest);
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }
    @PostMapping("/updateParticipant")
    public ResponseEntity<?> updateParticipant(@RequestBody ParticipantsObject data) throws Exception {
        System.out.println("data: " + data.getFirstName());
        System.out.println("data: " + data.getSequenceNumber());
        String result = "";
        if (data.getFirstName() != null) {
            result = connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_UPDATE_INFO(data);
            if (result.equals("1")) {
                System.out.println("update participant success");
            } else {
                System.out.println("update participant fail");
            }
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
