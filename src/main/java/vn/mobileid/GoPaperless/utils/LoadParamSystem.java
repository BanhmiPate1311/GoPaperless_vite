package vn.mobileid.GoPaperless.utils;

import org.springframework.stereotype.Component;
import vn.mobileid.GoPaperless.model.apiModel.ConnectorName;
import vn.mobileid.GoPaperless.model.apiModel.Enterprise;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Component
public class LoadParamSystem {
    private static final Map<String, ArrayList<ConnectorName>> mapStart = new HashMap<>();

    private static final Map<String, ArrayList<Enterprise>> mapEnterpriseStart = new HashMap<>();
    public static ArrayList<Enterprise> getParamEnterpriseStart(String value) {
        ArrayList<Enterprise> result = mapEnterpriseStart.get(value.trim());

        return result;
    }

    public static void updateParamEnterpriseSystem(String sKey, ArrayList<Enterprise> sValue) {
        mapEnterpriseStart.put(sKey, sValue);
    }
}
