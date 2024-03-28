package vn.mobileid.GoPaperless.controller;

import vn.mobileid.GoPaperless.model.apiModel.MailInfo;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import static vn.mobileid.GoPaperless.utils.CommonFunction.HASH_SHA256;

public class test3 {
    public static void main(String[] args) {
        String test = "<!DOCTYPE HTML\n" +
                "        PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional //EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n" +
                "<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:v=\"urn:schemas-microsoft-com:vml\"\n" +
                "      xmlns:o=\"urn:schemas-microsoft-com:office:office\">\n" +
                "\n" +
                "<head>\n" +
                "    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "    <meta name=\"x-apple-disable-message-reformatting\">\n" +
                "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n" +
                "    <title>Template Email</title>\n" +
                "    <link href=\"https://fonts.googleapis.com/css?family=Montserrat:400,700,200\" rel=\"stylesheet\" />\n" +
                "    <style type=\"text/css\">\n" +
                "        @media only screen and (min-width: 620px) {\n" +
                "            .u-row {\n" +
                "                width: 600px !important;\n" +
                "            }\n" +
                "\n" +
                "            .u-row .u-col {\n" +
                "                vertical-align: top;\n" +
                "            }\n" +
                "\n" +
                "            .u-row .u-col-50 {\n" +
                "                width: 300px !important;\n" +
                "            }\n" +
                "\n" +
                "            .u-row .u-col-100 {\n" +
                "                width: 600px !important;\n" +
                "            }\n" +
                "        }\n" +
                "\n" +
                "        @media (max-width: 620px) {\n" +
                "            .u-row-container {\n" +
                "                max-width: 100% !important;\n" +
                "                padding-left: 0px !important;\n" +
                "                padding-right: 0px !important;\n" +
                "            }\n" +
                "\n" +
                "            .u-row .u-col {\n" +
                "                min-width: 320px !important;\n" +
                "                max-width: 100% !important;\n" +
                "                display: block !important;\n" +
                "            }\n" +
                "\n" +
                "            .u-row {\n" +
                "                width: 100% !important;\n" +
                "            }\n" +
                "\n" +
                "            .u-col {\n" +
                "                width: 100% !important;\n" +
                "            }\n" +
                "\n" +
                "            .u-col>div {\n" +
                "                margin: 0 auto;\n" +
                "            }\n" +
                "\n" +
                "            .no-stack .u-col {\n" +
                "                min-width: 0 !important;\n" +
                "                display: table-cell !important;\n" +
                "            }\n" +
                "\n" +
                "            .no-stack .u-col-50 {\n" +
                "                width: 50% !important;\n" +
                "            }\n" +
                "        }\n" +
                "\n" +
                "        body,\n" +
                "        button {\n" +
                "            margin: 0;\n" +
                "            padding: 0;\n" +
                "            font-family: \"Montserrat\", \"Nucleo\", \"Helvetica\", sans-serif !important;\n" +
                "        }\n" +
                "\n" +
                "        table,\n" +
                "        tr,\n" +
                "        td {\n" +
                "            vertical-align: top;\n" +
                "            border-collapse: collapse;\n" +
                "        }\n" +
                "\n" +
                "        p {\n" +
                "            margin: 0;\n" +
                "            font-size: 14px;\n" +
                "        }\n" +
                "\n" +
                "        a[x-apple-data-detectors='true'] {\n" +
                "            color: inherit !important;\n" +
                "            text-decoration: none !important;\n" +
                "        }\n" +
                "\n" +
                "        table,\n" +
                "        td {\n" +
                "            color: #000000;\n" +
                "        }\n" +
                "\n" +
                "        #u_body a {\n" +
                "            color: #0000ee;\n" +
                "            text-decoration: underline;\n" +
                "        }\n" +
                "\n" +
                "        /* reponsive styles here */\n" +
                "    </style>\n" +
                "</head>\n" +
                "\n" +
                "<body class=\"clean-body u_body\"\n" +
                "      style=\"margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: rgb(247, 249, 252); color: #000000; height: 100%; min-height: 100vh; display: flex; flex-wrap: wrap; justify-content: center; align-items: center;\">\n" +
                "<div>\n" +
                "    <table id=\"u_body\"\n" +
                "           style=\"border-collapse: collapse; table-layout: fixed; border-spacing: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; vertical-align: top; min-width: 320px; Margin: 0 auto; background-color: #e7e7e7; width:100%\"\n" +
                "           cellpadding=\"0\" cellspacing=\"0\">\n" +
                "        <tbody>\n" +
                "        <tr style=\"vertical-align: top\">\n" +
                "            <td style=\"word-break: break-word; border-collapse: collapse !important; vertical-align: top\">\n" +
                "                <div class=\"u-row-container\" style=\"padding: 0px; background-color: rgb(247, 249, 252)\">\n" +
                "                    <div class=\"u-row\"\n" +
                "                         style=\"margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;\">\n" +
                "                        <div\n" +
                "                                style=\"border-collapse: collapse; display: table; width: 100%; height: 100%; background-color: transparent;\">\n" +
                "                            <div class=\"u-col u-col-100\"\n" +
                "                                 style=\"max-width: 320px; min-width: 600px; display: table-cell; vertical-align: top;padding:25px 0px 0px ;\">\n" +
                "                                <img src=\"@logoUrl\" title=\"logo\" width=\"200\" />\n" +
                "                                <div\n" +
                "                                        style=\"background-color: #ffffff; height: 100%; width: 100% !important; border-radius: 0px; -webkit-border-radius: 0px; -moz-border-radius: 0px;\">\n" +
                "                                    <div\n" +
                "                                            style=\"box-sizing: border-box; height: 100%; padding: 0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-right: 0px solid transparent; border-bottom: 0px solid transparent; border-radius: 0px; -webkit-border-radius: 0px; -moz-border-radius: 0px;\">\n" +
                "                                        <table id=\"u_content_heading_4\" role=\"presentation\" cellpadding=\"0\"\n" +
                "                                               cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
                "                                            <tbody>\n" +
                "                                            <tr>\n" +
                "                                                <td class=\"v-container-padding-padding\"\n" +
                "                                                    style=\"overflow-wrap: break-word; word-break: break-word; padding: 16px 0 0 50px;\"\n" +
                "                                                    align=\"left\">\n" +
                "                                                    <div\n" +
                "                                                            style=\"margin-bottom: 20px; color: #1c1c1c; line-height: 28px; font-size: 16px; word-break: normal;\">\n" +
                "                                                        <p style=\"font-weight: 700; font-size: 20px\">Hello, @FirstLastName\n" +
                "                                                        </p>\n" +
                "                                                        <span style=\"font-size: 16px;\">\n" +
                "                                                                        @FirstLastNameSigner &#9993; @EmailSigner\n" +
                "                                                                        <span>has invited you to sign</span>\n" +
                "                                                        </span>\n" +
                "                                                        <span style=\"color: #7d51da\">\n" +
                "                                                                        <a style=\"text-decoration: none; cursor: pointer;\"\n" +
                "                                                                           th:href=\"${signUrl}\" target=\"_blank\">\n" +
                "                                                                            @FileName .\n" +
                "                                                                        </a>                                                                    \n" +
                "                                                        </span>\n" +
                "                                                    </div>\n" +
                "                                                    <hr style=\"background-color: rgb(223, 219, 214);\" />\n" +
                "                                                </td>\n" +
                "                                            </tr>\n" +
                "                                            </tbody>\n" +
                "                                        </table>\n" +
                "\n" +
                "                                        <!-- Other tables and content here -->\n" +
                "                                        <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"\n" +
                "                                               border=\"0\" style=\"margin-top: 10px\">\n" +
                "                                            <tbody>\n" +
                "                                            <tr>\n" +
                "                                                <td class=\"v-container-padding-padding\"\n" +
                "                                                    style=\"overflow-wrap:break-word;word-break:break-word;padding: 0 46px; border-left: 5px solid #ebebeb;\"\n" +
                "                                                    align=\"left\">\n" +
                "                                                    <div\n" +
                "                                                            style=\"margin: 0px; color: #1c1c1c; line-height: 28px; font-size: 16px; word-break: normal;\">\n" +
                "                                                        <div th:if=\"${documentFileName!=null}\">\n" +
                "                                                                        <span\n" +
                "                                                                                style=\"font-weight: 700;\">Documents:</span><br />\n" +
                "                                                            <p>@FileName</p>\n" +
                "                                                        </div>\n" +
                "\n" +
                "                                                        <div th:if=\"${signingDeadline!=null}\">\n" +
                "                                                                        <span style=\"font-weight: 700;\">Signing\n" +
                "                                                                            deadline:</span><br />\n" +
                "                                                            <p>@SigningDeadline</p>\n" +
                "                                                        </div>\n" +
                "\n" +
                "                                                        <div th:if=\"${message!=null}\">\n" +
                "                                                                        <span\n" +
                "                                                                                style=\"font-weight: 700;\">Message:</span><br />\n" +
                "                                                            <p>@Message</p>\n" +
                "                                                        </div>\n" +
                "                                                    </div>\n" +
                "                                                </td>\n" +
                "                                            </tr>\n" +
                "                                            <tr>\n" +
                "                                                <td class=\"v-container-padding-padding\"\n" +
                "                                                    style=\"padding: 30px 0px 0px;\"></td>\n" +
                "                                            </tr>\n" +
                "                                            <tr>\n" +
                "                                                <td class=\"v-container-padding-padding\"\n" +
                "                                                    style=\"overflow-wrap:break-word;word-break:break-word;padding: 0 46px\"\n" +
                "                                                    align=\"left\">\n" +
                "                                                    <a style=\"font-weight: 700; color: #fff; text-decoration: none; font-size: 14px; cursor: pointer;\"\n" +
                "                                                       href=\"@LinkSign\" target=\"_blank\">\n" +
                "                                                        <button\n" +
                "                                                                style=\"background-color: rgb(125, 81, 218); width: 100%;\n" +
                "                                 color: #fff; padding: 15px 0; display: block; border: none; border-radius: 27px; cursor: pointer; font-weight: 700;\">\n" +
                "                                                            Review and sign\n" +
                "                                                        </button>\n" +
                "                                                    </a>\n" +
                "                                                </td>\n" +
                "                                            </tr>\n" +
                "                                            </tbody>\n" +
                "                                        </table>\n" +
                "\n" +
                "                                        <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"\n" +
                "                                               border=\"0\" style=\"margin-top: 30px;\">\n" +
                "                                            <tbody>\n" +
                "                                            <tr>\n" +
                "                                                <td class=\"v-container-padding-padding\"\n" +
                "                                                    style=\"overflow-wrap: break-word; word-break: break-word;\"\n" +
                "                                                    align=\"left\">\n" +
                "                                                    <p\n" +
                "                                                            style=\"color: #9e9c9c; text-align: center; font-size: 13px; padding: 32px 0px;\">\n" +
                "                                                        Join the community of e-signers and stay updated.\n" +
                "                                                    </p>\n" +
                "                                                </td>\n" +
                "                                            </tr>\n" +
                "                                            </tbody>\n" +
                "                                        </table>\n" +
                "\n" +
                "                                        <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"\n" +
                "                                               border=\"0\">\n" +
                "                                            <tbody>\n" +
                "                                            <tr>\n" +
                "                                                <td class=\"v-container-padding-padding\"\n" +
                "                                                    style=\"overflow-wrap: break-word; word-break: break-word; padding: 0px 0px 16px;\"\n" +
                "                                                    align=\"left\">\n" +
                "                                                    <div align=\"center\">\n" +
                "                                                        <a href=\"https://www.linkedin.com/company/information-technologies-services-solutions\"\n" +
                "                                                           title=\"LinkedIn\" target=\"_blank\">\n" +
                "                                                            <img src=\"https://rssp.mobile-id.vn/downloads/paperless/images/linkedin-letters.png\"\n" +
                "                                                                 alt=\"LinkedIn\" title=\"LinkedIn\" width=\"18\"\n" +
                "                                                                 style=\"outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; clear: both; display: block !important; border: none; height: auto; float: none; max-width: 32px !important\">\n" +
                "                                                        </a>\n" +
                "                                                    </div>\n" +
                "                                                </td>\n" +
                "                                            </tr>\n" +
                "                                            </tbody>\n" +
                "                                        </table>\n" +
                "                                    </div>\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                        </div>\n" +
                "                    </div>\n" +
                "                    <div class=\"u-row\"\n" +
                "                         style=\"margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;\">\n" +
                "                        <div\n" +
                "                                style=\"border-collapse: collapse; display: table; width: 100%; height: 100%; background-color: transparent;\">\n" +
                "                            <div class=\"u-col u-col-100\"\n" +
                "                                 style=\"max-width: 320px; min-width: 600px; display: table-cell; vertical-align: top;\">\n" +
                "                                <div\n" +
                "                                        style=\"background-color: #ffffff; height: 100%; width: 100% !important; border-radius: 0px; -webkit-border-radius: 0px; -moz-border-radius: 0px;\">\n" +
                "                                    <div\n" +
                "                                            style=\"box-sizing: border-box; height: 100%; padding: 0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-right: 0px solid transparent; border-bottom: 0px solid transparent; border-radius: 0px; -webkit-border-radius: 0px; -moz-border-radius: 0px;\">\n" +
                "                                        <div class=\"u-row-container\"\n" +
                "                                             style=\"padding: 0px; background-color: rgb(247, 249, 252); text-align: center;\">\n" +
                "                                            <table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n" +
                "                                                <tbody>\n" +
                "                                                <tr>\n" +
                "                                                    <td style=\"vertical-align: middle;\">\n" +
                "                                                        <a th:href=\"${emailPreferencesUrl}\"\n" +
                "                                                           style=\"color: #9e9c9c; font-size: 13px; text-decoration: none; cursor: pointer;\">Email\n" +
                "                                                            preferences</a>\n" +
                "                                                    </td>\n" +
                "                                                    <td style=\"vertical-align: middle; padding: 10px;\"> <a\n" +
                "                                                            style=\"color: #9e9c9c; font-size: 2.5rem; margin-bottom: 5px; text-decoration: none; cursor: pointer;\">&bull;</a>\n" +
                "                                                    </td>\n" +
                "                                                    <td style=\"vertical-align: middle;\"> <a\n" +
                "                                                            th:href=\"${termsOfServiceUrl}\"\n" +
                "                                                            style=\"color: #9e9c9c; font-size: 13px; text-decoration: none; cursor: pointer;\">Terms\n" +
                "                                                        of Service</a>\n" +
                "                                                    </td>\n" +
                "                                                </tr>\n" +
                "                                                </tbody>\n" +
                "                                            </table>\n" +
                "\n" +
                "                                            <p style=\"color: #9e9c9c; font-size: 13px; padding-bottom: 16px;\">\n" +
                "                                                <span th:text=\"${copyright}\"></span>&#8212;\n" +
                "                                                <a th:href=\"${enterpriseUrl}\" target=\"_blank\"\n" +
                "                                                   th:text=\"${enterpriseName}\"></a> &#8212;\n" +
                "                                                e-signing as an everyday service\n" +
                "                                            </p>\n" +
                "                                        </div>\n" +
                "\n" +
                "                                    </div>\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                        </div>\n" +
                "                    </div>\n" +
                "                </div>\n" +
                "            </td>\n" +
                "        </tr>\n" +
                "        </tbody>\n" +
                "    </table>\n" +
                "</div>\n" +
                "</body>\n" +
                "\n" +
                "</html>";
        String url = "https://rssp.mobile-id.vn/downloads/paperless/images/logo_paperless-color.png";
        String newAttachContent = test.replaceAll("@logoUrl", url);
        System.out.println(newAttachContent);
    }


}
