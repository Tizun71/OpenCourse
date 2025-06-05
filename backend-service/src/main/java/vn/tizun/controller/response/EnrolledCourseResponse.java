package vn.tizun.controller.response;

import lombok.*;
import vn.tizun.common.CourseLevel;
import vn.tizun.common.CourseStatus;

import java.io.Serializable;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrolledCourseResponse {
    private Long id;
    private String courseName;
    private String instructorName;
    private CourseLevel courseLevel;
    private String imageUrl;
    private float progress;
    private float avg_rating;
}

