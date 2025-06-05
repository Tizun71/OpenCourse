package vn.tizun.service.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class MailDataDto {
    private String to;
    private String subject;
    private String content;
    private Map<String, Object> props;
}
