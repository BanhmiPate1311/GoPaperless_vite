package vn.mobileid.GoPaperless.utils;

import org.springframework.stereotype.Component;
import vn.mobileid.GoPaperless.model.apiModel.ConnectorName;
import vn.mobileid.GoPaperless.model.apiModel.Enterprise;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class LoadParamSystem {
    private static final Map<String, ArrayList<ConnectorName>> mapStart = new HashMap<>();

    private static final Map<String, List<Enterprise>> mapEnterpriseStart = new HashMap<>();
    public static List<Enterprise> getParamEnterpriseStart(String value) {
        List<Enterprise> result = mapEnterpriseStart.get(value.trim());

        return result;
    }

    public static void updateParamEnterpriseSystem(String sKey, List<Enterprise> sValue) {
        mapEnterpriseStart.put(sKey, sValue);
    }
}
