package vn.tizun.controller.request;

import lombok.Getter;

@Getter
public class RateCreationRequest {
    private Long userId;
    private Long courseId;
    private int rating;
    private String message;
}
