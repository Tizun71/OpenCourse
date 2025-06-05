package vn.tizun.controller.request;

import lombok.Getter;
import vn.tizun.common.CourseLevel;

import java.util.Date;

@Getter
public class CertificateGenerateRequest {
    private String fullName;
    private String email;
    private String walletAddress;
    private Long userId;
    private Long courseId;
}
