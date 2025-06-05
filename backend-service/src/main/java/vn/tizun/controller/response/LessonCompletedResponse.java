package vn.tizun.controller.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LessonCompletedResponse {
    private long lessonId;
    private String lessonName;
}
