package vn.tizun.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.tizun.model.CategoryEntity;

import java.util.List;

public interface ICategoryRepository extends JpaRepository<CategoryEntity, Long> {
    List<CategoryEntity> findAllByOrderByIdAsc();
}
