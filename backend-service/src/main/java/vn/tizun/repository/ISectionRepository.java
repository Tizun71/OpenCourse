package vn.tizun.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.tizun.model.SectionEntity;
import vn.tizun.model.UserEntity;

import java.util.List;

@Repository
public interface ISectionRepository extends JpaRepository<SectionEntity, Long> {
    @Query("SELECT COALESCE(MAX(s.position), 0) FROM SectionEntity s")
    int findMaxPosition();

    @Query("select s from SectionEntity s where s.course.id = :courseId order by s.position")
    List<SectionEntity> findAllByCourseId(@Param("courseId") Long courseId);
}
