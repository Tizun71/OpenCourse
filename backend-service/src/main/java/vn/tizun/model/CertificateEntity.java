package vn.tizun.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "tbl_certificate", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "course_id"}))
public class CertificateEntity {
    @Id
    @GeneratedValue
    @Column(name = "id")
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "enrollment_id")
    private Enrollment enrollment;

    @Column(name = "issued_at", length = 255)
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    private Date issuedAt;

    @Column(name = "certificate_hash", length = 255)
    private String certificateHash;
}
