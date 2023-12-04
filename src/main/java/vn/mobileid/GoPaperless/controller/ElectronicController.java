package vn.mobileid.GoPaperless.controller;

import org.jmrtd.lds.icao.DG2File;
import org.jmrtd.lds.iso19794.FaceImageInfo;
import org.jmrtd.lds.iso19794.FaceInfo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.mobileid.GoPaperless.dto.elecdto.GetSubjectDto;
import vn.mobileid.GoPaperless.dto.elecdto.PersonalDto;
import vn.mobileid.GoPaperless.model.Electronic.request.CheckIdentityRequest;
import vn.mobileid.GoPaperless.model.Electronic.response.SubjectResponse;
import vn.mobileid.GoPaperless.service.ElectronicService;

import java.io.ByteArrayInputStream;
import java.io.DataInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/elec")
public class ElectronicController {

    private final ElectronicService electronicIdService;

    public ElectronicController(ElectronicService electronicIdService) {
        this.electronicIdService = electronicIdService;
    }


    @PostMapping("/checkPersonalCode")
    public ResponseEntity<?> checkPersonalCode(@RequestBody CheckIdentityRequest checkIdentityRequest) throws IOException {
        SubjectResponse response = electronicIdService.getSubject(checkIdentityRequest);

        GetSubjectDto getSubjectDto = new GetSubjectDto();
        getSubjectDto.setStatus(response.getStatus());
        getSubjectDto.setMessage(response.getMessage());
        getSubjectDto.setDtis_id(response.getDtis_id());
        if (response.getPersonal_informations() != null) {

            // Giải mã chuỗi Base64 thành mảng byte
            byte[] byteArray = Base64.getDecoder().decode(response.getPersonal_informations().getDg2_value());

            // DG2
            byte[] portrait = null;
            ByteArrayInputStream bais = new ByteArrayInputStream(byteArray);
            DG2File dg2File = new DG2File(bais);
            bais.close();
            List<FaceInfo> faceInfos = dg2File.getFaceInfos();
            List<FaceImageInfo> allFaceImageInfos = new ArrayList<>();
            for (FaceInfo faceInfo : faceInfos) {
                allFaceImageInfos.addAll(faceInfo.getFaceImageInfos());
            }
            if (!allFaceImageInfos.isEmpty()) {
                FaceImageInfo faceImageInfo = allFaceImageInfos.iterator().next();
                int imageLength = faceImageInfo.getImageLength();
                DataInputStream dataInputStream = new DataInputStream(faceImageInfo.getImageInputStream());
                byte[] buffer = new byte[imageLength];
                dataInputStream.readFully(buffer, 0, imageLength);
                portrait = buffer;
            }

            String base64Image = Base64.getEncoder().encodeToString(portrait);

            PersonalDto personalDto = new PersonalDto();
            personalDto.setPersonalNumber(response.getPersonal_informations().getPersonal_number());
            personalDto.setFullName(response.getPersonal_informations().getFull_name());
            personalDto.setBirthDate(response.getPersonal_informations().getBirth_date());
            personalDto.setGender(response.getPersonal_informations().getGender());
            personalDto.setNationality(response.getPersonal_informations().getNationality());
            personalDto.setEthnic(response.getPersonal_informations().getEthnic());
            personalDto.setReligion(response.getPersonal_informations().getReligion());
            personalDto.setPlaceOfOrigin(response.getPersonal_informations().getPlace_of_origin());
            personalDto.setPersonalIdentification(response.getPersonal_informations().getPersonal_identification());
            personalDto.setIssuanceDate(response.getPersonal_informations().getIssuance_date());
            personalDto.setExpiryDate(response.getPersonal_informations().getExpiry_date());
            personalDto.setEmail(response.getPersonal_informations().getEmail());
            personalDto.setMobile(response.getPersonal_informations().getMobile());
            personalDto.setDg1(response.getPersonal_informations().getDg1_value());
            personalDto.setDg2(base64Image);
            personalDto.setSubject_id(response.getPersonal_informations().getSubject_id());
            personalDto.setIdentity_document_type(response.getPersonal_informations().getIdentity_document_type());
            getSubjectDto.setPersonal_informations(personalDto);
        }

        return new ResponseEntity<>(getSubjectDto, HttpStatus.OK);
    }
}
