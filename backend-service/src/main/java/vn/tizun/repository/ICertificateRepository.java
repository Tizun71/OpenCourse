package vn.tizun.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.tizun.model.CategoryEntity;
import vn.tizun.model.CertificateEntity;

@Repository
public interface ICertificateRepository extends JpaRepository<CertificateEntity, Long> {
}
