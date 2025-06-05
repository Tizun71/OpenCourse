package vn.tizun.controller.request;

import lombok.Getter;

import java.util.Date;

@Getter
public class EventUpdateRequest {
    private Long id;
    private String title;
    private Date startedAt;
    private Date endedAt;
    private Long userId;
}
