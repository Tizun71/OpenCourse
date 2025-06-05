package vn.tizun.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.tizun.model.LessonCompletion;

import java.util.List;

public interface ILessonCompletionRepository  extends JpaRepository<LessonCompletion, Long> {
    List<LessonCompletion> findAllByUserIdAndLessonSectionCourseId(Long userId, Long courseId);
    int countByUserIdAndLessonSectionCourseId(Long userId, Long courseId);
}
