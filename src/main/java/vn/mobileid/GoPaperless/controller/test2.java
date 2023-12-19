package vn.mobileid.GoPaperless.controller;

import org.springframework.stereotype.Service;
import vn.mobileid.GoPaperless.utils.CommonFunction;

@Service
public class test2 {

    public static void main(String[] args) throws Exception {
        String cert = "MIIE1TCCA72gAwIBAgIQNumfxxfv7H9TQ6cR58hWSjANBgkqhkiG9w0BAQsFADAwMQswCQYDVQQGEwJWTjEQMA4GA1UECgwHVEVTVCBDQTEPMA0GA1UEAwwGRUFTWUNBMB4XDTIzMDcxMjA3MTgzOVoXDTI0MDcxMTA3MTgzOVowgZ4xCzAJBgNVBAYTAlZOMRcwFQYDVQQIDA5I4buTIENow60gTWluaDEZMBcGA1UEAwwQSHXhu7NuaCBDxrDhu51uZzEhMB8GCgmSJomT8ixkAQEMEUNDQ0Q6MDc5MDgzMDExMzE1MSMwIQYJKoZIhvcNAQkBFhRodXluaGN1b25nQGdtYWlsLmNvbTETMBEGA1UEFBMKMDkwMTc5MDc2NzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKvzy0cqIoZwl8+J7VymGM5ixYcxpzqaUk8kxI2wcOQ7/SwNGiov/My77zfGXxun9YsgUFDpqrmTS+RzWwEt1TjxvdISjzOlefe3k0jTknbHW2qJ6vMlorDLJY/w3JZhkV2MDpHbPMq7thVpq/QCpIoYo8F/wE7Vue4T+hkMJ7nndChwA90s/wuIkUOnsGgRGVAOocIxyKa3zuQ4pKsm+Zb5xDFThXKTrm9hTlqEbDNK6NJyzvccUn6KuTCs+fMwksv5aLIgF9G+vaO+Negkpigs19LUJTdStDWc0aBqGqqSlGoo7xV5Dy7aEqe+v4FaRnLXPg04uwv46GtzExChZJMCAwEAAaOCAXowggF2MAwGA1UdEwEB/wQCMAAwHwYDVR0jBBgwFoAUkpdsPAiDPZ9qtU3jS9rKVkqv1F8wPgYIKwYBBQUHAQEEMjAwMC4GCCsGAQUFBzABhiJodHRwOi8vbW9iaWxlLWlkLnZuL29jc3AvcmVzcG9uZGVyMB8GA1UdEQQYMBaBFGh1eW5oY3VvbmdAZ21haWwuY29tMEUGA1UdIAQ+MDwwOgYLKwYBBAGB7QMBBAEwKzApBggrBgEFBQcCARYdaHR0cHM6Ly9tb2JpbGUtaWQudm4vY3BzLmh0bWwwNAYDVR0lBC0wKwYIKwYBBQUHAwIGCCsGAQUFBwMEBgorBgEEAYI3CgMMBgkqhkiG9y8BAQUwOAYDVR0fBDEwLzAtoCugKYYnaHR0cDovL21vYmlsZS1pZC52bi9jcmwvZ2V0P25hbWU9RUFTWUNBMB0GA1UdDgQWBBQ8MXAEsiObaIBe6MSoUvSgKsv1UzAOBgNVHQ8BAf8EBAMCBPAwDQYJKoZIhvcNAQELBQADggEBAHHdPQ8bv7qK6iDqQOD/rM4112BTDOEoQyYUz0fZifl5cx+/zE6Jp7ZbaYlGOYMgTt+qhCDT5ZYXXknJylh8nmuNeUVRf9WQAm7tcQjj4/eD1qYDVz5mkvOZ51Bwyh1oD8CnZ6MgvRxjf9y1exOGu+zfjgm02YlKGhyiecr/t3UNrUfjB2XwWfNke9XrfKnX0yapXdSeX5O0HHxPrqnGr5AvkYM0VoglbSACvJ3OXHtptTqDaST+AtsIPTue1qHeWUGfgCee6/OwiyDvFwnLxDPcwH1S7t/k4WAQkhqcRCxCLpDJF6EcuktaahYWaV2rITaVZbD/NnROs1z5qKQsKqg=";

        Object[] info1 = new Object[3];
        String[] time = new String[2];
        int[] intRes = new int[1];

        CommonFunction.VoidCertificateComponents(cert, info1, time, intRes);
        if (intRes[0] == 0) {
            System.out.println("info1[0] = " + info1[0]);
            String uid = CommonFunction.getUID(info1[0].toString());
            System.out.println("seal = " + CommonFunction.isSeal(uid));

        } else {
            System.out.println("intRes[0] = " + intRes[0]);
        }
    }
}
