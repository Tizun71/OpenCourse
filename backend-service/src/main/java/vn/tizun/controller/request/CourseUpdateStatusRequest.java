package vn.tizun.controller.request;

import lombok.Getter;
import vn.tizun.common.CourseStatus;

@Getter
public class CourseUpdateStatusRequest {
    private Long courseId;
    private CourseStatus status;
}
