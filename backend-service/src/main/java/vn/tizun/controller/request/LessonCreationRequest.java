package vn.tizun.controller.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LessonCreationRequest {
    private Long sectionId;
    private String title;
    private String content;
    private String videoUrl;
}
