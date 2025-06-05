package vn.tizun.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.tizun.model.CourseEntity;
import vn.tizun.model.Enrollment;
import vn.tizun.model.UserEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface IEnrollmentRepository extends JpaRepository<Enrollment, Long> {
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.course.id = :courseId")
    long countEnrollmentsByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT e FROM Enrollment e WHERE e.user.id = :userId AND e.course.id = :courseId")
    Optional<Enrollment> findByUserIdAndCourseId(@Param("userId") Long userId, @Param("courseId") Long courseId);

    List<Enrollment> findByUserId(Long userId);

    boolean existsByUserAndCourse(UserEntity user, CourseEntity course);
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);

    @Query("SELECT e.course FROM Enrollment e WHERE e.user.id = :userId")
    List<CourseEntity> findCoursesByUserId(@Param("userId") Long userId);
}
