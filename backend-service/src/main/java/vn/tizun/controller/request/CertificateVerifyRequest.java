package vn.tizun.controller.request;

import lombok.Getter;

@Getter
public class CertificateVerifyRequest {
    private String message;
    private String signature;
}
