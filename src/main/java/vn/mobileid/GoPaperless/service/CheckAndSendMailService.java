package vn.mobileid.GoPaperless.service;

import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import vn.mobileid.GoPaperless.model.apiModel.MailInfo;
import vn.mobileid.GoPaperless.model.apiModel.Participants;
import vn.mobileid.GoPaperless.process.ProcessDb;
import vn.mobileid.GoPaperless.utils.Difinitions;

import java.util.ArrayList;
import java.util.List;

@Service
public class CheckAndSendMailService {
    private final ProcessDb connect;

    public CheckAndSendMailService(ProcessDb connect) {
        this.connect = connect;
    }

    public void shareToSign(
            String workFlowType,

            String signingToken,
            String signerName,
            String signerEmail,
            String fileName,
            Participants participants,
            byte[] data) throws Exception {
        String textMailKey = "email_invite_signing";
        String attachMailKey = "email_send_a_copy";
        MailInfo textMailInfo = connect.USP_GW_EMAIL_TEMPLATE_GET(2, textMailKey);
        MailInfo attachMailInfo = connect.USP_GW_EMAIL_TEMPLATE_GET(2, attachMailKey);
        String newSignerToken = null;
        Participants signerFirst = participants;
        if (!workFlowType.equals("parallel")) {
            boolean restart = false; // Biến này để kiểm tra xem có cần thực hiện lại từ đầu không
            do {
                List<Participants> responseList = connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_GET_NEXT_PARTICIPANT(newSignerToken);
                restart = false; // Gán lại giá trị mặc định trước khi lặp lại
                System.out.println("responseList: " + responseList.size());
                if (responseList.size() > 0) {
                    // Duyệt qua list participant và tiến hành gửi mail
                    for (Participants participant : responseList) {
                        String participantName = participant.getLastName() + " " + participant.getFirstName();
                        String newAttachSubject = attachMailInfo.getSubject().replaceAll("\\[filename\\]", fileName);
                        String newTextContent = textMailInfo.getBody().replaceAll("@FirstLastNameSigner", signerName).replaceAll("@FirstLastName", participantName).replaceAll("@EmailSigner", signerEmail).replaceAll("@LinkSign", "https://uat-paperless-gw.mobile-id.vn/view/signing/" + signingToken + "?access_token=" + signerFirst.getSignerToken());
                        String newAttachContent = attachMailInfo.getBody().replaceAll("@FirstLastNameSigner", signerName).replaceAll("@FirstLastName", participantName).replaceAll("@EmailSigner", signerEmail);
                        if (participant.getSignerType() != 5) {
                            // Gửi mail
                            try {
                                // Gửi mail
                                MailService.sendMail(null, null, participant.getEmail(), textMailInfo.getSubject(), newTextContent);
                            } catch (Exception e) {
                                e.printStackTrace(); // In ra stack trace của lỗi
                                // Ném lại ngoại lệ để dừng chương trình
                                throw new RuntimeException("Error occurred while sending text mail to " + participant.getEmail(), e);
                            }
                        } else {
                            try {
                                // Convert content from base64 to byte[]

                                // Gửi attachment
                                MailService.sendMail(fileName, data, participant.getEmail(), newAttachSubject, newAttachContent);
                            } catch (Exception e) {
                                e.printStackTrace(); // In ra stack trace của lỗi
                                // Ném lại ngoại lệ để dừng chương trình
                                throw new RuntimeException("Error occurred while sending attachment to " + participant.getEmail(), e);
                            }
                            // Tiến hành cập nhật trạng thái và thực hiện lại từ đầu
                            connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_UPDATE_STATUS(participant.getSignerToken(),
                                    Difinitions.CONFIG_WORKFLOW_PARTICIPANTS_COPY_STATUS_ID_SENT_A_COPY, "", 0);
                            newSignerToken = participant.getSignerToken();
                            restart = true; // Đánh dấu để thực hiện lại từ đầu
                        }
                    }
                }else{
                    System.out.println("send Mail!");
                    System.out.println("check:"+ ObjectUtils.isEmpty(signerFirst)+","+signerFirst != null);
                    if(signerFirst != null){

                        String participantName = signerFirst.getLastName() + " " + signerFirst.getFirstName();
                        String newAttachSubject = attachMailInfo.getSubject().replaceAll("\\[filename\\]", fileName);
                        String newTextContent = textMailInfo.getBody().replaceAll("@FirstLastNameSigner", signerName).replaceAll("@FirstLastName", participantName).replaceAll("@EmailSigner", signerEmail).replaceAll("@LinkSign", "https://uat-paperless-gw.mobile-id.vn/view/signing/" + signingToken + "?access_token=" + signerFirst.getSignerToken());
                        String newAttachContent = attachMailInfo.getBody().replaceAll("@FirstLastNameSigner", signerName).replaceAll("@FirstLastName", participantName).replaceAll("@EmailSigner", signerEmail);
                        if (signerFirst.getSignerType() != 5) {
                            // Gửi mail
                            try {
                                // Gửi mail
                                MailService.sendMail(null, null, signerFirst.getEmail(), textMailInfo.getSubject(), newTextContent);
                            } catch (Exception e) {
                                e.printStackTrace(); // In ra stack trace của lỗi
                                // Ném lại ngoại lệ để dừng chương trình
                                throw new RuntimeException("Error occurred while sending text mail to " + signerFirst.getEmail(), e);
                            }
                        }else {
                            try {
                                // Convert content from base64 to byte[]

                                // Gửi attachment
                                MailService.sendMail(fileName, data, signerFirst.getEmail(), newAttachSubject, newAttachContent);
                            } catch (Exception e) {
                                e.printStackTrace(); // In ra stack trace của lỗi
                                // Ném lại ngoại lệ để dừng chương trình
                                throw new RuntimeException("Error occurred while sending attachment to " + signerFirst.getEmail(), e);
                            }
                            // Tiến hành cập nhật trạng thái và thực hiện lại từ đầu
                            connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_UPDATE_STATUS(signerFirst.getSignerToken(),
                                    Difinitions.CONFIG_WORKFLOW_PARTICIPANTS_COPY_STATUS_ID_SENT_A_COPY, "", 0);
                            newSignerToken = signerFirst.getSignerToken();
                            restart = true; // Đánh dấu để thực hiện lại từ đầu
                        }
                    }
                }
            } while (restart); // Lặp lại nếu cần thực hiện lại từ đầu
        }else{
            List<Participants> responseList = new ArrayList<>();
            connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_LIST(responseList,signingToken);
            System.out.println("parallel participant:"+ responseList);
            System.out.println("parallel singing:"+ signingToken);
            for (Participants participant : responseList) {
                System.out.print(participant.getEmail());
                String participantName = participant.getLastName() + " " + participant.getFirstName();
                String newAttachSubject = attachMailInfo.getSubject().replaceAll("\\[filename\\]", fileName);
                String newTextContent = textMailInfo.getBody().replaceAll("@FirstLastNameSigner", signerName).replaceAll("@FirstLastName", participantName).replaceAll("@EmailSigner", signerEmail).replaceAll("@LinkSign", "https://uat-paperless-gw.mobile-id.vn/view/signing/" + signingToken + "?access_token=" + participant.getSignerToken());
                String newAttachContent = attachMailInfo.getBody().replaceAll("@FirstLastNameSigner", signerName).replaceAll("@FirstLastName", participantName).replaceAll("@EmailSigner", signerEmail);
                if (participant.getSignerType() != 5) {
                    // Gửi mail
                    try {
                        // Gửi mail
                        MailService.sendMail(null, null, participant.getEmail(), textMailInfo.getSubject(), newTextContent);

                    } catch (Exception e) {
                        e.printStackTrace(); // In ra stack trace của lỗi
                        // Ném lại ngoại lệ để dừng chương trình
                        throw new RuntimeException("Error occurred while sending text mail to " + participant.getEmail(), e);
                    }
                } else {
                    try {
                        // Convert content from base64 to byte[]

                        // Gửi attachment
                        MailService.sendMail(fileName, data, participant.getEmail(), newAttachSubject, newAttachContent);
                    } catch (Exception e) {
                        e.printStackTrace(); // In ra stack trace của lỗi
                        // Ném lại ngoại lệ để dừng chương trình
                        throw new RuntimeException("Error occurred while sending attachment to " + participant.getEmail(), e);
                    }
                    // Tiến hành cập nhật trạng thái và thực hiện lại từ đầu
                    connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_UPDATE_STATUS(participant.getSignerToken(),
                            Difinitions.CONFIG_WORKFLOW_PARTICIPANTS_COPY_STATUS_ID_SENT_A_COPY, "", 0);

                }
            }

        }
    }
    public void checkAndSendMail(
            String workFlowType,
            String signerToken,
            String signingToken,
            String signerName,
            String signerEmail,
            String fileName,
            byte[] data) throws Exception {
        String textMailKey = "email_invite_signing";
        String attachMailKey = "email_send_a_copy";
        MailInfo textMailInfo = connect.USP_GW_EMAIL_TEMPLATE_GET(2, textMailKey);
        MailInfo attachMailInfo = connect.USP_GW_EMAIL_TEMPLATE_GET(2, attachMailKey);
        String newSignerToken = signerToken;
        if (!workFlowType.equals("parallel")) {
            boolean restart = false; // Biến này để kiểm tra xem có cần thực hiện lại từ đầu không
            do {
                List<Participants> responseList = connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_GET_NEXT_PARTICIPANT(newSignerToken);
                restart = false; // Gán lại giá trị mặc định trước khi lặp lại
                if (responseList.size() > 0) {
                    // Duyệt qua list participant và tiến hành gửi mail
                    for (Participants participant : responseList) {
                        String participantName = participant.getLastName() + " " + participant.getFirstName();
                        String newAttachSubject = attachMailInfo.getSubject().replaceAll("\\[filename\\]", fileName);
                        String newTextContent = textMailInfo.getBody().replaceAll("@FirstLastNameSigner", signerName).replaceAll("@FirstLastName", participantName).replaceAll("@EmailSigner", signerEmail).replaceAll("@LinkSign", "https://uat-paperless-gw.mobile-id.vn/view/signing/" + signingToken + "?access_token=" + participant.getSignerToken());
                        String newAttachContent = attachMailInfo.getBody().replaceAll("@FirstLastNameSigner", signerName).replaceAll("@FirstLastName", participantName).replaceAll("<@EmailSigner>", "&lt;" + signerEmail + "&gt;");
                        if (participant.getSignerType() != 5) {
                            // Gửi mail
                            try {
                                // Gửi mail
                                MailService.sendMail(null, null, participant.getEmail(), newAttachSubject, newTextContent);
                            } catch (Exception e) {
                                e.printStackTrace(); // In ra stack trace của lỗi
                                // Ném lại ngoại lệ để dừng chương trình
                                throw new RuntimeException("Error occurred while sending text mail to " + participant.getEmail(), e);
                            }
                        } else {
                            try {
                                // Convert content from base64 to byte[]

                                // Gửi attachment
                                MailService.sendMail(fileName, data, participant.getEmail(), newAttachSubject, newAttachContent);
                            } catch (Exception e) {
                                e.printStackTrace(); // In ra stack trace của lỗi
                                // Ném lại ngoại lệ để dừng chương trình
                                throw new RuntimeException("Error occurred while sending attachment to " + participant.getEmail(), e);
                            }
                            // Tiến hành cập nhật trạng thái và thực hiện lại từ đầu
                            connect.USP_GW_PPL_WORKFLOW_PARTICIPANTS_UPDATE_STATUS(participant.getSignerToken(),
                                    Difinitions.CONFIG_WORKFLOW_PARTICIPANTS_COPY_STATUS_ID_SENT_A_COPY, "", 0);
                            newSignerToken = participant.getSignerToken();
                            restart = true; // Đánh dấu để thực hiện lại từ đầu
                        }
                    }
                }
            } while (restart); // Lặp lại nếu cần thực hiện lại từ đầu
        }
    }
}
