package vn.tizun.controller.request;

import lombok.Getter;

import java.util.Map;

@Getter
public class MailSenderRequest {
    private String to;
    private String subject;
    private String content;
    private Map<String, Object> props;
}
