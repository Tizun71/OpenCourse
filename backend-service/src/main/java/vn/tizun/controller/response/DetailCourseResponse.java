package vn.tizun.controller.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import vn.tizun.common.CourseStatus;
import vn.tizun.model.SectionEntity;

import java.util.List;

@Builder
@Getter
@Setter
public class DetailCourseResponse {
    private Long id;
    private String courseName;
    private String description;
    private long registeredNumber;
    private String courseLevel;
    private String categoryName;
    private Long categoryId;
    private String instructorName;
    private String imageUrl;
    private CourseStatus status;
    private List<SectionResponse> sections;
}
