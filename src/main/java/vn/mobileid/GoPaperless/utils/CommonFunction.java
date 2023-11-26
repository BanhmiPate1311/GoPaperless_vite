/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package vn.mobileid.GoPaperless.utils;

import org.bouncycastle.asn1.x500.AttributeTypeAndValue;
import org.bouncycastle.asn1.x500.RDN;
import org.bouncycastle.asn1.x500.X500Name;

import javax.xml.bind.DatatypeConverter;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.InputStream;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.Signature;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Enumeration;


/**
 * @author PHY
 */

public class CommonFunction {

    final public static String HASH_SHA256 = "SHA-256";
    final public static String HASH_SHA1 = "SHA-1";
    public static final String OID_CN = "2.5.4.3";
    public static final String OID_O = "2.5.4.3";

    public static String CheckTextNull(String sValue) {
        if (sValue == null) {
            sValue = "";
        } else {
            if (Difinitions.CONFIG_EXCEPTION_STRING_ERROR_NULL.equals(sValue.trim().toUpperCase())) {
                sValue = "";
            }
        }
        return sValue.trim();
    }

    public static boolean isNullOrEmpty(String value) {
        return value == null || value.trim().isEmpty() || value.trim().equalsIgnoreCase("null");
    }

    public static boolean isNotNullOrEmpty(String value) {
        return value != null && !value.trim().isEmpty() && !value.trim().equalsIgnoreCase("null");
    }

    public static String getCommonNameInDN(String dn) {
        X500Name subject = new X500Name(dn);
        RDN[] rdn = subject.getRDNs();
        for (RDN value : rdn) {
            AttributeTypeAndValue[] attributeTypeAndValue = value.getTypesAndValues();
            if (attributeTypeAndValue[0].getType().toString().equals(OID_CN)) {
                return attributeTypeAndValue[0].getValue().toString();
            }
        }
        return "";
    }

    public static String getPKCS1Signature(String data, String relyingPartyKeyStore, String relyingPartyKeyStorePassword) throws Exception {
        KeyStore keystore = KeyStore.getInstance("PKCS12");
        InputStream is = new FileInputStream(relyingPartyKeyStore);
        System.out.println("relyingPartyKeyStorePassword: " + relyingPartyKeyStorePassword);
        keystore.load(is, relyingPartyKeyStorePassword.toCharArray());

        Enumeration<String> e = keystore.aliases();
        PrivateKey key = null;
        String aliasName = "";
        while (e.hasMoreElements()) {
            aliasName = e.nextElement();
            key = (PrivateKey) keystore.getKey(aliasName, relyingPartyKeyStorePassword.toCharArray());
            if (key != null) {
                break;
            }
        }

        Signature sig = Signature.getInstance("SHA1withRSA");
        sig.initSign(key);
        sig.update(data.getBytes());
        return DatatypeConverter.printBase64Binary(sig.sign());
    }

    public static void VoidCertificateComponents(String certstr, Object[] info, String[] time, int[] intRes) {
        try {
            if (certstr.toUpperCase().contains("BEGIN CERTIFICATE")) {
                certstr = certstr.replace("-----BEGIN CERTIFICATE-----", "");
            }
            if (certstr.toUpperCase().contains("END CERTIFICATE")) {
                certstr = certstr.replace("-----END CERTIFICATE-----", "");
            }
            DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
            CertificateFactory certFactory1 = CertificateFactory.getInstance("X.509");
//            InputStream in = new ByteArrayInputStream(DatatypeConverter.parseBase64Binary(certstr));
            byte[] certBytes = Base64.getDecoder().decode(certstr);
            InputStream in = new ByteArrayInputStream(certBytes);
            X509Certificate cert = (X509Certificate) certFactory1.generateCertificate(in);
            info[0] = cert.getSubjectDN();
            info[0] = info[0].toString().replace("\\", "");
            info[1] = cert.getIssuerDN();
            info[2] = cert.getSerialNumber().toString(16);
            time[0] = formatter.format(cert.getNotBefore());
            time[1] = formatter.format(cert.getNotAfter());
            intRes[0] = 0;
        } catch (Exception e) {
            System.out.print("VoidCertificateComponents: " + e.getMessage());
            intRes[0] = 1;
        }
    }

    public static String getCommonnameInDN(String dn) {
        X500Name subject = new X500Name(dn);
        RDN[] rdn = subject.getRDNs();
        for (int j = 0; j < rdn.length; j++) {
            AttributeTypeAndValue[] attributeTypeAndValue = rdn[j].getTypesAndValues();
            if (attributeTypeAndValue[0].getType().toString().equals(OID_O)) {
                return attributeTypeAndValue[0].getValue().toString();
            }
        }
        return "";
    }
}
