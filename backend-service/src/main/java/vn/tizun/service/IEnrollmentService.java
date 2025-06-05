package vn.tizun.service;

import org.springframework.stereotype.Service;
import vn.tizun.common.EnrollmentStatus;
import vn.tizun.controller.request.EnrollmentRequest;
import vn.tizun.controller.request.EnrollmentUpdateProgressRequest;
import vn.tizun.controller.response.CourseResponse;
import vn.tizun.controller.response.UserResponse;

import java.util.List;

@Service
public interface IEnrollmentService {
    void enrollCourse(EnrollmentRequest request);
    boolean checkUserIsEnroll(Long userId, Long courseId);

    EnrollmentStatus getEnrollmentStatus(Long userId, Long courseId);


    void updateProgress(EnrollmentUpdateProgressRequest request);

    void updateStatus(Long userId, Long courseId, EnrollmentStatus status);

    List<CourseResponse> getEnrolledCoursesByUser(Long userId);
    List<UserResponse> getUserEnrollmentByCourse(Long courseId);
}
