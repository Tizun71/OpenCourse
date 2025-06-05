package vn.tizun.controller.request;

import lombok.Getter;

@Getter
public class NotificationRequest {
    private Long userId;
    private String title;
    private String body;
}
