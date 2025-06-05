package vn.tizun.controller.request;

import lombok.Getter;

import java.util.Date;

@Getter
public class EventCreationRequest {
    private String title;
    private Date startedAt;
    private Date endedAt;
    private Long userId;
}
