package vn.tizun.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.tizun.model.EventEntity;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Repository
public interface IEventRepository extends JpaRepository<EventEntity, Long> {
    List<EventEntity> findByUserIdAndStartedAtBetween(Long userId, Date startDate, Date endDate);

    @Query("SELECT t FROM EventEntity t WHERE t.startedAt BETWEEN :now AND :deadline")
    List<EventEntity> findUpcomingLessons(@Param("now") LocalDateTime now, @Param("deadline") LocalDateTime deadline);
}
