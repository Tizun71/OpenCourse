package vn.tizun.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.tizun.model.InstructorRegistration;

@Repository
public interface IInstructorRegistrationRepository extends JpaRepository<InstructorRegistration, Long> {
}
