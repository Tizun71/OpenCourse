package vn.tizun.controller.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import vn.tizun.model.LessonEntity;

import java.util.List;

@Builder
@Getter
@Setter
public class SectionResponse {
    private long id;
    private String title;
    private int position;
    private List<LessonResponse> lessons;
}
