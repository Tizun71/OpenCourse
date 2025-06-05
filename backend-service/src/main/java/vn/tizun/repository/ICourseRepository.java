package vn.tizun.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.tizun.model.CourseEntity;
import vn.tizun.model.UserEntity;

import java.util.List;

@Repository
public interface ICourseRepository extends JpaRepository<CourseEntity, Long> {
    @Query(value = "select c from CourseEntity c where c.status='PUBLISHED' " +
            "and (lower(c.courseName) like :keyword " +
            "or CAST(c.courseLevel AS string) like :keyword " +
            "or lower(c.category.categoryName) like :keyword " +
            "or lower(c.user.firstName) like :keyword " +
            "or lower(c.user.lastName) like :keyword)")
    Page<CourseEntity> searchByKeyword(String keyword, Pageable pageable);

    @Query(value = "select c from CourseEntity c where c.status='PUBLISHED'")
    Page<CourseEntity> findAvailable(Pageable pagable);

    @Query(value = "select c from CourseEntity c")
    Page<CourseEntity> findAllStatus(Pageable pagable);

    @Query(value = "select c from CourseEntity c where c.user.id = :instructorId")
    List<CourseEntity> findAllByInstructorId(@Param("instructorId") Long instructorId);


}
