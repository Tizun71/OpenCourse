package vn.tizun.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "tbl_instructor_registration")
public class InstructorRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "fullName")
    private String fullName;

    @Column(name="email")
    private String email;

    @Column(name = "phone", length = 15)
    private String phone;

    @Column(name="education")
    private String education;

    @Column(name="specialization")
    private String specialization;

    @Column(name="course_categories")
    private String courseCategories;

    @Column(name="teaching_experience")
    private String teachingExperience;

    @Column(name="video_sample_url")
    private String VideoSampleUrl;

    @Column(name="is_accepted")
    private boolean isAccepted = false;

    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    private Date createdAt;
}
