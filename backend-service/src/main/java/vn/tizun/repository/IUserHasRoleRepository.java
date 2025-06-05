package vn.tizun.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.tizun.model.UserEntity;
import vn.tizun.model.UserHasRole;

import java.util.List;
import java.util.Optional;

@Repository
public interface IUserHasRoleRepository extends JpaRepository<UserHasRole, Long> {
    Optional<UserHasRole> findByUserIdAndRoleId(Long userId, Long roleId);
    boolean existsByUserIdAndRoleId(Long userId, Long roleId);

    void deleteByUserId(Long id);
}