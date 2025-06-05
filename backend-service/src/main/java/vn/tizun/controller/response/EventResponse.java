package vn.tizun.controller.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Setter
@Getter
@Builder
public class EventResponse {
    private Long id;
    private String title;
    private Date startedAt;
    private Date endedAt;
}
