package vn.tizun.service;

import vn.tizun.common.EnrollmentStatus;
import vn.tizun.controller.request.EventCreationRequest;
import vn.tizun.controller.request.EventUpdateRequest;
import vn.tizun.controller.response.EventResponse;

import java.util.Date;
import java.util.List;

public interface IEventService {
    List<EventResponse> listByUserId(Long userId, Date startedDate, Date endedDate);
    long create(EventCreationRequest request);
    void update(EventUpdateRequest request);
    void delete(Long id);
}
