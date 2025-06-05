package vn.tizun.controller.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import vn.tizun.common.CourseLevel;

@Builder
@Setter
@Getter

public class RegistedCourseResponse {
    private Long id;
    private String courseName;
    private String instructorName;
    private CourseLevel level;
    private float progress;
    private String imageUrl;
}
