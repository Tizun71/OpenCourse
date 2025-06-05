package vn.tizun.controller.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class LessonResponse {
    private long id;
    private String title;
    private String content;
    private String videoUrl;
    private int position;
}
