package vn.tizun.controller.request;

import lombok.Getter;

@Getter
public class EnrollmentUpdateProgressRequest {
    private Long userId;
    private Long courseId;
    private float progress;
}
