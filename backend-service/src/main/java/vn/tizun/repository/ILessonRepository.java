package vn.tizun.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.tizun.model.LessonEntity;

@Repository
public interface ILessonRepository extends JpaRepository<LessonEntity, Long> {
    @Query("SELECT COALESCE(MAX(l.position), 0) FROM LessonEntity l")
    int findMaxPosition();

    int countBySectionCourseId(Long courseId);
}
