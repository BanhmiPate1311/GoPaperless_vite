package vn.mobileid.GoPaperless.controller;

import vn.mobileid.GoPaperless.model.apiModel.MailInfo;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import static vn.mobileid.GoPaperless.utils.CommonFunction.HASH_SHA256;

public class test3 {
    public static void main(String[] args) {
        String test = "Dear @FirstLastName, <br /><br />\n" +
                " You have received the attached document from @FirstLastNameSigner <@EmailSigner> <br /><br /> Thanks you<br />GoPaperless Gateway";
        String newAttachContent = test.replaceAll("@FirstLastName", "Huynh" + " " + "Cuong").replaceAll("@FirstLastNameSigner","Cuong" + " " + "Huynh").replaceAll("@EmailSigner","c@gmail");
        System.out.println(newAttachContent);
    }


}
