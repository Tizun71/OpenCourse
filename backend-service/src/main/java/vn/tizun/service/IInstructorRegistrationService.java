package vn.tizun.service;

import vn.tizun.controller.request.InstructorRegistrationRequest;
import vn.tizun.model.InstructorRegistration;

import java.util.List;

public interface IInstructorRegistrationService {
    List<InstructorRegistration> getAll();
    void save(InstructorRegistrationRequest request);
    void updateStatus(Long applicationId, boolean status);
}
