package vn.tizun.controller.request;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Setter
@Getter
public class InstructorRegistrationRequest {
    private String fullName;
    private String email;
    private String phone;
    private String education;
    private String specialization;
    private String courseCategories;
    private String teachingExperience;
    private String videoSampleUrl;
}
