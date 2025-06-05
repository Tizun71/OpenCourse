package vn.tizun.service.implement;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import vn.tizun.controller.request.InstructorRegistrationRequest;
import vn.tizun.exception.ResourceNotFoundException;
import vn.tizun.model.InstructorRegistration;
import vn.tizun.repository.IInstructorRegistrationRepository;
import vn.tizun.service.IInstructorRegistrationService;

import java.util.List;

@Service
@AllArgsConstructor
public class InstructorRegistrationService implements IInstructorRegistrationService {

    private final IInstructorRegistrationRepository instructorRegistrationRepository;

    @Override
    public List<InstructorRegistration> getAll() {
        return instructorRegistrationRepository.findAll();
    }

    @Override
    public void save(InstructorRegistrationRequest request) {
        InstructorRegistration instructorRegistration = new InstructorRegistration();
        instructorRegistration.setFullName(request.getFullName());
        instructorRegistration.setEmail(request.getEmail());
        instructorRegistration.setPhone(request.getPhone());
        instructorRegistration.setEducation(request.getEducation());
        instructorRegistration.setSpecialization(request.getSpecialization());
        instructorRegistration.setCourseCategories(request.getCourseCategories());
        instructorRegistration.setTeachingExperience(request.getTeachingExperience());
        instructorRegistration.setVideoSampleUrl(request.getVideoSampleUrl());

        instructorRegistrationRepository.save(instructorRegistration);
    }

    @Override
    public void updateStatus(Long applicationId, boolean status) {
        InstructorRegistration instructorRegistration = instructorRegistrationRepository.findById(applicationId).orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        instructorRegistration.setAccepted(status);

        instructorRegistrationRepository.save(instructorRegistration);
    }
}
