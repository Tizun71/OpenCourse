package vn.tizun.service;

import org.springframework.web.multipart.MultipartFile;
import vn.tizun.controller.request.CourseCreationRequest;
import vn.tizun.controller.request.CourseUpdateRequest;
import vn.tizun.controller.request.CourseUpdateStatusRequest;
import vn.tizun.controller.response.CoursePageResponse;
import vn.tizun.controller.response.CourseResponse;
import vn.tizun.controller.response.DetailCourseResponse;
import vn.tizun.controller.response.RegistedCourseResponse;

import java.util.List;

public interface ICourseService {
    CoursePageResponse findAll(String keyword, String sort, int page, int size);
    CoursePageResponse findAllStatus(String keyword, String sort, int page, int size);
    CourseResponse findById(Long id);
    List<RegistedCourseResponse> findRegistedCourseByUserID(Long userId);
    DetailCourseResponse getDetailCourse(Long id);
    CourseResponse findByCourseName(String courseName);
    long save(CourseCreationRequest req);
    void update(CourseUpdateRequest req);
    void updateImage(Long id, MultipartFile file);
    void updateStatus(CourseUpdateStatusRequest request);
    void delete(Long id);

    List<CourseResponse> listAllByInstructorId(Long instructorID);
    long count();
}
