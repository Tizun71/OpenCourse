package vn.tizun.service.implement;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import vn.tizun.common.EnrollmentStatus;
import vn.tizun.controller.request.EnrollmentRequest;
import vn.tizun.controller.request.EnrollmentUpdateProgressRequest;
import vn.tizun.controller.response.CourseResponse;
import vn.tizun.controller.response.UserResponse;
import vn.tizun.exception.ResourceNotFoundException;
import vn.tizun.model.CourseEntity;
import vn.tizun.model.Enrollment;
import vn.tizun.model.UserEntity;
import vn.tizun.repository.ICourseRepository;
import vn.tizun.repository.IEnrollmentRepository;
import vn.tizun.repository.IUserRepository;
import vn.tizun.service.IEnrollmentService;

import java.util.List;

@Service
@AllArgsConstructor
public class EnrollmentService implements IEnrollmentService {

    private final IUserRepository userRepository;
    private final ICourseRepository courseRepository;
    private final IEnrollmentRepository enrollmentRepository;

    @Override
    public void enrollCourse(EnrollmentRequest request) {
        UserEntity user = userRepository.findById(request.getUserId()).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CourseEntity course = courseRepository.findById(request.getCourseId()).orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        if (enrollmentRepository.existsByUserAndCourse(user, course)){
            throw new IllegalStateException("User already enrolled in the course");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);

        enrollment.setProgress(0);
        enrollment.setStatus(EnrollmentStatus.ENROLLED);

        enrollmentRepository.save(enrollment);
    }

    @Override
    public boolean checkUserIsEnroll(Long userId, Long courseId) {
        return enrollmentRepository.existsByUserIdAndCourseId(userId, courseId);
    }

    @Override
    public EnrollmentStatus getEnrollmentStatus(Long userId, Long courseId) {
        Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(userId, courseId).orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));
        return enrollment.getStatus();
    }



    @Override
    public void updateProgress(EnrollmentUpdateProgressRequest request) {
        Enrollment enrollment = enrollmentRepository
                .findByUserIdAndCourseId(request.getUserId(), request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Not found"));

        enrollment.setProgress(request.getProgress());

        enrollmentRepository.save(enrollment);
    }

    @Override
    public void updateStatus(Long userId, Long courseId, EnrollmentStatus status) {
        Enrollment enrollment = enrollmentRepository
                .findByUserIdAndCourseId(userId, courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Not found"));

        enrollment.setStatus(status);
        System.out.println(status);
        enrollmentRepository.save(enrollment);
    }

    @Override
    public List<CourseResponse> getEnrolledCoursesByUser(Long userId) {
        return List.of();
    }

    @Override
    public List<UserResponse> getUserEnrollmentByCourse(Long courseId) {
        return List.of();
    }
}
