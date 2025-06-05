package vn.tizun.controller.request;

import lombok.Getter;

@Getter
public class LessonUpdateRequest {
    private Long id;
    private String title;
    private String content;
    private int position;
}
