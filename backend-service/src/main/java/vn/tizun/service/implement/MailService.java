package vn.tizun.service.implement;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import vn.tizun.common.MailConstants;
import vn.tizun.controller.request.AccountRegisterForAdminRequest;
import vn.tizun.controller.request.AccountRegisterRequest;
import vn.tizun.controller.request.MailSenderRequest;
import vn.tizun.controller.request.UserCreationRequest;
import vn.tizun.service.IMailService;
import vn.tizun.service.dto.MailDataDto;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MailService implements IMailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine springTemplateEngine;

    @Override
    public void sendMail(MailDataDto req, String templateName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            Context context = new Context();
            context.setVariables(req.getProps());

            String html = springTemplateEngine.process(templateName, context);

            helper.setTo(req.getTo());
            helper.setSubject(req.getSubject());
            helper.setText(html, true);
            helper.setFrom(new InternetAddress("no-reply@t.mail.opencourse.org", "Open Course"));

            mailSender.send(message);
        } catch (MessagingException |UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }

    }

    public void sendMail_AccountRegister(AccountRegisterForAdminRequest request, String password) {
        MailDataDto mailData = new MailDataDto();
        mailData.setTo(request.getEmail());
        mailData.setSubject(MailConstants.CLIENT_REGISTER);
        Map<String, Object> props = new HashMap<>();

        props.put("name", request.getFirstName() + ' ' + request.getLastName());
        props.put("username", request.getUsername());
        props.put("password", password);

        mailData.setProps(props);

        sendMail(mailData, MailConstants.TEMPLATE_REGISTER_SUCCESSFUL);
    }
}
   