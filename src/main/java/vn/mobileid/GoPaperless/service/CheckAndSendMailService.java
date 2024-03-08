package vn.mobileid.GoPaperless.service;

import org.springframework.stereotype.Service;
import vn.mobileid.GoPaperless.model.apiModel.MailInfo;
import vn.mobileid.GoPaperless.model.apiModel.Participants;
import vn.mobileid.GoPaperless.process.ProcessDb;
import vn.mobileid.GoPaperless.utils.Difinitions;

import java.util.List;

@Service
public class CheckAndSendMailService {
    private final ProcessDb connect;

    public CheckAndSendMailService(ProcessDb connect) {
        this.connect = connect;
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
                System.out.println("responseList: " + responseList.size());
                if (responseList.size() > 0) {
                    // Duyệt qua list participant và tiến hành gửi mail
                    for (Participants participant : responseList) {
                        String participantName = participant.getLastName() + " " + participant.getFirstName();
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
                                MailService.sendMail(fileName, data, participant.getEmail(), attachMailInfo.getSubject(), newAttachContent);
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
