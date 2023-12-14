package vn.mobileid.GoPaperless.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.mobileid.GoPaperless.model.apiModel.Enterprise;
import vn.mobileid.GoPaperless.process.ProcessDb;

import java.util.ArrayList;
import java.util.List;

@Service
public class test2 {
    @Autowired
    private static ProcessDb connect;
    public static void main(String[] args) throws Exception {
        List<Enterprise> enterpriseList = new ArrayList<>();
        connect.USP_GW_ENTERPRISE_LIST(enterpriseList);
        for (Enterprise enterprise : enterpriseList) {
            System.out.println(enterprise.getName());
        }
    }
}
