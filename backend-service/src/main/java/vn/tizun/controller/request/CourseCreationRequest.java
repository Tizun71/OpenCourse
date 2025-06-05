package vn.tizun.controller.request;

import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;
import vn.tizun.common.CourseLevel;

import java.util.Date;

@Getter
public class CourseCreationRequest {
    private String courseName;
    private String description;
    private String imageUrl;
    private CourseLevel courseLevel;
    private Long instructorId;
    private Long categoryId;
}
